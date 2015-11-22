var doodleBreakout = doodleBreakout || {};

doodleBreakout.Game = function (game) {

};

doodleBreakout.Game.prototype = Object.create(doodleBreakout.AbstractSoundSettings.prototype);

doodleBreakout.Game.prototype.constructor = doodleBreakout.Game;

doodleBreakout.Game.prototype._level = 1;
doodleBreakout.Game.prototype._rotationActive = false;
doodleBreakout.Game.prototype.doodlebreakoutIsPaused = false;

doodleBreakout.Game.prototype.init = function (args) {
    if (args && args.level) {
        this._level = args.level;
    }
};

doodleBreakout.Game.prototype.create = function () {
    var game = this.game;

    this.doodlebreakoutIsPaused = false;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.timer = this.addTimeCounter( this.world.centerX, 10, 0.5, 0 );

    this.addPause( game.width, game.height, 1, 1 );

    this.gimmicks = new doodleBreakout.Gimmicks( game );
    game.add.existing(this.gimmicks);

    this.activateGimmickEasteregg( this.gimmicks );

    this.level = doodleBreakout.LevelManager.getLevel(this._level);

    this.bricks = this.level.generateBricks(this.gimmicks);
    game.add.existing(this.bricks);

    this.rotatorTimer = game.time.create(false);

    game.world.bringToTop(this.gimmicks);

    this.initializePlayers( this.bricks, this.gimmicks );
};

doodleBreakout.Game.prototype.update = function () {
    this.player.interact( this );
};

doodleBreakout.Game.prototype.initializePlayers = function( bricks, gimmicks ){
    var keySpacebar = this.addInputKey( Phaser.Keyboard.SPACEBAR );
    var keyLeft = this.addInputKey( Phaser.Keyboard.LEFT );
    var keyRight = this.addInputKey( Phaser.Keyboard.RIGHT );

    var plattform = new doodleBreakout.Plattform( this.game, 550, 550, 'plattform_player2', "down", 800, keyLeft, keyRight, keySpacebar );


    var playerPoints = 0;
    var playerLives = 3;

    if( this.player ){
        playerPoints = this.player.points;
        playerLives = this.player.livesAmount;
    }

    this.player = new doodleBreakout.SinglePlayer( this.game, plattform, playerLives );
    this.player.earnPoints( playerPoints );
    this.player.balls.imageKey = "ball1";
    this.player.addBall( 500, 500 );
    this.player.setBallsOnPlattform();
    this.player.balls.collideWith( this.bricks, this.collideBallVsBrick, this.overlapBallVsBrick );
    this.player.plattform.collideWith( this.gimmicks, this.collectGimmick );
    this.player.onBallLost( this.checkLives, this );

    this.addScoreText( this.game.width - 10, 10, 1, 0, this.player );
};

doodleBreakout.Game.prototype.checkLives = function(){
    if ( this.player.lives.countLiving() <= 0 ) {
        this.lostGame();
    }
};

doodleBreakout.Game.prototype.collectGimmick = function( plattform, gimmick ){
    gimmick.gathered( plattform.parent );
    this.updateScoreText();
};

doodleBreakout.Game.prototype.collideBallVsBrick = function( ball, brick ){
    if ( brick.hit( ball ) ) {
        this.updateScoreText();
    }

    if ( !this.bricks.children.find(function(brick){ return brick.destructionNeeded && brick.alive; } ) ) {

        doodleBreakout.ScoresManager.addBesttime( this._level, Math.floor(this.timer.seconds));
        this.timer.stop();

        this._level = doodleBreakout.LevelManager.getNextLevelId(this._level);

        if( this._level == false ){
            this.lostGame();
        }
        else {
            this.state.start( this.game.state.current );
        }
    }
};

doodleBreakout.Game.prototype.overlapBallVsBrick = function (ball, brick) {
    if (ball.isThunderball) {
        this.collideBallVsBrick(ball, brick);
        return false;
    }
    // collision happens
    return true;
};

doodleBreakout.Game.prototype.addTimeCounter = function ( x, y, xAnchor, yAnchor ) {
    var timerText = this.game.add.bitmapText( x, y, 'larafont', "0:00", 48);
    timerText.anchor.setTo( xAnchor, yAnchor );

    var timer = this.game.time.create( false );
    timer.loop( 1000, function ( timer, timerText ) {

        var time = Math.floor( timer.seconds );

        if (time % 60 < 10) {
            time = Math.floor(time / 60) + ":0" + (time % 60);
        } else {
            time = Math.floor(time / 60) + ":" + (time % 60);
        }

        timerText.setText( time );

    }, this, timer, timerText );
    timer.start();

    return timer;
};

doodleBreakout.Game.prototype.addScoreText = function( x, y, xAnchor, yAnchor, player ){
    if( ! this._scoreTexts ){
        this._scoreTexts = [];
    }
    var scoreText = this.game.add.bitmapText( x, y, 'larafont', player.points + "" , 48 );
    scoreText.anchor.setTo( xAnchor, yAnchor );
    this._scoreTexts.push( { player: player, text: scoreText } );
};

