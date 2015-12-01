var doodleBreakout = doodleBreakout || {};

doodleBreakout.Replay = function( game ){

};

doodleBreakout.Replay.prototype = Object.create(Phaser.State.prototype);
doodleBreakout.Replay.prototype.constructor = doodleBreakout.Replay;

doodleBreakout.Replay.prototype._nextFrame = 0;

doodleBreakout.Replay.prototype.init = function(args){
    this._recorder = args.recorder;
    this._data = this._recorder.dataReduced;
    if(args.callbackArgs) {
        this._callbackArgs = args.callbackArgs;
        this._callbackArgs.afterReplay = true;
        this._stopEnabled = true;
    } else {
        this._stopEnabled = false;
    }

};

doodleBreakout.Replay.prototype.create = function(){
    this._objects = {};

    this.menuGroup = new Phaser.Group( this.game, parent, "menu", true, false, undefined);

    var line = new Phaser.Sprite( this.game, 0, this.game.stage.height - 50, "block05", 0 );
    line.alpha = 0.5;
    line.width = 800;
    line.height = 50;

    this.menuGroup.add(line);

    var y = this.game.stage.height - 45;
    this.icons = {};

    this.icons.pause = this.game.add.sprite( 15, y, "icon_pause", 0, this.menuGroup);
    this.icons.pause.width = 40;
    this.icons.pause.height = 40;
    this.icons.pause.inputEnabled = true;
    this.icons.pause.events.onInputDown.add(this.togglePause, this);

    if(this._stopEnabled){
        this.icons.stop = this.game.add.sprite( 65, y, "icon_stop",  0, this.menuGroup);
        this.icons.stop.width = 40;
        this.icons.stop.height = 40;
        this.icons.stop.inputEnabled = true;
        this.icons.stop.events.onInputDown.add(this.back, this);

        this.icons.save = this.game.add.sprite(115, y, "icon_save",  0, this.menuGroup);
        this.icons.save.width = 40;
        this.icons.save.height = 40;
        this.icons.save.inputEnabled = true;
        this.icons.save.events.onInputDown.add(this.startDownload, this);
    }

};

doodleBreakout.Replay.prototype.togglePause = function(){
    this.icons.pause.frame = this.icons.pause.frame == 1 ? 0 : 1;
};

doodleBreakout.Replay.prototype.startDownload = function(){
    this._recorder.save();
};

doodleBreakout.Replay.prototype.back = function(){
    this.game.state.start("GameOver", true, false, this._callbackArgs);
};

doodleBreakout.Replay.prototype._updateObject = function (data, id) {
    if(this._objects[id]){
        if(!data) {
            this._objects[id].visible = false;
            this._objects[id].kill();
            delete this._objects[id];
            return;
        }

        if(data.x !== undefined){
            this._objects[id].x = data.x;
        }

        if(data.y !== undefined){
            this._objects[id].y = data.y;
        }

        if(data.height !== undefined){
            this._objects[id].height = data.height;
        }

        if(data.width !== undefined){
            this._objects[id].width = data.width;
        }

        if(data.visible !== undefined){
            this._objects[id].visible = data.visible;
        }

        if(data.frame !== undefined){
            this._objects[id].frame = data.frame;
        }

        if(data.text !== undefined) {
            this._objects[id].setText(data.text);
        }
    } else {
        if(!data){
            return;
        }
        if(data.key && typeof data.key === 'string'){
            this._objects[id] = this.game.add.sprite(data.x, data.y, data.key);
            this._objects[id].visible = data.visible;
            this._objects[id].frame = data.frame;

            switch (data.key) {
                case "ball":
                case "ball1":
                    this._objects[id].anchor.setTo(0.5, 1);
                    break;
                case "plattform01":
                case "plattform_player1":
                case "plattform_player2":
                    this._objects[id].anchor.setTo(0.5, 0.5);
                    break;
            }
        }
        else if(data.text) {
            this._objects[id] = this.game.add.bitmapText(data.x, data.y, 'larafont', data.text, data.fontSize);
            this._objects[id].anchor.setTo(data.text === "0" ? 1 : 0.5, 0);
            this._objects[id].visible = data.visible;
        }
    }
};

doodleBreakout.Replay.prototype.shutdown = function() {
    this.game.stage.removeChild(this.menuGroup);
};

doodleBreakout.Replay.prototype.update = function(){
    if(this._nextFrame < this._recorder.times.length && this.icons.pause.frame != 1){

        if(this._nextFrame == 0) {
            this.world.removeAll();
            this._objects = [];
        }

        for(var i in this._data){
            var offset = this._nextFrame - this._data[i][0].offset;
            if(offset >= 0) {
                this._updateObject(this._data[i][offset], this._data[i][0].__obj_id);
            }
        }

        this._nextFrame++;
    }
    if(this._nextFrame >= this._recorder.times.length){
        this.icons.pause.frame = 1;
        this._nextFrame = 0;
    }
};