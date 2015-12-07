var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.Gimmick
 */
doodleBreakout.Live = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'live' );
};

doodleBreakout.Live.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Live.prototype.constructor = doodleBreakout.Live;

/** @inheritdoc */
doodleBreakout.Live.prototype.collected = function( player ){
    this.destroy();
    if( player.lives ){
        player.addLive();
    }
};