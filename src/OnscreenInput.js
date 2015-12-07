var doodleBreakout = doodleBreakout || {};

/**
 * @class
 */
doodleBreakout.OnscreenInput = {};

doodleBreakout.OnscreenInput.enabled = false;

/**
 *
 */
doodleBreakout.OnscreenInput.init = function() {

    this._startX = 0;
    this._left = 300;

    if(window.ontouchstart !== undefined) {
        this.enabled = true;
        fakeInput.blur();

        var that = this;

        dpad.ontouchstart = function(event) {
            that._startX = event.touches[0].clientX;
            dpad.style.transition = "";
        };

        dpad.ontouchmove = function(event) {
            var x = event.touches[0].clientX;
            that._left = Math.min(Math.max(20, ( 300 - (that._startX - x) )), 580);
            that._updateView();
        };

        dpad.ontouchend = function() {
            that._left = 300;
            dpad.style.transition = "left 0.7s";
            that._updateView();
        };


        pad.ontouchstart = function(event) {
            dpad.style.transition = "left 0.2s";
            var l = (event.touches[0].clientX - pad.getBoundingClientRect().left);
            that._left = Math.min(Math.max(100, l), 500);
            that._updateView();
        };

        pad.ontouchmove = function(event) {
            dpad.style.transition = "";
            var l = (event.touches[0].clientX - pad.getBoundingClientRect().left);
            that._left = Math.min(Math.max(20, l), 580);
            that._updateView();
        };
        pad.ontouchend = function() {
            that._left = 300;
            dpad.style.transition = "left 0.7s";
            that._updateView();
        };
    } else {
        console.log("no osi required");
        onscreencontroll.parentElement.removeChild(onscreencontroll);
    }
};

/**
 *
 */
doodleBreakout.OnscreenInput.openKeyboard = function() {
    fakeInput.value = "";
    fakeInput.focus();
};

/**
 *
 */
doodleBreakout.OnscreenInput.closeKeyboard = function() {
    fakeInput.blur();
};


/**
 *
 * @private
 */
doodleBreakout.OnscreenInput._updateView = function(){
    dpad.style.left = this._left + "px";
};

/**
 *
 * @returns {boolean}
 */
doodleBreakout.OnscreenInput.isLeft = function() {
    return this._left < 250;
};

/**
 *
 * @returns {boolean}
 */
doodleBreakout.OnscreenInput.isRight = function() {
    return this._left > 350;
};
