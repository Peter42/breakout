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

        this.bricks = game.add.group();

        for ( var y = 100, i= 0; (i < levelStructure.length) && (y<400); y += 17, i++ ) {
            for (var x = 0, j = 0; (j < levelStructure[ i].length) && (x <= game.width - 50); x += 50, j++ ) {
                if( levelStructure[i][j] ) {
                    this.bricks.add( new doodleBreakout.Block( game, x, y, levelStructure[i][j] ) );
                }
            }
        }

        this.fallingGimmiks = game.add.group();

        this.lives = new doodleBreakout.Lives( game, 10, 10, this._lives );
        game.add.existing( this.lives );

        this.ball = new doodleBreakout.Ball( game, 300, 300 );
        this.ball.events.onOutOfBounds.add( this.lostBall, this );
        game.add.existing(this.ball);

        this.plattform = new doodleBreakout.Plattform(game, 550, 550 );
        game.add.existing(this.plattform);

        this._scoreText = game.add.bitmapText(this.game.width - 20, 0, 'larafont', this._score + "", 48);
        this._scoreText.anchor.setTo(1,0);

        this.plattform.holdBall( this.ball );
    },

    earnPoints: function (ammount) {
        this._score += ammount;
        this._scoreText.setText(this._score + "");
    },

    lostBall: function(){
        this.lives.lose();

        if( this.lives.countLiving() <= 0 ){
            this.lostGame();
        }
        else {
            this.plattform.holdBall( this.ball );
        }
    },

    lostGame: function(){
        this._level = 1;
        this._lives = 3;
        this._score = 0;
        this.state.start( 'MainMenu' );
    },

    update: function() {
        this.game.physics.arcade.collide(this.plattform, this.ball, function (plattform, ball) {
            var angle = this.game.physics.arcade.angleBetween(plattform, ball) + Math.PI / 2;

            var velocity = Math.sqrt(Math.pow(ball.body.velocity.x, 2) + Math.pow(ball.body.velocity.y, 2));
            velocity = Math.min(velocity, 800);

            doodleBreakout.SoundManager.playSfx('hit');

            ball.body.velocity.set(velocity * Math.sin(angle), -velocity * Math.cos(angle));
        }, undefined, this);

        this.game.physics.arcade.collide(this.ball, this.bricks, function (ball, brick) {
            if(brick.hit()){
                if(this.game.rnd.realInRange(0,1) > 0.99) {
                    var live = new doodleBreakout.Live(this.game, ball.x, ball.y);
                    this.game.physics.enable(live, Phaser.Physics.ARCADE);
                    live.body.velocity.set(0, 300);
                    live.checkWorldBounds = true;
                    live.events.onOutOfBounds.add(live.kill, live);
                    this.fallingGimmiks.add(live);
                }
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
        }, undefined, this);

        this.game.physics.arcade.collide(this.plattform, this.fallingGimmiks, function (plattform, gimmik) {

            gimmik.kill();

            switch (gimmik.key){
                case "live":
                    this.lives.addNew();
                    break;
            }

        }, undefined, this);
    },
};