var doodleBreakout = doodleBreakout || {};

doodleBreakout.Coin = function ( game, x, y ) {
    Phaser.Sprite.call(this, game, x, y, 'easteregg');
};

doodleBreakout.Coin.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Coin.prototype.constructor = doodleBreakout.Coin;

doodleBreakout.Coin.prototype.collected = function(){
    //earn Bonus Points for each collected Duplicate
    var iMax = 20;
    var iMin = 200;

    this.game.state.states.Game.earnPoints( Math.floor(Math.random() * (iMax - iMin + 1)) + iMin );

    this.kill();
};