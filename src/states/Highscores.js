var doodleBreakout = doodleBreakout || {};

doodleBreakout.Highscores = function( game ){

};

doodleBreakout.Highscores.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.Highscores.prototype.constructor = doodleBreakout.Highscores;


doodleBreakout.Highscores.prototype.create = function(){

    this.createBackHome();

    var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', 'Highscores',64);
    title.anchor.setTo(0.5, 0);

    var scores = doodleBreakout.ScoresManager.getHighscores();

    for(var i in scores){
        this._addScore(scores[i], 45 * i + 120);
    }

};

doodleBreakout.Highscores.prototype._addScore = function(score, y) {
    var text = this.game.add.bitmapText(this.world.centerX - 10, y, 'larafont', score.name,32);
    text.anchor.set(1,0);
    this.game.add.bitmapText(this.world.centerX + 10, y, 'larafont', score.score + "",32);

};
