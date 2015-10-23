var doodleBreakout = doodleBreakout || {};

doodleBreakout.GameOver = function( game ){

};

doodleBreakout.GameOver.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.GameOver.prototype.constructor = doodleBreakout.GameOver;

doodleBreakout.GameOver.prototype.init = function(args){

    this._score = args.score;
    this._level = args.level;

};

doodleBreakout.GameOver.prototype.create = function(){

    this.createBackHome();

    var title = this.game.add.bitmapText(this.world.centerX, 10, 'larafont', 'Game Over', 64);
    title.anchor.setTo(0.5, 0);

    var scoresA = this.game.add.bitmapText(this.world.centerX, 210, 'larafont', 'You scored', 48);
    scoresA.anchor.setTo(0.5, 0);

    var scoresB = this.game.add.bitmapText(this.world.centerX, 265, 'larafont', '' + this._score, 64);
    scoresB.anchor.setTo(0.5, 0);

    var scoresC = this.game.add.bitmapText(this.world.centerX, 340, 'larafont', 'Points', 48);
    scoresC.anchor.setTo(0.5, 0);

    var retry = this._generateMenuItem('Retry', 'Game', {level:this._level}, 100);

    var selectLevel = this._generateMenuItem('Select another level', 'LevelSelection', undefined, 340);

};

doodleBreakout.GameOver.prototype._generateMenuItem = function (text, targetState, args, x) {
    var item = this.game.add.bitmapText(x, 500, 'larafont', text, 40);
    item.anchor.setTo(0);
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