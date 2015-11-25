var doodleBreakout = doodleBreakout || {};

doodleBreakout.Lives = function ( game, x, y, amount ) {
    //  We call the Phaser.Sprite passing in the game reference
    Phaser.Group.call( this, game );

    this.x = x;
    this.y = y;

    for( var i = 0; i < amount; i++ ){
        this.addNew();
    }
};

doodleBreakout.Lives.prototype = Object.create(Phaser.Group.prototype);
doodleBreakout.Lives.prototype.constructor = doodleBreakout.Lives;

doodleBreakout.Lives.prototype.lose = function(){
    var live = this.getFirstAlive();
    if( live != null ){
        live.kill();
    }
};

doodleBreakout.Lives.prototype.addNew = function(){
    var live = new doodleBreakout.LiveSymbol( this.game, this.x + this.total * 40, this.y );
    this.addAt(live, 0);
};
