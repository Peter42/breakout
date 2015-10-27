var doodleBreakout = doodleBreakout || {};

doodleBreakout.AbstactBlock = function ( game, x, y, key ) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, key);

    this.health = this._getMaxHealth();

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;

    this.events.onKilled.add( this._onKill, this );
};

doodleBreakout.AbstactBlock.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.AbstactBlock.prototype.constructor = doodleBreakout.AbstactBlock;

doodleBreakout.AbstactBlock.prototype._getMaxHealth = function() {
    return this.game.cache.getFrameCount(this.key);
};

doodleBreakout.AbstactBlock.prototype.hit = function(ball) {
    if( ball.isThunderball ){
        this.kill();
        return true;
    }

    this.health--;
    if(this.health == 0) {
        this.kill();
        return true;
    } else {
        this.playHitSound();
        this.frame = this._getMaxHealth() - this.health;
        return false;
    }
};

doodleBreakout.AbstactBlock.prototype.playHitSound = function(){
    doodleBreakout.SoundManager.playSfx('hit');
};

doodleBreakout.AbstactBlock.prototype.playKillSound = function(){
    doodleBreakout.SoundManager.playSfx('break');
};


/**
 *
 * @private
 */
doodleBreakout.AbstactBlock.prototype._onKill = function(){
    this.playKillSound();

    if( this.gimmik != null ){
        this.gimmik.fall();
    }
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