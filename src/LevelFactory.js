var doodleBreakout = doodleBreakout || {};
/**
 * @class BlockFactory
 */

doodleBreakout.LevelFactory = {};

/**
 * @static
 * @param {Phaser.Game} game _ The game context.
 * @param {number} type - The type of the level to factor
 * @param {number} level - The level number
 */
doodleBreakout.LevelFactory.getLevel = function ( game, type, level ){
    switch (type) {
        case 1:
            var levelAmount = game.cache.getJSON( 'levelIndex').length;
            var levelData = {};

            if( level <= levelAmount ){
                levelData = game.cache.getJSON( 'level_' + level );
            }
            else {
                // get own level from local storage
                throw 'Not implemented yet';
            }

            if( levelData.id == undefined || levelData.id == "" || levelData.structure == undefined || levelData.structure.length === 0 ){
                throw 'Level definition is wrong';
            }

            return new doodleBreakout.Level( game, levelData.structure, levelData.id, levelData.probability );
        default:
            throw 'Not implemented yet';
    }

};
