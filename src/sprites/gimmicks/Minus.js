var doodleBreakout = doodleBreakout || {};

doodleBreakout.Minus = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'minus' );
};

doodleBreakout.Minus.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Minus.prototype.constructor = doodleBreakout.Minus;

doodleBreakout.Minus.prototype.collected = function( player ){
    //earn Bonus Points for each collected Minus
    player.earnPoints(70);
    player.plattform.shrink();
    this.kill();
};