var doodleBreakout = doodleBreakout || {};

// "abstract" class
doodleBreakout.Gimmick = function () {
};

doodleBreakout.Gimmick.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.Gimmick.prototype.constructor = doodleBreakout.Gimmick;

doodleBreakout.Gimmick.prototype.gathered = function () {
    this.playCollectSound();
    this.collected();
};


doodleBreakout.Gimmick.prototype.playCollectSound = function(){
    doodleBreakout.SoundManager.playSfx('flop');
};


doodleBreakout.Gimmick.prototype.collected = function(){
    this.kill();
};

doodleBreakout.Gimmick.prototype.fall = function(){
    this.visible = true;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.velocity.set(0,300);
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add( this.kill, this );
};