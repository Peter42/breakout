var doodleBreakout = doodleBreakout || {};

/**
 * Generic Gimmick
 * @constructor
 */
doodleBreakout.Gimmick = function ( game, x, y, texture ) {
    Phaser.Sprite.call( this, game, x, y, texture );
    this.visible = false;
    this.isFalling = false;
    this._duration = 0;
    this.stayAlive = false;
    this.globalEffect = false;

    this.xVelocity = 0;
    this.yVelocity = 300;

    this.className = "";
    for( name in doodleBreakout ){
        if( doodleBreakout.hasOwnProperty( name ) && typeof doodleBreakout[name] == "function" && doodleBreakout[name] != doodleBreakout.Gimmick && this instanceof doodleBreakout[name] ){
            this.className = name;
            break;
        }
    }
};

doodleBreakout.Gimmick.prototype = Object.create(Phaser.Sprite.prototype);
doodleBreakout.Gimmick.prototype.constructor = doodleBreakout.Gimmick;

/**
 * Call this mehtod if a gimmick is gathered
 * @public
 * @param {object} player - The player gathered the gimmick
 */
doodleBreakout.Gimmick.prototype.gathered = function( player ){
    this.playCollectSound();
    this.collected( player );
    this._startTimer( player );
};

/**
 * Set duration of a gimmick in seconds
 *  @protected@protected
 * @param {number} duration - Duration in seconds
 */
doodleBreakout.Gimmick.prototype.setDuration = function ( duration ) {
    this._duration = duration;
};

/**
 * Get the duration in seconds
 * @public
 * @returns {number}
 */
doodleBreakout.Gimmick.prototype.getDuration = function () {
    return this._duration;
};

/**
 * If the gimmick is gathered the timer is started
 * @private
 * @param player -- The player gathered the gimmick
 */
doodleBreakout.Gimmick.prototype._startTimer = function ( player ) {
  if( this._duration > 0 ){
      var scope;
      if( this.globalEffect ){

          if( ! doodleBreakout[ this.className ]._gimmickTimer ){
              doodleBreakout[ this.className ]._gimmickTimer = false;
          }
          scope = doodleBreakout[ this.className ];
      }
      else {
          if( ! player._gimmickTimer ){
              player._gimmickTimer = [];
          }

          if( ! player._gimmickTimer[ this.className ] ){
              player._gimmickTimer[ this.className ] = {
                  _gimmickTimer: false
              };
          }

          scope = player._gimmickTimer[ this.className ];
      }

      if( scope._gimmickTimer ){
          scope._gimmickTimer.destroy();
      }
      scope._gimmickTimer = this.game.time.create();
      scope._gimmickTimer.add( this._duration * Phaser.Timer.SECOND, this.onTimerTimeout, this );
      scope._gimmickTimer.start();
  }
};

/**
 * The method is called when the timer is timed out
 * @protected
 */
doodleBreakout.Gimmick.prototype.onTimerTimeout = function(){
    throw this.constructor.name + " Gimmick: Timeout method not implemented.";
};

/**
 * Play the specified sound
 * @protected
 */
doodleBreakout.Gimmick.prototype.playCollectSound = function(){
    doodleBreakout.SoundManager.playSfx('flop');
};

/**
 * Do this if the gimmick was collected
 * @protected
 * @param {object} player - The player gathered the gimmick
 */
doodleBreakout.Gimmick.prototype.collected = function( player ){
    this.destroy();
};

/**
 * Let the Gimmick fall in the direction of the platform
 * @public
 * @param ball - The ball which hit the block of the gimmick
 */
doodleBreakout.Gimmick.prototype.fall = function( ball ){
    this.isFalling = true;
    this.visible = true;
    this.game.physics.enable( this, Phaser.Physics.ARCADE );

    switch( ball.parent.parent.plattform.fieldPosition ){
        case "down":
            this.xVelocity = 0;
            this.yVelocity = 300;
            break;
        case "up":
            this.xVelocity = 0;
            this.yVelocity = -300;
            break;
        case "right":
            this.xVelocity = 300;
            this.yVelocity = 0;
            break;
        case "left":
            this.xVelocity = -300;
            this.yVelocity = 0;
            break;
        default:
    }
    this.body.velocity.set( this.xVelocity, this.yVelocity );
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add( this.destroy, this );
};

/**
 * Earn points from gimmick
 * @protected
 * @param {object} player - The player gathered the gimmick
 * @param {number} points - Amount of points from Gimmick
 */
doodleBreakout.Gimmick.prototype.earnPoints = function( player, points ){
    player.earnPoints(points, this.x,  this.y);
};