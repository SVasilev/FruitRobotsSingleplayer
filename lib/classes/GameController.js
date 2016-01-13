function GameController(player, ai, scoreBoard) {
  this.player = player;
  this.ai = ai;
  this.currentPlayer = 'player';
  this.scoreBoard = scoreBoard;
}

GameController.prototype._updateScore = function() {
  this.scoreBoard.updateScore(this.player.score, this.ai.score);
};

GameController.prototype.switchTurns = function() {
  if (this.currentPlayer === 'player') {
    if (this.player.move()) {
      this._updateScore();
      this.currentPlayer = 'AI';
    }
  }
  else {
    this.ai.move();
    this._updateScore();
    this.currentPlayer = 'player';
  }
};
