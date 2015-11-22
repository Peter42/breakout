var doodleBreakout = doodleBreakout || {};

doodleBreakout.ComputerPlayer = function( game, plattform, lives ) {
    doodleBreakout.SinglePlayer.call( this, game, plattform, lives );
};

doodleBreakout.ComputerPlayer.prototype = Object.create( doodleBreakout.SinglePlayer.prototype );
doodleBreakout.ComputerPlayer.prototype.constructor = doodleBreakout.ComputerPlayer;

doodleBreakout.ComputerPlayer.prototype.interact = function( scope, gimmicks ){
    doodleBreakout.SinglePlayer.prototype.interact.call( this, scope );

    this.plattform.releaseBalls();

// Stop platform, this may have been set by earlier calls of "update"
    this.plattform.action.move1 = false;
    this.plattform.action.move2 = false;

// allowed deviation from the center of the platform to the desiganted x possition
// (because the platform has some width ;) )
    var width = this.plattform.width / 4;

//var ball = undefined;
    var urgency = Infinity;

    var targetX = this.plattform.x;

// for every ball
    for( var i = this.balls.children.length - 1; i >= 0; --i) {
        var currentBall = this.balls.children[i];

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
        gimmicks = gimmicks.children.filter(function(gimmick){
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


    if(targetX > this.plattform.x + width) {
        this.plattform.action.move2 = true;
        this.plattform.action.move1 = false;
    }
    else if(targetX < this.plattform.x - width) {
        this.plattform.action.move1 = true;
        this.plattform.action.move2 = false;
    }
};


