var doodleBreakout = doodleBreakout || {};

doodleBreakout.Replay = function( game ){

};

doodleBreakout.Replay.prototype = Object.create(Phaser.State.prototype);
doodleBreakout.Replay.prototype.constructor = doodleBreakout.Replay;

doodleBreakout.Replay.prototype._nextFrame = 0;

doodleBreakout.Replay.prototype.init = function(args){
    this._recorder = args.recorder;
    this._data = this._recorder.dataReduced;
};

doodleBreakout.Replay.prototype.create = function(){
    this._objects = {};
};

doodleBreakout.Replay.prototype._updateObject = function (data, id) {
    if(this._objects[id]){
        if(!data) {
            console.log("kill " + id);
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
            console.log("width");
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
            console.log("create " + id + " with key " + data.key);
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

doodleBreakout.Replay.prototype.update = function(){
    if(this._nextFrame < this._recorder.times.length){

        for(var i in this._data){
            var offset = this._nextFrame - this._data[i][0].offset;
            if(offset >= 0) {
                this._updateObject(this._data[i][offset], this._data[i][0].__obj_id);
            }
        }

        this._nextFrame++;
    }
};