
const game = require("./game.js");

// Base render component for typing
function RenderComponent() {
  // Call our parent/super constructor
  game.EntityComponent.call(this);
}

// Inherit our parent's prototype
RenderComponent.prototype = Object.create(game.EntityComponent.prototype, {
  
});

exports.RenderComponent = RenderComponent;
