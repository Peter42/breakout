var doodleBreakout = doodleBreakout || {};

doodleBreakout.Settings = function( game ){
};

doodleBreakout.Settings.prototype = Object.create(doodleBreakout.AbstractSoundSettings.prototype);
doodleBreakout.Settings.prototype.constructor = doodleBreakout.Settings;

doodleBreakout.Settings.prototype.create = function(){

        this.createBackHome();

        var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', 'Settings',64);
        title.anchor.setTo(0.5, 0);

        this.createSoundSettings();

        var resetText = this.game.add.bitmapText(this.game.width / 2, 450, 'larafont', 'Reset Scores',48);
        resetText.anchor.setTo(0.5, 0);
        resetText.inputEnabled = true;

        resetText.events.onInputDown.add(this.resetScores, this);
        resetText.events.onInputOver.add(this.over, this);
        resetText.events.onInputOut.add(this.out, this);

    };

doodleBreakout.Settings.prototype.resetScores = function(){
        //implement functionality to reset all points and progress
        doodleBreakout.ScoresManager.reset();
        var okText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 90, 'larafont', 'Your scores have been resetted', 36);
        okText.anchor.setTo(0.5, 0);
        this.game.time.events.add(Phaser.Timer.SECOND, function(){
            okText.kill();
            }, this);
};