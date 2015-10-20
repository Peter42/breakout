var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @param {Phaser.game} game - The current game.
 * @param {number} levelNumber - The number of the level to load.
 */
doodleBreakout.Level = function ( game, levelNumber ) {
    if( levelNumber > game.levels ){
        throw "Level definition error" ;
    }
    var level = game.cache.getJSON( 'level_' + levelNumber );
    this._structure = level.structure;
};

/**
 * Returns the structure of the level
 */
doodleBreakout.Level.prototype = {
    constructor: doodleBreakout.Level,
    _structure: [],
    getStructure: function(){
        return this._structure;
    }

};