var doodleBreakout = doodleBreakout || {};

/**
 * @class
 */
doodleBreakout.LevelManager = {
    _game: null,
    _storage: window.localStorage,

    _levels: {
        static: [],
        alterable: []
    },

    localStorageKeys: {
        LEVELS : "LevelManager._levels"
    },

    init: function (game) {
        this._game = game;
        this._loadLevels();
    },

    _saveLevels: function(){
        this._storage.setItem( this.localStorageKeys.LEVELS, JSON.stringify( this._levels.alterable ) );
    },

    _loadLevels: function(){
        var levels = this._storage.getItem( this.localStorageKeys.LEVELS );
        if ( levels ) {
            try {
                this._levels.alterable = JSON.parse( levels );
                return true;
            } catch(e) {
                this._storage.removeItem( this.localStorageKeys.LEVELS );
            }
        }
        return false;
    },

    getLevelIds: function(){
        var levels = this._levels.static.concat( this._levels.alterable );
        var levelsAmount = levels.length;

        var levelIds = [];

        for( var i = 0; i < levelsAmount; i++ ){
            levelIds.push( levels[ i].id );
        }

        return levelIds;
    },

    getNextLevelId: function( actualId ){
        var levels = this._levels.static.concat( this._levels.alterable );
        var levelIndex = this._getLevelIndex( actualId, levels );

        if( levelIndex == -1 || ! levels[ levelIndex ] ){
            throw "Unknown level id";
        }
        else if( ! levels[ (levelIndex+1) ] ){
            return false;
        }

        return levels[ (levelIndex+1) ].id;
    },

    getLastAlterableLevel: function () {
        return this._levels.alterable[ this._levels.alterable.length - 1 ];
    },

    getLevel: function( id ){
        var levels = this._levels.static.concat( this._levels.alterable );
        var levelIndex = this._getLevelIndex( id, levels );
        var levelData = null;


        if( levelIndex == -1 || ! levels[ levelIndex ] ){
            throw "Unknown level id";
        }

        try {
            levelData = this._processLevelData( id, levels[ levelIndex ] );
        }
        catch ( e ){
            return false;
        }

        return new doodleBreakout.Level( this._game, levelData.structure, levelData.id, levelData.probability );
    },

    addLevel: function( levelData, editable ){
        editable = !!editable;

        var newLevel;
        var id;

        if( levelData.id && this._getLevelIndex( levelData.id, this._levels.alterable ) != -1 ){
            return this.editLevel( levelData.id, levelData );
        }


        if( ! editable ){
            if( ! levelData.id ){
                throw "Corrupt level data";
            }
            id = this.generateStaticGUID( levelData.id );
            newLevel = this._processLevelData( id, levelData );
            this._levels.static.push( newLevel );
        }
        else {
            id = this.generateGUID();
            newLevel = this._processLevelData( id, levelData );
            this._levels.alterable.push( newLevel );
            this._saveLevels();
        }
        return newLevel.id;
    },

    editLevel: function( id, data ){
        var levelData = null;

        var levelIndex = this._getLevelIndex( id, this._levels.alterable );

        if( levelIndex == -1 ){
            return false;
        }

        try {
            this._levels.alterable[ levelIndex ] = this._processLevelData( id, data );
            console.log( "save" );
            this._saveLevels();
            return true;
        }
        catch ( e ){
            return false;
        }
    },

    removeLevel: function( id ){
        var levelIndex = this._getLevelIndex( id, this._levels.alterable );

        if( levelIndex == -1 ){
            return false;
        }

        this._levels.alterable.splice( levelIndex, 1 );
        return true;
    },

    generateGUID: function() {
        object = {};
        var r = function(){
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };

        return (r() + r() + "-" + r() + "-4" + r().substr(0, 3) + "-" + r() + "-" + r() + r() + r()).toLowerCase();
    },

    generateStaticGUID: function( id ) {
        return id.toLowerCase();
    },

    _getLevelIndex: function( id, haystack ){
        var levelIndex = haystack.findIndex( function( a ){ return a.id == id; } );

        if( levelIndex == undefined ){
            return -1;
        }

        return levelIndex;
    },

    _processLevelData: function( id, levelData){
        var probability = {};
        var structure = [];

        if( ! levelData || typeof levelData !== 'object' ){
            throw "Corrupt level data";
        }

        if( ! id || typeof id !== 'string' ){
            throw "Invalid id";
        }

        if( ! levelData.hasOwnProperty( "structure" ) || ! ( levelData[ "structure" ] instanceof Array ) ){
            throw "No level structure defined";
        }

        structure = levelData.structure;

        if( levelData.hasOwnProperty( "probability" ) ){
            if( levelData.probability.hasOwnProperty( "dropProbability" ) ){
                probability.dropProbability = levelData.probability.dropProbability;
            }

            if( levelData.probability.hasOwnProperty( "positiveProbability" ) ){
                probability.positiveProbability = levelData.probability.positiveProbability;
            }

            if( levelData.probability.hasOwnProperty( "negativeProbability" ) ) {
                probability.negativeProbability = levelData.probability.negativeProbability;
            }
        }


        return {
            id: id,
            structure: structure,
            probability: probability
        }
    }
};