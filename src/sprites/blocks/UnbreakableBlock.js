var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.AbstractBlock
 */
doodleBreakout.UnbreakableBlock = function ( game, x, y ) {
    doodleBreakout.AbstractBlock.call(this, game, x, y, 'block05');
    this.points = 50;
    this.destructionNeeded = false;
};

doodleBreakout.UnbreakableBlock.prototype = Object.create(doodleBreakout.AbstractBlock.prototype);
doodleBreakout.UnbreakableBlock.prototype.constructor = doodleBreakout.UnbreakableBlock;

/** @inheritdoc */
doodleBreakout.UnbreakableBlock.prototype.hit = function( ball ){
    if( ball.isThunderball ) {
        ball.parent.parent.earnPoints( this.getPoints(), this.x + this.width/2, this.y );
        this.remove( ball );
        return true;
    }

    this.playHitSound();
    return false;
};