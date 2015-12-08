var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @classdec Represents the Single Player
 * @augments doodleBreakout.Player
 */
doodleBreakout.SinglePlayer = function( game, plattform, lives ) {
    doodleBreakout.Player.call( this, game, plattform );

    this.onBallLost( this.loseLive, this );

    this.lives = new doodleBreakout.Lives( game, 10, 10, lives );
    this.livesAmount = lives;
};

doodleBreakout.SinglePlayer.prototype = Object.create( doodleBreakout.Player.prototype );
doodleBreakout.SinglePlayer.prototype.constructor = doodleBreakout.SinglePlayer;

/**
 * Add one live
 */
doodleBreakout.SinglePlayer.prototype.addLive = function () {
    this.lives.addNew();
    this.livesAmount++;
};

/**
 * Lose one live
 */
doodleBreakout.SinglePlayer.prototype.loseLive = function () {
    this.lives.lose();
    this.livesAmount--;
};