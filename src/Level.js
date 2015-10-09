var doodleBreakout = doodleBreakout || {};

doodleBreakout.Level = function ( game, levelNumber ) {
    if( levelNumber > game.levels ){
        throw "Level definition error" ;
    }
    var level = game.cache.getJSON( 'level_' + levelNumber );
    this._structure = level.structure;
};

doodleBreakout.Level.prototype = {
    constructor: doodleBreakout.Level,
    _structure: [],
    getStructure: function(){
        return this._structure;
    }

};