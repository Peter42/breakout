QUnit.module( "Group::Gimmicks" );

QUnit.test( "Test the probabilityCalculation", function( assert ){
    var Gimmicks = function(){};
    Gimmicks.prototype = {
        game: {
            rnd: {
                fakeRandom: 0,
                realInRange: function(){
                    return this.fakeRandom;
                }
            }
        },
        probabilityCalculation: doodleBreakout.Gimmicks.prototype.probabilityCalculation
    };

    var gimmicks = new Gimmicks();

    gimmicks.game.rnd.fakeRandom = 0.5;
    assert.equal( gimmicks.probabilityCalculation( [ 1, 3, 4 ] ), 0 );

    gimmicks.game.rnd.fakeRandom = 2;
    assert.equal( gimmicks.probabilityCalculation( [ 1, 3, 4 ] ), 1 );

    gimmicks.game.rnd.fakeRandom = 5;
    assert.equal( gimmicks.probabilityCalculation( [ 1, 3, 4 ] ), 2 );
});