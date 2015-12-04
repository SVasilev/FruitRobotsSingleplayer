function Player(ground, cursors, robotImage) {
  Robot.call(this, ground, robotImage);
  this.cursors = cursors;
}

Player.prototype.move = function() {
  var directions = ['left', 'right', 'up', 'down'];
  for (var i = 0; i < directions.length; i++) {
    var direction = directions[i];
    if (this.cursors[direction].isDown) {
      game.input.keyboard.reset();
      return Robot.prototype.move.call(this, direction);
    }
  }
};
