function Robot(ground, imageName) {
  var randomCoordinates = ground.generateRandomCoordinates();
  // Add a check so the robots cant spawn on the same tile.
  while(ground.fruitCoordinates[[randomCoordinates.x, randomCoordinates.y].toString()]) {
    randomCoordinates = ground.generateRandomCoordinates();
  }
  this.ground = ground;
  this.robotSprite = game.add.tileSprite(
    randomCoordinates.x, randomCoordinates.y,
    ground.tileSize, ground.tileSize, imageName
  );
};

// Problem with inheritance.
// Robot.prototype._invalidMove = function() {
function _invalidMove() {
  var groundLeftBoundary = this.ground.groundSprite.x;
  var groundRightBoundary = groundLeftBoundary + this.ground.tileSize * (this.ground.size - 1);
  var groundTopBoundary = this.ground.groundSprite.y;
  var groundBottomBoundary = groundTopBoundary + this.ground.tileSize * (this.ground.size - 1);
  var robotX = this.robotSprite.x;
  var robotY = this.robotSprite.y;

  return robotX < groundLeftBoundary || robotX > groundRightBoundary || robotY < groundTopBoundary || robotY > groundBottomBoundary;
};

Robot.prototype.move = function(direction) {
  var axis = { 'left': 'x', 'right': 'x', 'up': 'y', 'down': 'y' };
  var multiplier = { 'left': -1, 'right': +1, 'up': -1, 'down': +1 };

  // Make a move and undo it if it is invalid.
  this.robotSprite[axis[direction]] += this.ground.tileSize * multiplier[direction];
  if (_invalidMove.call(this)) {
    this.robotSprite[axis[direction]] -= this.ground.tileSize * multiplier[direction];
    return false;
  }

  // Check if we step on a fruit and pick it up.
  if (this.ground.fruitCoordinates[[this.robotSprite.x, this.robotSprite.y].toString()]) {
    this.ground.fruitCoordinates[[this.robotSprite.x, this.robotSprite.y].toString()].destroy();
  }

  return true;
};
