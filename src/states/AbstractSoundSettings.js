var doodleBreakout = doodleBreakout || {};

doodleBreakout.AbstractSoundSettings = function( game ){};

doodleBreakout.AbstractSoundSettings.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);

doodleBreakout.AbstractSoundSettings.prototype.constructor = doodleBreakout.AbstractSoundSettings;

doodleBreakout.AbstractSoundSettings.prototype.createSoundSettings = function() {

    this.soundText = this.game.add.bitmapText(this.game.width / 2, 150, 'larafont', 'Toggle Sound',48);
    this.soundText.anchor.setTo(0.5, 0);

    this.soundSymbol = this.game.add.sprite(this.game.width / 2 - 80, 250, 'sound');
    this.soundSymbol.anchor.setTo(0.5,0);
    if( !doodleBreakout.SoundManager.isSfxEnabled()){
        this.soundSymbol.frame = 1;
    }

    this.soundSymbol.doodleBreakout = { 'Option' : 'SFX' };
    this.soundSymbol.inputEnabled = true;
    this.soundSymbol.events.onInputDown.add(this.toggleSound, this);
    this.soundSymbol.events.onInputOver.add(this.over, this);
    this.soundSymbol.events.onInputOut.add(this.out, this);

    this.musicSymbol = this.game.add.sprite(this.game.width / 2 + 80, 250, 'music');
    this.musicSymbol.anchor.setTo(0.5,0);
    if( !doodleBreakout.SoundManager.isMusicEnabled()){
        this.musicSymbol.frame = 1;
    }

    this.musicSymbol.doodleBreakout = { 'Option' : 'Music' };
    this.musicSymbol.inputEnabled = true;
    this.musicSymbol.events.onInputDown.add(this.toggleSound, this);
    this.musicSymbol.events.onInputOver.add(this.over, this);
    this.musicSymbol.events.onInputOut.add(this.out, this);

};

doodleBreakout.AbstractSoundSettings.prototype.destroySoundSettings = function() {
    this.soundText.kill();
    this.soundSymbol.kill();
    this.musicSymbol.kill();
};



doodleBreakout.AbstractSoundSettings.prototype.toggleSound = function(symbol){
    //Sound toggle functionality

    if(symbol.doodleBreakout.Option == 'SFX') {
        if (symbol.frame == 0) {
            symbol.frame = 1;
            doodleBreakout.SoundManager.setSfxEnabled(false);
        } else if (symbol.frame == 1) {
            symbol.frame = 0;
            doodleBreakout.SoundManager.setSfxEnabled(true);
        }
    } else if(symbol.doodleBreakout.Option == 'Music'){
        if( symbol.frame == 0 ){
            symbol.frame = 1;
            doodleBreakout.SoundManager.setMusicEnabled(false);
        } else if( symbol.frame == 1 ){
            symbol.frame = 0;
            doodleBreakout.SoundManager.setMusicEnabled(true);
        }
    }


};



