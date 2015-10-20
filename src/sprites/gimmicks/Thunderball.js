var doodleBreakout = doodleBreakout || {};

doodleBreakout.Thunderball = function ( game, x, y, ball ) {
    Phaser.Sprite.call(this, game, x, y, 'thunder');
    this._ball = ball;
    this.game = game;
};

doodleBreakout.Thunderball.prototype = Object.create(doodleBreakout.Gimmick.prototype);
doodleBreakout.Thunderball.prototype.constructor = doodleBreakout.Thunderball;

doodleBreakout.Thunderball.prototype.collected = function(){
    this.kill();

    this._ball.forEachAlive( function( ball ){
        ball.activateThunderpower( 6500 );
    }, this._ball );
};