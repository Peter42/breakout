/**
 * @namespace
 */
window.doodleBreakout = {};

window.onload = function(){
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );

    game.state.add( 'Preloader'     , doodleBreakout.Preloader );
    game.state.add( 'MainMenu'      , doodleBreakout.MainMenu );
    game.state.add( 'Settings'      , doodleBreakout.Settings );
    game.state.add( 'Credits'       , doodleBreakout.Credits );
    game.state.add( 'LevelSelection', doodleBreakout.LevelSelection );
    game.state.add( 'Game'          , doodleBreakout.Game );
    game.state.add( 'Highscores'    , doodleBreakout.Highscores );
    game.state.add( 'GameOver'    , doodleBreakout.GameOver );
    game.state.add( 'Boot'          , doodleBreakout.Boot, true );
};