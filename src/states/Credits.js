var doodleBreakout = doodleBreakout || {};

/**
 * @constructor
 * @augments doodleBreakout.AbstractMenu
 */
doodleBreakout.Credits = function (game) {

};

doodleBreakout.Credits.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.Credits.prototype.constructor = doodleBreakout.Credits;


/**
 * @inheritdoc
 */
doodleBreakout.Credits.prototype.create = function () {

    this.creditStrings = [
        "Developed by Magic WG and Lara",
        "Graphics by Lara",
        "Sounds by Marcel and Lina",
        "Infrastructure by Philipp",
        "-",
        "Libraries:",
        "Phaser.js",
        "FileSaver.js",
        "-",
        "Tools:",
        "WebStorm",
        "Linux MultiMedia Studio",
        "Krita",
        "-",
        "Stats:",
        "The development of this game",
        "cost our team:",
        "13 Cups of Coffee",
        "26 Cups of Tea",
        "32 Bread Rolls",
        "2 Bottles of Beer",
        "8 Glasses of Wine",
        "18 Liters of Coke",
        "",
        "",
        ""

    ].reverse();

    this.createBackHome();

    this.elements = this.game.add.group();

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    var title = this.game.add.bitmapText(this.game.width / 2, this.game.world.centerY, 'larafont', 'Credits', 64);
    title.anchor.setTo(0.5, 0);
    this.game.physics.enable(title, Phaser.Physics.ARCADE);
    title.doodleBreakout = {velocity: 0};
    title.body.maxVelocity.setTo(0);

    this.elements.add(title);

    this.game.world.bounds.setTo(0, 0, this.game.width, this.game.height + 50);

    this.next();
};

/**
 *
 */
doodleBreakout.Credits.prototype.next = function () {

    if (this.creditStrings.length > 0) {
        this.slideText(this.creditStrings.pop());
        this.updateTillNext = 110;
    } else {
        var easteregg = this.game.add.sprite(this.game.width / 2, this.game.height, 'easteregg');
        var clicked = false;
        easteregg.anchor.setTo(0.5, 0);
        this.game.physics.enable(easteregg, Phaser.Physics.ARCADE);
        easteregg.body.maxVelocity.setTo(0);
        easteregg.doodleBreakout = {velocity: 1};
        this.elements.add(easteregg);

        easteregg.inputEnabled = true;
        easteregg.events.onInputOver.add(this.over, this);
        easteregg.events.onInputOut.add(this.out, this);
        easteregg.events.onInputDown.add(function () {
            if (!clicked) {
                this.slideText("Try pressing 'E' in-game.");
                clicked = true;
            }

        }, this);
    }


};


/**
 * @inheritdoc
 */
doodleBreakout.Credits.prototype.update = function () {
    this.game.physics.arcade.overlap(this.elements, this.elements, function (a, b) {
        a.doodleBreakout.velocity = 0.5;
        b.doodleBreakout.velocity = 0.5;
    }, function (a, b) {
        return a != b;
    });

    this.elements.forEach(function (element) {
        element.y -= element.doodleBreakout.velocity;
    });

    this.updateTillNext--;
    if (this.updateTillNext == 0) {
        this.next();
    }
};

/**
 *
 * @param text
 * @returns {*|Phaser.BitmapText}
 */
doodleBreakout.Credits.prototype.slideText = function (text) {
    var credit = this.game.add.bitmapText(this.game.width / 2, this.game.height, 'larafont', text, 46);
    credit.anchor.setTo(0.5, 0);
    this.game.physics.enable(credit, Phaser.Physics.ARCADE);
    credit.body.maxVelocity.setTo(0);
    credit.doodleBreakout = {velocity: 1};

    this.elements.add(credit);
    credit.checkWorldBounds = true;
    credit.events.onOutOfBounds.add(credit.kill, credit);
    return credit;
};
