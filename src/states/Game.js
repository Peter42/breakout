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

    if(!this._recorder && doodleBreakout.Recorder.isRecordingActive() ) {
        this._recorder = new doodleBreakout.Recorder(game);
    }
};

doodleBreakout.Game.prototype.render = function() {
    if(this._recorder && !this.doodlebreakoutIsPaused) {
        this._recorder.capture(this);
    }
};

doodleBreakout.Game.prototype.update = function () {
    if(this.player){
        this.player.interact( this );
    }
};

doodleBreakout.Game.prototype.initializePlayers = function( bricks, gimmicks ){
    var keySpacebar = this.addInputKey( Phaser.Keyboard.SPACEBAR );
    var keyLeft = this.addInputKey( Phaser.Keyboard.LEFT );
    var keyRight = this.addInputKey( Phaser.Keyboard.RIGHT );

    var plattform = new doodleBreakout.Plattform( this.game, 550, 550, 'plattform01', "down", 800, keyLeft, keyRight, keySpacebar );

    var playerPoints = 0;
    var playerLives = 3;

    if( this.player ){
        playerPoints = this.player.points;
        playerLives = this.player.livesAmount;
    }

    this.player = new doodleBreakout.SinglePlayer( this.game, plattform, playerLives );
    this.player.earnPoints( playerPoints );
    this.player.balls.imageKey = "ball";
    this.player.addBall( 500, 500 );
    this.player.setBallsOnPlattform();
    this.player.balls.collideWith( this.bricks, this.collideBallVsBrick, this.overlapBallVsBrick );
    this.player.plattform.collideWith( this.gimmicks, this.collectGimmick );
    this.player.onBallLost( this.checkLives, this );
    this.player.onEarnPoint( this.showPointText, this );

    this.addScoreText( this.game.width - 10, 10, 1, 0, this.player );
};

doodleBreakout.Game.prototype.showPointText = function ( points, x, y ) {
    if( points && x && y ){
        this.displayText( x, y, points, Phaser.Timer.SECOND );
    }
};

doodleBreakout.Game.prototype.checkLives = function(){
    this.clearGimmickLifetimes( true );
    if ( this.player.lives.countLiving() <= 0 ) {
        this.lostGame();
    }
};

/**
 * Exexuted if gimmick is gatherd
 * @param plattform
 * @param gimmick
 */
doodleBreakout.Game.prototype.collectGimmick = function( plattform, gimmick ){
    this.showGimmickLifetime( gimmick );
    gimmick.gathered( plattform.parent );
    this.updateScoreText();
};

doodleBreakout.Game.prototype.collideBallVsBrick = function( ball, brick ){
    if ( brick.hit( ball ) ) {
        this.updateScoreText();
    }

    if ( !this.bricks.children.find(function(brick){ return brick.destructionNeeded && brick.alive; } ) ) {

        if(this.state.current == "Game"){
            doodleBreakout.ScoresManager.addBesttime( this._level, Math.floor(this.timer.seconds));
        }
        this.timer.stop();

        var nextLevel = doodleBreakout.LevelManager.getNextLevelId(this._level);

        if( nextLevel == false ){
            this.lostGame();
        }
        else {
            this._level = nextLevel;
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
    for( var i = 0; i < this._scoreTexts.length; ++i ){
        this._scoreTexts[ i ].text.setText( this._scoreTexts[ i ].player.points );
    }
};

doodleBreakout.Game.prototype.lostGame = function () {

    var oParameters = {
        level: this._level,
        score: this.player.points,
        lives: this.player.livesAmount,
        recorder: this._recorder
    };

    this.player = null;

    this._recorder = null;

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
        this.pauseOverlay.width = this.game.width;
        this.pauseOverlay.height = this.game.height;

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
            this.player = null;
            this._recorder = null;
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
            this.player = null;
            this._recorder = null;
            this.state.start("MainMenu");
        }, this);
        this.back.events.onInputOver.add(this.over, this);
        this.back.events.onInputOut.add(this.out, this);

        this._gameDivRotation = this._getGameRotation();

        this._setGameRotation(0);

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

        this._setGameRotation( this._gameDivRotation );
    }
};

doodleBreakout.Game.prototype._setGameRotation = function( deg ) {
    // game represents the game div
    game.style.transform = 'rotate(' + deg + 'deg)';
};

doodleBreakout.Game.prototype._getGameRotation = function() {
    // game represents the game div
    var rotation = game.style.transform.match( /rotate\((.*)\)/ );

    if( rotation == null || rotation.length < 2 ){
        return 0;
    }
    return parseInt( rotation[ 1 ] );
};

doodleBreakout.Game.prototype.addInputKey = function( key ){
    if( ! this.inputKeys ){
        this.inputKeys = [];
    }

    this.inputKeys.push( key );
    return this.game.input.keyboard.addKey( key );
};

doodleBreakout.Game.prototype.removeInputKeys = function () {
    for( var i = 0; i < this.inputKeys.length; ++i ){
        this.game.input.keyboard.removeKey( this.inputKeys[ i ] );
    }
    this.inputKeys = [];
};

doodleBreakout.Game.prototype.shutdown = function () {
    this._setGameRotation(0);
    this.removeInputKeys();
};

