var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.AbstractMenu
 */
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
    this.paletteOffsetY = 15;
    this.paletteOffsetX = game.width/2;
    this.paletteArrow = null;

    this._coords = null;

    // Palette
    this._color = 0;
    this._paletteBricks = [];

    // Data
    this.levelId = null;
    this.data = null;
    this._dataBricks = null;

    this.savedLevel = true;

    this.drawMode = 0;
};

doodleBreakout.LevelDesigner.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.LevelDesigner.prototype.constructor = doodleBreakout.LevelDesigner;

/**
 *
 */
doodleBreakout.LevelDesigner.prototype.goBackHome = function (){
    if( ! this.savedLevel ){
        var group = this._showPopup( "Save changes" );
        var yes = this.game.add.bitmapText( 200, 200, 'larafont', 'Yes', 50 );
        yes.x = (this.game.width/6)*2 - (yes.width/2);
        yes.anchor.setTo(0, 0);
        yes.inputEnabled = true;
        yes.input.useHandCursor = true;
        yes.events.onInputDown.add( function(){
            this._saveLevel();
            if( !!this.levelId ){
                this._updateButtons();
                this._closePopup();
            }
        }, this );
        group.add( yes );

        var no = this.game.add.bitmapText( 200, 200, 'larafont', 'No', 50 );
        no.x = (this.game.width/6)*4 - (no.width/2);
        no.anchor.setTo(0, 0);
        no.inputEnabled = true;
        no.input.useHandCursor = true;
        no.events.onInputDown.add( function(){
            this._closePopup();
            this.state.start("MainMenu");
        }, this );
        group.add( no );
    }
    else {
        this.state.start("MainMenu");
    }
};

/**
 * @inheritdoc
 */
doodleBreakout.LevelDesigner.prototype.create = function() {
    this.createBackHome();

    // mouse events
    document.body.oncontextmenu = function() { return false; };
    this.game.input.mouse.capture = true;
    this.game.input.onDown.add(this._paint, this);
    this.game.input.addMoveCallback(this._paint, this);

    this.groupBricks = this.game.add.group();
    this.groupPalette = this.game.add.group();
    this.groupButtons = this.game.add.group();
    this.groupPopup = this.game.add.group();

    this._createUI();
    this._setColor( 1 );

    var saveLevelId = this.levelId;

    this._reset();

    if( saveLevelId ){
        this.levelId = saveLevelId;
        var levelData = doodleBreakout.LevelManager.getLevelData( this.levelId );
        this.data = levelData.structure;
    }

    this._refresh();
};

/**
 * @inheritdoc
 */
doodleBreakout.LevelDesigner.prototype.shutdown = function(){
    this._reset();
    this._refresh();
};


/**
 *
 * @private
 */
doodleBreakout.LevelDesigner.prototype._createUI = function() {
    var xPos = 75;
    var yPos = 15;
    var xSpace = 10;

    var buttonNew = this.game.add.button( xPos, yPos, "icon_new", this._newLevel, this);

    var iconRowHeight = buttonNew.height;

    xPos = buttonNew.x + buttonNew.width + xSpace;
    var buttonRandom = this.game.add.button( xPos, yPos, "icon_random", this._randomLevel, this );
    buttonRandom.y += (iconRowHeight - buttonRandom.height)/2;

    xPos =  buttonRandom.x + buttonRandom.width + xSpace;
    var buttonOpen = this.game.add.button( xPos, yPos, "icon_folder", this._openLevel, this );
    buttonOpen.y += (iconRowHeight - buttonOpen.height)/2;

    xPos =  buttonOpen.x + buttonOpen.width + xSpace;
    var buttonSave = this.game.add.button( xPos, yPos, "icon_save", this._saveLevel, this );
    buttonSave.y += (iconRowHeight - buttonSave.height)/2;

    xPos =  buttonSave.x + buttonSave.width + xSpace;
    var buttonDelete = this.game.add.button( xPos, yPos, "icon_trash", this._deleteLevel, this );
    buttonDelete.y += (iconRowHeight - buttonDelete.height)/2;

    this.buttonDelete = buttonDelete;

    this.groupButtons.add( buttonNew );
    this.groupButtons.add( buttonRandom );
    this.groupButtons.add( buttonOpen );
    this.groupButtons.add( buttonSave );
    this.groupButtons.add( buttonDelete );

    this._updateButtons();

    this._drawModeText = this.game.add.bitmapText( 225, 75, 'larafont', this.getLevelDescriptorText( this.drawMode ), 25 );
    this._drawModeText.inputEnabled = true;
    this._drawModeText.input.useHandCursor = true;
    this._drawModeText.events.onInputDown.add( function(){
        this.setDrawMode( ++this.drawMode );
    }, this );

    this._coords = this.game.add.text( 75, 70, "X: 1\tY: 1", { font: "20px Courier", fill: "#000", tabs: 80 } );

    this._drawPalette();

    this.game.create.grid( 'drawingGrid', this._drawAreaWidth, this._drawAreaHeight+1, this.blockWidth, this.blockHeight, 'rgb(50,50,100)');
    this.game.add.sprite( this.offsetX , this.offsetY , 'drawingGrid');
};


