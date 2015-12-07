var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 */
doodleBreakout.GameOver = function( game ){

};

doodleBreakout.GameOver.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.GameOver.prototype.constructor = doodleBreakout.GameOver;

doodleBreakout.GameOver.prototype.init = function(args){

    this._score = args.score;
    this._level = args.level;
    this._lives = args.lives;
    this._recorder = args.recorder;
    this._args = args;
    this._afterReplay = args.afterReplay;

    this._isMultiplayer = false;

    // TODO: other screen for multiplayer
    if( args.winner ){
        this._isMultiplayer = true;
        this._winner = args.winner;
        this._playerRedScore = args.playerRedScore;
        this._playerBlueScore = args.playerBlueScore;
    }
};

doodleBreakout.GameOver.prototype.create = function(){

    this.createBackHome();
    //Title
    var title = this.game.add.bitmapText(this.world.centerX, 10, 'larafont', 'Game Over', 64);
    title.anchor.setTo(0.5, 0);

    if(this._isMultiplayer == true){
        if(this._playerBlueScore == this._playerRedScore){
            var remisText = this.game.add.bitmapText(this.world.centerX, 160, 'larafont', this._winner + '!', 56);
            remisText.anchor.setTo(0.5, 0);
            var remisScore1 = this.game.add.bitmapText(this.world.centerX, 235, 'larafont', 'Your final score is ', 48);
            remisScore1.anchor.setTo(0.5, 0);
            var remisScore2 = this.game.add.bitmapText(this.world.centerX, 310, 'larafont', this._playerRedScore + ':' + this._playerBlueScore, 48);
            remisScore2.anchor.setTo(0.5, 0);
        }else{
            var winner = this.game.add.bitmapText(this.world.centerX, 160, 'larafont', this._winner + ' won', 56);
            winner.anchor.setTo(0.5, 0);

            var finalScore1 = this.game.add.bitmapText(this.world.centerX, 235, 'larafont', 'with a score of', 48);
            finalScore1.anchor.setTo(0.5, 0);
            var finalScore2 = this.game.add.bitmapText(this.world.centerX, 310, 'larafont', this._playerRedScore + ':' + this._playerBlueScore + ' points!', 48);
            finalScore2.anchor.setTo(0.5, 0);
        }

        this._generateMenuItem('Rematch', 'GameMultiplayer', {level:this._level}, undefined, 120, 550);

    }else{
        if(! this._afterReplay) {
            doodleBreakout.OnscreenInput.openKeyboard();
        }

        //For each leftover life, add 50 Points to the score
        this._score += (this._lives * 50);



        this.name = this.game.add.bitmapText(this.world.centerX, 110, 'larafont', 'Enter your name', 48);
        this.nameIsInitial = true;
        this.name.anchor.setTo(0.5, 0);

        var scoresA = this.game.add.bitmapText(this.world.centerX, 180, 'larafont', 'You scored', 48);
        scoresA.anchor.setTo(0.5, 0);

        var scoresB = this.game.add.bitmapText(this.world.centerX, 235, 'larafont', '' + this._score, 64);
        scoresB.anchor.setTo(0.5, 0);

        var scoresC = this.game.add.bitmapText(this.world.centerX, 310, 'larafont', 'Points', 48);
        scoresC.anchor.setTo(0.5, 0);

        if(this._lives > 1){
            var scoresD = this.game.add.bitmapText(this.world.centerX, 370, 'larafont', 'Your '+this._lives+' extra lives gave you '+(this._lives*50)+' bonus points!', 30);
            scoresD.anchor.setTo(0.5, 0);
        } else if(this._lives == 1){
            var scoresE = this.game.add.bitmapText(this.world.centerX, 370, 'larafont', 'Your extra life gave you '+(this._lives*50)+' bonus points!', 30);
            scoresE.anchor.setTo(0.5, 0);
        }
        this._generateMenuItem('Retry', 'Game', {level:this._level}, undefined, 120, 550);
    }


    if(this._recorder){
        this._generateMenuItem('View Replay', 'Replay', {
            recorder: this._recorder,
            callbackArgs: this._args
        }, function() {
            if(! this._recorder.isShutdown()){
                this._recorder.capture(this);
                this._recorder.shutdown();
            }
        }, this.world.centerX, 480);
    }



    this._generateMenuItem('Select another level', 'LevelSelection', undefined, undefined, 520, 550);

    if(!this._afterReplay){
        this.game.input.keyboard.addCallbacks(this, null, null, this.keyPressed);
        var backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
        backspace.onDown.add(this.backspacePressed, this);
    }


};

doodleBreakout.GameOver.prototype.keyPressed = function(key) {
    // TODO: Add ÄÖÜ äöüto font
    if(! key.match(/[A-z0-9ß\u0020\-]/) ) {
        return;
    }

    if(this.nameIsInitial) {
        this.nameIsInitial = false;
        this.name.setText(key);
    } else {
        this.name.setText( this.name.text + key );
    }
};
doodleBreakout.GameOver.prototype.backspacePressed = function() {
    var text = this.name.text;

    if(this.nameIsInitial) {
        this.nameIsInitial = false;
        this.name.setText("");
    }
    else {
        this.name.setText(text.substr(0, text.length - 1));
    }
};

doodleBreakout.GameOver.prototype.shutdown = function() {
    doodleBreakout.OnscreenInput.closeKeyboard();

    this.game.input.keyboard.onPressCallback = null;

    if(!this._afterReplay){
        var name;
        if(!this._isMultiplayer){
            if(this.nameIsInitial) {
                name = "Player";
            } else {
                name = this.name.text;
            }
            doodleBreakout.ScoresManager.addHighscore(this._score, name);
        }
    }


};

doodleBreakout.GameOver.prototype.update = function() {
    if (this.game.input.activePointer.isDown && this.game.input.activePointer.position.y < this.world.centerY) {
        if(!this._afterReplay) {
            doodleBreakout.OnscreenInput.openKeyboard();
        }
    }
};

doodleBreakout.GameOver.prototype._generateMenuItem = function (text, targetState, args, onclick, x, y) {
    var item = this.game.add.bitmapText(x, y, 'larafont', text, 40);
    item.anchor.setTo(0.5);
    item.inputEnabled = true;
    item.doodleBreakout = { 'targetState' : targetState, 'arguments': args, 'onclick': onclick };

    item.events.onInputDown.add(this.click, this);
    item.events.onInputOver.add(this.over, this);
    item.events.onInputOut.add(this.out, this);

    return item;
};

doodleBreakout.GameOver.prototype.click = function(text){
    if(text.doodleBreakout.onclick){
        text.doodleBreakout.onclick.apply(this, arguments);
    }
    if(text.doodleBreakout.targetState) {
        this.game.state.start(text.doodleBreakout.targetState, true, false, text.doodleBreakout.arguments);
    }
};