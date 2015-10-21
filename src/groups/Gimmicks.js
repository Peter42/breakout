var doodleBreakout = doodleBreakout || {};

doodleBreakout.Gimmicks = function ( game, config, lives, ball, plattform ) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Group.call( this, game );

    this._ball = ball;
    this._lives = lives;
    this._plattform = plattform;

    if (config != null && config != undefined){
        for ( var key in config ) {
            if( config.hasOwnProperty( key )  && this._defaultConfig.hasOwnProperty( key ) ){
                this._defaultConfig[ key ] = config[ key ];
            }

        }
    }

};

doodleBreakout.Gimmicks.prototype = Object.create(Phaser.Group.prototype);
doodleBreakout.Gimmicks.prototype.constructor = doodleBreakout.Gimmicks;


doodleBreakout.Gimmicks.prototype.randomGimmick = function( x, y ){
    if (this.game.rnd.realInRange(0, 1) >= ( 100 - this._defaultConfig.dropProbability ) / 100){
        var aPositiveGimmicks = this._defaultConfig.gimmicks.positive;
        var aNegativeGimmicks = this._defaultConfig.gimmicks.negative;

        var aValues = [ this._defaultConfig.positiveProbability, this._defaultConfig.negativeProbability ];

        var oGimmickConfig = null;

        // positive or negative gimmick
        if( this.probabilityCalculation( aValues ) == 1 ) {
            // decide which negative gimmick should appear
            var negativeKey = this.probabilityCalculation( aNegativeGimmicks, "probability" );
            if( negativeKey !== -1 ){
                oGimmickConfig = aNegativeGimmicks[ negativeKey ];
            }
        }
        else {
            // decide which positive gimmick should appear
            var positiveKey = this.probabilityCalculation( aPositiveGimmicks, "probability" );
            if( positiveKey !== -1 ){
                oGimmickConfig = aPositiveGimmicks[ positiveKey ];
            }
        }

        if( oGimmickConfig !== null ){
            var oGimmick = this[ oGimmickConfig[ "create" ] ]( x, y );
            if ( oGimmick !== null ) {
                oGimmick.visible = false;
                this.add( oGimmick );
                return oGimmick;
            }
        }
    }

    return null;
};

doodleBreakout.Gimmicks.prototype._defaultConfig = {
    "dropProbability": 10,
    "positiveProbability": 50,
    "negativeProbability": 50,
    "gimmicks": {
        "positive": [
            {
                "name": "LiveBonus",
                "probability": 1,
                "create": "createLive"
            },
            {
                "name": "DuplicateBonus",
                "probability": 3,
                "create": "createDuplicate"
            },
            {
                "name": "Thunderball",
                "probability": 1,
                "create": "createThunderball"
            }
        ],
        "negative": [

        ]
    }
};

doodleBreakout.Gimmicks.prototype.createLive = function( x, y ){
    return new doodleBreakout.Live( this.game, x, y, this._lives );
};

doodleBreakout.Gimmicks.prototype.createDuplicate = function( x, y ){
    return new doodleBreakout.Duplicate( this.game, x, y, this._ball );
};

doodleBreakout.Gimmicks.prototype.createThunderball= function( x, y ){
    return new doodleBreakout.Thunderball( this.game, x, y, this._ball );
};

doodleBreakout.Gimmicks.prototype.probabilityCalculation = function( aArray, sKey ){
    var arrayKey;
    var arrayValueKey;
    var fRandomNumber = 0.0;
    var fProbabilitySum = 0.0;
    var aValues = aArray.slice();


    if( sKey == undefined ){
        sKey = null;
    }

    for( arrayKey in aValues ) {
        if ( aValues.hasOwnProperty(arrayKey) ) {
            var fProbabilityValue = 0.0;
            if ( sKey !== null && aValues[arrayKey].hasOwnProperty(sKey) ) {
                fProbabilityValue = parseFloat(aValues[arrayKey][sKey]);
            }
            else {
                fProbabilityValue = parseFloat(aValues[arrayKey]);
            }
            fProbabilitySum += fProbabilityValue;
            aValues[arrayKey] = fProbabilityValue;
        }
    }

    fRandomNumber = this.game.rnd.realInRange( 0, fProbabilitySum );

    fProbabilitySum = 0;
    arrayValueKey = null;

    for( arrayValueKey in aValues ){
        if ( aValues.hasOwnProperty(arrayValueKey) ) {
            var fValueStart = 0.0;
            var fValueEnd = 0.0;

            fValueStart = fProbabilitySum;
            fProbabilitySum += aValues[arrayValueKey];
            fValueEnd = fProbabilitySum;

            if ( fValueStart <= fRandomNumber && fRandomNumber < fValueEnd ) {
                return arrayValueKey;
            }
        }
    }

    return -1;
};