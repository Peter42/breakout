var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.AbstractBlock
 */
doodleBreakout.Level1Block = function ( game, x, y ) {
    doodleBreakout.AbstractBlock.call(this, game, x, y, 'block01');
};

doodleBreakout.Level1Block.prototype = Object.create(doodleBreakout.AbstractBlock.prototype);
doodleBreakout.Level1Block.prototype.constructor = doodleBreakout.Level1Block;