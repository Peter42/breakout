var doodleBreakout = doodleBreakout || {};

doodleBreakout.Rotator = function( game, x, y ){
    doodleBreakout.Gimmick.call( this, game, x, y, 'rotator' );
    this.setDuration( 7 );
    this.stayAlive = true;
    this.globalEffect = true;
};

doodleBreakout.Rotator.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Rotator.prototype.constructor = doodleBreakout.Rotator;

doodleBreakout.Rotator.prototype.collected = function( player ){
    //earn Bonus Points for each collected Duplicate
    this._earnPoints(player, 100);

    this._rotate(180);

    this.kill();
};

doodleBreakout.Rotator.prototype.onTimerTimeout = function() {
    this._rotate(0);
};

doodleBreakout.Rotator.prototype._rotate = function( deg ) {
    // game represents the game div
    game.style.transform = 'rotate('  + deg + 'deg)';
};