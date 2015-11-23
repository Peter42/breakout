var doodleBreakout = doodleBreakout || {};

doodleBreakout.Recorder = function( game ){
    this.game = game;
};

doodleBreakout.Recorder.constructor = doodleBreakout.Recorder;

doodleBreakout.Recorder.prototype.data = [];
doodleBreakout.Recorder.prototype.usedKeys = [];
doodleBreakout.Recorder.prototype.times = [];
doodleBreakout.Recorder.prototype.last = -1;

doodleBreakout.Recorder.prototype.capture = function (state) {
    var that = this;

    var data = JSON.stringify(state.stage, function(key, value) {

        if (["","children", "key", "position", "animations", "frame", "_width", "_height", "x", "y", "visible", "_fontSize", "_text", "__obj_id"].indexOf(key) < 0 && !key.match(/^[0-9]+$/)) {
            //console.log("'"+key+"'", value);
            return;
        }
        if("animations" == key){
            return value.frame;
            //console.log(key, value);
//            debugger;
        }
        if(key == "key" && typeof value == "string" && that.usedKeys.indexOf(value) < 0){
            that.usedKeys.push(value);
        }
        doodleBreakout.Recorder.objectId(value);
        return value;
    });

    data = JSON.parse(data);

    data = this.normalize([data], []);

    /*data.filter(function(data){
        return data.visible === true;
    });*/

    if( this.last > 0) {
        this.times.push(this.game.time.time - this.last);
    }
    this.last = this.game.time.time;
    this.data.push(data);
};


doodleBreakout.Recorder.prototype.render = function() {
    /*JSON.stringify(this.stage, function(key, value) {
     if (["","children", "key", "position", "frame", "x", "y", "0", "1", "2"].indexOf(key) < 0) {
     //console.log("'"+key+"'", value);
     return;
     }

     return value;
     });*/
};


doodleBreakout.Recorder.prototype.normalize = function(data, target) {

    for(var i in data) {
        target.push(data[i]);
        this.normalize(data[i].children, target);

        data[i].x = data[i].position.x;
        data[i].y = data[i].position.y;
        if (data[i].animations) {
            data[i].frame = data[i].animations;
        }

        data[i].width = data[i]._width;
        data[i].heigth = data[i]._height;

        if(data[i]._text) {
            data[i].text = data[i]._text;
            data[i].fontSize = data[i]._fontSize;
        }

        delete data[i]._text;
        delete data[i].position;
        delete data[i].children;
        delete data[i].animations;
    }

    return target;
};

doodleBreakout.Recorder.prototype.shutdown = function() {

    this.times.push(this.game.time.time - this.last);


    /*var before = this.data.length;

    // this removes duplicate frames and reduces the file size by about 10 to 20%
    this.data = this.data.filter(function(element, index, array){
        return JSON.stringify(element) != JSON.stringify(array[index - 1]);
    });

    var after = this.data.length;*/

    this.dataReduced = [];
    for(var i in this.data) {
        for(var j in this.data[i]) {
            var d = this.data[i][j];
            if(this.dataReduced[d.__obj_id]){
                this.dataReduced[d.__obj_id].push(d);
            } else {
                d.offset = i;
                this.dataReduced[d.__obj_id] = [d];
            }
        }
    }

    this.dataReduced = this.dataReduced.filter(function(a){ return a !== null; });

    for(var i in this.dataReduced) {
        var a = {};
        for(var j in this.dataReduced[i]) {
            var b = this.dataReduced[i][j];
            var c = JSON.parse(JSON.stringify(b));
            Object.keys(a).forEach(function(key){ if(a[key] == b[key]) delete b[key]; });
            a = c;
        }

        this.dataReduced[i] = this.dataReduced[i].filter(function(a){ return a !== {}; });
    }

    var that = this;
    this.images = [];
    this.usedKeys.forEach(function(key) {
        that.images.push(getDataUri(key, that.game));
    });

    //console.log("Reduced data by " + (100 - (after / before * 100)) + "% by removing redudant frames" );

    //console.log(JSON.stringify(this.data));
};


doodleBreakout.Recorder.prototype.save = function (){
    var state = this.game.cache.getText('replaystate');
    var index = this.game.cache.getText('replayindex');
    var phaser = this.game.cache.getText('replayphaser');

    index = index.replace("\"{{phaser}}\"", phaser);
    index = index.replace("\"{{state}}\"", state);
    index = index.replace("\"{{dataReduced}}\"", JSON.stringify(this.dataReduced));
    index = index.replace("\"{{times}}\"", JSON.stringify(this.times));
    index = index.replace("\"{{images}}\"", JSON.stringify(this.images));

    var blob = new Blob([index], {type: "text/html;charset=utf-8"});
    saveAs(blob, "test.html");
};


doodleBreakout.Recorder.__next_objid = 1;

doodleBreakout.Recorder.objectId  = function (obj) {

    if (obj==null) return null;
    if (typeof obj != 'object') return null;

    if (obj.__obj_id==null) obj.__obj_id=this.__next_objid++;
    return obj.__obj_id;
};

doodleBreakout.Recorder.setRecordingActive = function(value){
    this._active = (value === true);
    if(window.localStorage) {
        window.localStorage.setItem("Recorder.active", value === true);
    }
};

doodleBreakout.Recorder.isRecordingActive = function () {
    if(window.localStorage) {
        return window.localStorage.getItem("Recorder.active") === "true";
    }
    return this._active === true;
};


function getDataUri(key, game) {
    var image = game.cache.getImage(key);

    var canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    var frame = game.cache.getFrameByIndex(key, 0);

    return {
        "key": key,
        "data": canvas.toDataURL('image/png'),
        "width": frame ? frame.width : undefined,
        "height": frame ? frame.height : undefined
    };
}