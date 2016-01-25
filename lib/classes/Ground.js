function Ground(size, tileSpriteName, fruitTypes) {
  this.tileSize = 64;
  // Create and center the background sprite.
  this.groundSprite = game.add.tileSprite(
    game.world.centerX - size / 0.9 * this.tileSize,            // X
    game.world.centerY - size / 2 * this.tileSize,              // Y
    size * this.tileSize, size * this.tileSize, tileSpriteName  // WIDTH, HEIGHT
  );
  this.size = size;
  this.fruitTypes = fruitTypes;
  this.fruitCount = {};
  this.fruitCoordinates = {};

  this._randomizeGround();
};

Ground.prototype._randomizeGround = function() {
  for (var i = 0; i < this.fruitTypes.length; i++) {
    this.fruitCount[this.fruitTypes[i]] = Math.floor(Math.random() * Math.round(this.size / 2.5) + 1);
  }

  var randomCoordinates = { x: 0, y: 0 };
  for (var fruitType in this.fruitCount) {
    var fruitsLeft = this.fruitCount[fruitType];
    while (fruitsLeft !== 0) {
      randomCoordinates = this.generateRandomCoordinates();
      if (!this.fruitCoordinates[[randomCoordinates.x, randomCoordinates.y].toString()]) {
        // Add a fruit on the ground with random coordinates.
        this.fruitCoordinates[[randomCoordinates.x, randomCoordinates.y].toString()] = game.add.tileSprite(
          randomCoordinates.x, randomCoordinates.y, this.tileSize, this.tileSize, fruitType
        );
        fruitsLeft--;
      }
    }
  }
};

Ground.prototype.generateRandomCoordinates = function() {
  return {
    x: this.groundSprite.x + Math.floor(Math.random() * this.size) * this.tileSize,
    y: this.groundSprite.y + Math.floor(Math.random() * this.size) * this.tileSize
  };
};

Ground.prototype.extractEssentials = function() {
  var result = {};
  Object.keys(this).forEach(function(property) {
    // If properties represent heavy objects from phaser, extract the essentials.
    switch (property) {
      case 'groundSprite':
        result[property] =  {
          x: this.groundSprite.x,
          y: this.groundSprite.y
        };
        break;
      case 'fruitCoordinates':
        result[property] = {};
        for (var coordinates in this.fruitCoordinates) {
          result[property][coordinates] = {
            key: this.fruitCoordinates[coordinates].key,
            destroy: function() { /* dummy */ }
          };
        }
        break;
      default:
        result[property] = this[property];
        break;
    }
  }, this);

  return result;
};
