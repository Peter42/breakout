var doodleBreakout = doodleBreakout || {};

doodleBreakout.AutoGame = function (game) {};

doodleBreakout.AutoGame.prototype = Object.create(doodleBreakout.Game.prototype);
doodleBreakout.AutoGame.prototype.constructor = doodleBreakout.AutoGame;

doodleBreakout.AutoGame.prototype.create = function() {
    doodleBreakout.Game.prototype.create.call(this);
};

doodleBreakout.AutoGame.prototype.update = function() {
    doodleBreakout.Game.prototype.update.call(this);

    this.plattform.releaseBall();

    // Stop platform, this may have been set by earlier calls of "update"
    this.plattform.moveRight = false;
    this.plattform.moveLeft = false;

    // allowed deviation from the center of the platform to the desiganted x possition
    // (because the platform has some width ;) )
    var width = this.plattform.width / 4;

    //var ball = undefined;
    var urgency = Infinity;

    var targetX = this.plattform.x;

    // for every ball
    for( var i = this.ball.children.length - 1; i >= 0; --i) {
        var currentBall = this.ball.children[i];

        /*
         * Calculate the balls x position when it reaches the platforms y position
         */

        // Platform y position
        var py = this.plattform.y;
        // Ball x and y position
        var by = currentBall.y;
        var bx = currentBall.x;
        // Velocity of the ball (in x and y)
        var vy = currentBall.body.velocity.y;
        var vx = currentBall.body.velocity.x;

        var currentUrgency = Infinity;// = (by + (faktor * vy)) - py;
        //currentUrgency *= -1;

        // Distance form ball to platform
        var d = py - by;

        // time till ball reaches platform (distance divided by velocity y)
        var t = d / vy;

        // target x position (time till ball reaches platform multiplied by velocity x + current x)
        var tx = t * vx + bx;

        // "normalize" the balls target position (because it could possibly hit a wall)
        var n = Math.ceil(Math.abs( tx / this.game.width ));
        var ctx = Math.abs(tx % this.game.width);
        if( vy > 0 && n % 2 == 0 ) {
            ctx = this.game.width - ctx;
        }

        /*
         * Calculation finished
         */

        if( t > 0 ) {
            currentUrgency = t;
        }

        if(currentUrgency < urgency) {
            urgency = currentUrgency;
            targetX = ctx;
        }
    }

    // if urgency of the most urgent ball (time till it passes the platform) is below the threshold
    // we don't try to catch gimmiks
    if (urgency > 0.4) {

        // find all falling gimmicks
        var gimmicks = this.fallingGimmiks.children.filter(function(gimmick){
            return gimmick.body != null && gimmick.alive;
        });

        // find the closest one
        var gimmick = gimmicks.reduce(function(a,b){
            return a.y > b.y ? a : b;
        }, {y: -Infinity});

        if( gimmick.y > 0 ){
            var t = (this.plattform.y - gimmick.y) / gimmick.body.velocity.y;
            if(urgency - t > 0.4) {
                targetX = gimmick.x;
            }
        }

    }

    //

    if(targetX > this.plattform.x + width) {
        this.plattform.moveRight = true;
        this.plattform.moveLeft = false;
    }
    else if(targetX < this.plattform.x - width) {
        this.plattform.moveLeft = true;
        this.plattform.moveRight = false;
    }
};

doodleBreakout.Game.prototype.lostGame = function () {

    var oParameters = {
        level: doodleBreakout.LevelManager.getLevelIds()[0]
    };

    this._lives = 3;
    this._score = 0;
    this.state.start(this.game.state.current, true, false, oParameters);
};
