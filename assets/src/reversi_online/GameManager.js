const Constants = require('Constants');
const GAME_STATE = Constants.GAME_STATE;
const STAND = Constants.STAND;
const CHESS_TYPE = Constants.CHESS_TYPE;
var G_1 = require("../G");

cc.Class({
    extends: cc.Component,

    properties: {
        gameState: {
            default: GAME_STATE.PREPARE,
            type: GAME_STATE
        },
        turn: {
            default: STAND.BLACK,
            type: STAND
        },
        blackScoreLabel: cc.Label,
        whiteScoreLabel: cc.Label,
    },
    
    onLoad: function () {
        G_1.G.gameManager = this;
    },

    startGame() {
        this.turn = STAND.BLACK;
        this.gameState = GAME_STATE.PLAYING;
        this.showInfo('start game');
    },

    endGame() {
        G_1.G.roomSocket.disconnect();
        this.gameState = GAME_STATE.OVER;
        this.showInfo('game over');
    },

    changeTurn() {
        if (this.turn === STAND.BLACK) {
            this.turn = STAND.WHITE;
        } else if (this.turn === STAND.WHITE) {
            this.turn = STAND.BLACK;
        }
        G_1.G.chessManager.showEffect();
    },

    forceChangeTurn() {//无子可下换边
        this.showInfo('force change turn');
        this.changeTurn();
    },

    playerLeave() {
        this.gameState = GAME_STATE.OVER;
        this.showInfo('player Leave');
    },

    updateScore() {
        let chessCount = G_1.G.chessManager.getChessCount();
        let blackChess = chessCount[0];
        let whiteChess = chessCount[1];
        this.blackScoreLabel.string = blackChess + '';
        this.whiteScoreLabel.string = whiteChess + '';
    },

    showInfo(type) {
        let chessCount = G_1.G.chessManager.getChessCount();
        let blackChess = chessCount[0];
        let whiteChess = chessCount[1];
        if (type === 'start game') {
            if (G_1.G.stand === STAND.BLACK) {
                G_1.G.gameRoot.showTip('你是黑棋你先走');
            } else if (G_1.G.stand === STAND.WHITE) {
                G_1.G.gameRoot.showTip('你是白棋先等等');
            }
            this.blackScoreLabel.string = blackChess + '';
            this.whiteScoreLabel.string = whiteChess + '';
        } else if (type === 'game over') {
            if (blackChess > whiteChess) {
                if (G_1.G.stand === STAND.BLACK) {
                    G_1.G.gameRoot.showMaskMessage("恭喜你\n你赢啦！",
                        { label: "朕知道了", cb: () => { }, target: this });
                }
                else
                {
                    G_1.G.gameRoot.showMaskMessage("真是遗憾\n你输了。",
                        { label: "朕知道了", cb: () => { }, target: this });
                }
            } else if (blackChess < whiteChess) {
                if (G_1.G.stand === STAND.WHITE) {
                    G_1.G.gameRoot.showMaskMessage("恭喜你\n你赢啦！",
                        { label: "朕知道了", cb: () => { }, target: this });
                }
                else {
                    G_1.G.gameRoot.showMaskMessage("真是遗憾\n你输了。",
                        { label: "朕知道了", cb: () => { }, target: this });
                }
            } else if (blackChess === whiteChess) {
                G_1.G.gameRoot.showMaskMessage("棋逢敌手\n和棋了。",
                    { label: "朕知道了", cb: () => { }, target: this });
            }
        } else if (type === 'force change turn') {
            if (G_1.G.stand === STAND.BLACK) {
                G_1.G.gameRoot.showTip('黑方无子可下\n请白方下子');
            } else if (G_1.G.stand === STAND.WHITE) {
                G_1.G.gameRoot.showTip('白方无子可下\n请黑方下子');
            }
        } else if (type == 'player Leave') {
            G_1.G.gameRoot.showMaskMessage("你的对手离开了游戏\n你赢啦！",
                { label: "朕知道了", cb: () => { }, target: this });
        }
    },

    onBtnReurn(){
        G_1.G.returnHall();
        G_1.G.roomSocket.disconnect();
    },

    onBtnRestart() {
        this.startGame();
        G_1.G.roomSocket.disconnect();
    },
});
