var doodleBreakout = doodleBreakout || {};

doodleBreakout.Credits = function( game ){

};

doodleBreakout.Credits.prototype = {
    create: function(){

        var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', 'Credits',64);
        title.anchor.setTo(0.5, 0);
    }
};