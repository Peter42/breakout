var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.Gimmick
 */
doodleBreakout.Invincible = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'invincible' );
    this.setDuration( 8 );
    this.globalEffect = true;
};

doodleBreakout.Invincible.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Invincible.prototype.constructor = doodleBreakout.Thunderball;

/**
 * Represents the game bounds
 * @type {object}
 */
doodleBreakout.Invincible.saveCollision = null;

/**
 *
 */
doodleBreakout.Invincible.reset = function(){
    doodleBreakout.Invincible.saveCollision = null;
};

/** @inheritdoc */
doodleBreakout.Invincible.prototype.collected = function( player ){
    //earn Bonus Points for each collected Gravity
    this.earnPoints(player, 10);

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

/** @inheritdoc */
doodleBreakout.Invincible.prototype.onTimerTimeout = function(){
    if( doodleBreakout.Invincible.saveCollision != null ){
        this.game.physics.arcade.checkCollision = JSON.parse( JSON.stringify( doodleBreakout.Invincible.saveCollision ) );
        doodleBreakout.Invincible.saveCollision = null;
    }
};