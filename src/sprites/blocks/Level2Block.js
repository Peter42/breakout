var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.AbstractBlock
 */
doodleBreakout.Level2Block = function ( game, x, y ) {
    doodleBreakout.AbstractBlock.call(this, game, x, y, 'block02');
    this.points = 20;
};

doodleBreakout.Level2Block.prototype = Object.create(doodleBreakout.AbstractBlock.prototype);
doodleBreakout.Level2Block.prototype.constructor = doodleBreakout.Level2Block;