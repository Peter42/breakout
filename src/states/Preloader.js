var doodleBreakout = doodleBreakout || {};

doodleBreakout.Preloader = function( game ){

};

doodleBreakout.Preloader.prototype = {
    preload: function(){
        this.background = this.add.sprite( 0, 0, 'preloaderBackground');
        this.background.scale.setTo( this.game.width/this.background.width, this.game.height/this.background.height );

        this.preloadBar = this.add.sprite( this.game.width/2, this.game.height/2, 'preloaderBar');
        this.preloadBar.anchor.setTo(0.5,1);


        //	This sets the preloadBar sprite as a loader sprite.
        //	What that does is automatically crop the sprite from 0 to full-width
        //	as the files below are loaded in.

        this.load.setPreloadSprite( this.preloadBar,0 );

        //this.load.image('tetris', './paul.jpg');
        //this.load.image('tetris1', 'http://www.darts1.de/news/2009/Paul-Nicholson.jpg');
        //this.load.image('tetris2', 'http://hammer.ucla.edu/fileadmin/media/exhibitions/2005/PaulChan004.jpg');

    },



    create: function(){
        this.state.start('MainMenu');
    }
};