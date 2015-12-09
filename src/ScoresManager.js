var doodleBreakout = doodleBreakout || {};

/**
 * @class
 * @classdesc Persists scores
 */
doodleBreakout.ScoresManager = {

    _scores : [],
    _times: {},
    _initialized: false,

    LOCAL_STORAGE_KEYS: {
        HIGHSCORES : "ScoresManager._highscores",
        BESTTIMES  : "ScoresManager._besttimes"
    },

    MAX_HIGHSCORE_SIZE: 10,

    /**
     *
     * @param levelId
     * @param secondsUsed
     */
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

        if(this.storage) {
            this.storage.setItem(this.LOCAL_STORAGE_KEYS.BESTTIMES, JSON.stringify(this._times));
        }
    },

    /**
     *
     * @param score
     * @param name
     */
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

        /* if using the js (not nativ) google play games api
        var request = gapi.client.games.scores.submit(
            {
                leaderboardId: "CgkIuIu32t4bEAIQAg",
                score: score
            }
        );
        request.execute(function(response) {
            console.log("submit scores", response);
        });*/
        var data = {
            score: score,
            leaderboardId: "CgkIuIu32t4bEAIQAg"
        };
        window.plugins.playGamesServices.submitScore(data);


        this._scores.push({name:name, score: score});
        this._scores.sort(function(a,b){
            return b.score - a.score;
        });

        if(this._scores.length > this.MAX_HIGHSCORE_SIZE){
            this._scores.pop();
        }

        if(this.storage) {
            this.storage.setItem(this.LOCAL_STORAGE_KEYS.HIGHSCORES, JSON.stringify(this._scores));
        }
    },

    /**
     *
     * @returns {Array}
     */
    getHighscores: function() {
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }

        return this._scores;
    },

    /**
     *
     * @returns {doodleBreakout.ScoresManager._times|{}}
     */
    getBesttimes: function() {
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }

        return this._times;
    },

    /**
     *
     */
    reset: function () {
        if(! this._initialized ) {
            throw "Initialise SoundManager first";
        }

        this._scores = [];
        this._times = {};

        if(this.storage){
            this.storage.removeItem(this.LOCAL_STORAGE_KEYS.HIGHSCORES);
            this.storage.removeItem(this.LOCAL_STORAGE_KEYS.BESTTIMES);
        }
    },

    /**
     *
     * @param game
     */
    init: function (game) {
        this._game = game;

        if(!this.storage) {
            this.storage = window.localStorage;
        }

        if(this.storage){
            var scores = this.storage.getItem(this.LOCAL_STORAGE_KEYS.HIGHSCORES);
            if (scores) {
                try {
                    this._scores = JSON.parse(scores);
                } catch(e) {
                    console.log(e);
                    this.storage.removeItem(this.LOCAL_STORAGE_KEYS.HIGHSCORES);
                }
            }

            var times = this.storage.getItem(this.LOCAL_STORAGE_KEYS.BESTTIMES);
            if (times) {
                try {
                    this._times = JSON.parse(times);
                } catch(e) {
                    console.log(e);
                    this.storage.removeItem(this.LOCAL_STORAGE_KEYS.BESTTIMES);
                }
            }
        }

        this._initialized = true;
    }



};