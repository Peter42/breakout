var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.Gimmick
 */
doodleBreakout.Minus = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'minus' );
};

doodleBreakout.Minus.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Minus.prototype.constructor = doodleBreakout.Minus;

/** @inheritdoc */
doodleBreakout.Minus.prototype.collected = function( player ){
    //earn Bonus Points for each collected Minus
    this.earnPoints(player, 50);
    player.plattform.shrink();
    this.destroy();
};