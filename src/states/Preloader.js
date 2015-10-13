var doodleBreakout = doodleBreakout || {};

doodleBreakout.Preloader = function( game ){

};

doodleBreakout.Preloader.prototype = {
    preload: function(){
        this.background = this.add.sprite( 0, 0, 'preloaderBackground');
        this.background.scale.setTo( this.game.width/this.background.width, this.game.height/this.background.height );

        this.preloadBar = this.add.sprite( this.game.width/2, this.game.height/2, 'preloaderBar');
        this.preloadBar.anchor.setTo(0.5,1);

        //Load sprite images
        this.game.load.image('ball01', 'assets/images/ball01.png');
        this.game.load.image('plattform01', 'assets/images/plattform01.png');
        this.game.load.image('block02', 'assets/images/block02.png');

        //Load font files
        this.game.load.bitmapFont('larafont', 'assets/fonts/larafont.png', 'assets/fonts/larafont.xml');

        //Load Setting symbols
        this.game.load.spritesheet('sound', 'assets/images/soundspeaker.png', 70, 70);
        this.game.load.spritesheet('music', 'assets/notes.png', 50, 50);

        // Sounds
        this.game.load.audio('music', 'assets/sounds/music.ogg');
        this.game.load.audio('sfx', 'assets/sounds/sfx.ogg');



        //	This sets the preloadBar sprite as a loader sprite.
        //	What that does is automatically crop the sprite from 0 to full-width
        //	as the files below are loaded in.

        this.load.setPreloadSprite( this.preloadBar,0 );

        var levels = this.game.cache.getJSON( 'levelIndex' );

        this.game.levels = levels.length;

        for( var i = 1; i <= levels.length; i++ ){
            this.load.json( 'level_' + i, './levels/'+levels[(i-1)] );
        }

    },



    create: function(){
        doodleBreakout.SoundManager.init(this.game);

        this.state.start('MainMenu');
    }
};