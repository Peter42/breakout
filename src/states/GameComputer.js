var doodleBreakout = doodleBreakout || {};

doodleBreakout.GameComputer = function (game) {

};

doodleBreakout.GameComputer.prototype = Object.create(doodleBreakout.Game.prototype);

doodleBreakout.GameComputer.prototype.constructor = doodleBreakout.GameComputer;

doodleBreakout.GameComputer.prototype.update = function () {
    this.player.interact( this, this.gimmicks );
};

doodleBreakout.GameComputer.prototype.initializePlayers = function( bricks, gimmicks ){
    var plattform = new doodleBreakout.Plattform( this.game, 550, 550, 'plattform_player2', "down", 800, false, false, {onDown:{add:function(){}}}, false );

    var playerPoints = 0;
    var playerLives = 3;

    if( this.player ){
        playerPoints = this.player.points;
        playerLives = this.player.livesAmount;
    }

    this.player = new doodleBreakout.ComputerPlayer( this.game, plattform, playerLives );
    this.player.balls.imageKey = "ball1";
    this.player.earnPoints( playerPoints );
    this.player.addBall( 500, 500 );
    this.player.setBallsOnPlattform();
    this.player.balls.collideWith( this.bricks, this.collideBallVsBrick, this.overlapBallVsBrick );
    this.player.plattform.collideWith( this.gimmicks, this.collectGimmick );
    this.player.onBallLost( this.checkLives, this );

    this.addScoreText( this.game.width - 10, 10, 1, 0, this.player );
};

doodleBreakout.GameComputer.prototype.lostGame = function () {

    var oParameters = {
        level: doodleBreakout.LevelManager.getLevelIds()[0]
    };

    this.player.points = 0;
    this.state.start(this.game.state.current, true, false, oParameters);
};