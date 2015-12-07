var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.AbstractSoundSettings
 */
doodleBreakout.Settings = function (game) {
};

doodleBreakout.Settings.prototype = Object.create(doodleBreakout.AbstractSoundSettings.prototype);
doodleBreakout.Settings.prototype.constructor = doodleBreakout.Settings;

/**
 * @inheritdoc
 */
doodleBreakout.Settings.prototype.create = function () {

    this.createBackHome();

    var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', 'Settings', 64);
    title.anchor.setTo(0.5, 0);

    this.createSoundSettings();

    //Recording Settings
    var recordingText = this.game.add.bitmapText(this.game.width / 2, 370, 'larafont', 'Record Game', 48);
    recordingText.anchor.setTo(0.7, 0);
    this.recordSwitch = this.game.add.sprite(this.game.width / 2 + 160, 370, 'recording');
    if( doodleBreakout.Recorder.isRecordingActive()){
        this.recordSwitch.frame = 1;
    } else {
        this.recordSwitch.frame = 0;
    }
    this.recordSwitch.inputEnabled = true;
    this.recordSwitch.events.onInputDown.add(this.toggleRecording, this);


    //Reset Scores
    var resetText = this.game.add.bitmapText(this.game.width / 2, 490, 'larafont', 'Reset Scores', 48);
    resetText.anchor.setTo(0.5, 0);
    resetText.inputEnabled = true;
    resetText.events.onInputDown.add(this.resetScores, this);
    resetText.events.onInputOver.add(this.over, this);
    resetText.events.onInputOut.add(this.out, this);

};

/**
 *
 * @param text
 */
doodleBreakout.Settings.prototype.resetScores = function (text) {
    //implement functionality to reset all points and progress
    doodleBreakout.ScoresManager.reset();
    var okText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 250, 'larafont', 'Your scores have been resetted', 36);
    okText.anchor.setTo(0.5, 0);
    this.game.time.events.add(Phaser.Timer.SECOND, function () {
        okText.kill();
    }, this);
};


/**
 *
 * @param text
 */
doodleBreakout.Settings.prototype.toggleRecording = function (text) {
    if( doodleBreakout.Recorder.isRecordingActive()){
        doodleBreakout.Recorder.setRecordingActive(false);
        this.recordSwitch.frame = 0;
    } else {
        doodleBreakout.Recorder.setRecordingActive(true);
        this.recordSwitch.frame = 1;
    }
    //  };
};