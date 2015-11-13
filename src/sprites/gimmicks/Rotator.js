var doodleBreakout = doodleBreakout || {};

doodleBreakout.Rotator = function ( game, x, y, ball ) {
    Phaser.Sprite.call(this, game, x, y, 'rotator');
    this._ball = ball;
    this.game = game;
    if(!doodleBreakout.Rotator.rotatorTimer) {
        doodleBreakout.Rotator.rotatorTimer = this.game.time.create(false);
    }
};

doodleBreakout.Rotator.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Rotator.prototype.constructor = doodleBreakout.Rotator;

doodleBreakout.Rotator.prototype.collected = function(){
    //earn Bonus Points for each collected Duplicate
    this.game.state.callbackContext.earnPoints(120);

    this.kill();

    this.game.state.callbackContext.activateRotation();
};