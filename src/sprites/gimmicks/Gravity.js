var doodleBreakout = doodleBreakout || {};

doodleBreakout.Gravity = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'gravity' );
    this.setDuration( 20 );
    this.stayAlive = true;
};

doodleBreakout.Gravity.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Gravity.prototype.constructor = doodleBreakout.Thunderball;

doodleBreakout.Gravity.active = false;

doodleBreakout.Gravity.prototype.collected = function( player ){
    //earn Bonus Points for each collected Gravity
    this._earnPoints(player, 75);

    this.kill();

    if( ! doodleBreakout.Gravity.active ){
        doodleBreakout.Gravity.active = true;
        this.game.physics.arcade.gravity.y += 100;
    }
};

doodleBreakout.Gravity.prototype.onTimerTimeout = function() {
    doodleBreakout.Gravity.active = false;
    this.game.physics.arcade.gravity.y -= 100;
};