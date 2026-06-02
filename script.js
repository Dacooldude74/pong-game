// ===============================
// PONG 2: OOOGAA BOOGA EDITION
// ===============================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let ball = {
  x: 400,
  y: 250,
  vx: 5,
  vy: 3,
  speedBoost: 1
};

let leftY = 200;
let rightY = 200;

let scoreL = 0;
let scoreR = 0;

let keys = {};

// trail particles
let trail = [];

// AI mode toggle (set true for single player chaos)
let AI_MODE = true;

// input
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// reset ball with chaos
function resetBall(direction = 1) {
  ball.x = 400;
  ball.y = 250;

  let angle = (Math.random() * 2 - 1) * 0.8;

  ball.vx = direction * (5 + Math.random() * 2);
  ball.vy = angle * 5;

  ball.speedBoost = 1;
}

// collision helper
function hitPaddle(px, py) {
  return (
    ball.x < px + 10 &&
    ball.x > px &&
    ball.y > py &&
    ball.y < py + 100
  );
}

// update logic
function update() {

  // PLAYER CONTROLS (left)
  if (keys["w"]) leftY -= 6;
  if (keys["s"]) leftY += 6;

  // RIGHT PADDLE (AI or player)
  if (AI_MODE) {
    // simple chasing AI with delay
    rightY += ((ball.y - (rightY + 50)) * 0.08);
  } else {
    if (keys["ArrowUp"]) rightY -= 6;
    if (keys["ArrowDown"]) rightY += 6;
  }

  // ball movement
  ball.x += ball.vx * ball.speedBoost;
  ball.y += ball.vy * ball.speedBoost;

  // trail effect
  trail.push({ x: ball.x, y: ball.y });
  if (trail.length > 20) trail.shift();

  // wall bounce (gets faster)
  if (ball.y <= 0 || ball.y >= 500) {
    ball.vy *= -1.05;
  }

  // paddle collisions (adds spin)
  if (hitPaddle(10, leftY)) {
    let hitPos = (ball.y - leftY) / 100;
    ball.vx = Math.abs(ball.vx) + 0.5;
    ball.vy = (hitPos - 0.5) * 8;
  }

  if (hitPaddle(780, rightY)) {
    let hitPos = (ball.y - rightY) / 100;
    ball.vx = -Math.abs(ball.vx) - 0.5;
    ball.vy = (hitPos - 0.5) * 8;
  }

  // speed ramps up over time
  ball.speedBoost += 0.002;

  // scoring
  if (ball.x < 0) {
    scoreR++;
    resetBall(1);
  }

  if (ball.x > 800) {
    scoreL++;
    resetBall(-1);
  }

  // rage mode (if one player dominates)
  if (Math.abs(scoreL - scoreR) >= 5) {
    ball.speedBoost = 2.5;
  }

  document.getElementById("score").innerText =
    `OOOGAA ${scoreL} - ${scoreR} BOOGA`;
}

// draw everything
function draw() {

  // screen shake when fast
  let shake = ball.speedBoost > 2 ? Math.random() * 4 : 0;

  ctx.save();
  ctx.translate(shake, shake);

  // background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 500);

  // trail
  for (let i = 0; i < trail.length; i++) {
    ctx.fillStyle = `rgba(0,255,0,${i / trail.length})`;
    ctx.fillRect(trail[i].x, trail[i].y, 6, 6);
  }

  // center line
  ctx.fillStyle = "gray";
  for (let i = 0; i < 500; i += 20) {
    ctx.fillRect(400, i, 2, 10);
  }

  // paddles
  ctx.fillStyle = "white";
  ctx.fillRect(10, leftY, 10, 100);
  ctx.fillRect(780, rightY, 10, 100);

  // ball (gets bigger when fast)
  ctx.fillStyle = "lime";
  let size = 10 + ball.speedBoost;
  ctx.fillRect(ball.x, ball.y, size, size);

  ctx.restore();
}

// loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

resetBall();
loop();
