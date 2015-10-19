var doodleBreakout = doodleBreakout || {};

doodleBreakout.MainMenu = function( game ){

};

doodleBreakout.MainMenu.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.MainMenu.prototype.constructor = doodleBreakout.MainMenu;

doodleBreakout.MainMenu.prototype.create = function(){
    var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', 'Main Menu', 64);
    title.anchor.setTo(0.5, 0);

    this._generateMenuItem('Start Game', 'Game', 150);
    this._generateMenuItem('Highscores', 'Highscores', 250);
    this._generateMenuItem('Settings', 'Settings', 350);
    this._generateMenuItem('Credits', 'Credits', 450);
};

doodleBreakout.MainMenu.prototype._generateMenuItem = function (text, targetState, y) {
    var item = this.game.add.bitmapText(this.game.world.centerX, y, 'larafont', text, 48);
    item.anchor.setTo(0.5, 0);
    item.inputEnabled = true;
    item.doodleBreakout = { 'targetState' : targetState };

    item.events.onInputDown.add(this.click, this);
    item.events.onInputOver.add(this.over, this);
    item.events.onInputOut.add(this.out, this);

    return item;
};

doodleBreakout.MainMenu.prototype.click = function(text){
    this.game.state.start(text.doodleBreakout.targetState);
};