var doodleBreakout = doodleBreakout || {};

doodleBreakout.LevelSelection = function( game ){

};

doodleBreakout.LevelSelection.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.LevelSelection.prototype.constructor = doodleBreakout.LevelSelection;

doodleBreakout.LevelSelection.prototype._tileTint = 0xFFFFFF;
doodleBreakout.LevelSelection.prototype._titleText = '';
doodleBreakout.LevelSelection.prototype._targetState = '';
doodleBreakout.LevelSelection.prototype._pages = 0;
doodleBreakout.LevelSelection.prototype._currentPage = -1;
doodleBreakout.LevelSelection.prototype._items = [];
doodleBreakout.LevelSelection.prototype._isComputerPlayerActive = false;


doodleBreakout.LevelSelection.prototype.init = function(gameMode){
    switch(gameMode){
        case 'singlePlayer':
            this._tileTint = 0x0080FF;
            this._titleText = 'Single Player';
            this._targetState = 'Game';
            break;
        case 'multiPlayer':
            this._tileTint = 0xFF4500;
            this._titleText = 'Multi-Player';
            this._targetState = 'GameMultiplayer';
            break;
        case 'computer':
            this._tileTint = 0x80FF00;
            this._titleText = 'Computer Mode';
            this._targetState = 'GameComputer';
            break;
    }
};


doodleBreakout.LevelSelection.prototype.create = function(){
    this.createBackHome();

    var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', this._titleText, 64);
    title.anchor.setTo(0.5, 0);

    var multiplayer = false;

    if (this._titleText == 'Multi-Player'){
        //Computer vs Player Switch
        var recordingText = this.game.add.bitmapText(this.game.width / 2 + 50, 80, 'larafont', 'Player vs. Computer', 42);
        recordingText.anchor.setTo(0.7, 0);
        this.computerPlayerSwitch = this.game.add.sprite(this.game.width / 2 + 200, 80, 'recording');
        if(this._isComputerPlayerActive){
            this.computerPlayerSwitch.frame = 1;
        } else {
            this.computerPlayerSwitch.frame = 0;
        }
        this.computerPlayerSwitch.inputEnabled = true;
        this.computerPlayerSwitch.events.onInputDown.add(this.toggleComputerPlayer, this);
        multiplayer = true;
    }

    var levelIds = doodleBreakout.LevelManager.getLevelIds( multiplayer );

    this._pages = Math.ceil(levelIds.length/12);
    this._items = [];

    for(var i = 0; i < levelIds.length; ++i) {
        var x = 160 * (i % 4) + 170;
        var y = 150 * (Math.floor( (i % 12) / 4) + 1) + 60;

        var text = (i + 1) + "";
        var besttime = doodleBreakout.ScoresManager.getBesttimes()[levelIds[i]];

        var tile = this.game.add.sprite(x,y, 'tile');
        tile.anchor.setTo(0.5, 0.5);
        tile.tint = this._tileTint;

        var item = this.game.add.bitmapText(x, y, 'larafont', text, 60);
        item.anchor.setTo(0.5, 0.5);

        tile.inputEnabled = true;

        tile.doodleBreakout = {
            'targetLevel' : levelIds[i]
        };

        tile.events.onInputDown.add(this.startLevel, this);
        tile.events.onInputOver.add(this.over, this);
        tile.events.onInputOut.add(this.out, this);

        var besttimeitem = undefined;
        if(besttime && this._targetState == "Game"){
            if(besttime % 60 < 10) {
                besttime = Math.floor(besttime / 60) + ":0" + (besttime % 60);
            } else {
                besttime = Math.floor(besttime / 60) + ":" + (besttime % 60);
            }

            besttimeitem = this.game.add.bitmapText(x, y + 45, 'larafont', besttime, 36);
            besttimeitem.anchor.setTo(0.5, 0.5);
        }

        this._items.push([ tile, item, besttimeitem ]);

    }

    this._goLeft = this.game.add.bitmapText(45,340, 'larafont', "<", 60);
    this._goLeft.anchor.setTo(0.5);
    this._goRight = this.game.add.bitmapText(this.world.width - 45,340, 'larafont', "<", 60);
    this._goRight.anchor.setTo(0.5);
    this._goRight.rotation = Math.PI;

    this._goRight.inputEnabled = true;
    this._goRight.events.onInputDown.add(this.nextPage, this);
    this._goRight.events.onInputOver.add(this.over, this);
    this._goRight.events.onInputOut.add(this.out, this);

    this._goLeft.inputEnabled = true;
    this._goLeft.events.onInputDown.add(this.previousPage, this);
    this._goLeft.events.onInputOver.add(this.over, this);
    this._goLeft.events.onInputOut.add(this.out, this);

    this._setPage(0);
};

doodleBreakout.LevelSelection.prototype.startLevel = function( target ){
    this.state.start( this._targetState, true, false, {level: target.doodleBreakout.targetLevel,
                                                        computerPlayer: this._isComputerPlayerActive} );
};

doodleBreakout.LevelSelection.prototype._setPage = function(page){
    this._currentPage = page;

    for(var i = 0; i < this._items.length; ++i) {
        var items = this._items[i];
        var enabled = (Math.floor(i/12) === page);

        for(var j = 0; j < items.length; ++j) {
            if (items[j]) {
                items[j].visible = enabled;
            }
        }
    }

    this._goLeft.visible = (this._currentPage > 0);
    this._goRight.visible = (this._currentPage + 1 < this._pages);
};

doodleBreakout.LevelSelection.prototype.previousPage = function(){
    if(this._currentPage > 0){
        this._setPage(this._currentPage - 1);
    }
};

doodleBreakout.LevelSelection.prototype.nextPage = function(){
    if(this._currentPage + 1 < this._pages){
        this._setPage(this._currentPage + 1);
    }
};
doodleBreakout.LevelSelection.prototype.toggleComputerPlayer = function() {
  if (this._isComputerPlayerActive){
      this._isComputerPlayerActive = false;
      this.computerPlayerSwitch.frame = 0;
  } else {
      this._isComputerPlayerActive = true;
      this.computerPlayerSwitch.frame = 1;
  }
};
