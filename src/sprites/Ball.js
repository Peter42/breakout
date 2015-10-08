var doodleBreakout = doodleBreakout || {};

doodleBreakout.Ball = function (game, x, y) {

    var bmd = game.make.bitmapData(32, 32);
    bmd.circle(16, 16, 16, 'blue');

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, bmd);


    this.anchor.setTo(0.5, 1);

    game.physics.enable(this, Phaser.Physics.ARCADE);


    //  This makes the game world bounce-able
    this.body.collideWorldBounds = true;
    this.checkWorldBounds = true;

    // speed up the ball a little bit
    this.body.bounce.set(1.005);


    this.events.onOutOfBounds.add(this.lost, this);


};

doodleBreakout.Ball.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.Ball.prototype.constructor = doodleBreakout.Ball;

doodleBreakout.Ball.prototype.update = function() {
    var w = this.width * 0.5;
    if(this.x == w || this.y == this.width || this.x + w == this.game.width){
        doodleBreakout.SoundManager.playSfx('hit');
    }
};

doodleBreakout.Ball.prototype.lost = function() {
    alert("You lost");
};

doodleBreakout.Ball.prototype.start = function() {
    //  This gets it moving
    this.body.velocity.setTo(200, 200);
};
