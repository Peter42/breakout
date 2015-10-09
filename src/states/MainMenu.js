var doodleBreakout = doodleBreakout || {};

doodleBreakout.MainMenu = function( game ){

};

doodleBreakout.MainMenu.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.MainMenu.prototype.constructor = doodleBreakout.MainMenu;

doodleBreakout.MainMenu.prototype.create = function(){

        var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', 'Main Menu',64);
        title.anchor.setTo(0.5, 0);

        var startText = this.game.add.bitmapText(this.game.width / 2, 150, 'larafont', 'Start Game',48);
        startText.anchor.setTo(0.5,0);
        startText.inputEnabled = true;
        startText.doodleBreakout = { 'targetState' : 'Game' };

        startText.events.onInputDown.add(this.click, this);
        startText.events.onInputOver.add(this.over, this);
        startText.events.onInputOut.add(this.out, this);

        var highscoresText = this.game.add.bitmapText(this.game.width / 2, 250, 'larafont', 'Highscores',48);
        highscoresText.anchor.setTo(0.5,0);
        highscoresText.inputEnabled = true;
        highscoresText.doodleBreakout = { 'targetState' : 'Highscores' };

        highscoresText.events.onInputDown.add(this.click, this);
        highscoresText.events.onInputOver.add(this.over, this);
        highscoresText.events.onInputOut.add(this.out, this);

        var settingsText = this.game.add.bitmapText(this.game.width / 2, 350, 'larafont', 'Settings',48);
        settingsText.anchor.setTo(0.5,0);
        settingsText.inputEnabled = true;
        settingsText.doodleBreakout = { 'targetState' : 'Settings' };

        settingsText.events.onInputDown.add(this.click, this);
        settingsText.events.onInputOver.add(this.over, this);
        settingsText.events.onInputOut.add(this.out, this);

        var creditsText = this.game.add.bitmapText(this.game.width / 2, 450, 'larafont', 'Credits',48);
        creditsText.anchor.setTo(0.5,0);
        creditsText.inputEnabled = true;
        creditsText.doodleBreakout = { 'targetState' : 'Credits' };

        creditsText.events.onInputDown.add(this.click, this);
        creditsText.events.onInputOver.add(this.over, this);
        creditsText.events.onInputOut.add(this.out, this);

    };

doodleBreakout.MainMenu.prototype.click = function(text){

      this.game.state.start(text.doodleBreakout.targetState);
    };
