var doodleBreakout = doodleBreakout || {};

doodleBreakout.Live = function ( game, x, y, lives ) {
    Phaser.Sprite.call(this, game, x, y, 'live');
    this._lives = lives;
};

doodleBreakout.Live.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Live.prototype.constructor = doodleBreakout.Live;

doodleBreakout.Live.prototype.collected = function(){
    this.kill();
    this._lives.addNew();
}