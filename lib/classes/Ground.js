function Ground(size) {
  this.tileSize = 64;
  // Create and center the background sprite.
  this.groundSprite = game.add.tileSprite(
    game.world.centerX - size / 2 * this.tileSize,            // X
    game.world.centerY - size / 2 * this.tileSize,            // Y
    size * this.tileSize, size * this.tileSize, 'groundTile'  // WIDTH, HEIGHT
  );
  this.size = size;
  this.fruitCoordinates = {};

  this.randomizeGround();
};

Ground.prototype.generateRandomCoordinates = function() {
  return {
    x: this.groundSprite.x + Math.floor(Math.random() * this.size) * this.tileSize,
    y: this.groundSprite.y + Math.floor(Math.random() * this.size) * this.tileSize
  };
};

Ground.prototype.randomizeGround = function() {
  var fruitTypes = ['banana', 'apple', 'watermelon'];
  var fruitCount = {};
  var randomCoordinates = { x: 0, y: 0 };
  for (var i = 0; i < fruitTypes.length; i++) {
    fruitCount[fruitTypes[i]] = Math.floor(Math.random() * Math.round(this.size / 2.5) + 1);
  }

  for (var fruitType in fruitCount) {
    var fruitsLeft = fruitCount[fruitType];
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

  console.log(this.fruitCoordinates);
};