doodleBreakout.Game.prototype.displayText = function(x,y,text,timeout){

    var textPopup = this.game.add.bitmapText(x, y, 'larafont', String(text), 36);
    textPopup.anchor.setTo(0.5, 0);

    this.game.add.tween(textPopup).to( { alpha: 0 }, timeout/2, Phaser.Easing.Linear.None, true, timeout/2, 0, false);
    this.timer = this.game.time.create(false);
    this.timer.destroy();
    this.timer.stop();
    this.timer.add( timeout, function(){

        textPopup.destroy();
    }, this);
    this.timer.start();

};

doodleBreakout.Game.prototype.showGimmickLifetime = function ( gimmick ) {
    if( gimmick.getDuration() <= 0 ){
        return;
    }

    var duration = gimmick.getDuration();

    if( ! this._activeDisplayedGimmick ){
        this._activeDisplayedGimmick = [];
    }

    for( var i = 0; i < this._activeDisplayedGimmick.length; ++i ){
        if( this._activeDisplayedGimmick[ i ].className == gimmick.className ){
            this._activeDisplayedGimmick[ i ].children[ 1 ].setText( duration );
            return;
        }
    }

    var length = this._activeDisplayedGimmick.length;

    var position = 10;
    if( length > 0 ){
        position = this._activeDisplayedGimmick[ length - 1 ].nextX;
    }

    var activeGimmickDisplay = this.game.add.group();
    activeGimmickDisplay.className = gimmick.className;
    activeGimmickDisplay.stayAlive = gimmick.stayAlive;

    var gimmickImage = this.game.add.sprite( position, this.game.height, gimmick.key );
    gimmickImage.anchor.setTo( 0, 1 );

    var gimmickImageHeight = gimmickImage.height;

    gimmickImage.height = 30;
    gimmickImage.width = gimmickImage.width / (gimmickImageHeight/gimmickImage.height);

    activeGimmickDisplay.nextX = gimmickImage.x + gimmickImage.width + 10;
    activeGimmickDisplay.add( gimmickImage );

    var xTimerText = Math.floor( (gimmickImage.x) + gimmickImage.width / 2 );
    var yTimerText = Math.floor( (gimmickImage.y - gimmickImage.height ) + gimmickImage.height / 2 );
    var timerText = this.game.add.bitmapText( xTimerText, yTimerText, 'larafont', String(duration), 32 );
    timerText.anchor.setTo( 0.5 );

    activeGimmickDisplay.add( timerText );

    this._activeDisplayedGimmick.push( activeGimmickDisplay );

    activeGimmickDisplay.destructionTimer = this.game.time.create();

    activeGimmickDisplay.destructionTimer.loop( Phaser.Timer.SECOND, function( activeGimmick ){
        var text = activeGimmick.children[ 1 ];

        var time = parseInt( text.text ) - 1;

        text.setText( time );

        if( time <= 0 ){
            var gimmickTween = this.game.add.tween( activeGimmick.children[ 0 ] );
            var textTween = this.game.add.tween( activeGimmick.children[ 1 ] );

            gimmickTween.onComplete.add( this._removeGimmickLifetime, this, null, activeGimmick );

            gimmickTween.to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false );
            textTween.to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false );
        }
    }, this, activeGimmickDisplay );
    activeGimmickDisplay.destructionTimer.start();
};

doodleBreakout.Game.prototype.clearGimmickLifetimes = function( keepStayAlive ){
    if( ! this._activeDisplayedGimmick ){
        return;
    }

    for( var i = 0; i < this._activeDisplayedGimmick.length; ++i ){
        if( ! ( keepStayAlive && this._activeDisplayedGimmick[ i ].stayAlive ) ){
            this._removeGimmickLifetime( null, null, this._activeDisplayedGimmick[ i ] );
        }
    }
};

doodleBreakout.Game.prototype._removeGimmickLifetime = function ( sprite, tween, activeGimmick ) {
    activeGimmick.destructionTimer.destroy();

    this._activeDisplayedGimmick.splice( this._activeDisplayedGimmick.indexOf( activeGimmick ), 1 );

    activeGimmick.destroy();

    for( var i = 0; i < this._activeDisplayedGimmick.length; ++i ){
        var pos = 0;
        if( this._activeDisplayedGimmick[ i - 1 ] ){
            pos = this._activeDisplayedGimmick[ i - 1 ].nextX;
        }

        if( ! this._activeDisplayedGimmick[ i ] ){
            console.log( "Undefined Error" );
            continue;
        }

        var textPos = Math.floor((pos) + this._activeDisplayedGimmick[ i ].children[ 0 ].width / 2);

        this.game.add.tween(this._activeDisplayedGimmick[ i ].children[ 0 ]).to( { x: pos }, 250, Phaser.Easing.Linear.None, true );
        this.game.add.tween(this._activeDisplayedGimmick[ i ].children[ 1 ]).to( { x: textPos }, 250, Phaser.Easing.Linear.None, true );

        this._activeDisplayedGimmick[ i ].nextX = pos + this._activeDisplayedGimmick[ i ].children[ 0 ].width + 10;
    }
};