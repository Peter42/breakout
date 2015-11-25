var doodleBreakout = doodleBreakout || {};

doodleBreakout.Plus = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'plus' );
};

doodleBreakout.Plus.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Plus.prototype.constructor = doodleBreakout.Plus;

doodleBreakout.Plus.prototype.collected = function( player ){
    //earn Bonus Points for each collected Plus
    player.earnPoints(50);
    player.plattform.grow();
    this.kill();
};