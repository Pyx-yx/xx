import { GameRoot } from "./shared/GameRoot";

class GlobalInstance {

    public static readonly Instance: GlobalInstance = new GlobalInstance();
    public gameRoot: GameRoot = null;
	
	public globalSocket = null;
	public hallSocket = null;//大厅
    public queueSocket = null;//队列
    public roomSocket = null;//房间
    public gameManager = null;
    public chessManager = null;
    public stand = null;//你是黑方或白方

    public ServerIP = "127.0.0.1:12002";

    private constructor() {
    }

    public enterHall() {
        cc.director.loadScene("hall");
    }

    public returnHall() {
        cc.director.loadScene("hall");
    }

    public enterGobang() {
        this.loadSceneWithProgress("gobang");
    }

    public enterReversi() {
        this.loadSceneWithProgress("reversi");
    }
	
	public enterReversiMatch() {
		this.loadSceneWithProgress("match");
	}

    public enter2048() {
        this.loadSceneWithProgress("2048");
    }

    public enterJump() {
        this.loadSceneWithProgress("jump");
    }

    public enterPuzzle() {
        this.loadSceneWithProgress("puzzle");
    }

    public enterGet47() {
        this.loadSceneWithProgress("get47");
    }

    public enterTetris() {
        this.loadSceneWithProgress("tetris");
    }

    public enterMine() {
        this.loadSceneWithProgress("mine");
    }

    public enterLink() {
        this.loadSceneWithProgress("link");
    }

    public enterSnake() {
        this.loadSceneWithProgress("snake");
    }

    public enterBrick() {
        this.loadSceneWithProgress("brick");
    }

    private setLoadingDisplay() {
        if (cc.sys.isNative) {
            return;
        }
        // Loading splash scene
        let splash = document.getElementById('splash');
        let progressBar = splash.querySelector('.progress-bar span');
        (cc.loader as any).onProgress = function (completedCount, totalCount, item) {
            let percent = 100 * completedCount / totalCount;
            if (progressBar) {
                (progressBar as any).style.width = percent.toFixed(2) + '%';
            }
        };
        splash.style.display = 'block';
        (progressBar as any).style.width = '0%';

        cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
            splash.style.display = 'none';
        });
    }

    private loadSceneWithProgress(scene: string, cb?: Function) {
        this.setLoadingDisplay();
        cc.director.preloadScene(scene, () => {
            setTimeout(() => {
                cc.director.loadScene(scene, cb);
            }, 1000);
        });
    }
	
}

export const G = GlobalInstance.Instance;
