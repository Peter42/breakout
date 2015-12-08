var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.Gimmick
 */
doodleBreakout.Rotator = function( game, x, y ){
    doodleBreakout.Gimmick.call( this, game, x, y, 'rotator' );
    this.setDuration( 7 );
    this.stayAlive = true;
    this.globalEffect = true;
};

doodleBreakout.Rotator.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Rotator.prototype.constructor = doodleBreakout.Rotator;

/** @inheritdoc */
doodleBreakout.Rotator.prototype.collected = function( player ){
    //earn Bonus Points for each collected Duplicate
    this.earnPoints(player, 100);

    this._rotate(180);

    this.kill();
};

/** @inheritdoc */
doodleBreakout.Rotator.prototype.onTimerTimeout = function() {
    this._rotate(0);
};

/**
 * Rotate the whole game
 * @param {number} deg - Number of deegres to rotate
 * @private
 */
doodleBreakout.Rotator.prototype._rotate = function( deg ) {
    // game represents the game div
    game.style.transform = 'rotate('  + deg + 'deg)';
};

/**
 *
 */
doodleBreakout.Rotator.reset = function(){
    game.style.transform = 'rotate(0deg)';
};