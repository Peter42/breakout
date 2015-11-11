QUnit.module( "ScoresManager", {beforeEach: function() {
    doodleBreakout.ScoresManager.reset();
}} );

doodleBreakout.ScoresManager.init();
doodleBreakout.ScoresManager.storage = null;

QUnit.test( "Test reset function", function( assert ){
    doodleBreakout.ScoresManager.addBesttime("level", 123);
    doodleBreakout.ScoresManager.addHighscore(1000, "asd");

    doodleBreakout.ScoresManager.reset();

    assert.deepEqual( doodleBreakout.ScoresManager.getBesttimes(), {} );
    assert.deepEqual( doodleBreakout.ScoresManager.getHighscores(), [] );
});

QUnit.test( "Test Highscore max ammount", function( assert ){
    for(var i = 0; i < doodleBreakout.ScoresManager.MAX_HIGHSCORE_SIZE + 3; ++i) {
        doodleBreakout.ScoresManager.addHighscore(i, "asd");
    }
    assert.equal( doodleBreakout.ScoresManager.getHighscores().length, doodleBreakout.ScoresManager.MAX_HIGHSCORE_SIZE );
});

QUnit.test( "Test Highscore ammount", function( assert ){
    for(var i = 1; i <= doodleBreakout.ScoresManager.MAX_HIGHSCORE_SIZE - 1; ++i) {
        doodleBreakout.ScoresManager.addHighscore(i, "asd");
    }
    assert.equal( doodleBreakout.ScoresManager.getHighscores().length, doodleBreakout.ScoresManager.MAX_HIGHSCORE_SIZE - 1 );
});

QUnit.test( "New besttime detection", function( assert ){
    var levelid = "level";
    var besttimeA = 30;
    var besttimeB = 10;
    var besttimeC = 20;

    assert.equal( doodleBreakout.ScoresManager.getBesttimes()[levelid], undefined );

    doodleBreakout.ScoresManager.addBesttime(levelid, besttimeA);
    assert.equal( doodleBreakout.ScoresManager.getBesttimes()[levelid], besttimeA );

    doodleBreakout.ScoresManager.addBesttime(levelid, besttimeB);
    assert.equal( doodleBreakout.ScoresManager.getBesttimes()[levelid], besttimeB );

    doodleBreakout.ScoresManager.addBesttime(levelid, besttimeC );
    assert.equal( doodleBreakout.ScoresManager.getBesttimes()[levelid], besttimeB );
});

QUnit.test( "Besttime ammount", function( assert ){
    assert.equal( Object.keys(doodleBreakout.ScoresManager.getBesttimes()).length, 0 );

    doodleBreakout.ScoresManager.addBesttime("a", 1);
    doodleBreakout.ScoresManager.addBesttime("b", 1);
    doodleBreakout.ScoresManager.addBesttime("c", 1 );

    assert.equal( Object.keys(doodleBreakout.ScoresManager.getBesttimes()).length, 3 );
});


QUnit.test( "Besttime negative number", function( assert ){
    assert.throws(function() {
        doodleBreakout.ScoresManager.addBesttime("c", -1 );
    }, new RegExp("must be positive"));
});

QUnit.test( "Besttime string", function( assert ){
    assert.throws(function() {
        doodleBreakout.ScoresManager.addBesttime("c", "1" );
    }, new RegExp("must be a number"));
});

QUnit.test( "Highscore string", function( assert ){
    assert.throws(function() {
        doodleBreakout.ScoresManager.addHighscore("1", "Peter" );
    }, new RegExp("must be a number"));
});

QUnit.test( "Highscore negative number", function( assert ){
    assert.throws(function() {
        doodleBreakout.ScoresManager.addHighscore(-1, "Peter" );
    }, new RegExp("must be positive"));
});

QUnit.test( "Highscore sorting", function( assert ){
    doodleBreakout.ScoresManager.addHighscore(1, "A" );
    doodleBreakout.ScoresManager.addHighscore(3, "C" );
    doodleBreakout.ScoresManager.addHighscore(2, "B" );

    assert.deepEqual(doodleBreakout.ScoresManager.getHighscores(), [
        {name:"C", score:3},
        {name:"B", score:2},
        {name:"A", score:1}
    ]);
});

