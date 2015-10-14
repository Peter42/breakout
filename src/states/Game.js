var doodleBreakout = doodleBreakout || {};

doodleBreakout.Game = function( game ){
};

doodleBreakout.Game.prototype = {
    level: 1,
    create: function(){

        var game = this.game;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.physics.arcade.checkCollision.down = false;


        var Level = new doodleBreakout.Level( game, this.level );
        var levelStructure = Level.getStructure();

        this.bricks = game.add.group();

        for ( var y = 100, i= 0; (i < levelStructure.length) && (y<400); y += 17, i++ ) {
            for (var x = 0, j = 0; (j < levelStructure[ i].length) && (x <= game.width - 50); x += 50, j++ ) {
                if( levelStructure[i][j] ) {
                    this.bricks.add( new doodleBreakout.Block( game, x, y, levelStructure[i][j] ) );
                }
            }
        }

        this.lives = new doodleBreakout.Lives( game, 10, 10, 3 );
        game.add.existing( this.lives );

        this.ball = new doodleBreakout.Ball( game, 300, 300 );
        this.ball.events.onOutOfBounds.add( this.lostBall, this );
        game.add.existing(this.ball);

        this.plattform = new doodleBreakout.Plattform(game, 550, 550 );
        game.add.existing(this.plattform);


        this.countdownText = game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'larafont', '3',128);
        this.countdownText.anchor.setTo(0.5);

        this.countdown = game.time.create(false);
        this.countdown.doodleBreakout = { value : 3};
        this.countdown.loop(1000, this.countdownUpdate, this);
        this.countdown.start();
    },

    lostBall: function(){
        this.lives.lose();

        if( this.lives.countLiving() <= 0 ){
            this.lostGame();
        }
        else {
            //this.ball.position.x = 300;
            //this.ball.position.y = 300;
            this.plattform.holdBall( this.ball );
        }
    },

    lostGame: function(){
        this.level = 1;
        this.lives = 3;
        this.state.start( 'MainMenu' );
    },

    countdownUpdate : function() {
        this.countdown.doodleBreakout.value--;
        if(this.countdown.doodleBreakout.value == 0){
            this.ball.start();
            this.countdownText.kill();
            this.countdown.stop();
        } else {
            this.countdownText.setText(this.countdown.doodleBreakout.value + "");
        }
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
            brick.hit();
            doodleBreakout.SoundManager.playSfx('break');

            if (this.bricks.total == 0) {
                console.log( game.levels +"<" +( this._level + 1 ) );
                if( this.game.levels < ( this._level + 1 ) ){
                    this.level = 1;
                    this.state.start('Game' );
                }
                else {
                    this.level++;
                    this.state.start('Game' );
                }
            }
        }, undefined, this);
    },
};