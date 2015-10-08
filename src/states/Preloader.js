var doodleBreakout = doodleBreakout || {};

doodleBreakout.Preloader = function( game ){

};

doodleBreakout.Preloader.prototype = {
    preload: function(){
        this.background = this.add.sprite( 0, 0, 'preloaderBackground');
        this.background.scale.setTo( this.game.width/this.background.width, this.game.height/this.background.height );

        this.preloadBar = this.add.sprite( this.game.width/2, this.game.height/2, 'preloaderBar');
        this.preloadBar.anchor.setTo(0.5,1);

        //Load font files
        this.game.load.bitmapFont('larafont', 'assets/fonts/larafont.png', 'assets/fonts/larafont.xml');

        //Load Setting symbols
        this.game.load.spritesheet('sound', 'assets/soundspeaker.png', 50, 46);
        this.game.load.spritesheet('music', 'assets/notes.png', 50, 50);

        // Sounds
        this.game.load.audio('music', 'assets/sounds/music.ogg');
        this.game.load.audio('sfx', 'assets/sounds/sfx.ogg');



        //	This sets the preloadBar sprite as a loader sprite.
        //	What that does is automatically crop the sprite from 0 to full-width
        //	as the files below are loaded in.

        this.load.setPreloadSprite( this.preloadBar,0 );

        //this.load.image('tetris', './paul.jpg');
        //this.load.image('tetris1', 'http://www.darts1.de/news/2009/Paul-Nicholson.jpg');
        //this.load.image('tetris2', 'http://hammer.ucla.edu/fileadmin/media/exhibitions/2005/PaulChan004.jpg');

    },



    create: function(){

        doodleBreakout.SoundManager.init(this.game);

        this.state.start('MainMenu');
    }
};