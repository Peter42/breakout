var doodleBreakout = doodleBreakout || {};

doodleBreakout.Credits = function( game ){

};

doodleBreakout.Credits.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.Credits.prototype.constructor = doodleBreakout.Credits;



doodleBreakout.Credits.prototype.create = function(){

        this.creditStrings = [
                "Developed by Magic WG and Lara",
                "Graphics by Lara",
                "Sounds by Marcel and Lina",
                 "Infrastructure by Philipp",
                 "-",
                 "Libraries:",
                 "Phaser.js",
                 "-",
                 "Tools:",
                 "WebStorm",
                 "Linux MultiMedia Studio",
                 //TODO: Laras Zeichenprogramm
                 "-",
                 "Stats:",
                 "The development of this game",
                 "cost our team:",
                 "4 Cups of Coffee",
                 "6 Cups of Tea",
                 "12 Bread Rolls",
                 "2 Bottles of Beer",
                 "4 Glasses of Wine",
                 "5 Bottles of Coke",
                "",
                "",
                ""

        ].reverse();

        this.createBackHome();

        this.elements = this.game.add.group();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        var title = this.game.add.bitmapText(this.game.width / 2, this.game.world.centerY, 'larafont', 'Credits',64);
        title.anchor.setTo(0.5, 0);
        this.game.physics.enable(title, Phaser.Physics.ARCADE);
      //  title.body.immovable = true;

        this.elements.add(title);

        this.timer = this.game.time.create(false);
        this.timer.loop(1500, this.next, this);
        this.timer.start();

        this.game.world.bounds.setTo(0,0,this.game.width, this.game.height + 50);


        this.next();
    };

doodleBreakout.Credits.prototype.next = function() {

        if (this.creditStrings.length > 0) {
                this.slideText( this.creditStrings.pop());
        } else {
                var easteregg = this.game.add.sprite(this.game.width / 2, this.game.height, 'easteregg');
                easteregg.anchor.setTo(0.5, 0);
                this.game.physics.enable(easteregg, Phaser.Physics.ARCADE);
                easteregg.body.velocity.setTo(0, -90);
                this.elements.add(easteregg);
                this.timer.stop();

                easteregg.inputEnabled = true;
                easteregg.events.onInputOver.add(this.over, this);
                easteregg.events.onInputOut.add(this.out, this);
                easteregg.events.onInputDown.add(function(){
                        this.slideText("Try pressing 'E' in-game.");
                }, this);
        }


    };


doodleBreakout.Credits.prototype.update = function(){
        this.game.physics.arcade.collide(this.elements, this.elements, function(a,b) {
                a.body.maxVelocity.setTo(40);
                b.body.maxVelocity.setTo(40);
        });
    };

doodleBreakout.Credits.prototype.slideText = function(text){
        var credit = this.game.add.bitmapText(this.game.width / 2, this.game.height, 'larafont', text, 50);
        credit.anchor.setTo(0.5, 0);
        this.game.physics.enable(credit, Phaser.Physics.ARCADE);
        credit.body.velocity.setTo(0, -90);

        this.elements.add(credit);
        credit.checkWorldBounds = true;
        credit.events.onOutOfBounds.add(credit.kill, credit);
}
