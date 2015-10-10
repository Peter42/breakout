var doodleBreakout = doodleBreakout || {};

doodleBreakout.Credits = function( game ){

};

doodleBreakout.Credits.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.Credits.prototype.constructor = doodleBreakout.Credits;

doodleBreakout.Credits.prototype.creditStrings = [
        "",
        "Developed by Magic WG and Lara",
        "Graphics by Lara",
        "Sounds by Marcel and Lina",
        "Infrastructure by Philipp",
        "",
        "Libraries:",
        "Phaser.js"

    ].reverse();

doodleBreakout.Credits.prototype.create = function(){

        this.createBackHome();

        this.elements = this.game.add.group();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', 'Credits',64);
        title.anchor.setTo(0.5, 0);
        this.game.physics.enable(title, Phaser.Physics.ARCADE);
        title.body.immovable = true;

        this.elements.add(title);

        this.timer = this.game.time.create(false);
        this.timer.loop(1500, this.next, this);
        this.timer.start();

        this.next();
    };

doodleBreakout.Credits.prototype.next = function() {
        var credit = this.game.add.bitmapText(this.game.width / 2, this.game.height, 'larafont', this.creditStrings.pop() ,48);
        credit.anchor.setTo(0.5, 0);
        this.game.physics.enable(credit, Phaser.Physics.ARCADE);
        credit.body.velocity.setTo(0,-100);

        this.elements.add(credit);

    };

doodleBreakout.Credits.prototype.update = function(){
        this.game.physics.arcade.collide(this.elements, this.elements, function(a,b) {
            a.body.velocity.setTo(0);
            b.body.velocity.setTo(0);
        });
    };