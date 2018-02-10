let lastEntityId = 0;

function SystemsHost() {
  this._entityOnlySystems = [];
  this._systemsComponentMap = new Map();
}
SystemsHost.prototype = Object.create(Object.prototype, {
  getEntities: {
    value: function() {}
  },
  addSystem: {
    value: function(system, ...componentTypes) {
      // here we are just organizing our systems by component type so we may
      // easily access the correct systems for running on our entities components

      if(system.run.length != componentTypes.length + 1) {
        throw new Error(
          "addSystem() system run method must contain exact amount of component types supplied + 1 for entity"
        );
      }

      if(componentTypes.length > 0) {
        componentTypes.forEach((componentType, index) => {
          if(!this._systemsComponentMap.has(componentType)) {
            this._systemsComponentMap.set(componentType, []);
          }
          
          this._systemsComponentMap.get(componentType).push({
            system: system,
            index: index
          });

        });
      } else {
        this._entityOnlySystems.push(system);
      }
    }
  },
  runSystems: {
    value: function() {
      let entities = this.getEntities();

      for(let entity of entities) {
        let pendingSystems = new WeakMap();

        for(let system of this._entityOnlySystems) {
          system.run(entity);
        }

        let components = entity.components;
        components.forEach((component, componentIndex) => {
          let componentType = component.constructor;

          if(this._systemsComponentMap.has(componentType)) {
            let systemsComponentInfos = this._systemsComponentMap.get(componentType);
            
            for(let systemsComponentInfo of systemsComponentInfos) {
              let entityCompIndicies = pendingSystems.get(systemsComponentInfo.system) || [];

              entityCompIndicies.push({
                component: component,
                index: componentIndex
              });

              if(entityCompIndicies.length == systemsComponentInfo.system.run.length - 1) {
                let runComponents = [];
                entityCompIndicies.forEach(compIndex => {
                  runComponents[compIndex.index] = compIndex.component;
                });

                systemsComponentInfo.system.run(entity, ...runComponents);
                pendingSystems.delete(systemsComponentInfo.system);
              } else {
                pendingSystems.set(systemsComponentInfo.system, entityCompIndicies);
              }
            }
            
          }
        });
      }
    },
    writable: false,
    configurable: false,
    enumerable: true
  }
});

SystemsHost.prototype.constructor = SystemsHost;

// Game encapsulates the entire game
function Game() {
  SystemsHost.call(this);

  // The current world
  this.world = null;
}

Game.prototype = Object.create(SystemsHost.prototype, {
  getEntities: {
    value: function() {
      if(this.world) {
        // Return ths current world's entities
        return this.world.getEntities();
      } else {
        // No current world, we have no entities.
        return [];
      }
    }
  },
  setWorld: {
    value: function(world) {
      this.world = world;
    }
  },
  loop: {
    value: function() {
      // Run our general game systems
      this.runSystems();

      // If we have a current world run our world systems
      if(this.world) {
        this.world.runSystems();
      }
    }
  }
});

Game.prototype.constructor = Game;

// GameWorld contains entities
function GameWorld() {
  SystemsHost.call(this);
  this._entities = [];
}

GameWorld.prototype = Object.create(SystemsHost.prototype, {
  getEntities: {
    value: function() {
      return this._entities;
    }
  },
  addEntity: {
    value: function(entity) {
      this._entities.push(entity);
      return entity;
    }
  }
});

GameWorld.prototype.constructor = GameWorld;

// Entities contain components
function Entity() {

  // List of this entities components
  this.components = [];

  Object.defineProperty(this, "id", {
    value: ++lastEntityId,
    configurable: false,
    writable: false,
    enumerable: true
  });
}

// Components contain information about an entity
function EntityComponent() {}

exports.Game = Game;
exports.GameWorld = GameWorld;
exports.Entity = Entity;
exports.EntityComponent = EntityComponent;
