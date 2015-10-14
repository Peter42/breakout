var doodleBreakout = doodleBreakout || {};

doodleBreakout.Lives = function ( game, x, y, amount ) {

    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Group.call( this, game );

    for( var i = 0; i < amount; i++ ){
        this.add( new doodleBreakout.Live( game, x + (i*40), y ) );
    }
    this.reverse();
};

doodleBreakout.Lives.prototype = Object.create(Phaser.Group.prototype);
doodleBreakout.Lives.prototype.constructor = doodleBreakout.Lives;

doodleBreakout.Lives.prototype.lose = function(){
    var live = this.getFirstAlive();
    if( live != null ){
        live.kill();
    }
};
