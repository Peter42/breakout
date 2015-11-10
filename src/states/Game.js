var doodleBreakout = doodleBreakout || {};

doodleBreakout.Game = function (game) {

};

doodleBreakout.Game.prototype = Object.create(doodleBreakout.AbstractSoundSettings.prototype);

doodleBreakout.Game.prototype.constructor = doodleBreakout.Game;

doodleBreakout.Game.prototype._level = 1;
doodleBreakout.Game.prototype._score = 0;
doodleBreakout.Game.prototype._lives = 3;
doodleBreakout.Game.prototype._rotationActive = false;
doodleBreakout.Game.prototype.doodlebreakoutIsPaused = false;

doodleBreakout.Game.prototype.eastereggon = false;

doodleBreakout.Game.prototype.init = function (args) {
    if (args && args.level) {
        this._level = args.level;
    }
};

doodleBreakout.Game.prototype.create = function () {
    var game = this.game;

    this.doodlebreakoutIsPaused = false;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;

    this._scoreText = game.add.bitmapText(this.game.width - 10, 10, 'larafont', this._score + "", 48);
    this._scoreText.anchor.setTo(1, 0);

    this.timer = game.time.create(false);
    this.timer.loop(1000, function () {
        this.updateTimerText(Math.floor(this.timer.seconds));
    }, this);
    this.timer.start();
    this.timertext = game.add.bitmapText(this.world.centerX, 10, 'larafont', "0:00", 48);
    this.timertext.anchor.setTo(0.5, 0);


    this.easteregg = game.input.keyboard.addKey(Phaser.Keyboard.E);
    this.easteregg.onDown.add(this.toggleEasteregg, this);


    this.pauseIcon = game.add.button( this.game.width, this.game.height, 'icon_pause', this.pauseGame, this );
    this.pauseIcon.x -= this.pauseIcon.width + 5;
    this.pauseIcon.y -= this.pauseIcon.height + 5;


    this.pause = game.input.keyboard.addKey(Phaser.Keyboard.P);
    this.pause.onDown.add(this.pauseGame, this);

    this.lives = new doodleBreakout.Lives(game, 10, 10, this._lives);
    game.add.existing(this.lives);

    this.plattform = new doodleBreakout.Plattform(game, 550, 550);
    game.add.existing(this.plattform);

    this.ball = this.game.add.group();
    this.plattform.holdBall(this.addBall(300, 300));

    this.fallingGimmiks = new doodleBreakout.Gimmicks(game, this.lives, this.ball, this.plattform);
    game.add.existing(this.fallingGimmiks);

    this.level = doodleBreakout.LevelManager.getLevel(this._level);

    this.bricks = this.level.generateBricks(this.fallingGimmiks);
    game.add.existing(this.bricks);

    this.rotatorTimer = game.time.create(false);

    game.world.bringToTop(this.fallingGimmiks);
};

doodleBreakout.Game.prototype.updateTimerText = function (time) {
    if (time % 60 < 10) {
        time = Math.floor(time / 60) + ":0" + (time % 60);
    } else {
        time = Math.floor(time / 60) + ":" + (time % 60);
    }
    this.timertext.setText(time);
};

doodleBreakout.Game.prototype.earnPoints = function (ammount) {
    this._score += ammount;
    this._scoreText.setText(this._score + "");
};

doodleBreakout.Game.prototype.lostBall = function (ball) {
    if (this.ball.total <= 1) {
        this.lives.lose();
        this.fallingGimmiks.killMoving();

        if (this.lives.countLiving() <= 0) {
            this.lostGame();
        }
        else {
            this.plattform.resetPlattform();
            this.plattform.holdBall(this.addBall(300, 300));
        }
    }

    ball.kill();
    this.ball.remove(ball);
};

doodleBreakout.Game.prototype.lostGame = function () {

    var oParameters = {
        level: this._level,
        score: this._score,
        lives: this.lives.countLiving()
    };

    this._level = 1;
    this._lives = 3;
    this._score = 0;
    this.state.start('GameOver', true, false, oParameters);
};

doodleBreakout.Game.prototype.toggleEasteregg = function () {
    this.eastereggon = !this.eastereggon;
    this.fallingGimmiks.forEachAlive(function (gimmick) {
        gimmick.visible = this.eastereggon;
    }, this);
};

doodleBreakout.Game.prototype.update = function () {
    this.game.physics.arcade.collide(this.plattform, this.ball, function (plattform, ball) {
        var angle = this.game.physics.arcade.angleBetween(plattform, ball) + Math.PI / 2;

        var velocity = Math.sqrt(Math.pow(ball.body.velocity.x, 2) + Math.pow(ball.body.velocity.y, 2));
        velocity = Math.min(velocity, 800);

        doodleBreakout.SoundManager.playSfx('paddle');

        ball.body.velocity.set(velocity * Math.sin(angle), -velocity * Math.cos(angle));
    }, undefined, this);

    this.game.physics.arcade.collide(this.ball, this.bricks, this.collideBallBrick, this.overlapBallBrick, this);

    this.game.physics.arcade.collide(this.plattform, this.fallingGimmiks, function (plattform, gimmick) {
        gimmick.gathered();
    }, undefined, this);
};

doodleBreakout.Game.prototype.overlapBallBrick = function (ball, brick) {
    if (ball.isThunderball) {
        this.collideBallBrick(ball, brick);
        return false;
    }
    // collision happens
    return true;
};

doodleBreakout.Game.prototype.collideBallBrick = function (ball, brick) {
    if (brick.hit(ball)) {
        this.earnPoints(20);
    }


        if ( !this.bricks.children.find(function(block){ return block.destructionNeeded && block.alive; })) {

        doodleBreakout.ScoresManager.addBesttime("level_" + this._level, Math.floor(this.timer.seconds));
        this.timer.stop();

        if (this.game.levels < ( this._level + 1 )) {
            this.lostGame();
        }
        else {
            this._level = doodleBreakout.LevelManager.getNextLevelId(this._level);
            this._lives = this.lives.countLiving();
            this.state.start('Game');
        }
    }
};

doodleBreakout.Game.prototype.addBall = function (x, y) {
    var ball = new doodleBreakout.Ball(this.game, x, y);
    this.ball.add(ball);
    ball.events.onOutOfBounds.add(this.lostBall, this);
    return ball;
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
            this.state.start('Game');
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

doodleBreakout.Game.prototype.shutdown = function () {
    //reset rotation
    this.deactivateRotation();
    this.input.keyboard.removeKey(Phaser.Keyboard.E);
    this.input.keyboard.removeKey(Phaser.Keyboard.P);
    this.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
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