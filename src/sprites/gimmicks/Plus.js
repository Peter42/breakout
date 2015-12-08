var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.Gimmick
 */
doodleBreakout.Plus = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'plus' );
};

doodleBreakout.Plus.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Plus.prototype.constructor = doodleBreakout.Plus;

/** @inheritdoc */
doodleBreakout.Plus.prototype.collected = function( player ){
    //earn Bonus Points for each collected Plus
    this.earnPoints(player, 25);
    player.plattform.grow();
    this.destroy();
};