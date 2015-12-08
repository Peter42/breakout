var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 */
doodleBreakout.Gimmicks = function ( game, gimmicks ) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Group.call( this, game );

    this._probabilityConfig = {
        "dropProbability": 10,
        "positiveProbability": 1,
        "negativeProbability": 1
    };

    if( gimmicks ){
        doodleBreakout.Gimmicks._gimmickProbability = gimmicks;
    }
};

doodleBreakout.Gimmicks._gimmickProbability = {
    "positive": [
        {
            "name": "LiveBonus",
            "probability": 1,
            "create": doodleBreakout.Live
        },
        {
            "name": "DuplicateBonus",
            "probability": 3,
            "create": doodleBreakout.Duplicate
        },
        {
            "name": "Thunderball",
            "probability": 1,
            "create": doodleBreakout.Thunderball
        },
        {
            "name": "Plus",
            "probability": 3,
            "create": doodleBreakout.Plus
        },
        {
            "name": "Coin",
            "probability": 3,
            "create": doodleBreakout.Coin
        },
        {
            "name": "Invincible",
            "probability": 2,
            "create": doodleBreakout.Invincible
        }
    ],
    "negative": [
        {
            "name": "Minus",
            "probability": 5,
            "create": doodleBreakout.Minus
        },
        {
            "name": "Rotator",
            "probability": 4,
            "create": doodleBreakout.Rotator
        },
        {
            "name": "Gravity",
            "probability": 5,
            "create": doodleBreakout.Gravity
        }
    ]
};

doodleBreakout.Gimmicks.prototype = Object.create(Phaser.Group.prototype);
doodleBreakout.Gimmicks.prototype.constructor = doodleBreakout.Gimmicks;


doodleBreakout.Gimmicks.prototype.setCustomProbability = function( config ){
    if ( config != null && config != undefined ){
        for ( var key in config ) {
            if( config.hasOwnProperty( key )  && this._probabilityConfig.hasOwnProperty( key ) && key != "gimmicks" ){
                this._probabilityConfig[ key ] = config[ key ];
            }

        }
    }
};

doodleBreakout.Gimmicks.prototype.killMoving = function(){
    this.forEachAlive( function( gimmick ){
        if ( gimmick.body != null && gimmick.body.velocity.y > 0 ) {
            gimmick.kill();
        }
    }, this );
};


doodleBreakout.Gimmicks.prototype.randomGimmick = function( x, y ){
    if (this.game.rnd.realInRange(0, 1) >= ( 100 - this._probabilityConfig.dropProbability ) / 100){
        var aPositiveGimmicks = doodleBreakout.Gimmicks._gimmickProbability.positive;
        var aNegativeGimmicks = doodleBreakout.Gimmicks._gimmickProbability.negative;

        var aValues = [ this._probabilityConfig.positiveProbability, this._probabilityConfig.negativeProbability ];

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
            var oGimmick = new (oGimmickConfig[ "create" ])( this.game, x, y );
            if ( oGimmick !== null ) {
                this.add( oGimmick );
                return oGimmick;
            }
        }
    }

    return null;
};

doodleBreakout.Gimmicks.prototype.cloneGimmick = function ( gimmick, x, y ) {
    var oGimmick = this[ creator ]( x, y );
    if ( oGimmick !== null ) {
        oGimmick.visible = false;
        oGimmick.creator = creator;
        this.add( oGimmick );
        return oGimmick;
    }
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

