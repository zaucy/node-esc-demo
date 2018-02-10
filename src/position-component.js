
const game = require("./game.js");

// Position of an entity in our world
function PositionComponent() {
  // Call our parent/super constructor
  game.EntityComponent.call(this);

  this.x = 0;
  this.y = 0;
  this.z = 0;
}

// Inherit our parent's prototype
PositionComponent.prototype = Object.create(game.EntityComponent.prototype, {

  move: {
    value: function(deltaX, deltaY, deltaZ) {
      this.x += deltaX || 0;
      this.y += deltaY || 0;
      this.z += deltaZ || 0;
    }
  }

});

PositionComponent.prototype.constructor = PositionComponent;

exports.PositionComponent = PositionComponent;
