var doodleBreakout = doodleBreakout || {};
/**
 * @class doodleBreakout.BlockFactory
 */

doodleBreakout.BlockFactory = {};

/**
 * @static
 * @param {number} type - The type of the block to factor
 * @param {Phaser.Game} game _ The game context.
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 */
doodleBreakout.BlockFactory.get = function (type, game, x, y){
    switch (type) {
        case 1:
            return new doodleBreakout.Level1Block(game, x, y);
        case 2:
            return new doodleBreakout.Level2Block(game, x, y);
        case 3:
            return new doodleBreakout.Level3Block(game, x, y);
        case 4:
            return new doodleBreakout.GlassBlock(game, x, y);
        case 5:
            return new doodleBreakout.UnbreakableBlock(game, x, y);
        default:
            throw "Not implemented yet";
    }

};