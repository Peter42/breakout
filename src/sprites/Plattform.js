var doodleBreakout = doodleBreakout || {};

doodleBreakout.Plattform = function (game, x, y) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, 'plattform01');

    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.space.onDown.add( this.releaseBall, this );

    //game.add.sprite(423 + 98 * 0.45, game.height - 100, bmd);
    this.anchor.setTo(0.5, 1);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
    this.body.collideWorldBounds = true;

    var that = this;
    window.addEventListener("deviceorientation", function(event) {
        that.handleOrientationEvent(event);
    }, true);

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

    if( this._ball != null ){
        this._ball.x = this.x;
    }
};


doodleBreakout.Plattform.prototype.handleOrientationEvent = function(event) {
    if(!this.initialBeta) {
        this.initialBeta = event.beta;
    } else {
        if( Math.abs(event.beta - this.initialBeta) > 20 ){
            this.releaseBall();
        }
    }
    var gamma = event.gamma;
    gamma = Math.max(Math.min(gamma, 10), -10);
    gamma = gamma / 10;
    if(Math.abs(gamma) < 0.3) {
        gamma = 0;
    }
    this.body.velocity.set(800 * gamma, 0);
};

doodleBreakout.Plattform.prototype._ball = null;

doodleBreakout.Plattform.prototype.holdBall = function( ball ){
    this._ball = ball;
    this._ball.setPosition( this.x, this.y - this.height );
    this._ball.stop();

};

doodleBreakout.Plattform.prototype.releaseBall = function(){
    this._ball.start();
    this._ball = null;
};

