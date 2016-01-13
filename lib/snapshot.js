function Minimax(ai) {
  this.ai = ai;
  this.graph = {};
  this.maxDepth = 1;
}

Minimax.prototype.getDirection = function() {
  this._generateTree();
  return ['left', 'right', 'up', 'down'][Math.floor(Math.random() * 4)];
};

Minimax.prototype.addMoveIfNotDuplicate = function(state, possibleMoves, direction) {
  var movedState = $.extend(true, {}, state);
  if (Robot.prototype.move.call(movedState, direction)) {
    var possibleMove = JSON.stringify(movedState);
    if (this.graph[possibleMove] === undefined) {
      possibleMoves.push(movedState);
    }
  }
};

Minimax.prototype.generatePossibleMoves = function(state) {
  var possibleMoves = [];
  this.addMoveIfNotDuplicate(state, possibleMoves, 'left');
  this.addMoveIfNotDuplicate(state, possibleMoves, 'up');
  this.addMoveIfNotDuplicate(state, possibleMoves, 'right');
  this.addMoveIfNotDuplicate(state, possibleMoves, 'down');
  return possibleMoves;
};

Minimax.prototype.addGraphNodes = function(state, queue, currentLevel) {
  var stateKey = JSON.stringify(state);
  var possibleMoves = this.generatePossibleMoves(state);

  for (var i = 0; i < possibleMoves.length; i++) {
    var possibleMove = possibleMoves[i];
    var possibleMoveKey = JSON.stringify(possibleMove);
    if (!this.graph[possibleMoveKey]) {
      this.graph[possibleMoveKey] = null;
      possibleMove.level = currentLevel + 1;
      possibleMoves[i] = possibleMoveKey;
      queue.push(possibleMove);
    }
  }
  this.graph[stateKey] = possibleMoves;
  this.graph[stateKey] = this.graph[stateKey].length ? this.graph[stateKey] : null;
};

Minimax.prototype._generateTree = function() {
  var currentState = this.ai.extractEssentials();
  currentState.level = 0;
  var currentStateKey = JSON.stringify(currentState);
  this.graph = {};
  this.graph[currentStateKey] = null;

  var queue = [currentState];
  while(true) {
    var currentNode = queue.shift();
    if (currentNode.level === this.maxDepth) {
      break;
    }
    this.addGraphNodes(currentNode, queue, currentNode.level);
  }

  //console.log(this.graph);
  //console.log(this.graph[Object.keys(this.graph)[0]]);
  console.log(Object.keys(this.graph).length);
};

Minimax.prototype._heuristicScore = function() {
  var score = 0;
  var winningCategories = 0;
  var losingCategories = 0;
  var playerFruitFromThisType, aiFruitFromThisType, totalFruitFromThisType, fruitType;

  for (fruitType in this.ai.ground.fruitCount) {
    playerFruitFromThisType = this.ai.player.score[fruitType];
    aiFruitFromThisType = this.ai.score[fruitType];
    totalFruitFromThisType = this.ai.ground.fruitCount[fruitType];
    if (aiFruitFromThisType * 2 > totalFruitFromThisType) {
      score += 1;
      winningCategories += 1;
      continue;
    }
    if (playerFruitFromThisType * 2 > totalFruitFromThisType) {
      score -= 1;
      losingCategories += 1;
      continue;
    }
    if (aiFruitFromThisType === playerFruitFromThisType) {
      continue;
    }
    var remainingFruit = totalFruitFromThisType - aiFruitFromThisType - playerFruitFromThisType;
    if (remainingFruit === 0) {
      winningCategories += 0.5;
      losingCategories += 0.5;
      continue;
    }
    score += (aiFruitFromThisType - playerFruitFromThisType) / totalFruitFromThisType;
  }

  var fruitTypesCount = this.ai.ground.fruitTypes.length;
  if (winningCategories * 2 > fruitTypesCount) {
    return Number.POSITIVE_INFINITY;
  }
  if (winningCategories * 2 === fruitTypesCount &&
      losingCategories * 2 === fruitTypesCount) {
    return 0;
  }

  // Add distance heuristic if we are not surely winning and the game is not tied.
  for (var coordinates in this.ai.ground.fruitCoordinates) {
    fruitType = this.ai.ground.fruitCoordinates[coordinates].key;
    playerFruitFromThisType = this.ai.player.score[fruitType];
    aiFruitFromThisType = this.ai.score[fruitType];
    totalFruitFromThisType = this.ai.ground.fruitCount[fruitType];

    if (aiFruitFromThisType * 2 <= totalFruitFromThisType && playerFruitFromThisType * 2 <= totalFruitFromThisType) {
      var diff = Math.abs(aiFruitFromThisType - playerFruitFromThisType);
      var toWin = (totalFruitFromThisType + 1) * 0.5 - Math.max(aiFruitFromThisType, playerFruitFromThisType);
      var aiX = (this.ai.robotSprite.x - this.ai.ground.groundSprite.x) / this.ai.ground.tileSize;
      var aiY = (this.ai.robotSprite.y - this.ai.ground.groundSprite.y) / this.ai.ground.tileSize;
      var playerX = (this.ai.player.robotSprite.x - this.ai.ground.groundSprite.x) / this.ai.ground.tileSize;
      var playerY = (this.ai.player.robotSprite.y - this.ai.ground.groundSprite.y) / this.ai.ground.tileSize;
      coordinates = '[' + coordinates + ']';
      var fruitX = (JSON.parse(coordinates)[0] - this.ai.ground.groundSprite.x) / this.ai.ground.tileSize;
      var fruitY = (JSON.parse(coordinates)[1] - this.ai.ground.groundSprite.y) / this.ai.ground.tileSize;
      var aiDist = Math.abs(aiX - fruitX) + Math.abs(aiY - fruitY);
      var playerDist = Math.abs(playerX - fruitX) + Math.abs(playerY - fruitY);
      score += 0.5 * (1 / aiDist - 1 / playerDist) * 1 / (toWin + diff + 2);
    }
  }

  return score;
};
