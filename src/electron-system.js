const path = require("path");
const electron = require("electron");
const game = require("./game.js");
const child_process = require("child_process");

function ElectronSystem() {
  const spawnPath = path.resolve(__dirname, "electron-system/electron-system-spawn.js");
  this._spawn = child_process.spawn(electron, [spawnPath], {
    stdio: [0, 1, 2, 'ipc']
  });

  this._lastUpdates = {};

  this.leftKeyPressed = false;
  this.rightKeyPressed = false;
  this.jumpKeyPressed = false;

  this._spawn.on("message", (msg) => {
    if(msg.status == "ready") {
      this._onSpawnReady();
    }

    if(msg.status == "quit") {
      process.exit(0);
    }

    if(msg.leftKey) {
      this.leftKeyPressed = true;
    }

    if(msg.rightKey) {
      this.rightKeyPressed = true;
    }

    if(msg.jumpKey) {
      this.jumpKeyPressed = true;
    }
  });

}

// Inherit our parent's prototype
ElectronSystem.prototype = Object.create(Object.prototype, {
  _onSpawnReady: {
    value: function() {

    }
  },
  _clearInputs: {
    value: function() {
      this.leftKeyPressed = false;
      this.rightKeyPressed = false;
      this.jumpKeyPressed = false;
    }
  },
  _sendPositionUpdate: {
    value: function(entity, position) {

      let lastUpdate = this._lastUpdates[entity.id];
      if(!lastUpdate) {
        lastUpdate = {};
      }

      // Don't send the precision position to the renderer. Transisions will
      // happen on the css side.
      let x = Math.round(position.x);
      let y = Math.round(position.y);
      let z = Math.round(position.z);

      if(lastUpdate.x != x || lastUpdate.y != y || lastUpdate.z != z) {
        this._spawn.send({
          entityId: entity.id,
          position: {
            x: x,
            y: y,
            z: z
          }
        });

        lastUpdate = {
          x: x,
          y: y,
          z: z
        };

        this._lastUpdates[entity.id] = lastUpdate;
      }
    }
  },
  run: {
    value: function(entity, position, playerInput) {
      
      if(this.leftKeyPressed) {
        playerInput.moveLeft = true;
      }

      if(this.rightKeyPressed) {
        playerInput.moveRight = true;
      }

      if(this.jumpKeyPressed && position.y <= 0) {
        playerInput.jumping = true;
      }

      this._sendPositionUpdate(entity, position);
      this._clearInputs();
    }
  }
});

ElectronSystem.prototype.constructor = ElectronSystem;

exports.ElectronSystem = ElectronSystem;
