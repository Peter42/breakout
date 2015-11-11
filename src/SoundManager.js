var doodleBreakout = doodleBreakout || {};

doodleBreakout.SoundManager = {

    _sfxEnabled: true,
    _musicEnabled: true,
    _initialized: true,

    LOCAL_STORAGE_KEYS: {
        MUSIC_ENABLED: "SoundManager._musicEnabled",
        SFX_ENABLED: "SoundManager._sfxEnabled"
    },

    playSfx: function(name) {
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }

        if(this._sfxEnabled){
            this._sfx.play(name);
        }

    },

    isMusicEnabled: function(){
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }
        return this._musicEnabled;
    },

    isSfxEnabled: function(){
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }
        return this._sfxEnabled;
    },

    setMusicEnabled: function (enabled) {
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }

        this._musicEnabled = enabled === true;

        if(window.localStorage) {
            window.localStorage.setItem(this.LOCAL_STORAGE_KEYS.MUSIC_ENABLED, this._musicEnabled);
        }

        this._updateMusic();
    },

    _updateMusic: function () {
        if(this._musicEnabled) {
            this._music.play();
        } else {
            this._music.stop();
        }
    },

    setSfxEnabled: function (enabled) {
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }

        this._sfxEnabled = enabled === true;

        if(window.localStorage) {
            window.localStorage.setItem(this.LOCAL_STORAGE_KEYS.SFX_ENABLED, this._sfxEnabled);
        }
    },

    init: function (game) {
        this._game = game;

        this._music = game.add.audio('music', 0.7, true);
        this._music.play();

        this._sfx = game.add.audio('sfx');
        this._sfx.allowMultiple = true;

        this._sfx.addMarker('hit', 0, 0.3);
        this._sfx.addMarker('worldcollide', 8, 0.3, 0.2);
        this._sfx.addMarker('paddle', 9, 0.2);
        this._sfx.addMarker('hit_glass', 2, 0.2);
        this._sfx.addMarker('drop', 6, 0.2);
        this._sfx.addMarker('blubb', 7, 0.2);
        this._sfx.addMarker('flop', 5, 0.2);
        this._sfx.addMarker('klack', 4, 0.3);
        this._sfx.addMarker('collect_coin', 3, 0.3);
        this._sfx.addMarker('break', 1, 0.6);

        if(window.localStorage){
            this._sfxEnabled = window.localStorage.getItem(this.LOCAL_STORAGE_KEYS.SFX_ENABLED) !== "false";
            this._musicEnabled = window.localStorage.getItem(this.LOCAL_STORAGE_KEYS.MUSIC_ENABLED) !== "false";
        }

        this._updateMusic();

        this._initialized = true;
    }



};