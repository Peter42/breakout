var doodleBreakout = doodleBreakout || {};

doodleBreakout.Game = function( game ){
};

doodleBreakout.Game.prototype = {
    _level: 1,
    _score: 0,
    _lives: 3,

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
        doodleBreakout.ScoresManager.addHighscore(this._score, this.game.rnd.pick(["Hans","Peter","Karl","Franz"]));
        this._level = 1;
        this._lives = 3;
        this._score = 0;
        this.state.start( 'MainMenu' );
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