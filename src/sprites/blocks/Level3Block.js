var doodleBreakout = doodleBreakout || {};

doodleBreakout.Level3Block = function ( game, x, y ) {
    doodleBreakout.AbstactBlock.call(this, game, x, y, 'block03');
};

doodleBreakout.Level3Block.prototype = Object.create(doodleBreakout.AbstactBlock.prototype);
doodleBreakout.Level3Block.prototype.constructor = doodleBreakout.Level1Block;