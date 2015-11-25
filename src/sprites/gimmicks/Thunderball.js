var doodleBreakout = doodleBreakout || {};

doodleBreakout.Thunderball = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'thunder' );
};

doodleBreakout.Thunderball.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Thunderball.prototype.constructor = doodleBreakout.Thunderball;

doodleBreakout.Thunderball.prototype.collected = function( player ){
    //earn Bonus Points for each collected Duplicate
    player.earnPoints(80);

    this.kill();

    player.balls.forEachAlive( function( ball ){
        ball.activateThunderpower( 6500 );
    }, this._ball );
};