var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 */
doodleBreakout.LiveSymbol = function (game, x, y) {
    // We call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, 'live');
};

doodleBreakout.LiveSymbol.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.LiveSymbol.prototype.constructor = doodleBreakout.LiveSymbol;
