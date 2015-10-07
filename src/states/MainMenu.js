var doodleBreakout = doodleBreakout || {};

doodleBreakout.MainMenu = function( game ){

};

doodleBreakout.MainMenu.prototype = {
    create: function(){
        var nameLabel = this.game.add.text( 80, 80, "Main Menu", { font: '50px Arial', fill: '#ffffff' });
    }
};