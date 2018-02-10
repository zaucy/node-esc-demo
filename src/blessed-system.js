const blessed = require("blessed");
const game = require("./game.js");

function BlessedSystem() {

  this.keysPressed = {};
  this.entityBoxes = {};

  this.screen = screen = blessed.screen({
    smartCSR: true
  });

  this.screen.enableKeys();

  this.screen.on('keypress', (ch, key) => {
    this.keysPressed[key.name] = true;
  });

  this.screen.key(['escape', 'q', 'C-c'], () => {
    process.exit(0);
  });
}

// Inherit our parent's prototype
BlessedSystem.prototype = Object.create(Object.prototype, {

  getEntityBox: {
    value: function(entity) {
      if(!this.entityBoxes[entity.id]) {
        this.entityBoxes[entity.id] = blessed.box({
          top: 'center',
          left: 'center',
          width: 1,
          height: 1,
          style: {
            bg: 'magenta'
          }
        });

        this.screen.append(this.entityBoxes[entity.id]);
      }

      return this.entityBoxes[entity.id];
    }
  },

  run: {
    value: function(entity, position, playerInput) {
      let entityBox = this.getEntityBox(entity);

      if(this.keysPressed.left) {
        playerInput.moveLeft = true;
      }

      if(this.keysPressed.right) {
        playerInput.moveRight = true;
      }

      if(this.keysPressed.up && position.y <= 0) {
        playerInput.jumping = true;
      }

      entityBox.top = Math.round((-position.y) + parseInt(this.screen.height/2));
      entityBox.left = Math.round(position.x + parseInt(this.screen.width/2));

      this.screen.render();

      // Clear after processing keys pressed
      this.keysPressed = {};
    }
  }
});

BlessedSystem.prototype.constructor = BlessedSystem;

exports.BlessedSystem = BlessedSystem;