/**
 *
 * @param drawMode
 * @returns {string}
 */
doodleBreakout.LevelDesigner.prototype.getLevelDescriptorText = function ( drawMode ) {
    var result = "";
    switch ( drawMode ){
        case 0:
            result = "Single";
            break;
        case 1:
            result = "Both";
            break;
        case 2:
            result = "Multi";
            break;
        default:
            result = "Single";
    }
    return result;
};

/**
 *
 * @param mode
 */
doodleBreakout.LevelDesigner.prototype.setDrawMode = function ( mode ) {
    if( mode > 2 || ! mode ){
        mode = 0;
    }
    this._drawModeText.setText( this.getLevelDescriptorText( mode ) );
    this.drawMode = mode;
};


/**
 *
 * @returns {boolean}
 * @private
 */
doodleBreakout.LevelDesigner.prototype._saveLevel = function(){
    if( !doodleBreakout.LevelManager.validateStructure( this.data ) ){
        this._showPopup( "Can not save empty level" );
        return false;
    }

    if( this.levelId ){
        doodleBreakout.LevelManager.editLevel( this.levelId, {
            structure: this.data,
            multiplayer: this.drawMode
        }, true );

        this.savedLevel = true;
        this._updateButtons();

        return true;
    }

    var group = this._showPopup( "Saved" );

    var levelText = this.game.add.bitmapText( 200, 200, 'larafont', 'Ok', 50 );
    levelText.x = (this.game.width/2) - (levelText.width/2);
    levelText.anchor.setTo(0, 0);
    levelText.inputEnabled = true;
    levelText.input.useHandCursor = true;
    levelText.events.onInputDown.add( function(){
        this.levelId = doodleBreakout.LevelManager.addLevel( {
            structure: this.data,
            multiplayer: this.drawMode
        }, true );
        this._updateButtons();
        this._closePopup();
    }, this );

    group.add( levelText );

    this.savedLevel = true;
    this._updateButtons();

    return true;
};


/**
 *
 * @private
 */
doodleBreakout.LevelDesigner.prototype._newLevel = function(){
    if( ! this.savedLevel ){
        var group = this._showPopup( "Save changes" );
        var yes = this.game.add.bitmapText( 200, 200, 'larafont', 'Yes', 50 );
        yes.x = (this.game.width/6)*2 - (yes.width/2);
        yes.anchor.setTo(0, 0);
        yes.inputEnabled = true;
        yes.input.useHandCursor = true;
        yes.events.onInputDown.add( function(){
            this._saveLevel();
            if( !!this.levelId ){
                this._updateButtons();
                this._closePopup();
            }
        }, this );
        group.add( yes );

        var no = this.game.add.bitmapText( 200, 200, 'larafont', 'No', 50 );
        no.x = (this.game.width/6)*4 - (no.width/2);
        no.anchor.setTo(0, 0);
        no.inputEnabled = true;
        no.input.useHandCursor = true;
        no.events.onInputDown.add( function(){
            this.savedLevel = true;
            this._reset();
            this._refresh();
            this._updateButtons();
            this._closePopup();
        }, this );
        group.add( no );
    }
    else {
        this._reset();
        this._refresh();
        this._updateButtons();
    }
};


/**
 *
 * @returns {boolean}
 * @private
 */
doodleBreakout.LevelDesigner.prototype._deleteLevel = function(){
    if( ! this.levelId ){
        return false;
    }

    var group = this._showPopup( "Delete this level" );

    var levelText = this.game.add.bitmapText( 200, 200, 'larafont', 'Yes', 50 );
    levelText.x = (this.game.width/2) - (levelText.width/2);
    levelText.anchor.setTo(0, 0);
    levelText.inputEnabled = true;
    levelText.input.useHandCursor = true;
    levelText.events.onInputDown.add( function(){
        doodleBreakout.LevelManager.removeLevel( this.levelId );
        this._reset();
        this._refresh();
        this._updateButtons();
        this._closePopup();
    }, this );

    group.add( levelText );
};


