var doodleBreakout = doodleBreakout || {};

doodleBreakout.Level1Block = function ( game, x, y ) {
    doodleBreakout.AbstactBlock.call(this, game, x, y, 'block01');
};

doodleBreakout.Level1Block.prototype = Object.create(doodleBreakout.AbstactBlock.prototype);
doodleBreakout.Level1Block.prototype.constructor = doodleBreakout.Level1Block;