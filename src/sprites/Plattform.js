var doodleBreakout = doodleBreakout || {};

doodleBreakout.Plattform = function (game, x, y) {

    var bmd = game.make.bitmapData(128, 16);
    bmd.rect(0, 0, 128, 16, 'red');

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, bmd);

    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    //game.add.sprite(423 + 98 * 0.45, game.height - 100, bmd);
    this.anchor.setTo(0.5, 1);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
    this.body.collideWorldBounds = true;

};

doodleBreakout.Plattform.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.Plattform.prototype.constructor = doodleBreakout.Plattform;

doodleBreakout.Plattform.prototype.update = function() {
    if (this.leftKey.isDown) {
        this.body.velocity.set(-800, 0);
    }
    else if (this.rightKey.isDown) {
        this.body.velocity.set(800, 0);
    } else {
        this.body.velocity.set(0, 0);
    }
};

