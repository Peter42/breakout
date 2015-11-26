var doodleBreakout = doodleBreakout || {};

doodleBreakout.AbstactBlock = function ( game, x, y, key ) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, key);

    this.health = this._getMaxHealth();

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.allowGravity = false;
    this.body.immovable = true;
};

doodleBreakout.AbstactBlock.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.AbstactBlock.prototype.constructor = doodleBreakout.AbstactBlock;

doodleBreakout.AbstactBlock.prototype.destructionNeeded = true;

doodleBreakout.AbstactBlock.prototype._getMaxHealth = function() {
    return this.game.cache.getFrameCount(this.key);
};

doodleBreakout.AbstactBlock.prototype.points = 10;

doodleBreakout.AbstactBlock.prototype.getPoints = function () {
    return this.points;
}

doodleBreakout.AbstactBlock.prototype.hit = function( ball ) {
    if( ball.isThunderball ){
        ball.parent.parent.earnPoints( this.getPoints() );
        this.remove( ball );
        return true;
    }

    this.health--;
    if(this.health == 0) {
        ball.parent.parent.earnPoints( this.getPoints() );
        this.remove( ball );
        return true;
    } else {
        this.playHitSound();
        this.frame = this._getMaxHealth() - this.health;
        return false;
    }
};

doodleBreakout.AbstactBlock.prototype.remove = function( ball ){
    this.playKillSound();

    if( this.gimmik != null && ball != null ){
        this.gimmik.fall( ball );
    }

    this.destroy();
};

doodleBreakout.AbstactBlock.prototype.playHitSound = function(){
    doodleBreakout.SoundManager.playSfx('klack');
};

doodleBreakout.AbstactBlock.prototype.playKillSound = function(){
    doodleBreakout.SoundManager.playSfx('blubb');
};

doodleBreakout.AbstactBlock.prototype.setGimmik = function(gimmik){
    if(! gimmik) {
        return;
    }
    if(this.gimmik){
        throw "Gimmik has already been set";
    }

    this.gimmik = gimmik;
};