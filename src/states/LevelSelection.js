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
        var x = 250 * ( (i - 1) % 3) + 130;
        var y = 150 * Math.ceil(i / 3);

        var text = "Level " + i;
        var besttime = doodleBreakout.ScoresManager.getBesttimes()['level_' + i];
        if(besttime){
            if(besttime % 60 < 10) {
                besttime = Math.floor(besttime / 60) + ":0" + (besttime % 60);
            } else {
                besttime = Math.floor(besttime / 60) + ":" + (besttime % 60);
            }
        }

        var item = this.game.add.bitmapText(x, y, 'larafont', text, 48);
        item.anchor.setTo(0.5, 0);
        item.inputEnabled = true;

        item.doodleBreakout = { 'targetLevel' : i };

        item.events.onInputDown.add(this.startLevel, this);
        item.events.onInputOver.add(this.over, this);
        item.events.onInputOut.add(this.out, this);

        var besttimeitem = this.game.add.bitmapText(x, y + 50, 'larafont', besttime, 36);
        besttimeitem.anchor.setTo(0.5, 0);
    }
};

doodleBreakout.LevelSelection.prototype.startLevel = function(target){
    this.state.states.Game.setLevel(target.doodleBreakout.targetLevel);
    this.state.start('Game' );
};
