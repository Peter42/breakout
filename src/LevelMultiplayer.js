var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @param {Phaser.game} game - The current game.
 * @param {number} levelNumber - The number of the level to load.
 */
doodleBreakout.LevelMultiplayer = function ( game, structure, id, probability ) {
    this.game = game;
    this._structure = structure;
    this._id = id;
    this._probability = probability;
};

doodleBreakout.LevelMultiplayer.prototype.constructor = doodleBreakout.Level;

/**
 *
 * @type {number}
 */
doodleBreakout.LevelMultiplayer.offsetY = 50;
/**
 *
 * @type {number}
 */
doodleBreakout.LevelMultiplayer.offsetX = 0;

/**
 *
 * @param gimmicks
 * @returns {Phaser.Group}
 */
doodleBreakout.LevelMultiplayer.prototype.generateBricks = function( gimmicks ){
        gimmicks.setCustomProbability( this._probability );

        var bricks = new Phaser.Group( this.game );

        for ( var x = this.game.width/2 + (16/2), i= 0; (i < this._structure.length) && (x<this.game.width); x += 16, i++ ) {
            for (var y = doodleBreakout.LevelMultiplayer.offsetY + (50/2), j = 0; (j < this._structure[ i].length ) && (y <= this.game.height); y += 50, j++ ) {
                if( this._structure[i][j] ) {

                    var gimmickLeft = gimmicks.randomGimmick( (this.game.width/2 + (16/2))-(i+1)*16, y );
                    var gimmickRight = null;

                    if( gimmickLeft ){
                        gimmickRight = new gimmickLeft.constructor( this.game, x, y );
                        gimmicks.add( gimmickRight );
                    }

                    var brickLeft = doodleBreakout.BlockFactory.get( this._structure[i][j], this.game, (this.game.width/2 + (16/2))-(i+1)*16, y );
                    brickLeft.setGimmik( gimmickLeft );
                    brickLeft.rotation = Math.PI/2;
                    brickLeft.anchor.setTo( 0.5, 0.5 );
                    brickLeft.body.height = 50;
                    brickLeft.body.width = 16;
                    brickLeft.body.offset.x = 16;
                    brickLeft.body.offset.y = -16;

                    var brickRight = doodleBreakout.BlockFactory.get( this._structure[i][j], this.game, x, y );
                    brickRight.setGimmik( gimmickRight );
                    brickRight.rotation = Math.PI/2;
                    brickRight.anchor.setTo( 0.5, 0.5 );
                    brickRight.body.height = 50;
                    brickRight.body.width = 16;
                    brickRight.body.offset.x = 16;
                    brickRight.body.offset.y = -16;

                    bricks.add( brickRight );
                    bricks.add( brickLeft );
                }
            }
        }

        return bricks;
};
