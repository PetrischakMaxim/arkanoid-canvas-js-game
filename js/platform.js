function Platform(ball) {
    this.x = 340;
    this.y = 480;
    this.width = 251;
    this.height = 41;
    this.velocity = 12;
    this.dx = 0;
    this.ball = ball;

    this.moveLeft = function () {
        this.dx = -this.velocity;
    };

    this.moveRight = function () {
        this.dx = this.velocity;
    };

    this.stop = function () {
        this.dx = 0;
    };

    this.move = function () {
        if (this.dx) {
            this.x += this.dx;
            if (this.ball) {
                this.ball.x += this.dx;
            }
        }
    };

    this.fire = function () {
        if (this.ball) {
            this.ball.start();
            this.ball = null;
        }
    };

    this.getTouchOffset = function (x) {
        var diff = this.x + this.width - x; // RIGHT
        var offset = this.width - diff; // LEFT
        var result = (2 * offset) / this.width;
        return result - 1;
    };

    this.collideWorldBounds = function (width) {
        var platformLeft = this.x + this.dx;
        var platformRight = platformLeft + this.width;
        var worldLeft = 0;
        var worldRight = width;

        if (platformLeft < worldLeft || platformRight > worldRight) {
            this.dx = 0;
        }
    };
}