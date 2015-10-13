var doodleBreakout = doodleBreakout || {};

doodleBreakout.Block = function ( game, x, y, type, health ) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, 'block02');

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;

};

doodleBreakout.Block.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.Block.prototype.constructor = doodleBreakout.Block;

doodleBreakout.Block.prototype.update = function() {

};