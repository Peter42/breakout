var doodleBreakout = doodleBreakout || {};

doodleBreakout.Level2Block = function ( game, x, y ) {
    doodleBreakout.AbstactBlock.call(this, game, x, y, 'block02');
};

doodleBreakout.Level2Block.prototype = Object.create(doodleBreakout.AbstactBlock.prototype);
doodleBreakout.Level2Block.prototype.constructor = doodleBreakout.Level2Block;