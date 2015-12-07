var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @classdec Represents the Player
 */
doodleBreakout.Player = function( game, plattform ) {

    Phaser.Group.call( this, game );

    this.game = game;
    this.balls = game.add.group();
    this.balls.imageKey = "ball";
    this.plattform = plattform;

    this.points = 0;

    this.add( plattform );
    this.add( this.balls );

    this.balls.collideWith = function ( object2, collideCallback, processCallback, callbackContext ){
        var collision = {
            object1: this,
            object2: object2,
            collideCallback: collideCallback,
            processCallback: processCallback,
            callbackContext: callbackContext
        };
        this.parent.customCollisions.push( collision );
    };

    this.plattform.collideWith = function ( object2, collideCallback, processCallback, callbackContext ){
        var collision = {
            object1: this,
            object2: object2,
            collideCallback: collideCallback,
            processCallback: processCallback,
            callbackContext: callbackContext
        };
        this.parent.customCollisions.push( collision );
    };

    this.customCollisions = [];

    this.ballLost = [];
    this.earnPoint = [];
};

doodleBreakout.Player.prototype = Object.create(Phaser.Group.prototype);
doodleBreakout.Player.prototype.constructor = doodleBreakout.Player;

/**
 * Call this method in the update method of the state where the player should interact
 * @param {object} scope - In which scope the player interacts.
 */
doodleBreakout.Player.prototype.interact = function( scope ){
    for( var i = 0; i < this.customCollisions.length; ++i ){
        var callbackContext = this.customCollisions[ i ].callbackContext;
        if( ! callbackContext ){
            callbackContext = scope;
        }
        this.game.physics.arcade.collide( this.customCollisions[ i ].object1, this.customCollisions[ i ].object2, this.customCollisions[ i ].collideCallback, this.customCollisions[ i ].processCallback, callbackContext );
    }

    this.game.physics.arcade.collide( this.plattform, this.balls, function ( plattform, ball ) {

        var y = plattform.y;
        var x = plattform.x;

        switch ( plattform.fieldPosition ){
            case "up":
                y -= plattform.height / 2;
                break;
            case "down":
                y += plattform.height / 2;
                break;
            case "left":
                x -= plattform.height / 2;
                break;
            case "right":
                x += plattform.height / 2;
                break;
        }

        var angle = this.game.physics.arcade.angleToXY(ball, x, y) - Math.PI / 2;

        var velocity = Math.sqrt(Math.pow(ball.body.velocity.x, 2) + Math.pow(ball.body.velocity.y, 2));
        velocity = Math.min(velocity, 800);

        doodleBreakout.SoundManager.playSfx('paddle');

        ball.body.velocity.set(velocity * Math.sin(angle), -velocity * Math.cos(angle));
    }, null, this);
};

/**
 * Add objects with which the player must collide.
 * @param {object} object2 - The second object or array of objects to check.
 * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them, unless you are colliding Group vs. Sprite, in which case Sprite will always be the first parameter.
 * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
 * @param {object} callbackContext - The context in which to run the callbacks.
 */
doodleBreakout.Player.prototype.collideWith = function ( object2, collideCallback, processCallback, callbackContext ){
    var collision = {
        object1: this,
        object2: object2,
        collideCallback: collideCallback,
        processCallback: processCallback,
        callbackContext: callbackContext
    };
    this.customCollisions.push( collision );
};

/**
 * Set all Balls of the player on his platform
 */
doodleBreakout.Player.prototype.setBallsOnPlattform = function(){
    this.plattform.holdBalls( this.balls );
};

/**
 * Add a ball to the player
 */
doodleBreakout.Player.prototype.addBall = function( x, y ){
    if( ! x ){
        x = 0;
    }

    if( ! y ){
        y = 0;
    }

    var ball = new doodleBreakout.Ball( this.game, x, y, this.balls.imageKey );
    ball.events.onOutOfBounds.add(this._lostBall, this);

    this.balls.add(ball);
    ball.start();

    if( this.plattform.hold ){
        this.setBallsOnPlattform();
    }

    return ball;
};

/**
 * Let the player earn points
 * @param {number} points - Add the number of points to the player
 * @param {number} x - x position to work with
 * @param {number} y - y position to work with
 */
doodleBreakout.Player.prototype.earnPoints = function( points, x, y ){
    this.points += points;
    for( var i = 0; i < this.earnPoint.length; ++i ){
        (this.earnPoint[ i ][ 0 ]).call( this.earnPoint[ i ][ 1 ], points, x, y );
    }
};

/**
 * Add a method which should be called on ball lost
 */
doodleBreakout.Player.prototype.onBallLost = function( fn, scope ){
    this.ballLost.push( [fn,scope] );
};

/**
 * Add a method which should be called when the player earn points
 */
doodleBreakout.Player.prototype.onEarnPoint = function( fn, scope ){
    this.earnPoint.push( [fn,scope] );
};

/**
 * Is called if the player lost a ball
 */
doodleBreakout.Player.prototype._lostBall = function (ball) {
    if ( this.balls.total <= 1 ){

        for( var i = 0; i < this.ballLost.length; ++i ){
            (this.ballLost[ i ][ 0 ]).call( this.ballLost[ i ][ 1 ], ball );
        }
        this.plattform.resetPlattform();
        this.addBall( 300, 300 );
        this.plattform.holdBalls( this.balls );
    }

    ball.kill();
    this.balls.remove( ball );
};