var doodleBreakout = doodleBreakout || {};

doodleBreakout.SinglePlayer = function( game, plattform, lives ) {
    doodleBreakout.Player.call( this, game, plattform );

    this.onBallLost( this.loseLive, this );

    this.lives = new doodleBreakout.Lives( game, 10, 10, lives );
    this.livesAmount = lives;
};

doodleBreakout.SinglePlayer.prototype = Object.create( doodleBreakout.Player.prototype );
doodleBreakout.SinglePlayer.prototype.constructor = doodleBreakout.SinglePlayer;

doodleBreakout.SinglePlayer.prototype.interact = function ( scope ) {
    doodleBreakout.Player.prototype.interact.call( this, scope );
};

doodleBreakout.SinglePlayer.prototype.addLive = function () {
    this.lives.addNew();
    this.livesAmount++;
};

doodleBreakout.SinglePlayer.prototype.loseLive = function () {
    this.lives.lose();
    this.livesAmount--;
};