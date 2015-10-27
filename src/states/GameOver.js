var doodleBreakout = doodleBreakout || {};

doodleBreakout.GameOver = function( game ){

};

doodleBreakout.GameOver.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.GameOver.prototype.constructor = doodleBreakout.GameOver;

doodleBreakout.GameOver.prototype.init = function(args){

    this._score = args.score;
    this._level = args.level;
    this._lives = args.lives;

};

doodleBreakout.GameOver.prototype.create = function(){

    this.createBackHome();

    //For each leftover life, add 50 Points to the score
    this._scores += (this._lives * 50);


    var title = this.game.add.bitmapText(this.world.centerX, 10, 'larafont', 'Game Over', 64);
    title.anchor.setTo(0.5, 0);

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

    this._generateMenuItem('Retry', 'Game', {level:this._level}, 120);

    this._generateMenuItem('Select another level', 'LevelSelection', undefined, 520);


    this.game.input.keyboard.addCallbacks(this, null, null, this.keyPressed);
    var backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
    backspace.onDown.add(this.backspacePressed, this);

};

doodleBreakout.GameOver.prototype.keyPressed = function(key) {

    debugger;
    // TODO: Add ÄÖÜ äöü ß to font
    if(! key.match(/[A-z0-9\u0020\-]/) ) {
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
    this.name.setText(text.substr(0, text.length - 1));
};

doodleBreakout.GameOver.prototype.shutdown = function() {
    var name;
    if(this.nameIsInitial) {
        name = "Player";
    } else {
        name = this.name.text;
    }
    doodleBreakout.ScoresManager.addHighscore(this._score, name);
};


doodleBreakout.GameOver.prototype._generateMenuItem = function (text, targetState, args, x) {
    var item = this.game.add.bitmapText(x, 500, 'larafont', text, 40);
    item.anchor.setTo(0.5);
    item.inputEnabled = true;
    item.doodleBreakout = { 'targetState' : targetState, 'arguments': args };

    item.events.onInputDown.add(this.click, this);
    item.events.onInputOver.add(this.over, this);
    item.events.onInputOut.add(this.out, this);

    return item;
};

doodleBreakout.GameOver.prototype.click = function(text){
    this.game.state.start(text.doodleBreakout.targetState, true, false, text.doodleBreakout.arguments);
};