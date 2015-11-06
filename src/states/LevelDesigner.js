var doodleBreakout = doodleBreakout || {};

doodleBreakout.LevelDesigner = function( game ){
    // size parameters
    this.blockWidth = 50;
    this.blockHeight = 16;

    this.offsetX = doodleBreakout.Level.offsetX;
    this.offsetY = doodleBreakout.Level.offsetY;

    this.iDrawAreaHeight = game.height - this.offsetY;
    this.iDrawAreaWidth = game.width - this.offsetX;

    this._amountRows = parseInt( this.iDrawAreaHeight / this.blockHeight );
    this._amountCols = parseInt( this.iDrawAreaWidth / this.blockWidth );

    this._drawAreaWidth = this._amountCols * this.blockWidth;
    this._drawAreaHeight = this._amountRows * this.blockHeight;

    // Palette position
    this.paletteOffsetX = game.width/2;
    this.paletteArrow = null;

    this._coords = null;

    // Palette
    this._color = 0;
    this._paletteBricks = [];

    // Data
    this.data = null;
    this._dataBricks = null;
};

doodleBreakout.LevelDesigner.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.LevelDesigner.prototype.constructor = doodleBreakout.LevelDesigner;

doodleBreakout.LevelDesigner.prototype.create = function() {
    this.createBackHome();

    // mouse events
    document.body.oncontextmenu = function() { return false; };
    this.game.input.mouse.capture = true;
    this.game.input.onDown.add(this._paint, this);
    this.game.input.addMoveCallback(this._paint, this);

    this.groupBricks = this.game.add.group();
    this.groupPalette = this.game.add.group();

    this._createUI();
    this._setColor( 1 );
    this._reset();
};


doodleBreakout.LevelDesigner.prototype._createUI = function() {
    var saveTexture = this.game.create.texture('save', [
        'DDDDDDDDDD',
        'DED1111DED',
        'DED1111DDD',
        'DEDDDDDDED',
        'DEEEEEEEED',
        'DEFFFFFFED',
        'DEFFFFFFED',
        'DEFFFFFFED',
        'DEFFFFFFED',
        'DDDDDDDDDD'
    ], 4);

    var folderTexture = this.game.create.texture('folder', [
        '...........',
        '77777777777',
        '72222227887',
        '77777777887',
        '78888888887',
        '78888888887',
        '78888888887',
        '78888888887',
        '78888888887',
        '77777777777'
    ], 4);

    var sheetTexture = this.game.create.texture('sheet', [
        '99999999.',
        '922222299',
        '922222229',
        '922222229',
        '922222229',
        '922222229',
        '922222229',
        '922222229',
        '922222229',
        '999999999'
    ], 4);

    var trashTexture = this.game.create.texture('trash', [
        '...000...',
        '...0.0...',
        '000000000',
        '.0.0.0.0.',
        '.0.0.0.0.',
        '.0.0.0.0.',
        '.0.0.0.0.',
        '.0.0.0.0.',
        '.0.0.0.0.',
        '.0000000.'
    ], 4);

    var runTexture = this.game.create.texture('run', [
        'AA....',
        'ABA...',
        'ABBA..',
        'ABBBA.',
        'ABBBBA',
        'ABBBBA',
        'ABBBA.',
        'ABBA..',
        'ABA...',
        'AA....'
    ], 4);

    var randomTexture = this.game.create.texture('random', [
        '33333',
        '34443',
        '34243',
        '34443',
        '33333',
        '33333',
        '32423',
        '34243',
        '32423',
        '33333'
    ], 4);

    var xPos = 75;
    var yPos = 15;
    var xSpace = 10;
    xPos += this.game.add.button( xPos, yPos, sheetTexture, this._newLevel, this).width + xSpace;
    xPos += this.game.add.button( xPos, yPos, randomTexture, this._randomLevel, this ).width + xSpace;
    xPos += this.game.add.button( xPos, yPos, folderTexture, this._openLevel, this ).width + xSpace;
    xPos += this.game.add.button( xPos, yPos, saveTexture, this._saveLevel, this ).width + xSpace;
    xPos += this.game.add.button( xPos, yPos, runTexture, this._playLevel, this ).width + xSpace;
    this.game.add.button( xPos, yPos, trashTexture, this._deleteLevel, this );

    this._coords = this.game.add.text( 75, 70, "X: 1\tY: 1", { font: "20px Courier", fill: "#000", tabs: 80 } );

    this._drawPalette();

    this.game.create.grid( 'drawingGrid', this._drawAreaWidth, this._drawAreaHeight+1, this.blockWidth, this.blockHeight, 'rgb(50,50,100)');
    this.game.add.sprite( this.offsetX , this.offsetY , 'drawingGrid');
};


