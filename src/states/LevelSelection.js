var doodleBreakout = doodleBreakout || {};

doodleBreakout.LevelSelection = function( game ){

};

doodleBreakout.LevelSelection.prototype = Object.create(doodleBreakout.AbstractMenu.prototype);
doodleBreakout.LevelSelection.prototype.constructor = doodleBreakout.LevelSelection;

doodleBreakout.LevelSelection.prototype.create = function(){

    this.createBackHome();

    var title = this.game.add.bitmapText(this.game.width / 2, 10, 'larafont', 'Select Level', 64);
    title.anchor.setTo(0.5, 0);

    for(var i = 1; i <= this.game.levels; ++i) {
        var item = this.game.add.bitmapText(200 * ( (i - 1) % 3) + 200 , 150 * Math.ceil(i / 3), 'larafont', "Level " + i, 48);
        item.anchor.setTo(0.5, 0);
        item.inputEnabled = true;

        item.doodleBreakout = { 'targetLevel' : i };

        item.events.onInputDown.add(this.startLevel, this);
        item.events.onInputOver.add(this.over, this);
        item.events.onInputOut.add(this.out, this);
    }
};

doodleBreakout.LevelSelection.prototype.startLevel = function(target){
    this.state.states.Game.setLevel(target.doodleBreakout.targetLevel);
    this.state.start('Game' );
};
