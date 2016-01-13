function Robot(ground, imageName) {
  var randomCoordinates = ground.generateRandomCoordinates();
  while(ground.fruitCoordinates[[randomCoordinates.x, randomCoordinates.y].toString()]) {
    randomCoordinates = ground.generateRandomCoordinates();
  }
  this.score = { 'banana': 0, 'apple': 0, 'watermelon': 0 };
  this.ground = ground;
  this.robotSprite = game.add.tileSprite(
    randomCoordinates.x, randomCoordinates.y,
    ground.tileSize, ground.tileSize, imageName
  );
};

Robot.prototype._invalidMove = function() {
  var leftBoundary = this.ground.groundSprite.x;
  var rightBoundary = leftBoundary + this.ground.tileSize * (this.ground.size - 1);
  var topBoundary = this.ground.groundSprite.y;
  var bottomBoundary = topBoundary + this.ground.tileSize * (this.ground.size - 1);
  var robotX = this.robotSprite.x;
  var robotY = this.robotSprite.y;

  return robotX < leftBoundary || robotX > rightBoundary ||
         robotY < topBoundary || robotY > bottomBoundary;
};

Robot.prototype.move = function(direction) {
  var axis = { 'left': 'x', 'right': 'x', 'up': 'y', 'down': 'y' };
  var multiplier = { 'left': -1, 'right': +1, 'up': -1, 'down': +1 };

  // Make a move and undo it if it is invalid.
  this.robotSprite[axis[direction]] += this.ground.tileSize * multiplier[direction];
  if (this._invalidMove()) {
    this.robotSprite[axis[direction]] -= this.ground.tileSize * multiplier[direction];
    return false;
  }

  // Check if we step on a fruit and pick it up.
  var keyFromCoordinates = [this.robotSprite.x, this.robotSprite.y].toString();
  var fruitSprite = this.ground.fruitCoordinates[keyFromCoordinates];
  if (fruitSprite) {
    this.score[fruitSprite.key]++;
    fruitSprite.destroy();
    delete this.ground.fruitCoordinates[keyFromCoordinates];;
  }

  return true;
};

Robot.prototype.extractEssentials = function() {
  return {
    score: this.score,
    robotSprite: {
      x: this.robotSprite.x,
      y: this.robotSprite.y
    },
    _invalidMove: this._invalidMove
  };
};
