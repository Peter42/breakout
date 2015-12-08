var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.AbstractBlock
 */
doodleBreakout.Level3Block = function ( game, x, y ) {
    doodleBreakout.AbstractBlock.call(this, game, x, y, 'block03');
    this.points = 30;
};

doodleBreakout.Level3Block.prototype = Object.create(doodleBreakout.AbstractBlock.prototype);
doodleBreakout.Level3Block.prototype.constructor = doodleBreakout.Level3Block;