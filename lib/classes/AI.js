// Inherit methods from Robot base class
AI.prototype = Object.create(Robot.prototype);
AI.prototype.constructor = AI;

function AI(ground, robotImage, player) {
  Robot.call(this, ground, robotImage);
  this.player = player;
  this.minimaxAlgorithm = new Minimax(this);
}

AI.prototype.move = function() {
  Robot.prototype.move.call(this, this.minimaxAlgorithm.getDirection());
};

AI.prototype.extractEssentials = function() {
  var result = Robot.prototype.extractEssentials.call(this);
  result.ground = this.ground.extractEssentials();
  result.player = this.player.extractEssentials();
  result.player.ground = result.ground;
  return result;
};
