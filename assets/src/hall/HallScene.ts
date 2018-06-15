import { G } from "../G";

const { ccclass, property } = cc._decorator;

@ccclass
export class HallScene extends cc.Component {
	
	start()
	{
		G.gameRoot.tipPanel.active = true;
	}
	
    onBtnGobang() {
        G.enterGobang();
    }

    onBtnReversi() {
        G.enterReversi();
    }

    onBtn2048() {
        G.enter2048();
    }

    onBtnJump() {
        G.enterJump();
    }

    onBtnPuzzle() {
        G.enterPuzzle();
    }

    onBtnGet47() {
        G.enterGet47();
    }

    onBtnTetris() {
        G.enterTetris();
    }

    onBtnMine() {
        G.enterMine();
    }

    onBtnLink() {
        G.enterLink();
    }

    onBtnSnake() {
        G.enterSnake();
    }

    onBtnBrick() {
        G.enterBrick();
    }

}
