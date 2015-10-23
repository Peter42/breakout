var doodleBreakout = doodleBreakout || {};

doodleBreakout.Game = function( game ){
};

doodleBreakout.Game.prototype = {
    _level: 1,
    _score: 0,
    _lives: 3,

    init: function(args) {
        if(args && args.level) {
            this._level = args.level;
        }
    },

    create: function(){

        var game = this.game;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.physics.arcade.checkCollision.down = false;


        var Level = new doodleBreakout.Level( game, this._level );
        var levelStructure = Level.getStructure();



        this.lives = new doodleBreakout.Lives( game, 10, 10, this._lives );
        game.add.existing( this.lives );

        this.plattform = new doodleBreakout.Plattform(game, 550, 550 );
        game.add.existing(this.plattform);

        this._scoreText = game.add.bitmapText(this.game.width - 20, 0, 'larafont', this._score + "", 48);
        this._scoreText.anchor.setTo(1,0);

        this.ball = this.game.add.group();
        this.plattform.holdBall( this.addBall(300, 300) );

        this.easteregg = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.easteregg.onDown.add( this.toggleEasteregg, this);

        this.pause = game.input.keyboard.addKey(Phaser.Keyboard.P);
        this.pause.onDown.add( function(){
            game.paused = !game.paused;
        }, this);

        this.fallingGimmiks = new doodleBreakout.Gimmicks( game, null, this.lives, this.ball, this.plattform );
        game.add.existing(this.fallingGimmiks);

        this.bricks = game.add.group();

        for ( var y = 100, i= 0; (i < levelStructure.length) && (y<400); y += 17, i++ ) {
            for (var x = 0, j = 0; (j < levelStructure[ i].length) && (x <= game.width - 50); x += 50, j++ ) {
                if( levelStructure[i][j] ) {
                    var gimmick = this.fallingGimmiks.randomGimmick( x, y );
                    this.bricks.add( new doodleBreakout.Block( game, x, y, levelStructure[i][j], gimmick ) );
                }
            }
        }
        game.world.bringToTop(this.fallingGimmiks);

        this.timer = game.time.create(false);
        this.timer.loop(1000, function () {
            this.updateTimerText(Math.floor(this.timer.seconds));
        }, this);
        this.timer.start();
        this.timertext = game.add.bitmapText(this.world.centerX, 0, 'larafont', "0:00", 48);
        this.timertext.anchor.setTo(0.5,0);
    },

    updateTimerText: function (time) {
        if(time % 60 < 10) {
            time = Math.floor(time / 60) + ":0" + (time % 60);
        } else {
            time = Math.floor(time / 60) + ":" + (time % 60);
        }
        this.timertext.setText(time);
    },

    earnPoints: function (ammount) {
        this._score += ammount;
        this._scoreText.setText(this._score + "");
    },

    lostBall: function(ball){
        if(this.ball.total <= 1) {
            this.lives.lose();

            if (this.lives.countLiving() <= 0) {
                this.lostGame();
            }
            else {
                this.plattform.holdBall( this.addBall(300, 300) );
            }
        }

        ball.kill();
        this.ball.remove(ball);
    },

    lostGame: function(){

        var oParameters = {
            level: this._level,
            score: this._score,
            lives: this.lives.countLiving()
        };

        this._level = 1;
        this._lives = 3;
        this._score = 0;
        this.state.start( 'GameOver', true, false, oParameters);
    },

    eastereggon: false,
    toggleEasteregg: function(){
        this.eastereggon = !this.eastereggon;
        this.fallingGimmiks.forEachAlive( function(gimmick){
            gimmick.visible = this.eastereggon;
        }, this );
    },

    update: function() {
        this.game.physics.arcade.collide(this.plattform, this.ball, function (plattform, ball) {
            var angle = this.game.physics.arcade.angleBetween(plattform, ball) + Math.PI / 2;

            var velocity = Math.sqrt(Math.pow(ball.body.velocity.x, 2) + Math.pow(ball.body.velocity.y, 2));
            velocity = Math.min(velocity, 800);

            doodleBreakout.SoundManager.playSfx('hit');

            ball.body.velocity.set(velocity * Math.sin(angle), -velocity * Math.cos(angle));
        }, undefined, this);

        this.game.physics.arcade.collide(this.ball, this.bricks, this.collideBallBrick, this.overlapBallBrick, this);

        this.game.physics.arcade.collide(this.plattform, this.fallingGimmiks, function (plattform, gimmick) {
            gimmick.collected();
        }, undefined, this);
    },

    overlapBallBrick: function (ball, brick) {
        if( ball.isThunderball ){
            brick.health = 1;
            this.collideBallBrick( ball, brick );
            return false;
        }
        // collision happens
        return true;
    },

    collideBallBrick: function (ball, brick) {
        if( brick.hit() ){
            this.earnPoints(20);
        }
        doodleBreakout.SoundManager.playSfx('break');

        if (this.bricks.total == 0) {

            doodleBreakout.ScoresManager.addBesttime("level_" + this._level, Math.floor(this.timer.seconds));
            this.timer.stop();

            if( this.game.levels < ( this._level + 1 ) ){
                this.lostGame();
            }
            else {
                this._level++;
                this._lives = this.lives.countLiving();
                this.state.start('Game' );
            }
        }
    },

    addBall: function(x, y) {
        var ball = new doodleBreakout.Ball( this.game, x, y );
        this.ball.add(ball);
        ball.events.onOutOfBounds.add( this.lostBall, this );
        return ball;
    }
};