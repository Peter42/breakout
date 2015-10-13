var doodleBreakout = doodleBreakout || {};

doodleBreakout.Boot = function( game ){

};

doodleBreakout.Boot.prototype = {

    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        //  This tells the game to resize the renderer to match the game dimensions (i.e. 100% browser width / height)
        //this.scale.scaleMode = Phaser.ScaleManager.RESIZE;

    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('preloaderBackground', './assets/preloadBackground.png');
        this.load.image('preloaderBar', './assets/preloadBar.png');
        this.game.load.json( 'levelIndex', 'levels/index.json');
    },

    create: function () {
        this.game.stage.backgroundColor = 0xEEEEEE;
        this.state.start('Preloader');
    }

};

