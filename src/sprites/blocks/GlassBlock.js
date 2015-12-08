var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.AbstractBlock
 */
doodleBreakout.GlassBlock = function ( game, x, y ) {
    doodleBreakout.AbstractBlock.call(this, game, x, y, 'block04');
    this.points = 20;
};

doodleBreakout.GlassBlock.prototype = Object.create(doodleBreakout.AbstractBlock.prototype);
doodleBreakout.GlassBlock.prototype.constructor = doodleBreakout.GlassBlock;

/** @inheritdoc */
doodleBreakout.GlassBlock.prototype.playHitSound = function(){
    doodleBreakout.SoundManager.playSfx('hit_glass');
};