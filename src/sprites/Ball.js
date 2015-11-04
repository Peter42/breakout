var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @classdec Represents the Ball
 */
doodleBreakout.Ball = function (game, x, y) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, 'ball');


    this.anchor.setTo(0.5, 1);

    game.physics.enable(this, Phaser.Physics.ARCADE);


    //  This makes the game world bounce-able
    this.body.collideWorldBounds = true;
    this.checkWorldBounds = true;

    // speed up the ball a little bit
    this.body.bounce.set(1.005);
    this.body.immovable = false;

    this.events.onOutOfBounds.add(this.lost, this);

    this.powerTimer = game.time.create(false);
    this.isThunderball = false;
};

doodleBreakout.Ball.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.Ball.prototype.constructor = doodleBreakout.Ball;

doodleBreakout.Ball.prototype.update = function() {
    var w = this.width * 0.5;
    if(this.x == w || this.y == this.width || this.x + w == this.game.width){
        doodleBreakout.SoundManager.playSfx('worldcollide');
    }
};

doodleBreakout.Ball.prototype.lost = function() {
    this.removeThunderpower();
};

/**
 * Gives the ball an initial velocity
 */
doodleBreakout.Ball.prototype.start = function() {
    //  This gets it moving
    this.body.moves = true;
    this.body.velocity.setTo(270, 270);
};

/**
 * Sets the postition of the ball
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 */
doodleBreakout.Ball.prototype.setPosition = function( x, y ) {
    //  This gets it moving
    this.x = x;
    this.y = y;
};

/**
 * Stops the movement of the ball
 */
doodleBreakout.Ball.prototype.stop = function() {
    this.body.moves = false;
};

/**
 * Sets the ball to a Thunderball
 * @param {number} duration - The duration of the activity.
 */
doodleBreakout.Ball.prototype.activateThunderpower = function( duration ){
    this.frame = 1;
    this.isThunderball = true;

    this.powerTimer.destroy();
    this.powerTimer.stop();
    this.powerTimer.add( duration, this.removeThunderpower, this);
    this.powerTimer.start();
};

/**
 * Removes Thunderballpower
 */
doodleBreakout.Ball.prototype.removeThunderpower = function(){
    if( this.isThunderball ){
        this.powerTimer.destroy();
        this.powerTimer.stop();
        this.frame = 0;
        this.isThunderball = false;
    }
};