
const game = require("./game.js");

// Stores the players current input
function PlayerInputComponent() {
  // Call our parent/super constructor
  game.EntityComponent.call(this);

  this.moveLeft = false;
  this.moveRight = false;
  this.jumping = false;
  this.crouching = false;
}

// Inherit our parent's prototype
PlayerInputComponent.prototype = Object.create(game.EntityComponent.prototype, {

});

PlayerInputComponent.prototype.constructor = PlayerInputComponent;

exports.PlayerInputComponent = PlayerInputComponent;
