var doodleBreakout = doodleBreakout || {};

doodleBreakout.GlassBlock = function ( game, x, y ) {
    doodleBreakout.AbstactBlock.call(this, game, x, y, 'block04');
};

doodleBreakout.GlassBlock.prototype = Object.create(doodleBreakout.AbstactBlock.prototype);
doodleBreakout.GlassBlock.prototype.constructor = doodleBreakout.Level1Block;