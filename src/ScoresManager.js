var doodleBreakout = doodleBreakout || {};

/**
 * @class
 * @classdesc Persists scores
 */
doodleBreakout.ScoresManager = {

    _scores : [],
    _times: {},
    _initialized: true,

    LOCAL_STORAGE_KEYS: {
        HIGHSCORES : "ScoresManager._highscores",
        BESTTIMES  : "ScoresManager._besttimes"
    },

    MAX_HIGHSCORE_SIZE: 2,

    addBesttime: function (levelId, secondsUsed){
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }

        if(typeof secondsUsed !== "number"){
            throw 'Parameter "secondsUsed" must be a number';
        }
        if(secondsUsed < 0){
            throw 'Parameter "secondsUsed" must be positive';
        }

        if(typeof levelId !== "string"){
            throw 'Parameter "levelId" must be a string';
        }

        var currentBest = this._times[levelId];
        if( !currentBest || currentBest > secondsUsed) {
            this._times[levelId] = secondsUsed;
        }

        if(window.localStorage) {
            window.localStorage.setItem(this.LOCAL_STORAGE_KEYS.BESTTIMES, JSON.stringify(this._times));
        }
    },

    addHighscore: function (score, name) {
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }

        if(typeof score !== "number"){
            throw 'Parameter "score" must be a number';
        }
        if(score < 0){
            throw 'Parameter "score" must be positive';
        }

        if(typeof name !== "string"){
            throw 'Parameter "name" must be a string';
        }


        this._scores.push({name:name, score: score});
        this._scores.sort(function(a,b){
            return b.score - a.score;
        });

        if(this._scores.length > this.MAX_HIGHSCORE_SIZE){
            this._scores.pop();
        }

        if(window.localStorage) {
            window.localStorage.setItem(this.LOCAL_STORAGE_KEYS.HIGHSCORES, JSON.stringify(this._scores));
        }
    },

    getHighscores: function() {
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }

        return this._scores;
    },

    getBesttimes: function() {
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }

        return this._times;
    },

    reset: function () {
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }

        this._scores = [];
        this._times = {};

        if(window.localStorage){
            window.localStorage.removeItem(this.LOCAL_STORAGE_KEYS.HIGHSCORES);
            window.localStorage.removeItem(this.LOCAL_STORAGE_KEYS.BESTTIMES);
        }
    },

    init: function (game) {
        this._game = game;


        if(window.localStorage){
            var scores = window.localStorage.getItem(this.LOCAL_STORAGE_KEYS.HIGHSCORES);
            if (scores) {
                try {
                    this._scores = JSON.parse(scores);
                } catch(e) {
                    console.log(e);
                    window.localStorage.removeItem(this.LOCAL_STORAGE_KEYS.HIGHSCORES);
                }
            }

            var times = window.localStorage.getItem(this.LOCAL_STORAGE_KEYS.BESTTIMES);
            if (times) {
                try {
                    this._times = JSON.parse(times);
                } catch(e) {
                    console.log(e);
                    window.localStorage.removeItem(this.LOCAL_STORAGE_KEYS.BESTTIMES);
                }
            }
        }

        this._initialized = true;
    }



};