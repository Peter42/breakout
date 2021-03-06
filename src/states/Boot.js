var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments Phaser.State
 */
doodleBreakout.Boot = function( game ){

};

doodleBreakout.Boot.prototype = {

    /**
     *
     */
    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        //  This tells the game to resize the renderer to match the game dimensions (i.e. 100% browser width / height)
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

        this.scale.getParentBounds = function(target) {
            var bounds = target || new Phaser.Rectangle();
            var parentNode = this.boundingParent;

            bounds.setTo(0,0,parseInt(parentNode.style.width), parseInt(parentNode.style.height));

            return bounds;
        };

    },

    /**
     *
     */
    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.game.load.image('hintergrund', 'assets/images/hintergrund.png');
        this.game.load.image('plattform01', 'assets/images/plattform01.png');
        this.game.load.json( 'levelIndex', 'levels/index.json');
    },

    /**
     *
     */
    create: function () {
        this.state.start('Preloader');
    }

};

