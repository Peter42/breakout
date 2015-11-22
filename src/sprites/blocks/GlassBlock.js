var doodleBreakout = doodleBreakout || {};

doodleBreakout.GlassBlock = function ( game, x, y ) {
    doodleBreakout.AbstactBlock.call(this, game, x, y, 'block04');
    this.points = 20;
};

doodleBreakout.GlassBlock.prototype = Object.create(doodleBreakout.AbstactBlock.prototype);
doodleBreakout.GlassBlock.prototype.constructor = doodleBreakout.GlassBlock;

doodleBreakout.GlassBlock.prototype.playHitSound = function(){
    doodleBreakout.SoundManager.playSfx('hit_glass');
};