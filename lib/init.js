/* global Phaser, Ground */

var GROUND_SIZE = 8;
var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var currentPlayer = 'player';

function preload() {
  game.load.image('groundTile', './assets/img/grassTile.jpg');
  game.load.image('apple', './assets/img/apple.png');
  game.load.image('banana', './assets/img/banana.png');
  game.load.image('watermelon', './assets/img/watermelon.png');
  game.load.image('playerRobot', './assets/img/playerRobot.png');
  game.load.image('aiRobot', './assets/img/aiRobot.png');
}

function create() {
  var cursors = game.input.keyboard.createCursorKeys();

  this.ground = new Ground(GROUND_SIZE);
  this.player = new Player(this.ground, cursors, 'playerRobot');
  this.ai = new AI(this.ground, 'aiRobot');

  game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
  game.scale.refresh();
}

function update() {
  if (currentPlayer === 'player') {
    if (this.player.move()) {
      currentPlayer = 'AI';
    }
  }
  else {
    this.ai.move();
    currentPlayer = 'player';
  }
}

function render () {
  game.debug.inputInfo(32, 32);
  // var coords = this.world.calculatePlayerCooordinates();
  // this.text.text = 'PositionX: ' + coords.x +
  //       '\nPositionY: ' + coords.y +
  //       '\nTileType: ' + this.party.currentTile() +
  //       '\nRightType: ' + this.party.nextTile('right') +
  //       '\nLeftType: ' + this.party.nextTile('left') +
  //       '\nUpType: ' + this.party.nextTile('up') +
  //       '\nDownType: ' + this.party.nextTile('down');

  // this.text1.text = 'PositionX: ' + this.world.sprite.tilePosition.x +
  //       '\nPositionY: ' + this.world.sprite.tilePosition.y;
  // this.text2.text = 'Next encounter steps: ' + this.world.nextEncounterSteps;
}