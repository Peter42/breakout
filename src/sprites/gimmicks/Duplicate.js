var doodleBreakout = doodleBreakout || {};

doodleBreakout.Duplicate = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'duplicate' );
};

doodleBreakout.Duplicate.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Duplicate.prototype.constructor = doodleBreakout.Duplicate;

doodleBreakout.Duplicate.prototype.collected = function( player ){
    //earn Bonus Points for each collected Duplicate
    this._earnPoints(player, 40);
    var currentBall = player.balls.getFirstAlive();

    var x = currentBall.body.velocity.x;
    var y = currentBall.body.velocity.y;

    var velocity = Math.sqrt(Math.pow(x, 2) +  Math.pow(y, 2));
    var angle = Math.atan2(y, x);

    currentBall.body.velocity.y = Math.sin(angle + Math.PI / 4) * velocity;
    currentBall.body.velocity.x = Math.cos(angle + Math.PI / 4) * velocity;

    var ball = player.addBall(currentBall.x,currentBall.y);
    ball.isThunderball = currentBall.isThunderball;
    if( currentBall.isThunderball ){
        ball.activateThunderpower( currentBall.powerTimer.duration );
    }

    ball.body.velocity.y = Math.sin(angle - Math.PI / 4) * velocity;
    ball.body.velocity.x = Math.cos(angle - Math.PI / 4) * velocity;

    this.kill();
};