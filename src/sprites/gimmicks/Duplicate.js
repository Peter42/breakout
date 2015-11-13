var doodleBreakout = doodleBreakout || {};

doodleBreakout.Duplicate = function ( game, x, y, ball ) {
    Phaser.Sprite.call(this, game, x, y, 'duplicate');
    this.ball = ball;
};

doodleBreakout.Duplicate.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Duplicate.prototype.constructor = doodleBreakout.Duplicate;

doodleBreakout.Duplicate.prototype.collected = function(){
    //earn Bonus Points for each collected Duplicate
    this.game.state.callbackContext.earnPoints(50);

    var currentBall = this.ball.getFirstAlive();

    var x = currentBall.body.velocity.x;
    var y = currentBall.body.velocity.y;

    var velocity = Math.sqrt(Math.pow(x, 2) +  Math.pow(y, 2));
    var angle = Math.atan2(y, x);

    currentBall.body.velocity.y = Math.sin(angle + Math.PI / 4) * velocity;
    currentBall.body.velocity.x = Math.cos(angle + Math.PI / 4) * velocity;

    var ball = this.game.state.callbackContext.addBall(currentBall.x,currentBall.y);
    ball.isThunderball = currentBall.isThunderball;
    if( currentBall.isThunderball ){
        ball.activateThunderpower( currentBall.powerTimer.duration );
    }

    ball.body.velocity.y = Math.sin(angle - Math.PI / 4) * velocity;
    ball.body.velocity.x = Math.cos(angle - Math.PI / 4) * velocity;

    this.kill();
};