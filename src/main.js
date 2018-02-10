const {Game, GameWorld, Entity} = require("./game.js");
const {PositionComponent} = require("./position-component.js");
const {PlayerInputComponent} = require("./player-input-component.js");
const {BlessedSystem} = require("./blessed-system.js");
const {ElectronSystem} = require("./electron-system.js");
const {GravitySystem} = require("./gravity-system.js");
const {CollisionSystem} = require("./collision-system");

let game = new Game();
let world = new GameWorld();

game.setWorld(world);

game.addSystem(new CollisionSystem(), PositionComponent);
game.addSystem(new GravitySystem(), PositionComponent);
game.addSystem(new ElectronSystem(), PositionComponent, PlayerInputComponent);
game.addSystem(new BlessedSystem(), PositionComponent, PlayerInputComponent);

game.addSystem({
  run: function(entity, position, playerInput) {
    let moveX = 0;
    let moveY = 0;

    if(playerInput.moveLeft) {
      moveX -= 1;
      playerInput.moveLeft = false;
    }

    if(playerInput.moveRight) {
      moveX += 1;
      playerInput.moveRight = false;
    }

    if(playerInput.jumping) {
      moveY += 3;
      playerInput.jumping = false;
    }

    position.move(moveX, moveY);
  }
}, PositionComponent, PlayerInputComponent);

let playerEntity = new Entity();
playerEntity.components.push(new PositionComponent(0, 0));
playerEntity.components.push(new PlayerInputComponent());
world.addEntity(playerEntity);


setInterval(() => game.loop(), 16);
