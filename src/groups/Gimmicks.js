var doodleBreakout = doodleBreakout || {};

doodleBreakout.Gimmicks = function ( game, config, lives, ball, plattform ) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Group.call( this, game );

    this._ball = ball;
    this._lives = lives;
    this._plattform = plattform;

    if (config != null && config != undefined){
        for ( var key in config ) {
            if( this._defaultConfig[key] instanceof Array  ){
                continue;
            }
            this._defaultConfig[key] = config[key];
        }
    }

};

doodleBreakout.Gimmicks.prototype = Object.create(Phaser.Group.prototype);
doodleBreakout.Gimmicks.prototype.constructor = doodleBreakout.Gimmicks;


doodleBreakout.Gimmicks.prototype.randomGimmick = function( x, y ){
    if( this.game.rnd.realInRange(0,1) >= (100 - this._defaultConfig.dropProbability)/100 ) {
        var sum = 0;
        for( var iIndex in this._defaultConfig.gimmicks ){
            sum += this._defaultConfig.gimmicks[ iIndex ].probability;
        }

        var random = this.game.rnd.realInRange(0,sum);

        sum = 0;
        var start = 0;
        var end = 0;
        var id = 0;
        for( var i in this._defaultConfig.gimmicks ){
            start = sum;
            sum += this._defaultConfig.gimmicks[ i ].probability;
            end = sum;
            if ( start <= random && end > random ) {
                id = i;
                break;
            }
        }

        var gimmick = this[ this._defaultConfig.gimmicks[ id ][ "create" ] ]( x, y );
        if( gimmick != null ){
            gimmick.visible = false;
            this.add( gimmick );
            return gimmick;
        }
    }

    return null;
};

doodleBreakout.Gimmicks.prototype._defaultConfig = {
    "dropProbability": 4,
    "positiveProbability": 50,
    "negativeProbability": 50,
    "gimmicks": [
        {
            "name": "LiveBonus",
            "probability": 1,
            "positive": true,
            "create": "createLive"
        },
        {
            "name": "DuplicateBonus",
            "probability": 2,
            "positive": true,
            "create": "createDuplicate"
        }
    ]
};

doodleBreakout.Gimmicks.prototype.createLive = function( x, y ){
    return new doodleBreakout.Live( this.game, x, y, this._lives );
};

doodleBreakout.Gimmicks.prototype.createDuplicate = function( x, y ){
    return new doodleBreakout.Duplicate( this.game, x, y, this._ball );
};
