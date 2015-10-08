var doodleBreakout = doodleBreakout || {};

doodleBreakout.Game = function( game ){

};

doodleBreakout.Game.prototype = {
    create: function(){

        var game = this.game;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.physics.arcade.checkCollision.down = false;

        this.bricks = game.add.group();

        for (var y = 100; y < 200; y += 17) {
            for (var x = 0; x < game.width - 64; x += 65) {
                this.bricks.add(new doodleBreakout.Block(game, x, y));
            }
        }

        this.ball = new doodleBreakout.Ball(game, 300, 300);
        game.add.existing(this.ball);

        this.plattform = new doodleBreakout.Plattform(game, 550, 550);
        game.add.existing(this.plattform);

        this.countdownText = game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'larafont', '3',128);
        this.countdownText.anchor.setTo(0.5);

        this.countdown = game.time.create(false);
        this.countdown.doodleBreakout = { value : 3};
        this.countdown.loop(1000, this.countdownUpdate, this);
        this.countdown.start();
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
            brick.kill();
            doodleBreakout.SoundManager.playSfx('break');

            if (this.bricks.total == 0) {
                //alert("Gewonnen");
                this.state.start('Game');
            }
        }, undefined, this);
    }
};