doodleBreakout.LevelDesigner.prototype._saveLevel = function(){
    var guid = (function () {
        var r = function(){
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (r() + r() + "-" + r() + "-4" + r().substr(0, 3) + "-" + r() + "-" + r() + r() + r()).toLowerCase();
    })();


    levels[ guid ] = {
        id: guid,
        structure: this.data
    };

    // TODO: save to local storage

    return guid;
};


doodleBreakout.LevelDesigner.prototype._playLevel = function(){
    var id = this._saveLevel();
    // TODO: start game
};


doodleBreakout.LevelDesigner.prototype._newLevel = function(){
    this._reset();
    this._refresh();
};


doodleBreakout.LevelDesigner.prototype._deleteLevel = function(){
    // TODO: delete selected level
    this._reset();
    this._refresh();
};


doodleBreakout.LevelDesigner.prototype._openLevel = function(){
    // TODO: open from local storage
};


doodleBreakout.LevelDesigner.prototype._randomLevel = function(){
    // TODO: optimize random level generation
    this._reset();

    var rnd = function( a, b ){
        return Math.floor((Math.random() * b) + a);
    };

    var oGimmicks = new doodleBreakout.Gimmicks( this.game, null, null, null );

    var probability = [ rnd(1,3), rnd(7,15), rnd(3,8), rnd(1,3), rnd(1,3), rnd(1,3) ];
    
    var iRandomStop = rnd( 10, 15);

    for( var y = 0; y < this._amountRows; y++ ){
        if( y > 15 ){
            continue;
        }
        for( var x = 0; x < this._amountCols; x++ ){
            if( y > iRandomStop ){
                probability = [ rnd(40,70), rnd(7,15), rnd(3,8), rnd(1,3), rnd(1,3), rnd(1,3) ];
            }
            else {
                if( x >= 1 && this.data[y][x-1] == 0 ){
                    probability = [ 50, rnd(1,3), 0, 0, 0, 0 ];
                }
                else if( x >= 1 && this.data[y][x-1] == 4 ){
                    probability = [ 1, 40, 1, 1, 100, 1 ];
                }
                else {
                    probability = [ rnd(1,3), rnd(7,15), rnd(3,8), rnd(1,3), rnd(1,3), rnd(1,3) ];
                }
            }


            this.data[y][x] = parseInt( oGimmicks.probabilityCalculation( probability ) );
        }
    }

    this._refresh();
};


/**
 * Reset the draw-grid content
 */
doodleBreakout.LevelDesigner.prototype._reset = function() {
    this.groupBricks.removeAll( true );
    this.data = [];
    this._dataBricks = [];
    for ( var y = 0; y < this._amountRows; y++ ){
        var a = [];
        var b = [];
        for ( var x = 0; x < this._amountCols; x++ ){
            b.push( null );
            a.push( 0 );
        }
        this.data.push( a );
        this._dataBricks.push( b );
    }
};


/**
 * Refresh the draw-grid content
 */
doodleBreakout.LevelDesigner.prototype._refresh = function() {
    this.groupBricks.removeAll( true );

    for ( var yCoord = 0; yCoord < this._amountRows; yCoord++ ){
        for ( var xCoord = 0; xCoord < this._amountCols; xCoord++ ){
            var iBrickType = this.data[yCoord][xCoord];
            if ( iBrickType != 0 ) {
                var oPosition = this._getBrickPosition( xCoord, yCoord );
                var brick = this._drawBrick( iBrickType, oPosition.x, oPosition.y );
                this._dataBricks[yCoord][xCoord] = brick;
                this.groupBricks.add( brick );
            }
        }
    }
};


/**
 * Draw the palette where you can choose the brick type
 */
doodleBreakout.LevelDesigner.prototype._drawPalette = function() {
    var iPaletteCols = parseInt( ( this.game.width - this.paletteOffsetX ) / this.blockWidth );
    var iPaletteRows = parseInt( this.offsetY / this.blockWidth );

    var iBrickType = 1;
    try {
        for( var iRow = 0; iRow < iPaletteRows; iRow++ ){
            for( var iCol = 0; iCol < iPaletteCols; iCol++ ){
                var brick = this._drawBrick( iBrickType, this.paletteOffsetX + iCol*this.blockWidth, iRow*this.blockHeight );
                brick.inputEnabled = true;
                brick.input.useHandCursor = true;
                brick.events.onInputDown.add( function( brick, pointer, type ){
                    this._setColor( type );
                }, this, null, iBrickType);

                this._paletteBricks.push( brick );

                this.groupPalette.add( brick );

                iBrickType++;
            }
        }
    }
    catch ( e ){}


    var arrowTexture = this.game.create.texture('arrow', [
        '  00  ',
        ' 0000 ',
        '000000',
        ' 0000 ',
        '  00  '
    ], 2);

    this.paletteArrow = this.game.add.sprite( 0, 0, 'arrow');
};

/**
 * Set the Brick type and move the marker
 * @param {number} color - The Brick type
 */
doodleBreakout.LevelDesigner.prototype._setColor = function( color ){
    if( color == 0 ){
        throw "Color 0 is not allowed!";
    }

    this._color = color;

    var oBrick = this._paletteBricks[ color-1 ];

    this.paletteArrow.x = oBrick.x + (oBrick.width/2) - (this.paletteArrow.width/2);
    this.paletteArrow.y = oBrick.y + (oBrick.height/2) - (this.paletteArrow.height/2);
};


/**
 * Refresh the draw-grid content
 * @param {number} type - The Brick type
 * @param {number} xPos - The x position of the Brick
 * @param {number} yPos - The y position of the Brick
 */
doodleBreakout.LevelDesigner.prototype._drawBrick= function( type, xPos, yPos ){
    var brick = doodleBreakout.BlockFactory.get( type, this.game, xPos, yPos );
    if( type == 4 ){
        brick.frame = 1;
    }
    this.game.add.existing( brick );
    return brick;
};


/**
 *
 * @param {number} xCoord - The x coordinate of the grid
 * @param {number} yCoord - The y coordinate if the grid
 * @returns {object}
 */
doodleBreakout.LevelDesigner.prototype._getBrickPosition = function( xCoord, yCoord ){
    return {
        x: ( xCoord * this.blockWidth ) + this.offsetX,
        y: ( yCoord * this.blockHeight ) + this.offsetY
    };
};


doodleBreakout.LevelDesigner.prototype._paint = function( oPointer ) {
    var iCoordX = Math.floor( ( oPointer.x - this.offsetX ) / this.blockWidth );
    var iCoordY = Math.floor( ( oPointer.y - this.offsetY ) / this.blockHeight );

    if( iCoordX < 0 || iCoordX >= this._amountCols || iCoordY < 0 || iCoordY >= this._amountRows ){
        return;
    }

    this._coords.text = "X: " + (iCoordX+1) + "\tY: " + (iCoordY+1);

    if( ! oPointer.isDown ){
        return;
    }

    if( oPointer.rightButton.isDown ){
        this.data[iCoordY][iCoordX] = 0;
        if( this._dataBricks[iCoordY][iCoordX] !==  null ){
            this._dataBricks[iCoordY][iCoordX].destroy();
        }
    }
    else {
        if( this.data[iCoordY][iCoordX] == this._color ){
            return;
        }

        if( this._dataBricks[iCoordY][iCoordX] !== null ){
            this._dataBricks[iCoordY][iCoordX].destroy();
        }

        this.data[iCoordY][iCoordX] = this._color;

        var oBrickPosition = this._getBrickPosition( iCoordX, iCoordY );

        var oBrick = this._drawBrick( this.data[iCoordY][iCoordX] ,oBrickPosition.x, oBrickPosition.y );
        this._dataBricks[iCoordY][iCoordX] = oBrick;
        this.groupBricks.add( oBrick );
    }
};