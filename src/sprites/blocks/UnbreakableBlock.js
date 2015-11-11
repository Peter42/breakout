var doodleBreakout = doodleBreakout || {};

doodleBreakout.UnbreakableBlock = function ( game, x, y ) {
    doodleBreakout.AbstactBlock.call(this, game, x, y, 'block05');
};

doodleBreakout.UnbreakableBlock.prototype = Object.create(doodleBreakout.AbstactBlock.prototype);
doodleBreakout.UnbreakableBlock.prototype.constructor = doodleBreakout.UnbreakableBlock;

doodleBreakout.UnbreakableBlock.prototype.destructionNeeded = false;

doodleBreakout.UnbreakableBlock.prototype.hit = function( ball ){
    if( ball.isThunderball ){
        this.kill();
        return true;
    }

    this.playHitSound();
    return false;
};