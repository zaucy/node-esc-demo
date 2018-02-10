function CollisionSystem() {
}

CollisionSystem.prototype = {
  run: function(entity, positionComponent) {
    if(positionComponent.y < 0) {
      positionComponent.y = 0;
    }
  }
};

exports.CollisionSystem = CollisionSystem;
