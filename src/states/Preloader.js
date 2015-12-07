var doodleBreakout = doodleBreakout || {};

doodleBreakout.Preloader = function( game ){
    this._levels = 0;
};

doodleBreakout.Preloader.prototype = {
    preload: function(){
        this.background = this.add.sprite( 0, 0, 'preloaderBackground');
        this.background.scale.setTo( this.game.width/this.background.width, this.game.height/this.background.height );

        this.preloadBar = this.add.sprite( this.game.width/2, this.game.height/2, 'preloaderBar');
        this.preloadBar.anchor.setTo(0.5,1);

        //Load sprite images
        this.game.load.spritesheet('ball', 'assets/images/ball.png', 16, 16);
        this.game.load.spritesheet('ball1', 'assets/images/ball2.png', 16, 16);
        this.game.load.image('thunder', 'assets/images/feature01.png');
        this.game.load.image('live', 'assets/images/feature02.png');
        this.game.load.image('duplicate', 'assets/images/feature03.png');
        this.game.load.image('gravity', 'assets/images/schwerkraft.png');
        this.game.load.image('invincible', 'assets/images/unbesiegbar.png');
        this.game.load.image('minus', 'assets/images/minus.png');
        this.game.load.image('plus', 'assets/images/plus.png');
        this.game.load.image('coin', 'assets/images/coin.png');
        this.game.load.image('rotator', 'assets/images/rotator.png');

        this.game.load.image('plattform01', 'assets/images/plattform01.png');
        this.game.load.image('plattform_player1', 'assets/images/plattform_player1.png');
        this.game.load.image('plattform_player2', 'assets/images/plattform_player2.png');
        this.game.load.spritesheet('block01', 'assets/images/block01.png', 50, 16);
        this.game.load.spritesheet('block02', 'assets/images/block02.png', 50, 16);
        this.game.load.spritesheet('block03', 'assets/images/block03.png', 50, 16);
        this.game.load.spritesheet('block04', 'assets/images/block04.png', 50, 16);
        this.game.load.spritesheet('block05', 'assets/images/blockfest.png', 50, 16);
        this.game.load.image('hintergrund', 'assets/images/hintergrund.png');
        this.game.load.image('tile', 'assets/images/kachel.png');
        this.game.load.image('easteregg', 'assets/images/easteregg.png');

        // load icons
        this.game.load.image('icon_trash', 'assets/icons/muelleimer.png');
        this.game.load.image('icon_new', 'assets/icons/neu.png');
        this.game.load.image('icon_folder', 'assets/icons/ordner.png');
        this.game.load.spritesheet('icon_pause', 'assets/icons/pause.png', 29, 40);
        this.game.load.image('icon_random', 'assets/icons/random.png');
        this.game.load.image('icon_save', 'assets/icons/speichern.png');
        this.game.load.image('icon_start', 'assets/icons/start.png');
        this.game.load.image('icon_stop', 'assets/icons/stop.png');


        this.game.load.image('icon_singleplayer', 'assets/icons/singleplayer.png');
        this.game.load.image('icon_multiplayer', 'assets/icons/multiplayer.png');
        this.game.load.image('icon_computer', 'assets/icons/computer.png');


        //Load font files
        this.game.load.bitmapFont('larafont', 'assets/fonts/larafont.png', 'assets/fonts/larafont.xml');

        //Load Setting symbols
        this.game.load.spritesheet('sound', 'assets/images/soundspeaker.png', 70, 70);
        this.game.load.spritesheet('music', 'assets/images/note.png', 70, 70);
        this.game.load.spritesheet('recording', 'assets/icons/onoffswitch.png', 88, 40);
        // Sounds
        this.game.load.audio('music', ['assets/sounds/breakout_background.ogg', 'assets/sounds/breakout_background.mp3', 'assets/sounds/breakout_background.wav']);
        this.game.load.audio('sfx', ['assets/sounds/sfx.ogg', 'assets/sounds/sfx.mp3', 'assets/sounds/sfx.wav']);

        //Overlay for Pause Menu
        this.game.load.image('pause', 'assets/images/pause_background.png');

        // Pointer for Block Palette in the Level Designer
        this.game.load.image( 'arrow', 'assets/images/blockpalette_pointer.png' );

        this.game.load.text('replaystate', './states/Replay.js');
        this.game.load.text('replayphaser', './lib/phaser.min.js');
        this.game.load.text('replayindex', './recordingindex.html');
        this.game.load.text('replayfontxml', 'assets/fonts/larafont.xml');

        //	This sets the preloadBar sprite as a loader sprite.
        //	What that does is automatically crop the sprite from 0 to full-width
        //	as the files below are loaded in.

        this.load.setPreloadSprite( this.preloadBar,0 );

        var levels = this.game.cache.getJSON( 'levelIndex' );

        // TODO: remove this.game.levels
        this._levels = this.game.levels = levels.length;

        for( var i = 1; i <= levels.length; i++ ){
            this.load.json( 'level_' + i, './levels/'+levels[(i-1)] );
        }

    },



    create: function(){
        doodleBreakout.SoundManager.init(this.game);
        doodleBreakout.ScoresManager.init(this.game);
        doodleBreakout.LevelManager.init( this.game );

        for( var i = 1; i <= this._levels; i++ ){
            doodleBreakout.LevelManager.addLevel( this.game.cache.getJSON( 'level_' + i ) );
        }

        var hintergrund = new Phaser.Image(this.game, 0, 0, 'hintergrund');
        this.stage.addChildAt(hintergrund, 0);

        this.state.start('MainMenu');
    }
};