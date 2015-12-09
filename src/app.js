/**
 * @namespace
 */
window.doodleBreakout = {};

window.onload = function(){

    window.addEventListener("resize", calculateSize);
    calculateSize();


    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );

    game.state.add( 'Preloader'      , doodleBreakout.Preloader );
    game.state.add( 'MainMenu'       , doodleBreakout.MainMenu );
    game.state.add( 'Settings'       , doodleBreakout.Settings );
    game.state.add( 'Credits'        , doodleBreakout.Credits );
    game.state.add( 'LevelSelection' , doodleBreakout.LevelSelection );
    game.state.add( 'Game'           , doodleBreakout.Game );
    game.state.add( 'GameComputer'   , doodleBreakout.GameComputer );
    game.state.add( 'GameMultiplayer', doodleBreakout.GameMultiplayer );
    game.state.add( 'Highscores'     , doodleBreakout.Highscores );
    game.state.add( 'GameOver'       , doodleBreakout.GameOver );
    game.state.add( 'LevelDesigner'  , doodleBreakout.LevelDesigner );
    game.state.add( 'Replay'         , doodleBreakout.Replay );
    game.state.add( 'Boot'           , doodleBreakout.Boot, true );

    doodleBreakout.OnscreenInput.init();
};

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
    console.log("ready");
    window.plugins.playGamesServices.auth(function (result) {

    });

    window.plugins.playGamesServices.isSignedIn(function (result) {

        console.log(result.isSignedIn, result);
    });
}

function calculateSize() {

    if(document.activeElement === fakeInput){
        return;
    }

    var width = 800;
    var height = 600;

    var faktor = Math.min(window.innerHeight / height, window.innerWidth / width);
    width *= faktor;
    height *= faktor;

    var gameDiv = document.getElementById("game");
    gameDiv.style.width = width + "px";
    gameDiv.style.height = height + "px";
}

/* if using the js (not nativ) google play games api
function signinCallback(auth) {
    console.log("signinCallback", arguments);
    if (auth && auth.error == null) {
        // Hooray! The user is logged int!
        // If we got here from a sign-in button, we should probably hide it
        //hideMyGamesSignInButton();
        //loadLeaderboardsAndAchievements();

    } else {
        // Common reasons are immediate_failed and user_signed_out
        if (auth && typeof auth.hasOwnProperty == "function" && auth.hasOwnProperty('error')) {
            console.log('Sign in failed because: ', auth.error);
        }
        gapi.auth.signIn();
    }

}*/


// Polyfills

// Array.find
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/find
if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

// Array.findIndex
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}