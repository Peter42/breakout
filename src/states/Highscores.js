var doodleBreakout = doodleBreakout || {};

doodleBreakout.Highscores = function( game ){

};

doodleBreakout.Highscores.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.Highscores.prototype.constructor = doodleBreakout.Highscores;


doodleBreakout.Highscores.prototype.create = function(){

    this.createBackHome();

    var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', 'Highscores',64);
    title.anchor.setTo(0.5, 0);

};