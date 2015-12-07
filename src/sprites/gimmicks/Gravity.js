var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.Gimmick
 */
doodleBreakout.Gravity = function ( game, x, y ) {
    doodleBreakout.Gimmick.call( this, game, x, y, 'gravity' );
    this.setDuration( 20 );
    this.stayAlive = true;
    this.globalEffect = true;
};

doodleBreakout.Gravity.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Gravity.prototype.constructor = doodleBreakout.Thunderball;

/**
 * Set the gravity global
 * @static
 * @type {boolean}
 */
doodleBreakout.Gravity.active = false;

/**
 *
 */
doodleBreakout.Gravity.reset = function(){
    doodleBreakout.Gravity.active = false;
};

/** @inheritdoc */
doodleBreakout.Gravity.prototype.collected = function( player ){
    //earn Bonus Points for each collected Gravity
    this.earnPoints(player, 75);

    this.kill();

    if( ! doodleBreakout.Gravity.active ){
        doodleBreakout.Gravity.active = true;
        this.game.physics.arcade.gravity.y += 100;
        console.log( "GravityACTIVATE" );
    }
};

/** @inheritdoc */
doodleBreakout.Gravity.prototype.onTimerTimeout = function(){
    if( doodleBreakout.Gravity.active ) {
        doodleBreakout.Gravity.active = false;
        this.game.physics.arcade.gravity.y -= 100;
    }
};