var doodleBreakout = doodleBreakout || {};

doodleBreakout.Minus = function ( game, x, y, plattform ) {
    Phaser.Sprite.call(this, game, x, y, 'minus');
    this.plattform = plattform;
};

doodleBreakout.Minus.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Minus.prototype.constructor = doodleBreakout.Minus;

doodleBreakout.Minus.prototype.collected = function(){
    //earn Bonus Points for each collected Minus
    if( this.plattform.width > 40 ){
        this.game.state.states.Game.earnPoints(70);
        this.plattform.width -= 20;
    }

    this.kill();
};