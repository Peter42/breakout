var doodleBreakout = doodleBreakout || {};

doodleBreakout.Live = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'live' );
};

doodleBreakout.Live.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Live.prototype.constructor = doodleBreakout.Live;

doodleBreakout.Live.prototype.collected = function( player ){
    this.kill();
    if( player.lives ){
        player.addLive();
    }
};