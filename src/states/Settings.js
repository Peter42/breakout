var doodleBreakout = doodleBreakout || {};

doodleBreakout.Settings = function( game ){

};

doodleBreakout.Settings.prototype = {
    create: function(){

        var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', 'Settings',64);
        title.anchor.setTo(0.5, 0);

        var soundText = this.game.add.bitmapText(this.game.width / 2, 150, 'larafont', 'Toggle Sound',48);
        soundText.anchor.setTo(0.5, 0);

        var soundSymbol = this.game.add.sprite(this.game.width / 2 - 80, 250, 'sound');
        soundSymbol.anchor.setTo(0.5,0);
        soundSymbol.inputEnabled = true;
        soundSymbol.events.onInputDown.add(this.toggleSound, this);
        soundSymbol.events.onInputOver.add(this.over, this);
        soundSymbol.events.onInputOut.add(this.out, this);

        var musicSymbol = this.game.add.sprite(this.game.width / 2 + 80, 250, 'music');
        musicSymbol.anchor.setTo(0.5,0);
        musicSymbol.inputEnabled = true;
        musicSymbol.events.onInputDown.add(this.toggleSound, this);
        musicSymbol.events.onInputOver.add(this.over, this);
        musicSymbol.events.onInputOut.add(this.out, this);

        var resetText = this.game.add.bitmapText(this.game.width / 2, 350, 'larafont', 'Reset Scores',48);
        resetText.anchor.setTo(0.5, 0);
        resetText.inputEnabled = true;

        resetText.events.onInputDown.add(this.resetScores, this);
        resetText.events.onInputOver.add(this.over, this);
        resetText.events.onInputOut.add(this.out, this);

    },

    toggleSound: function(symbol){
      //Sound toggle functionality
       if( symbol.frame == 0 ){
             symbol.frame = 1;
        } else if( symbol.frame == 1 ){
            symbol.frame = 0;
        }


    },

    resetScores: function(text){
        //implement functionality to reset all points and progress
        var okText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 40, 'larafont', 'Your scores have been resetted', 48);
        okText.anchor.setTo(0.5, 0);
        this.game.time.events.add(Phaser.Timer.SECOND, function(){
            okText.kill();
            }, this);
    },

    over: function(text){
        text.scale.setTo(1.1,1.1);
    },

    out: function(text){
        text.scale.setTo(1,1);
    }
};