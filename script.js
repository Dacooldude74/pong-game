// OOOGAA BOOGA PONG (REAL WEB VERSION)

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let ball = { x: 400, y: 250, vx: 5, vy: 3 };

let left = 200;
let right = 200;

let scoreL = 0;
let scoreR = 0;

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function resetBall() {
  ball.x = 400;
  ball.y = 250;
  ball.vx = (Math.random() > 0.5 ? 5 : -5);
  ball.vy = (Math.random() * 6 - 3);
}

function update() {

  // controls
  if (keys["w"]) left -= 6;
  if (keys["s"]) left += 6;
  if (keys["ArrowUp"]) right -= 6;
  if (keys["ArrowDown"]) right += 6;

  // ball movement
  ball.x += ball.vx;
  ball.y += ball.vy;

  // walls
  if (ball.y <= 0 || ball.y >= 500) ball.vy *= -1;

  // paddles
  if (ball.x < 30 && ball.y > left && ball.y < left + 100) {
    ball.vx *= -1;
  }

  if (ball.x > 770 && ball.y > right && ball.y < right + 100) {
    ball.vx *= -1;
  }

  // scoring
  if (ball.x < 0) {
    scoreR++;
    resetBall();
  }

  if (ball.x > 800) {
    scoreL++;
    resetBall();
  }

  document.getElementById("score").innerText = `${scoreL} - ${scoreR}`;
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 500);

  // paddles
  ctx.fillStyle = "white";
  ctx.fillRect(10, left, 10, 100);
  ctx.fillRect(780, right, 10, 100);

  // ball
  ctx.fillRect(ball.x, ball.y, 10, 10);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
