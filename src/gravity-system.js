function GravitySystem() {
}

GravitySystem.prototype = {
  run: function(entity, positionComponent) {
    positionComponent.move(0, -0.15);
  }
};

exports.GravitySystem = GravitySystem;
