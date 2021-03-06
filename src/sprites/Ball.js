var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @classdec Represents the Ball
 */
doodleBreakout.Ball = function ( game, x, y, key ) {

    //  We call the Phaser.Sprite passing in the game reference
    if( ! key ){
       key = 'ball';
    }

    Phaser.Sprite.call(this, game, x, y, key );


    this.anchor.setTo(0.5, 1);

    game.physics.enable(this, Phaser.Physics.ARCADE);


    //  This makes the game world bounce-able
    this.body.collideWorldBounds = true;
    this.checkWorldBounds = true;

    // speed up the ball a little bit
    this.body.bounce.set(1.005);
    this.body.immovable = false;

    this.body.maxVelocity.setTo( 600, 600 );

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
 */
doodleBreakout.Ball.prototype.activateThunderpower = function(){
    this.frame = 1;
    this.isThunderball = true;
};

/**
 * Removes Thunderballpower
 */
doodleBreakout.Ball.prototype.removeThunderpower = function(){
    if( this.isThunderball ){
        this.frame = 0;
        this.isThunderball = false;
    }
};

/**
 * Activates/Deactivates the collision
 */
doodleBreakout.Ball.prototype.setCollision = function ( value ) {
    value = !!value;
    this.body.checkCollision.up = value;
    this.body.checkCollision.down = value;
    this.body.checkCollision.left = value;
    this.body.checkCollision.right = value;
};