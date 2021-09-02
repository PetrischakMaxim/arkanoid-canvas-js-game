var ball = new Ball();
var platform = new Platform(ball);
var game = new Game(ball, platform);

document.addEventListener("DOMContentLoaded", game.start);
