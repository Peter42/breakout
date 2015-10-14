var doodleBreakout = doodleBreakout || {};

doodleBreakout.Live = function (game, x, y) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, 'Live');
};

doodleBreakout.Live.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.Live.prototype.constructor = doodleBreakout.Live;
