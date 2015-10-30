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
    this.game.state.states.Game.earnPoints(120);

    this.kill();

    doodleBreakout.Rotator.rotatorTimer.stop();
    doodleBreakout.Rotator.rotatorTimer.add(7000, doodleBreakout.Rotator.deactivateRotation, this);
    doodleBreakout.Rotator.rotatorTimer.start();
    doodleBreakout.Rotator.activateRotation();
};

doodleBreakout.Rotator.activateRotation = function() {

    game.style.transform = 'rotate(180deg)';
};

doodleBreakout.Rotator.deactivateRotation = function() {

    game.style.transform = 'rotate(0deg)';
};