function AI(ground, robotImage) {
  Robot.call(this, ground, robotImage);
}

AI.prototype.move = function() {
  var randomDirection = ['left', 'right', 'up', 'down'][Math.floor(Math.random() * 4)];
  Robot.prototype.move.call(this, randomDirection);
};
