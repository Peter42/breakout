var doodleBreakout = doodleBreakout || {};

doodleBreakout.Plattform = function (game, x, y, key, fieldPosition, velocity, moveKey1, moveKey2, releaseKey, activePointer ) {

    Phaser.Sprite.call(this, game, x, y, key);

    this.isPointerActive = !(activePointer === false);

    this.moveDirection1 = moveKey1;
    this.moveDirection2 = moveKey2;

    this.release = releaseKey;
    this.release.onDown.add( this.releaseBalls, this );
    this.release.onDown.add( this.releasePressed, this );


    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.body.collideWorldBounds = true;

    this.holdPosition = { x:0, y:0 };

    this.hold = false;

    this.holdBallVelocity = {
        x: 0,
        y: 0
    };

    this.sizeValues = {
        velocity: {
            x: velocity.x,
            y: velocity.y
        },
        height: this.height,
        width: this.width
    };

    this.fieldPosition = fieldPosition;

    switch( fieldPosition ){
        case "down":
            this.sizeValues.velocity.x = velocity;
            this.sizeValues.velocity.y = 0;
            this.holdPosition.x = this.x;
            this.holdPosition.y = this.y - this.height/2;
            game.physics.arcade.checkCollision.down = false;
            this.stay = this.stayX;
            this.holdBallVelocity.x = 10;
            this.holdBallVelocity.y = 270;
            rotation = 0;
            break;
        case "up":
            this.sizeValues.velocity.x = velocity;
            this.sizeValues.velocity.y = 0;
            this.holdPosition.x = this.x;
            this.holdPosition.y = this.y + this.height/2 + 16;
            game.physics.arcade.checkCollision.up = false;
            this.stay = this.stayX;
            this.holdBallVelocity.x = 10;
            this.holdBallVelocity.y = -270;
            rotation = 180;
            break;
        case "right":
            this.sizeValues.velocity.x = 0;
            this.sizeValues.velocity.y = velocity;
            this.body.height = this.width;
            this.body.width = this.height;
            this.holdPosition.x = this.x - this.body.width/2 - 8;
            this.holdPosition.y = this.y;
            this.stay = this.stayY;
            this.holdBallVelocity.x = 270;
            this.holdBallVelocity.y = 10;
            game.physics.arcade.checkCollision.right = false;
            rotation = -90;
            break;
        case "left":
            this.sizeValues.velocity.x = 0;
            this.sizeValues.velocity.y = velocity;
            this.body.height = this.width;
            this.body.width = this.height;
            this.holdPosition.x = this.x + this.body.width/2 + 8;
            this.holdPosition.y = this.y;
            this.stay = this.stayY;
            this.holdBallVelocity.x = -270;
            this.holdBallVelocity.y = 10;
            game.physics.arcade.checkCollision.left = false;
            rotation = 90;
            break;
        default: throw "no facing direction";
    }

    this.anchor.setTo(0.5, 0.5);
    this.rotation = rotation * (Math.PI/180);

    var that = this;
    window.addEventListener("devicemotion", function(event) {
        console.log(event);
        that.handleOrientationEvent(event);
    }, true);

    this.action = {
        move1: false,
        move2: false
    };

    this.freeze = false;
};

doodleBreakout.Plattform.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.Plattform.prototype.constructor = doodleBreakout.Plattform;

doodleBreakout.Plattform.prototype.update = function() {
    if( this._balls != null ){
        this._balls.forEach( function( ball ){
            this.stay( ball );
        }, this );
    }

    if( this.freeze ){
        this.body.velocity.set( 0, 0 );
        return;
    }

    if( this.fieldPosition == "left" || this.fieldPosition == "right" ){
        this.body.height = this.width;
        this.body.width = this.height;
    }

    if ( this.isPointerActive && this.game.input.activePointer.isDown ) {
        this.releaseBalls();
    }

    if (this.moveDirection1.isDown || doodleBreakout.OnscreenInput.isLeft() | this.action.move1 ) {
        this.body.velocity.set( -this.sizeValues.velocity.x, -this.sizeValues.velocity.y);
    }
    else if (this.moveDirection2.isDown || doodleBreakout.OnscreenInput.isRight() | this.action.move2 ) {
        this.body.velocity.set( this.sizeValues.velocity.x, this.sizeValues.velocity.y);
    } else {
        this.body.velocity.set(0, 0);
    }

};

doodleBreakout.Plattform.prototype.stayX = function ( ball ) {
    ball.x = this.x;
};

doodleBreakout.Plattform.prototype.stayY = function ( ball ) {
    ball.y = this.y;
};


doodleBreakout.Plattform.prototype.handleOrientationEvent = function(event) {
    if( ! this.body ){
        return;
    }

    this.action.move1 = false;
    this.action.move2 = false;

    var gamma = event.accelerationIncludingGravity.x;
    if(Math.abs(gamma) < 1) {
        gamma = 0;
    }

    if( gamma >  0 ) {
        this.action.move1 = true;
    }
    else if ( gamma <  0 ) {
        this.action.move2 = true;
    }
};


doodleBreakout.Plattform.prototype.holdBalls = function( balls ){
    this.hold = true;
    this._balls = balls;

    this._balls.forEach( function( ball ){
        ball.setCollision( false );
        ball.setPosition( this.holdPosition.x, this.holdPosition.y );
        ball.stop();

        ball.animations.add('blink');
        ball.animations.play('blink', 8, true);
    }, this );

    var timer = this.game.time.create();
    timer.add( 1.5 * Phaser.Timer.SECOND, this.releaseBalls, this);
    timer.start();
};


doodleBreakout.Plattform.prototype.releasePressed = function () {
    if( ! this._releaseTimestamps ){
        this._releaseTimestamps = [];
    }

    var currentTime = this.game.time.time;

    this._releaseTimestamps = this._releaseTimestamps.filter( function ( value ){
        return value > ( currentTime - Phaser.Timer.SECOND * 2 );
    } );

    this._releaseTimestamps.push( currentTime );

    if( ! this.freeze && this._releaseTimestamps.length > 3 ){
        this.freeze = true;

        var freezeTime = 3 * Phaser.Timer.SECOND;

        this.game.state.getCurrentState().displayText( this.x, this.y, "TILT", freezeTime );

        var timer = this.game.time.create(false);
        timer.add( freezeTime, function(){
            this.freeze = false;
        }, this);
        timer.start();
    }
};

doodleBreakout.Plattform.prototype.releaseBalls = function(){
    if( this.hold && this._balls && !this.game.state.callbackContext.doodlebreakoutIsPaused ) {
        this.hold = false;
        this._balls.forEach( function( ball ){
            ball.animations.getAnimation("blink").destroy();
            ball.frame = 0;
            ball.setCollision( true );
            ball.start();
            ball.body.velocity.setTo( this.holdBallVelocity.x, this.holdBallVelocity.y );
        }, this );
        this._balls = null;
    }
};


doodleBreakout.Plattform.prototype.resetPlattform = function(){
    this.height = this.sizeValues.height;
    this.width = this.sizeValues.width;
    this.freeze = false;
};

doodleBreakout.Plattform.prototype.grow = function(){
    if( this.width >= this.sizeValues.width * 2 ){
        return false;
    }
    this.width += (this.sizeValues.width/100) * 10;
    this.height += (this.sizeValues.height/100) * 10;

    return true;
};

doodleBreakout.Plattform.prototype.shrink = function(){
    if( this.width < ( this.sizeValues.width/3 ) ){
        return false;
    }
    this.width -= (this.sizeValues.width/100) * 10;
    this.height -= (this.sizeValues.height/100) * 10;

    return true;
};

