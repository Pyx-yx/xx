var G_1 = require("../G");
cc.Class({
    extends: cc.Component,

    onLoad: function () {
        G_1.G.globalSocket = io.connect('117.78.46.98:4848');//117.78.46.98;127.0.0.1
        //断开连接后再重新连接需要加上{'force new connection': true}
        G_1.G.hallSocket = io.connect('117.78.46.98:4848/hall',{'force new connection': true});
    },

    onBtnStart() {
        G_1.G.hallSocket.disconnect();
        cc.director.loadScene('match');
    }
});
