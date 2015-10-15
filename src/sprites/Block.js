var doodleBreakout = doodleBreakout || {};

doodleBreakout.Block = function ( game, x, y, type, gimmik ) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, 'block0' + type);

    this.type = type;
    this.health = type;
    this.gimmik = gimmik || null;

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;

    this.events.onKilled.add( this.isDead, this );
};

doodleBreakout.Block.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.Block.prototype.constructor = doodleBreakout.Block;

doodleBreakout.Block.prototype.update = function() {

};

doodleBreakout.Block.prototype.hit = function() {
    this.health--;
    if(this.health == 0) {
        this.kill();
        return true;
    } else {
        this.frame = this.type - this.health;
        return false;
    }
};

doodleBreakout.Block.prototype.isDead = function(){
    if( this.gimmik != null ){
        this.gimmik.fall();
    }
};