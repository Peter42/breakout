var doodleBreakout = doodleBreakout || {};

doodleBreakout.Plus = function ( game, x, y, plattform ) {
    Phaser.Sprite.call(this, game, x, y, 'plus');
    this.plattform = plattform;
};

doodleBreakout.Plus.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Plus.prototype.constructor = doodleBreakout.Plus;

doodleBreakout.Plus.prototype.collected = function(){
    //earn Bonus Points for each collected Plus
    this.game.state.callbackContext.earnPoints(50);
    this.plattform.grow();
    this.kill();
};