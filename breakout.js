/**
 * Created by philipp on 05.10.15.
 */

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {

    game.load.baseURL = 'http://examples.phaser.io/assets/';
    game.load.crossOrigin = 'anonymous';

    game.load.image('phaser', 'sprites/pangball.png');

}
var bmdSprite;
var sprite;
var leftKey, rightKey;
var bricks;

function create() {


    //  Our BitmapData (same size as our canvas)
    var bmd = game.make.bitmapData(128, 16);

    bricks = game.add.group();

    bmd.rect(0, 0, 128, 16, 'red');
    //  Add it to the world or we can't see it
    // bmd.addToWorld();

    for (var y = 100; y < 200; y += 17) {
        for (var x = 0; x < game.width - 64; x += 65) {
            bricks.add(rectSprite(x, y));
        }
    }


    bmdSprite = game.add.sprite(423 + 98 * 0.45, game.height - 100, bmd);
    //debugger;
    bmdSprite.anchor.setTo(0.5, 1);
    game.physics.enable(bmdSprite, Phaser.Physics.ARCADE);
    bmdSprite.body.immovable = true;
    bmdSprite.body.collideWorldBounds = true;

    sprite = game.add.sprite(300, 300, 'phaser');
    sprite.anchor.setTo(0.5, 1);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    //  This gets it moving
    sprite.body.velocity.setTo(200, 200);

    //  This makes the game world bounce-able
    sprite.body.collideWorldBounds = true;

    // speed up the ball a little bit
    sprite.body.bounce.set(1.005);

    sprite.inputEnabled = true;
    sprite.input.enableDrag(true);


    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
}

function rectSprite(x, y) {
    var bmd = game.make.bitmapData(64, 16);


    bmd.rect(0, 0, 64, 16, 'yellow');


    var sprite = game.add.sprite(x, y, bmd);

    //bmdSprite.anchor.setTo(0.5,1);
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.immovable = true;
    sprite.body.collideWorldBounds = true;

    return sprite;
}

function update() {

    //console.log(game.physics.arcade.angleBetween(bmdSprite, sprite) + Math.PI / 2);

    game.physics.arcade.collide(bmdSprite, sprite, function (board, ball) {
        //debugger;
        console.log(board, ball);

        var angle = game.physics.arcade.angleBetween(board, ball) + Math.PI / 2;
        console.log(angle);

        var velocity = Math.sqrt(Math.pow(ball.body.velocity.x, 2) + Math.pow(ball.body.velocity.y, 2));
        velocity = Math.min(velocity, 800);

        ball.body.velocity.set(velocity * Math.sin(angle), -velocity * Math.cos(angle));

        debugger;
    });


    game.physics.arcade.collide(bricks, sprite, function (ball, brick) {


        brick.kill();

        if (bricks.total == 0) {
            alert("Gewonnen");
        }

    });


    if (leftKey.isDown) {
        if (bmdSprite.body.velocity.x > 0) {
            bmdSprite.body.velocity.set(0, 0);
        } else {
            bmdSprite.body.velocity.set(bmdSprite.body.velocity.x - 20, 0);
        }
    }
    else if (rightKey.isDown) {
        if (bmdSprite.body.velocity.x < 0) {
            bmdSprite.body.velocity.set(0, 0);
        } else {
            bmdSprite.body.velocity.set(bmdSprite.body.velocity.x + 20, 0);
        }
    } else if (bmdSprite.body.velocity.x < 0) {
        bmdSprite.body.velocity.set(bmdSprite.body.velocity.x + 5, 0);
    } else if (bmdSprite.body.velocity.x > 0) {
        bmdSprite.body.velocity.set(bmdSprite.body.velocity.x - 5, 0);
    }

}

function render() {

}