/**
 *
 * @private
 */
doodleBreakout.LevelDesigner.prototype._openLevel = function(){
    var group = this._showPopup( "Select level" );

    var levels = doodleBreakout.LevelManager.getAlterableLevelIds();

    var levelAmount = levels.length;

    var xPos = 75;
    var yPos = 75;

    for( var i = 0; i < levelAmount; i++ ){
        var levelData = doodleBreakout.LevelManager.getLevelData( levels[ i ] );

        var levelText = this.game.add.bitmapText( xPos, yPos, 'larafont', this.getLevelDescriptorText( levelData.multiplayer ) + i, 30 );
        levelText.anchor.setTo(0, 0);
        levelText.inputEnabled = true;
        levelText.input.useHandCursor = true;
        levelText.events.onInputDown.add( function( text, pointer, levelData ){
            this._reset();

            this.data = levelData.structure;
            this.levelId = levelData.id;
            this.setDrawMode( levelData.multiplayer );

            this._updateButtons();
            this._refresh();
            this._closePopup();
        }, this, null, levelData );

        xPos += levelText.width + 25;

        if( xPos > this.game.width - 100 ){
            xPos = 75;
            yPos += levelText.height + 20;
        }

        group.add( levelText );
    }
};


/**
 *
 * @private
 */
doodleBreakout.LevelDesigner.prototype._updateButtons = function(){
    this.buttonDelete.visible = !!this.levelId;
};


/**
 *
 * @param titleText
 * @returns {*|Phaser.Group}
 * @private
 */
doodleBreakout.LevelDesigner.prototype._showPopup = function( titleText ){
    this.groupPopup.removeAll( true );

    this.game.input.reset( true );

    this.groupButtons.forEach( function( button ){
        button.input.enabled = false;
    }, this );

    this.groupPalette.forEach( function( palette ){
        palette.input.enabled = false;
    }, this );

    var overlay = this.game.add.sprite( 0, 0, 'pause' );
    overlay.width = this.game.width;
    overlay.height = this.game.height;

    var back = this.game.add.bitmapText( 20, 10, 'larafont', '<', 48 );
    back.anchor.setTo(0, 0);
    back.inputEnabled = true;
    back.events.onInputDown.add( this._closePopup, this);

    var title = this.game.add.bitmapText( 50, 10, 'larafont', titleText, 48 );
    title.x = (this.game.width/2) - (title.width/2);

    this.groupPopup.add( overlay );
    this.groupPopup.add( back );
    this.groupPopup.add( title );

    this.game.world.bringToTop( this.groupPopup );
    return this.groupPopup;
};

doodleBreakout.LevelDesigner.prototype._closePopup = function(){
    this.groupPopup.removeAll( true );

    this._addMouseListener();

    this.groupButtons.forEach( function( button ){
        button.input.enabled = true;
    }, this );

    this.groupPalette.forEach( function( palette ){
        palette.input.enabled = true;
    }, this );
};


/**
 *
 * @private
 */
doodleBreakout.LevelDesigner.prototype._addMouseListener = function(){
    this.game.input.mouse.capture = true;
    this.game.input.onDown.add(this._paint, this);
    this.game.input.addMoveCallback(this._paint, this);
};


/**
 *
 * @private
 */
doodleBreakout.LevelDesigner.prototype._randomLevel = function(){
    var saveId = this.levelId;
    this._reset();
    this.levelId = saveId;
    this.savedLevel = false;

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
    this.levelId = null;

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
    var iPaletteRows = parseInt( this.paletteOffsetY - this.offsetY / this.blockWidth );

    var iBrickType = 1;
    try {
        for( var iRow = 0; iRow < iPaletteRows; iRow++ ){
            for( var iCol = 0; iCol < iPaletteCols; iCol++ ){
                var brick = this._drawBrick( iBrickType, this.paletteOffsetX + iCol*this.blockWidth, this.paletteOffsetY+iRow*this.blockHeight );
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
        this.savedLevel = false;
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

        this.savedLevel = false;

        this.data[iCoordY][iCoordX] = this._color;

        var oBrickPosition = this._getBrickPosition( iCoordX, iCoordY );

        var oBrick = this._drawBrick( this.data[iCoordY][iCoordX] ,oBrickPosition.x, oBrickPosition.y );
        this._dataBricks[iCoordY][iCoordX] = oBrick;
        this.groupBricks.add( oBrick );
    }
};