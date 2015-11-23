var doodleBreakout = doodleBreakout || {};

doodleBreakout.GameMultiplayer = function (game) {

};

doodleBreakout.GameMultiplayer.prototype = Object.create(doodleBreakout.Game.prototype);

doodleBreakout.GameMultiplayer.prototype.constructor = doodleBreakout.GameMultiplayer;

doodleBreakout.GameMultiplayer.prototype.init = function (args) {
    if (args && args.level) {
        this._level = args.level;
    }
};

doodleBreakout.GameMultiplayer.prototype.create = function ( game ) {
    game.physics.startSystem( Phaser.Physics.ARCADE );
    game.physics.arcade.bounds.height = 550;
    game.physics.arcade.bounds.y = 50;

    this.line = this.game.add.sprite( 0, 0, "block05" );
    this.line.alpha = 0.3;
    this.line.width = 800;
    this.line.height = 50;

    this.rotatorTimer = game.time.create(false);

    this.blockerLeft = this.game.add.sprite( -1, 0, "block01" );
    game.physics.arcade.enable(this.blockerLeft);
    this.blockerLeft.body.immovable = true;
    this.blockerLeft.width = 1;
    this.blockerLeft.height = 600;

    this.blockerRight = this.game.add.sprite( game.width, 0, "block01" );
    game.physics.arcade.enable(this.blockerRight);
    this.blockerRight.body.immovable = true;
    this.blockerRight.width = 1;
    this.blockerRight.height = 600;


    this.addPause( this.world.centerX, 5, 0.5, 0 );

    var useGimmicks = {
        "positive": [
            {
                "probability": 3,
                "create": doodleBreakout.Duplicate
            },
            {
                "probability": 1,
                "create": doodleBreakout.Thunderball
            },
            {
                "probability": 3,
                "create": doodleBreakout.Plus
            },
            {
                "probability": 3,
                "create": doodleBreakout.Coin
            }
        ],
        "negative": [
            {
                "probability": 6,
                "create": doodleBreakout.Minus
            },
            {
                "probability": 4,
                "create": doodleBreakout.Rotator
            }
        ]
    };

    this.gimmicks = new doodleBreakout.Gimmicks( game, useGimmicks );
    game.add.existing( this.gimmicks );

    this.activateGimmickEasteregg( this.gimmicks );

    this.level = doodleBreakout.LevelManager.getMultiplayerLevel( this._level, true );

    this.bricks = this.level.generateBricks( this.gimmicks );
    game.add.existing( this.bricks );

    game.world.bringToTop(this.gimmicks);

    this.initializePlayers( this.bricks, this.gimmicks );
};

doodleBreakout.GameMultiplayer.prototype.update = function () {
    this.player1.interact( this );
    this.player2.interact( this );
};

doodleBreakout.GameMultiplayer.prototype.initializePlayers = function( bricks, gimmicks ){
    var keyW = this.addInputKey( Phaser.Keyboard.W );
    var keyS = this.addInputKey( Phaser.Keyboard.S );
    var keyD = this.addInputKey( Phaser.Keyboard.D );

    var plattform = new doodleBreakout.Plattform( this.game, 40, 300, 'plattform_player1', "left", 800, keyW, keyS, keyD, false );

    this.player1 = new doodleBreakout.Player( this.game, plattform );
    this.player1.addBall( 100, 100 );
    this.player1.setBallsOnPlattform();

    var keyUp = this.addInputKey( Phaser.Keyboard.UP );
    var keyDown = this.addInputKey( Phaser.Keyboard.DOWN );
    var keyLeft = this.addInputKey( Phaser.Keyboard.LEFT );

    var plattform1 = new doodleBreakout.Plattform( this.game, this.game.width-40, 300, 'plattform_player2', "right", 800, keyUp, keyDown, keyLeft, false );

    this.player2 = new doodleBreakout.Player( this.game, plattform1 );
    this.player2.balls.imageKey = "ball1";
    this.player2.addBall( 700, 100 );
    this.player2.setBallsOnPlattform();

    this.player1.collideWith( this.player2.balls );
    this.player2.collideWith( this.player1.balls );

    this.player1.balls.collideWith( bricks, this.collideBallVsBrick, this.overlapBallVsBrick );
    this.player2.balls.collideWith( bricks, this.collideBallVsBrick, this.overlapBallVsBrick );

    this.player1.balls.collideWith( this.blockerRight );
    this.player2.balls.collideWith( this.blockerLeft );

    this.player1.plattform.collideWith( gimmicks, this.collectGimmick );
    this.player2.plattform.collideWith( gimmicks, this.collectGimmick );

    this.player1.onBallLost( this.lostBall, this.player1 );
    this.player2.onBallLost( this.lostBall, this.player2 );

    this.player1.onEarnPoint( this.updateScoreText, this );
    this.player2.onEarnPoint( this.updateScoreText, this );

    this.addScoreText( 10, 5, 0, 0, this.player1 );
    this.addScoreText( this.game.width - 10, 5, 1, 0, this.player2 );
};

doodleBreakout.GameMultiplayer.prototype.collideBallVsBrick = function( ball, brick ){
    player = ball.parent.parent;

    brick.hit(ball);

    if ( !this.bricks.children.find(function(brick){ return brick.destructionNeeded && brick.alive; } ) ) {
        this.endGame();
    }
};

doodleBreakout.GameMultiplayer.prototype.lostBall = function(){
    this.earnPoints( -100 );
};

doodleBreakout.GameMultiplayer.prototype.endGame = function () {
    // TODO: create new game over screen
    var winner = "Player BLUE";
    if( this.player1.points > this.player2.points ){
        winner = "Player RED";
    }
    else if( this.player1.points == this.player2.points ){
        winner = "REMIS";
    }

    var oParameters = {
        level: this._level,
        winner: winner,
        playerRedScore: this.player1.points,
        playerBlueScore: this.player2.points
    };

    this._level = 1;
    this.state.start('GameOver', true, false, oParameters);
};