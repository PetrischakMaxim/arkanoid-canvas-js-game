function Game(ball, platform) {
  var me = this;
  this.ctx = null;
  this.width = 960;
  this.height = 540;
  this.blocks = [];
  this.rows = 3;
  this.cols = 6;
  this.score = 0;
  this.running = false;

  this.ball = ball;
  this.platform = platform;

  this.sounds = {
    jump: null,
    bump: null,
    theme: null,
    gameOver: null,
    winner: null,
  };

  this.sprites = {
    ball: null,
    platform: null,
    block: null,
  };

  this.controls = {
    key37: false,
    key39: false,
    key32: false,
  };

  this.init = function () {
    this.running = true;
    this.ctx = document.getElementById("mycanvas").getContext("2d");
    this.setEvents();
    this.setTextFont();
  };

  this.setKey = function (keyCode, keyState) {
    this.controls["key" + keyCode] = keyState;
  };

  this.handleKeyDown = function () {
    if (this.controls.key32) {
      me.platform.fire();
      me.playSound("theme");
    }
    if (this.controls.key37) {
      me.platform.moveLeft();
    }
    if (this.controls.key39) {
      me.platform.moveRight();
    }
  };

  this.setTextFont = function () {
    this.ctx.font = "20px Ubuntu, Helvetica, sans-serif";
    this.ctx.fillStyle = "black";
  };

  this.setEvents = function () {
    window.addEventListener("keydown", function (evt) {
      me.setKey(evt.keyCode, true);
      me.handleKeyDown();
    });

    window.addEventListener("keyup", function (evt) {
      me.setKey(evt.keyCode, false);
      me.platform.stop();
    });
  };

  this.preload = function (callback) {
    var loaded = 0;
    var totalSpritesLength = Object.getOwnPropertyNames(this.sprites).length;
    var totalSoundsLength = Object.getOwnPropertyNames(this.sounds).length;
    var totalForPreload = totalSpritesLength + totalSoundsLength;

    var onResourceLoad = function () {
      ++loaded;
      if (loaded >= totalForPreload) {
        callback();
      }
    };

    this.loadSprites(onResourceLoad);
    this.loadSounds(onResourceLoad);
  };

  this.loadSprites = function (callback) {
    for (var key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = "assets/img/" + key + ".png";
      this.sprites[key].addEventListener("load", callback);
    }
  };

  this.loadSounds = function (callback) {
    for (var key in this.sounds) {
      this.sounds[key] = new Audio("assets/sounds/" + key + ".mp3");
      this.sounds[key].addEventListener("canplaythrough", callback, { once: true });
    }
  };

  this.update = function () {
    this.collideBlocks();
    this.collidePlatform();
    this.ball.collideWorldBounds(function () {
      me.end("gameOver");
    });
    this.platform.collideWorldBounds(this.width);
    this.platform.move();
    this.ball.fly();
  };

  this.clear = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
  };

  this.render = function () {
    this.ctx.save();
    this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);
    this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
    this.renderText("Score: " + this.score);
    this.renderBlocks();
    this.ctx.restore();
  };

  this.renderText = function (text) {
    this.ctx.fillText(text, 10, 20);
  };

  this.createBlocks = function () {
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        this.blocks.push(new Block(col, row));
      }
    }
  };

  this.renderBlocks = function () {
    for (var block in this.blocks) {
      var currentBlock = this.blocks[block];
      if (currentBlock.active) {
        this.ctx.drawImage(this.sprites.block, currentBlock.x, currentBlock.y);
      }
    }
  };

  this.collideBlocks = function () {
    for (var block in this.blocks) {
      var currentBlock = this.blocks[block];
      if (currentBlock.active && this.ball.collide(currentBlock)) {
        this.ball.bumpBlock(currentBlock);
        this.playSound("bump");
        this.addScore();
      }
    }
  };

  this.collidePlatform = function () {
    if (this.ball.collide(this.platform)) {
      this.ball.bumpPlatform(this.platform);
      this.playSound("jump");
    }
  };

  this.addScore = function () {
    ++this.score;
    if (this.score >= this.blocks.length) {
      this.end("winner");
    }
  };

  this.run = function () {
    if (this.running) {
      window.requestAnimationFrame(function () {
        me.update();
        me.clear();
        me.render();
        me.run();
      });
    }
  };

  this.start = function () {
    me.init();

    me.preload(function () {
      me.update();
      me.createBlocks();
      me.run();
    });
  };

  this.end = function (sound) {
    this.running = false;
    this.pauseSound("theme");
    this.playSound(sound, me.reload);
  };

  this.reload = function () {
    window.location.reload();
  };

  this.playSound = function (sound, callback) {
    this.sounds[sound].play();
    if (callback) {
      this.sounds[sound].addEventListener("ended", callback);
    }
  };

  this.pauseSound = function (sound) {
    this.sounds[sound].pause();
  };
}
