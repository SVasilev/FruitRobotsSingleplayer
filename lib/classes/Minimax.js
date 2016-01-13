function Minimax(ai) {
  this.ai = ai;
  this.graph = {};
  this.maxDepth = 2;
}

Minimax.prototype.getDirection = function() { // Smth like that.
  var startState = this._generateTree();
  var maxResult = -Infinity;
  var direction;

  this.graph[startState].forEach(function(neighbour) {
    var neighbourResult = this._minimaxAlgorithm(neighbour, 'player');
    if (maxResult < neighbourResult) {
      maxResult = neighbourResult;
      direction = this.determineDirection(startState, neighbour);
    }
  }, this);

  console.log(maxResult);

  console.log(direction);
  return direction;
};

Minimax.prototype.determineDirection = function(startState, neighbour) {
  startState = JSON.parse(startState);
  neighbour = JSON.parse(neighbour);

  if (startState.robotSprite.x > neighbour.robotSprite.x) return 'left';
  if (startState.robotSprite.x < neighbour.robotSprite.x) return 'right';
  if (startState.robotSprite.y > neighbour.robotSprite.y) return 'up';
  if (startState.robotSprite.y < neighbour.robotSprite.y) return 'down';
};

Minimax.prototype.generatePossibleMoves = function(state) {
  var possibleMoves = [];

  ['left', 'up', 'right', 'down'].forEach(function(direction) {
    var movedState = $.extend(true, {}, state); // -> This takes SERIOUS amout of time in my oppinion. If you fix this you can be very fast. If you reverse the step only the fruits on the ground and the fruits in the current player change
    // Switch turns, depending on the current level of the node in the tree.
    var currentTurn = movedState.level % 2 === 0 ? movedState.player : movedState;

    if (Robot.prototype.move.call(currentTurn, direction)) {
      // Optimisation: Don't queue states to which we have already been.
      var possibleMove = JSON.stringify(movedState);
      if (this.graph[possibleMove] === undefined) {
        possibleMoves.push(movedState);
      }
    }
  }, this);
  return possibleMoves;
};

Minimax.prototype.addGraphNodes = function(state, queue) {
  var stateKey = JSON.stringify(state);
  state.level++;
  var possibleMoves = this.generatePossibleMoves(state);

  for (var i = 0; i < possibleMoves.length; i++) {
    var possibleMove = possibleMoves[i];
    var possibleMoveKey = JSON.stringify(possibleMove);
    if (!this.graph[possibleMoveKey]) {
      this.graph[possibleMoveKey] = null;
      possibleMoves[i] = possibleMoveKey;
      queue.push(possibleMove);
    }
  }
  this.graph[stateKey] = possibleMoves;
  this.graph[stateKey] = this.graph[stateKey].length ? this.graph[stateKey] : null;
};

Minimax.prototype._generateTree = function() {
  // var now = new Date().getTime(); PROFILING
  var startState = this.ai.extractEssentials();
  startState.level = 0;
  var startStateKey = JSON.stringify(startState);
  this.graph = {};
  this.graph[startStateKey] = null;

  var queue = [startState];
  while(true) {
    var currentNode = queue.shift();
    if (currentNode.level === this.maxDepth) {
      // alert('Algorithm took ' + (new Date().getTime() - now) + ' milliseconds.');
      break;
    }
    this.addGraphNodes(currentNode, queue);
  }

  return startStateKey;
};

Minimax.prototype._minimaxAlgorithm = function(state, player) {
  var neighbours = this.graph[state];

  if (neighbours === null) {
    console.log(this._heuristicScore(state));
    return this._heuristicScore(state);
  }

  if (player === 'ai') {
    var maxResult = -Infinity;
    for (var i = 0; i < neighbours.length; i++) {
      maxResult = Math.max(maxResult, this._minimaxAlgorithm(neighbours[i], 'player'));
    }
    return maxResult;
  }
  else {
    var minResult = Infinity;
    for (var i = 0; i < neighbours.length; i++) {
      minResult = Math.min(minResult, this._minimaxAlgorithm(neighbours[i], 'ai'));
    }
    return minResult;
  }
};

Minimax.prototype._heuristicScore = function(state) {
  var score = 0;
  var winningCategories = 0;
  var losingCategories = 0;
  var playerFruitFromThisType, aiFruitFromThisType, totalFruitFromThisType, fruitType;
  state = JSON.parse(state);

  for (fruitType in state.ground.fruitCount) {
    playerFruitFromThisType = state.player.score[fruitType];
    aiFruitFromThisType = state.score[fruitType];
    totalFruitFromThisType = state.ground.fruitCount[fruitType];
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

  var fruitTypesCount = state.ground.fruitTypes.length;
  if (winningCategories * 2 > fruitTypesCount) {
    return Number.POSITIVE_INFINITY;
  }
  if (winningCategories * 2 === fruitTypesCount &&
      losingCategories * 2 === fruitTypesCount) {
    return 0;
  }

  // Add distance heuristic if we are not surely winning and the game is not tied.
  for (var coordinates in state.ground.fruitCoordinates) {
    fruitType = state.ground.fruitCoordinates[coordinates].key;
    playerFruitFromThisType = state.player.score[fruitType];
    aiFruitFromThisType = state.score[fruitType];
    totalFruitFromThisType = state.ground.fruitCount[fruitType];

    if (aiFruitFromThisType * 2 <= totalFruitFromThisType && playerFruitFromThisType * 2 <= totalFruitFromThisType) {
      var diff = Math.abs(aiFruitFromThisType - playerFruitFromThisType);
      var toWin = (totalFruitFromThisType + 1) * 0.5 - Math.max(aiFruitFromThisType, playerFruitFromThisType);
      var aiX = (state.robotSprite.x - state.ground.groundSprite.x) / state.ground.tileSize;
      var aiY = (state.robotSprite.y - state.ground.groundSprite.y) / state.ground.tileSize;
      var playerX = (state.player.robotSprite.x - state.ground.groundSprite.x) / state.ground.tileSize;
      var playerY = (state.player.robotSprite.y - state.ground.groundSprite.y) / state.ground.tileSize;
      coordinates = '[' + coordinates + ']';
      var fruitX = (JSON.parse(coordinates)[0] - state.ground.groundSprite.x) / state.ground.tileSize;
      var fruitY = (JSON.parse(coordinates)[1] - state.ground.groundSprite.y) / state.ground.tileSize;
      var aiDist = Math.abs(aiX - fruitX) + Math.abs(aiY - fruitY);
      var playerDist = Math.abs(playerX - fruitX) + Math.abs(playerY - fruitY);
      score += 0.5 * (1 / aiDist - 1 / playerDist) * 1 / (toWin + diff + 2);
    }
  }

  return score;
};
