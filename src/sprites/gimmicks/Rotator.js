var doodleBreakout = doodleBreakout || {};

doodleBreakout.Rotator = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'rotator' );
    if(!doodleBreakout.Rotator.rotatorTimer) {
        doodleBreakout.Rotator.rotatorTimer = this.game.time.create(false);
    }
};

doodleBreakout.Rotator.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Rotator.prototype.constructor = doodleBreakout.Rotator;

doodleBreakout.Rotator.prototype.collected = function( player ){
    //earn Bonus Points for each collected Duplicate
    this._earnPoints(player, 120);

    this.kill();

    this.game.state.callbackContext.activateRotation();
};