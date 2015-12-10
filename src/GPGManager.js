var doodleBreakout = doodleBreakout || {};

/**
 * @class
 * @classdesc Persists scores
 */
doodleBreakout.GPGManager = {


    status: {
        loggedin: false
    },

    toggleLogin: function() {
        if(this.status.loggedin) {
            if (confirm("Disconnect from Google Play Games?")) {
                window.plugins.playGamesServices.signOut(function(){
                    doodleBreakout.GPGManager.status.loggedin = false;
                });
            }
        } else {
            window.plugins.playGamesServices.auth(function(){
                doodleBreakout.GPGManager.status.loggedin = true;
            });
        }
    }

};