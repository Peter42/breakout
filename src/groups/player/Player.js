var doodleBreakout = doodleBreakout || {};

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


doodleBreakout.Player.prototype.interact = function( scope ){
    for( i in this.customCollisions ){
        var callbackContext = this.customCollisions[ i ].callbackContext;
        if( ! callbackContext ){
            callbackContext = scope;
        }
        this.game.physics.arcade.collide( this.customCollisions[ i ].object1, this.customCollisions[ i ].object2, this.customCollisions[ i ].collideCallback, this.customCollisions[ i ].processCallback, callbackContext );
    }

    this.game.physics.arcade.collide( this.plattform, this.balls, function ( plattform, ball ) {
        var angle = this.game.physics.arcade.angleBetween(plattform, ball) + Math.PI / 2;

        var velocity = Math.sqrt(Math.pow(ball.body.velocity.x, 2) + Math.pow(ball.body.velocity.y, 2));
        velocity = Math.min(velocity, 800);

        doodleBreakout.SoundManager.playSfx('paddle');

        ball.body.velocity.set(velocity * Math.sin(angle), -velocity * Math.cos(angle));
    }, null, this);
};

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


doodleBreakout.Player.prototype.setBallsOnPlattform = function(){
    this.plattform.holdBalls( this.balls );
};


doodleBreakout.Player.prototype.addBall = function( x, y ){
    if( ! x ){
        x = 0;
    }

    if( ! y ){
        y = 0;
    }

    var ball = new doodleBreakout.Ball( this.game, x, y, this.balls.imageKey );
    ball.events.onOutOfBounds.add(this.lostBall, this);

    this.balls.add(ball);
    ball.start();

    if( this.plattform.hold ){
        this.setBallsOnPlattform();
    }

    return ball;
};


doodleBreakout.Player.prototype.earnPoints = function( points, x, y ){
    this.points += points;
    if(x&&y){
        var text = "" + points;
        var game =  this.game.state.states[this.game.state.current];
        game.displayText(x,y, text, Phaser.Timer.SECOND);
    }
    for( i in this.earnPoint ){
        (this.earnPoint[ i ][ 0 ]).call( this.earnPoint[ i ][ 1 ] );
    }
};

doodleBreakout.Player.prototype.onBallLost = function( fn, scope ){
    this.ballLost.push( [fn,scope] );
};

doodleBreakout.Player.prototype.onEarnPoint = function( fn, scope ){
    this.earnPoint.push( [fn,scope] );
};

doodleBreakout.Player.prototype.lostBall = function (ball) {
    if ( this.balls.total <= 1 ){

        for( i in this.ballLost ){
            (this.ballLost[ i ][ 0 ]).call( this.ballLost[ i ][ 1 ] );
        }
        this.plattform.resetPlattform();
        this.addBall( 300, 300 );
        this.plattform.holdBalls( this.balls );
    }

    ball.kill();
    this.balls.remove( ball );
};