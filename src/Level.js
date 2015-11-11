var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @param {Phaser.game} game - The current game.
 * @param {number} levelNumber - The number of the level to load.
 */
doodleBreakout.Level = function ( game, structure, id, probability ) {
    this.game = game;
    this._structure = structure;
    this._id = id;
    this._probability = probability;
};

/**
 * Returns the structure of the level
 */
doodleBreakout.Level.prototype.constructor = doodleBreakout.Level;

doodleBreakout.Level.offsetY = 100;
doodleBreakout.Level.offsetX = 0;

doodleBreakout.Level.prototype.generateBricks = function( gimmicks ){
        gimmicks.setCustomProbability( this._probability );

        var bricks = new Phaser.Group( this.game );

        for ( var y = doodleBreakout.Level.offsetY, i= 0; (i < this._structure.length) && (y<this.game.height); y += 17, i++ ) {
            for (var x = doodleBreakout.Level.offsetX, j = 0; (j < this._structure[ i].length) && (x <= this.game.width - 50); x += 50, j++ ) {
                if( this._structure[i][j] ) {
                    var gimmick = gimmicks.randomGimmick( x, y );
                    var brick = doodleBreakout.BlockFactory.get( this._structure[i][j], this.game, x, y );
                    brick.setGimmik(gimmick);
                    bricks.add( brick );
                }
            }
        }

        return bricks;
};
