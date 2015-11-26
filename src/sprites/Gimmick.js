var doodleBreakout = doodleBreakout || {};

// "abstract" class
doodleBreakout.Gimmick = function ( game, x, y, texture ) {
    Phaser.Sprite.call( this, game, x, y, texture );
    this.visible = false;
    this.isFalling = false;
};

doodleBreakout.Gimmick.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.Gimmick.prototype.constructor = doodleBreakout.Gimmick;

doodleBreakout.Gimmick.prototype.gathered = function( player ) {
    this.playCollectSound();
    this.collected( player );
};

doodleBreakout.Gimmick.prototype.playCollectSound = function(){
    doodleBreakout.SoundManager.playSfx('flop');
};

doodleBreakout.Gimmick.prototype.collected = function(){
    this.destroy();
};

doodleBreakout.Gimmick.prototype.fall = function( ball ){
    this.isFalling = true;
    this.visible = true;
    this.game.physics.enable( this, Phaser.Physics.ARCADE );

    switch( ball.parent.parent.plattform.fieldPosition ){
        case "down":
            this.xVelocity = 0;
            this.yVelocity = 300;
            break;
        case "up":
            this.xVelocity = 0;
            this.yVelocity = -300;
            break;
        case "right":
            this.xVelocity = 300;
            this.yVelocity = 0;
            break;
        case "left":
            this.xVelocity = -300;
            this.yVelocity = 0;
            break;
        default:
    }
    this.body.velocity.set( this.xVelocity, this.yVelocity );
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add( this.kill, this );
};

doodleBreakout.Gimmick.prototype.xVelocity = 0;
doodleBreakout.Gimmick.prototype.yVelocity = 300;

doodleBreakout.Gimmick.prototype.setVelocity = function ( x, y ) {
    this.xVelocity = x;
    this.yVelocity = y;
};

doodleBreakout.Gimmick.prototype._earnPoints = function( player, points ){
    player.earnPoints(points, this.x,  this.y);
};
