var doodleBreakout = doodleBreakout || {};

doodleBreakout.Highscores = function( game ){

};

doodleBreakout.Highscores.prototype = {
    create: function(){

        var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', 'Highscores',64);
        title.anchor.setTo(0.5, 0);

    }
};