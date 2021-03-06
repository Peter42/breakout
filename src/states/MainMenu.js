var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.AbstractMenu
 */
doodleBreakout.MainMenu = function (game) {

};

doodleBreakout.MainMenu.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.MainMenu.prototype.constructor = doodleBreakout.MainMenu;

/**
 * @inheritdoc
 */
doodleBreakout.MainMenu.prototype.create = function () {
    var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', 'Main Menu', 64);
    title.anchor.setTo(0.5, 0);

    // Single Player Icon
    this._generateMenuIcon('icon_singleplayer', this.game.world.centerX - 120, 90, 'LevelSelection', 'singlePlayer');
    // Multi Player Icon
    this._generateMenuIcon('icon_multiplayer', this.game.world.centerX, 90, 'LevelSelection', 'multiPlayer');
    // Computer Player Icon
    this._generateMenuIcon('icon_computer', this.game.world.centerX + 120, 90, 'LevelSelection', 'computer');

    this._generateMenuItem('Highscores', 220, 'Highscores');
    this._generateMenuItem('Settings', 320, 'Settings');
    this._generateMenuItem('Create Level', 420, 'LevelDesigner');
    this._generateMenuItem('Credits', 520, 'Credits');
};

/**
 *
 * @param text
 * @param y
 * @param targetState
 * @returns {*|Phaser.BitmapText}
 * @private
 */
doodleBreakout.MainMenu.prototype._generateMenuItem = function (text, y, targetState) {
    var item = this.game.add.bitmapText(this.game.world.centerX, y, 'larafont', text, 48);
    this._enableInput(item, targetState);
    return item;
};

/**
 *
 * @param spriteName
 * @param x
 * @param y
 * @param targetState
 * @param options
 * @returns {*}
 * @private
 */
doodleBreakout.MainMenu.prototype._generateMenuIcon = function (spriteName, x, y, targetState, options) {
    var icon = this.game.add.sprite(x, y, spriteName);
    this._enableInput(icon, targetState, options);
    return icon;
};

/**
 *
 * @param gameObject
 * @param targetState
 * @param options
 * @private
 */
doodleBreakout.MainMenu.prototype._enableInput = function (gameObject, targetState, options) {
    gameObject.anchor.setTo(0.5, 0);
    gameObject.inputEnabled = true;
    gameObject.doodleBreakout = {
        'targetState': targetState,
        'options': options
    };

    gameObject.events.onInputDown.add(this.click, this);
    gameObject.events.onInputOver.add(this.over, this);
    gameObject.events.onInputOut.add(this.out, this);
};

/**
 *
 * @param text
 */
doodleBreakout.MainMenu.prototype.click = function (text) {
    this.game.state.start(text.doodleBreakout.targetState, true, false, text.doodleBreakout.options);
};