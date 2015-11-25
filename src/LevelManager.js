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


    init: function ( game ) {
        this._game = game;
        this._loadLevels();
    },

    getLevelIds: function(){
        var levels = this._levels.static.concat( this._levels.alterable );
        var levelsAmount = levels.length;
        var levelIds = [];

        for( var i = 0; i < levelsAmount; i++ ){
            levelIds.push( levels[i].id );
        }

        return levelIds;
    },

    getNextLevelId: function( actualId ){
        var levels = this._levels.static.concat( this._levels.alterable );
        var levelIndex = this._getLevelIndex( actualId, levels );

        if( levelIndex == -1 || ! levels[ levelIndex ] ){
            throw "Unknown level id: " + levels[levelIndex];
        }
        else if( ! levels[ (levelIndex+1) ] ){
            return false;
        }

        return levels[ (levelIndex+1) ].id;
    },

    getStaticLevelIds: function () {
        var levelsAmount = this._levels.static.length;
        var levelIds = [];

        for( var i = 0; i < levelsAmount; i++ ){
            levelIds.push( this._levels.static[i].id );
        }

        return levelIds;
    },

    getAlterableLevelIds: function() {
        var levelsAmount = this._levels.alterable.length;
        var levelIds = [];

        for( var i = 0; i < levelsAmount; i++ ){
            levelIds.push( this._levels.alterable[i].id );
        }

        return levelIds;
    },

    getLevel: function( id ){
        var levelData = this.getLevelData( id );

        if( ! levelData ){
            throw "Level definition error";
        }

        return new doodleBreakout.Level( this._game, levelData.structure, levelData.id, levelData.probability );
    },

    getMultiplayerLevel: function( id ){
        var levelData = this.getLevelData( id );

        if( ! levelData ){
            throw "Level definition error";
        }

        return new doodleBreakout.LevelMultiplayer( this._game, levelData.structure, levelData.id, levelData.probability );
    },

    getLevelData: function( id ){
        var levels = this._levels.static.concat( this._levels.alterable );
        var levelIndex = this._getLevelIndex( id, levels );
        var levelData = null;

        if( levelIndex == -1 || ! levels[ levelIndex ] ){
            throw "Unknown level id: " + levels[levelIndex];
        }

        levelData = this._processLevelData( id, levels[ levelIndex ] );

        return JSON.parse( JSON.stringify( levelData) );
    },

    addLevel: function( levelData, editable ){
        var levelSection;
        var newLevel;
        var id;

        editable = !!editable;

        if( ! editable ){
            levelSection = this._levels.static;
            id = this._generateStaticGUID( levelData.id );
        }
        else {
            levelSection = this._levels.alterable;
            id = this._generateGUID();
        }

        newLevel = this._processLevelData( id, levelData );

        levelSection.push( newLevel );
        this._saveLevels();
        return newLevel.id;
    },

    editLevel: function( id, levelData ){
        var levelIndex = this._getLevelIndex( id, this._levels.alterable );

        this._levels.alterable[ levelIndex ] = this._processLevelData( id, levelData );
        this._saveLevels();

        return true;
    },

    removeLevel: function( id ){
        var levelIndex = this._getLevelIndex( id, this._levels.alterable );

        this._levels.alterable.splice( levelIndex, 1 );
        this._saveLevels();

        return true;
    },

    _saveLevels: function(){
        this._storage.setItem( this.localStorageKeys.LEVELS, JSON.stringify( this._levels.alterable ) );
        return true;
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

    _generateGUID: function() {
        object = {};
        var r = function(){
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };

        return (r() + r() + "-" + r() + "-4" + r().substr(0, 3) + "-" + r() + "-" + r() + r() + r()).toLowerCase();
    },

    _generateStaticGUID: function( id ) {
        if( ! id ){
            throw "Undefined level id";
        }
        return id.toLowerCase();
    },

    _getLevelIndex: function( id, haystack ){
        if( ! id ){
            throw "Level id not set";
        }

        var levelIndex = haystack.findIndex( function( a ){ return a.id == id; } );

        if( levelIndex == undefined ){
            throw "Undefined level";
        }

        return levelIndex;
    },

    validateStructure: function( structure ){
        var length = structure.length;

        var sum = 0;

        for( var a = 0; a < length; a++ ){
            var aLength = structure[a].length;
            for( var b = 0; b < aLength; b++ ){
                if( structure[a][b] != 0 ){
                    return true;
                }

            }
        }

        return false;
    },

    _processLevelData: function( id, levelData ){
        var probability = {};
        var structure = [];

        if( ! levelData || typeof levelData !== 'object' ){
            throw "Corrupt level data";
        }

        if( ! id || typeof id !== 'string' ){
            throw "Invalid id";
        }

        if( ! levelData.hasOwnProperty( "structure" ) || ! ( levelData[ "structure" ] instanceof Array ) || ! this.validateStructure( levelData.structure ) ){
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