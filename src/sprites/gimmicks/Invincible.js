var doodleBreakout = doodleBreakout || {};

doodleBreakout.Invincible = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'invincible' );
    this.setDuration( 8 );
};

doodleBreakout.Invincible.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Invincible.prototype.constructor = doodleBreakout.Thunderball;

doodleBreakout.Invincible.saveCollision = null;

doodleBreakout.Invincible.prototype.collected = function( player ){
    //earn Bonus Points for each collected Gravity
    this._earnPoints(player, 10);

    if( doodleBreakout.Invincible.saveCollision == null ){
        doodleBreakout.Invincible.saveCollision = JSON.parse( JSON.stringify( this.game.physics.arcade.checkCollision ) );
    }

    this.game.physics.arcade.checkCollision = {
        up: true,
        down: true,
        left: true,
        right: true
    };

    this.kill();
};

doodleBreakout.Invincible.prototype.onTimerTimeout = function() {
    this.game.physics.arcade.checkCollision = JSON.parse( JSON.stringify( doodleBreakout.Invincible.saveCollision ) );
    doodleBreakout.Invincible.saveCollision = null;
};