const Constants = require('Constants');
const CHESS_TYPE = Constants.CHESS_TYPE;
const STAND = Constants.STAND;
const GAME_STATE = Constants.GAME_STATE;
var G_1 = require("../G");
var Board = require("../reversi/ReversiBoard");

cc.Class({
    extends: cc.Component,
    properties: {
        COL: 8,
        ROW: 8,
        chessPrefab: cc.Prefab,
        graphics: cc.Graphics,
        chesses: [],
        tileWidth: cc.number = 0, // 一个方块的宽度
        startX: cc.number = 0, // 棋盘左下角
        startY: cc.number = 0,
        boardWidth: cc.number = 0, // 棋盘节点宽高
        boardHeight: cc.number = 0,
        blackEffect: cc.Node,
        whiteEffect: cc.Node,
        blackNode: cc.Node,
        whiteNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        G_1.G.chessManager = this;
        this.chessWidth = this.node.width / (this.COL +1);
        for (let x = 0; x < this.COL + 1; x++) {
            this.chesses[x] = [];
            for (let y = 0; y < this.ROW + 1; y++) {
                let chessNode = cc.instantiate(this.chessPrefab);
                chessNode.parent = this.node;
                chessNode.width = this.chessWidth - 5;
                chessNode.height = this.chessWidth - 5;
                chessNode.position = cc.p((x + 1) * this.chessWidth,  (y+1) * this.chessWidth);
                let chess = chessNode.getComponent('Chess');
                chess.coor = cc.p(x, y);
                this.chesses[x][y] = chess;
                this.addTouchEvent(chess);
            }
        }
        this.chesses[3][3].type = CHESS_TYPE.BLACK;
        this.chesses[3][4].type = CHESS_TYPE.WHITE;
        this.chesses[4][4].type = CHESS_TYPE.BLACK;
        this.chesses[4][3].type = CHESS_TYPE.WHITE;
        G_1.G.gameManager.startGame();
        this.showEffect();
        this.showYou();
        let self = this;
        G_1.G.roomSocket.on('update chessboard', function (chessCoor) {
            self.fallChess(self.chesses[chessCoor.x][chessCoor.y]);
        });
        G_1.G.roomSocket.on('change turn', function () {
            G_1.G.gameManager.changeTurn();
        });
        G_1.G.roomSocket.on('force change turn', function () {
            G_1.G.gameManager.forceChangeTurn();
        });
        G_1.G.roomSocket.on('player leave', function () {
            G_1.G.gameManager.playerLeave();
        });

        //Board.draw();
        this.tileWidth = this.node.width / (this.COL + 1);
        this.startX = this.tileWidth / 2;
        this.startY = this.tileWidth / 2;
        this.boardWidth = this.tileWidth * this.COL;
        this.boardHeight = this.tileWidth * this.ROW;
        this.graphics.clear();
        this.graphics.strokeColor = cc.Color.BLACK;
        for (var x = 0; x < this.COL + 1; x++) {
            this.graphics.moveTo(this.startX + x * this.tileWidth, this.startY);
            this.graphics.lineTo(this.startX + x * this.tileWidth, this.startY + this.boardHeight);
            this.graphics.stroke();
        }
        for (var y = 0; y < this.ROW + 1; y++) {
            this.graphics.moveTo(this.startX, this.startY + y * this.tileWidth);
            this.graphics.lineTo(this.startX + this.boardWidth, this.startY + y * this.tileWidth);
            this.graphics.stroke();
        }
    },

    addTouchEvent(chess) {
        let self = this;
        chess.node.on('touchend', function (e) {
            if (G_1.G.gameManager.gameState === GAME_STATE.PLAYING) {
                if (G_1.G.gameManager.turn === G_1.G.stand) {
                    if (chess.type === CHESS_TYPE.NONE) {
                        for (let dir = 1; dir <= 8; dir++) {
                            if (self.judgePass(G_1.G.gameManager.turn, chess, dir)) {
                                self.fallChess(chess);
                                G_1.G.roomSocket.emit('update chessboard', chess.coor);
                                break;
                            }
                            if (dir === 8) {
                                return;
                            }
                        }

                    }
                }
                else {
                    G_1.G.gameRoot.showTip("别心急，还没到你");
                }
            }
            else {
                G_1.G.gameRoot.showTip("游戏已经结束");
            }
        });
    },

    fallChess(chess) {
        if (G_1.G.gameManager.turn === STAND.BLACK) {
            chess.type = CHESS_TYPE.BLACK;
        } else if (G_1.G.gameManager.turn === STAND.WHITE) {
            chess.type = CHESS_TYPE.WHITE;
        }
        for (let dir = 1; dir <= 8; dir++) {
            if (this.judgePass(G_1.G.gameManager.turn, chess, dir)) {
                this.changePass(chess, dir);
            }
        }
        G_1.G.gameManager.updateScore();
        G_1.G.gameManager.changeTurn();
        this.judgeWin();
    },

    showEffect() {
        if (G_1.G.gameManager.turn === STAND.BLACK) {
            this.blackEffect.active = true;
            this.whiteEffect.active = false;
        } else if (G_1.G.gameManager.turn === STAND.WHITE) {
            this.blackEffect.active = false;
            this.whiteEffect.active = true;
        }
    },

    showYou() {
        if (G_1.G.stand === STAND.BLACK) {
            this.blackNode.active = true;
            this.whiteNode.active = false;
        } else if (G_1.G.stand === STAND.WHITE) {
            this.blackNode.active = false;
            this.whiteNode.active = true;
        }
    },

    nearChess(chess, dir) {
        switch (dir) {
            case 1://left
                if (chess.coor.x !== 0) {
                    return this.chesses[chess.coor.x - 1][chess.coor.y];
                }
                break;
            case 2://left up
                if (chess.coor.x !== 0 && chess.coor.y !== this.ROW - 1) {
                    return this.chesses[chess.coor.x - 1][chess.coor.y + 1];
                }
                break;
            case 3://up
                if (chess.coor.y !== this.ROW - 1) {
                    return this.chesses[chess.coor.x][chess.coor.y + 1];
                }
                break;
            case 4://right up
                if (chess.coor.x !== this.COL - 1 && chess.coor.y !== this.ROW - 1) {
                    return this.chesses[chess.coor.x + 1][chess.coor.y + 1];
                }
                break;
            case 5://right
                if (chess.coor.x !== this.COL - 1) {
                    return this.chesses[chess.coor.x + 1][chess.coor.y];
                }
                break;
            case 6://right down
                if (chess.coor.x !== this.COL - 1 && chess.coor.y !== 0) {
                    return this.chesses[chess.coor.x + 1][chess.coor.y - 1];
                }
                break;
            case 7://down
                if (chess.coor.y !== 0) {
                    return this.chesses[chess.coor.x][chess.coor.y - 1];
                }
                break;
            case 8://left down
                if (chess.coor.x !== 0 && chess.coor.y !== 0) {
                    return this.chesses[chess.coor.x - 1][chess.coor.y - 1];
                }
                break;

            default:
                break;
        }
        return null;
    },

    judgePass(stand, chess, dir) {
        let tempChess = chess;
        tempChess = this.nearChess(chess, dir);
        if (tempChess === null) {
            return false;
        }
        while (tempChess.type === -stand) {
            tempChess = this.nearChess(tempChess, dir);
            if (tempChess === null) {
                return false;
            }
            if (tempChess.type === stand) {
                return true;
            }
        }
        return false;
    },

    changePass(chess, dir) {
        let tempChess = this.nearChess(chess, dir);
        while (tempChess.type === -G_1.G.gameManager.turn) {
            tempChess.type = chess.type;
            tempChess = this.nearChess(tempChess, dir);
        }
    },

    judgeMoveAble(stand) {//判断stand是否有可落子的地方
        let tryChess = null;
        for (let x = 0; x < this.COL; x++) {
            for (let y = 0; y < this.ROW; y++) {
                tryChess = this.chesses[x][y];
                if (tryChess.type === CHESS_TYPE.NONE) {
                    for (let dir = 1; dir <= 8; dir++) {
                        if (this.judgePass(stand, tryChess, dir)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },

    judgeWin() {
        let selfMoveAble = this.judgeMoveAble(G_1.G.gameManager.turn);
        let oppoMoveAble = this.judgeMoveAble(-G_1.G.gameManager.trun);
        if (selfMoveAble) {
            return;
        } else if (!selfMoveAble && oppoMoveAble) {
            cc.log('can not move next turn');
            G_1.G.gameManager.forceChangeTurn();
            G_1.G.roomSocket.emit('force change turn');
        } else if (!selfMoveAble && !oppoMoveAble) {
            cc.log('both can not move someone win');
            G_1.G.gameManager.endGame();
        }
    },

    getChessCount(){
        let blackChess = 0;
        let whiteChess = 0;
        for (let x = 0; x < this.chesses.length; x++) {
            for (let y = 0; y < this.chesses[x].length; y++) {
                if (this.chesses[x][y].type === CHESS_TYPE.BLACK) {
                    blackChess++;
                } else if (this.chesses[x][y].type === CHESS_TYPE.WHITE) {
                    whiteChess++;
                }
            }
        }
        return [blackChess,whiteChess];
    }
});
