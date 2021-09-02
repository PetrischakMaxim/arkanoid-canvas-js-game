function Ball(x, y) {
  this.velocity = 6;
  this.dx = 0;
  this.dy = 0;
  this.x = 440;
  this.y = 440;
  this.width = 40;
  this.height = 40;

  this.start = function () {
    this.dy = -this.velocity;
    this.dx = this.getRandomDirection(-this.velocity, this.velocity);
  };

  this.fly = function () {
    if (this.dy) {
      this.y += this.dy;
    }
    if (this.dx) {
      this.x += this.dx;
    }
  };

  this.collide = function (element) {
    var x = this.x + this.dx;
    var y = this.y + this.dy;

    if (
      x + this.width > element.x && // LEFT
      x < element.x + element.width && //RIGHT
      y + this.height > element.y && // BOTTOM
      y < element.y + element.height // TOP
    ) {
      return true;
    }
    return false;
  };

  this.bumpBlock = function (block) {
    this.dy *= -1;
    this.destroyBlock(block);
  };

  this.destroyBlock = function (block) {
    block.active = false;
  };

  this.bumpPlatform = function (platform) {
    if (platform.dx) {
      this.x += platform.dx;
    }

    if (this.dy > 0) {
      this.dy = -this.velocity;
      var touchX = this.x + this.width / 2;
      this.dx = this.velocity * platform.getTouchOffset(touchX);
    }
  };

  this.collideWorldBounds = function (callback) {
    var x = this.x + this.dx;
    var y = this.y + this.dy;

    var ballLeft = x;
    var ballRight = ballLeft + this.width;
    var ballTop = y;
    var ballBottom = ballTop + this.height;

    var worldLeft = 0;
    var worldRight = game.width;
    var worldTop = 0;
    var worldBottom = game.height;

    if (ballLeft < worldLeft) {
      this.x = 0;
      this.dx = this.velocity;
    } else if (ballRight > worldRight) {
      this.x = worldRight - this.width;
      this.dx = -this.velocity;
    } else if (ballTop < worldTop) {
      this.y = 0;
      this.dy = this.velocity;
    } else if (ballBottom > worldBottom) {
      callback();
    }
  };

  this.getRandomDirection = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
}
