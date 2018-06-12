const Constants = require('Constants');
const STAND = Constants.STAND;
var G_1 = require("../G");

cc.Class({
    extends: cc.Component,

    onLoad: function () {
		G_1.G.gameRoot.tipPanel.active = false;
        G_1.G.queueSocket = io.connect('117.78.46.98:4848/queue', { 'force new connection': true });
        G_1.G.queueSocket.on('set stand', function (stand) {
            if (stand === 'black') {
                G_1.G.stand = STAND.BLACK;
            } else if (stand === 'white') {
                G_1.G.stand = STAND.WHITE;
            }
        });
        G_1.G.queueSocket.on('match success', function (roomId) {
            cc.log('match success' + roomId);
            G_1.G.roomSocket = io.connect('117.78.46.98:4848/rooms' + roomId, { 'force new connection': true });
            G_1.G.queueSocket.disconnect();
            cc.director.loadScene('reversi_online');
        });
    },

    onBtnCancel() {
        G_1.G.queueSocket.disconnect();
        cc.director.loadScene('hall');
    }
});