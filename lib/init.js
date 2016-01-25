/* global Phaser, Ground, Robot */

var GROUND_SIZE = 8;
var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('backgroundImage', './assets/img/backgroundImage.jpg');
  game.load.image('picnicBlanket', './assets/img/picnicBlanket.jpg');
  game.load.image('apple', './assets/img/apple.png');
  game.load.image('banana', './assets/img/banana.png');
  game.load.image('watermelon', './assets/img/watermelon.png');
  game.load.image('playerRobot', './assets/img/playerRobot.png');
  game.load.image('aiRobot', './assets/img/aiRobot.png');
  game.load.image('scoreboard', './assets/img/scoreboard.png');
}

function create() {
  game.add.tileSprite(0, 0, 1280, 720, 'backgroundImage');

  var fruitTypes = ['banana', 'apple', 'watermelon'];
  var cursors = game.input.keyboard.createCursorKeys();

  var scoreBoard = new ScoreBoard('scoreboard', fruitTypes);
  var ground = new Ground(GROUND_SIZE, 'picnicBlanket', fruitTypes);
  var player = new Player(ground, cursors, 'playerRobot');
  var ai = new AI(ground, 'aiRobot', player);
  this.gameController = new GameController(player, ai, scoreBoard);

  game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
  game.scale.refresh();
}

function update() {
  this.gameController.switchTurns();
}
