function ScoreBoard(scoreBoardSprite, fruitTypes) {
  this.scoreBoardSprite = game.add.sprite(game.width - 620, 50, scoreBoardSprite);
  this.fruitTypes = fruitTypes;
  this.player1Score = {};
  this.player2Score = {};

  this._drawScores();
};

ScoreBoard.prototype._drawScores = function() {
  var player1Coords = {
    x: game.width - this.scoreBoardSprite.width / 1.28,
    y: game.height - this.scoreBoardSprite.height / 0.85
  };
  var player2Coords = {
    x: game.width - this.scoreBoardSprite.width / 4.2,
    y: game.height - this.scoreBoardSprite.height / 0.93
  };
  var fontStyle = { font: 'italic 15pt Comic Sans MS', fill: '#000000' };

  for (var i = 0; i < this.fruitTypes.length; i++) {
    var currentFruit = this.fruitTypes[i];
    this.player1Score[currentFruit] = game.add.text(player1Coords.x, player1Coords.y + i * 37, '0', fontStyle);
    this.player2Score[currentFruit] = game.add.text(player2Coords.x, player2Coords.y + i * 37, '0', fontStyle);
  }
};

ScoreBoard.prototype.updateScore = function(player1CurrentScore, player2CurrentScore) {
  for (var i = 0; i < this.fruitTypes.length; i++) {
    var fruitType = this.fruitTypes[i];
    this.player1Score[fruitType].setText(player1CurrentScore[fruitType]);
    this.player2Score[fruitType].setText(player2CurrentScore[fruitType]);
  }
};
