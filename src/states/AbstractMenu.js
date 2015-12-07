var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 */
doodleBreakout.AbstractMenu = function( game ){};

doodleBreakout.AbstractMenu.prototype = {
    /**
     * create a back navigation
     */
    createBackHome: function () {

        var goHomeText = this.game.add.bitmapText(20, 10, 'larafont', '<',48);
        goHomeText.anchor.setTo(0, 0);
        goHomeText.inputEnabled = true;

        goHomeText.events.onInputDown.add(this.goBackHome, this);
        goHomeText.events.onInputOver.add(this.over, this);
        goHomeText.events.onInputOut.add(this.out, this);

    },

    /**
     * go back
     */
    goBackHome: function () {
        this.state.start("MainMenu");
    },

    /**
     * @param text
     */
    over: function(text){
        text.scale.setTo(1.1);
    },

    /**
     * @param text
     */
    out: function(text){
        text.scale.setTo(1);
    }

};

