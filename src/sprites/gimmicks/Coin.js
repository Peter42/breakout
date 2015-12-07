var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.Gimmick
 */
doodleBreakout.Coin = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'coin');
};

doodleBreakout.Coin.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Coin.prototype.constructor = doodleBreakout.Coin;

/** @inheritdoc */
doodleBreakout.Coin.prototype.collected = function( player ){
    //earn Bonus Points for each collected Duplicate
    var iMax = 20;
    var iMin = 200;

    this.earnPoints( player,  Math.floor(Math.random() * (iMax - iMin + 1)) + iMin );

    this.destroy();
};

/** @inheritdoc */
doodleBreakout.Coin.prototype.playCollectSound = function(){
    doodleBreakout.SoundManager.playSfx('collect_coin');
};