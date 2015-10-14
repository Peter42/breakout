var doodleBreakout = doodleBreakout || {};

doodleBreakout.Live = function (game, x, y) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, 'live');

    this.scale.setTo( 0.3, 0.3 );

    game.physics.enable(this, Phaser.Physics.ARCADE);

};

doodleBreakout.Live.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.Live.prototype.constructor = doodleBreakout.Live;
