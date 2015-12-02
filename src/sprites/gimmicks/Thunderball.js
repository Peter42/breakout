var doodleBreakout = doodleBreakout || {};

doodleBreakout.Thunderball = function (game, x, y) {
    doodleBreakout.Gimmick.call(this, game, x, y, 'thunder');
    this.setDuration( 7 );
    this._thunderballs = null;
};

doodleBreakout.Thunderball.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Thunderball.prototype.constructor = doodleBreakout.Thunderball;

doodleBreakout.Thunderball.prototype.collected = function (player) {
    //earn Bonus Points for each collected Duplicate
    this._earnPoints(player, 20);

    this.kill();

    this._thunderballs = player.balls;

    player.balls.forEachAlive( function (ball) {
        ball.activateThunderpower();
    } );
};

doodleBreakout.Thunderball.prototype.onTimerTimeout = function() {
    this._thunderballs.forEachAlive( function (ball) {
        ball.removeThunderpower();
    } );
};