QUnit.module( "SoundManager" );

var mockGame = {
    add : {
        audio: function(){
            return {
                play: function(){},
                stop: function(){},
                addMarker: function(){}
            };
        }
    }
};

doodleBreakout.SoundManager.storage = null;
doodleBreakout.SoundManager.init(mockGame);

QUnit.test( "Test sounds enabled by default", function( assert ) {
    assert.equal(doodleBreakout.SoundManager.isMusicEnabled(), true);
    assert.equal(doodleBreakout.SoundManager.isSfxEnabled(), true);
});

QUnit.test( "Test disable sounds", function( assert ) {
    doodleBreakout.SoundManager.setMusicEnabled(false);
    doodleBreakout.SoundManager.setSfxEnabled(false);

    assert.equal(doodleBreakout.SoundManager.isMusicEnabled(), false);
    assert.equal(doodleBreakout.SoundManager.isSfxEnabled(), false);
});

QUnit.test( "Test invalid setter parameter", function( assert ) {
    doodleBreakout.SoundManager.setMusicEnabled("asdf");
    doodleBreakout.SoundManager.setMusicEnabled(2);

    assert.equal(doodleBreakout.SoundManager.isMusicEnabled(), false);
    assert.equal(doodleBreakout.SoundManager.isSfxEnabled(), false);
});