doodleBreakout.Game.prototype.updateScoreText = function () {
    for( i in this._scoreTexts ){
        this._scoreTexts[ i ].text.setText( this._scoreTexts[ i ].player.points );
    }
};

doodleBreakout.Game.prototype.lostGame = function () {

    var oParameters = {
        level: this._level,
        score: this.player.points,
        lives: this.player.livesAmount
    };

    this._level = 1;
    this.state.start('GameOver', true, false, oParameters);
};

doodleBreakout.Game.prototype.activateGimmickEasteregg = function( gimmicks ){
    var easteregg = this.addInputKey( Phaser.Keyboard.E );
    easteregg.onDown.add( function( key, gimmicks ){
        gimmicks.forEachAlive(function( gimmick ){
            if( ! gimmick.isFalling ){
                gimmick.visible = ! gimmick.visible;
            }
        } );
    }, this, null, gimmicks );
};

doodleBreakout.Game.prototype.addPause = function( x, y, xAnchor, yAnchor ){
    this.pauseIcon = this.game.add.button( x, y, 'icon_pause', this.pauseGame, this );
    this.pauseIcon.anchor.setTo( xAnchor, yAnchor );

    this.pauseIcon.onInputOver.add( this.over, this );
    this.pauseIcon.onInputOut.add( this.out, this );

    this.pause = this.addInputKey( Phaser.Keyboard.P );
    this.pause.onDown.add( this.pauseGame, this );
};

doodleBreakout.Game.prototype.pauseGame = function () {

    if(!this.doodlebreakoutIsPaused){
        this.doodlebreakoutIsPaused = true;
        this.game.physics.arcade.isPaused = true;
        this.game.time.gamePaused();

        this.pauseOverlay = this.game.add.sprite(0, 0, 'pause');
        this.pauseOverlay.alpha = 0.6;

        this.pauseIcon.bringToTop();
        this.pauseIcon.frame = 1;

        this.title = this.game.add.bitmapText(this.game.width / 2, 40, 'larafont', 'Pause', 64);
        this.title.anchor.setTo(0.5, 0);

        this.createSoundSettings();

        this.retry = this.game.add.bitmapText(this.game.width / 2, 380, 'larafont', 'Retry', 48);
        this.retry.anchor.setTo(0.5, 0);
        this.retry.inputEnabled = true;

        this.retry.events.onInputDown.add(function(){
            this._score = 0;
            this.state.start(this.game.state.current);
        }, this);
        this.retry.events.onInputOver.add(this.over, this);
        this.retry.events.onInputOut.add(this.out, this);

        this.resume = this.game.add.bitmapText(this.game.width / 2, 440, 'larafont', 'Resume', 48);
        this.resume.anchor.setTo(0.5, 0);
        this.resume.inputEnabled = true;

        this.resume.events.onInputDown.add(this.pauseGame, this);
        this.resume.events.onInputOver.add(this.over, this);
        this.resume.events.onInputOut.add(this.out, this);

        this.back = this.game.add.bitmapText(this.game.width / 2, 500, 'larafont', 'Back to menu', 48);
        this.back.anchor.setTo(0.5, 0);
        this.back.inputEnabled = true;

        this.back.events.onInputDown.add(function(){
            this._score = 0;
            this.state.start("MainMenu");
        }, this);
        this.back.events.onInputOver.add(this.over, this);
        this.back.events.onInputOut.add(this.out, this);

        this._rotate(0);

    } else {
        this.doodlebreakoutIsPaused = false;
        this.game.physics.arcade.isPaused = false;
        this.game.time.gameResumed();

        this.pauseIcon.frame = 0;

        this.pauseOverlay.kill();
        this.title.kill();
        this.retry.kill();
        this.resume.kill();
        this.back.kill();
        this.destroySoundSettings();

        this._rotate(this._rotationActive ? 180 : 0);
    }

};

doodleBreakout.Game.prototype.addInputKey = function( key ){
    if( ! this.inputKeys ){
        this.inputKeys = [];
    }

    this.inputKeys.push( key );
    return this.game.input.keyboard.addKey( key );
};

doodleBreakout.Game.prototype.removeInputKeys = function () {
    for( i in this.inputKeys ){
        this.input.keyboard.removeKey( this.inputKeys[ i ] );
    }
};

doodleBreakout.Game.prototype.shutdown = function () {
    //reset rotation
    this.deactivateRotation();

    this.removeInputKeys();
};

doodleBreakout.Game.prototype.activateRotation = function() {

    this._rotationActive = true;

    this.rotatorTimer.stop();
    this.rotatorTimer.add(7000, this.deactivateRotation, this);
    this.rotatorTimer.start();

    this._rotate(180);
};

doodleBreakout.Game.prototype.deactivateRotation = function() {
    this._rotationActive = false;
    this.rotatorTimer.stop();
    this._rotate(0);
};

doodleBreakout.Game.prototype._rotate = function( deg ) {
    game.style.transform = 'rotate('  + deg + 'deg)';
};