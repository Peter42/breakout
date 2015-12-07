var doodleBreakout = doodleBreakout || {};

/**
 * Generic Block
 * @constructor
 */
doodleBreakout.AbstractBlock = function ( game, x, y, key ) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, key);

    this.health = this._getMaxHealth();

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.allowGravity = false;
    this.body.immovable = true;
};

doodleBreakout.AbstractBlock.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.AbstractBlock.prototype.constructor = doodleBreakout.AbstractBlock;

doodleBreakout.AbstractBlock.prototype.destructionNeeded = true;

/**
 * Get the start helth of the block
 * @returns {number}
 * @private
 */
doodleBreakout.AbstractBlock.prototype._getMaxHealth = function() {
    return this.game.cache.getFrameCount(this.key);
};

/**
 * Amount of points for the block
 * @protected
 * @type {number}
 */
doodleBreakout.AbstractBlock.prototype.points = 10;

/**
 * Get the points
 * @public
 * @returns {number}
 */
doodleBreakout.AbstractBlock.prototype.getPoints = function () {
    return this.points;
};

/**
 * Call method if the block was hit
 * @param ball
 * @returns {boolean}
 * @public
 */
doodleBreakout.AbstractBlock.prototype.hit = function( ball ) {
    if( ball.isThunderball ){
        ball.parent.parent.earnPoints( this.getPoints(), this.x + this.width/2, this.y );
        this.remove( ball );
        return true;
    }

    this.health--;
    if(this.health == 0) {
        ball.parent.parent.earnPoints( this.getPoints(), this.x + this.width/2, this.y );
        this.remove( ball );
        return true;
    } else {
        this.playHitSound();
        this.frame = this._getMaxHealth() - this.health;
        return false;
    }
};

/**
 * Remove the block
 * @param ball
 * @protected
 */
doodleBreakout.AbstractBlock.prototype.remove = function( ball ){
    this.playKillSound();

    if( this.gimmik != null && ball != null ){
        this.gimmik.fall( ball );
    }

    this.destroy();
};

/**
 * Play a sound if the block is hit
 * @protected
 */
doodleBreakout.AbstractBlock.prototype.playHitSound = function(){
    doodleBreakout.SoundManager.playSfx('klack');
};

/**
 * Play a sound if the block is destroyed
 * @protected
 */
doodleBreakout.AbstractBlock.prototype.playKillSound = function(){
    doodleBreakout.SoundManager.playSfx('blubb');
};

/**
 * Set a gimmick for the block
 * @param gimmick
 * @public
 */
doodleBreakout.AbstractBlock.prototype.setGimmik = function(gimmick){
    if(! gimmick) {
        return;
    }
    if(this.gimmik){
        throw "Gimmik has already been set";
    }

    this.gimmik = gimmick;
};