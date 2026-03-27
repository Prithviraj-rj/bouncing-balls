const canvas = document.getElementById("test");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;
const BALL_RADIUS = 20;
const GRAVITY = 0; // Set to 0 for zero-gravity field, or any positive value for gravity
const DAMPING = 1; // Reduced damping for zero-gravity (balls move freely)
const FPS = 60;
const DT = 1 / FPS;
const speedScale = 1.75;
const maxBalls = 50; // enter less then 3 to generate random balls

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// ==================== BALL CLASS ====================
class Ball {
  constructor(x, y, vx, vy, radius = BALL_RADIUS, color = "#00FF00") {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
    this.mass = 1; // All balls have equal mass
    this.collisionCooldown = 0;
  }

  update(dt) {
    // Apply gravity
    this.vy += GRAVITY * dt;

    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Damping
    this.vx *= DAMPING;
    this.vy *= DAMPING;

    // Boundary collision - walls
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx = -this.vx * 0.95;
    }
    if (this.x + this.radius > CANVAS_WIDTH) {
      this.x = CANVAS_WIDTH - this.radius;
      this.vx = -this.vx * 0.95;
    }

    // Boundary collision - floor and ceiling
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy = -this.vy * 0.95;
    }
    if (this.y + this.radius > CANVAS_HEIGHT) {
      this.y = CANVAS_HEIGHT - this.radius;
      this.vy = -this.vy * 0.95;
    }

    // Update cooldown
    if (this.collisionCooldown > 0) {
      this.collisionCooldown--;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Calculate kinetic energy
  getKineticEnergy() {
    return 0.5 * this.mass * (this.vx * this.vx + this.vy * this.vy);
  }
}

// ==================== PHYSICS ====================
function elasticCollision(ball1, ball2) {
  const dx = ball2.x - ball1.x;
  const dy = ball2.y - ball1.y;
  const distSquared = dx * dx + dy * dy;
  const dist = Math.sqrt(distSquared);

  // Don't process if balls are not actually colliding
  if (dist > ball1.radius + ball2.radius) return false;
  if (dist < 0.1) return false;

  // Normalize collision vector
  const nx = dx / dist;
  const ny = dy / dist;

  // Separate overlapping balls
  const overlap = ball1.radius + ball2.radius - dist;
  const separationX = (nx * overlap) / 2 + 0.1;
  const separationY = (ny * overlap) / 2 + 0.1;

  ball1.x -= separationX;
  ball1.y -= separationY;
  ball2.x += separationX;
  ball2.y += separationY;

  // Relative velocity
  const dvx = ball2.vx - ball1.vx;
  const dvy = ball2.vy - ball1.vy;

  // Relative velocity along collision normal
  const dvn = dvx * nx + dvy * ny;

  // Don't process if moving apart
  if (dvn >= 0) return false;

  // For equal mass elastic collision, exchange velocity components along normal
  // Formula: v1' = v1 + dvn * n, v2' = v2 - dvn * n
  ball1.vx += dvn * nx;
  ball1.vy += dvn * ny;
  ball2.vx -= dvn * nx;
  ball2.vy -= dvn * ny;

  return true;
}

function getRandomColor() {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
    "#F8B739",
    "#52D273",
    "#FF85A1",
    "#4D96FF",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
/**
 * Returns a random integer between min (inclusive) and max (exclusive).
 */
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

// Example: Generates a random number between 1 and 9 (e.g., 1, 2, ..., 8, 9, but never 10)
console.log(getRandomInt(1, 10));

// ==================== MAIN ====================
let balls = [
  // new Ball(
  //   getRandomInt(1, 1200),
  //   getRandomInt(1, 1200),
  //   getRandomInt(400, 600),
  //   getRandomInt(400, 600),
  //   BALL_RADIUS,
  //   "#FF6B6B",
  // ),
  // new Ball(
  //   getRandomInt(1, 1200),
  //   getRandomInt(1, 1200),
  //   getRandomInt(-600, -400),
  //   getRandomInt(-600, -400),
  //   BALL_RADIUS,
  //   "#FF6B6B",
  // ),
  // new Ball(
  //   getRandomInt(1, 1200),
  //   getRandomInt(1, 1200),
  //   getRandomInt(900, 1600),
  //   getRandomInt(900, 1600),
  //   BALL_RADIUS,
  //   "#FF6B6B",
  // ),
  new Ball(750, 400, -500, 550, BALL_RADIUS, "#4ECDC4"),
  new Ball(-750, 400, -500, 550, BALL_RADIUS, "#4ECDC4"),
  new Ball(760, 400, -500, 550, BALL_RADIUS, "#4ECDC4"),
];

const collisionPairs = new Set();

function animate() {
  // Clear canvas
  ctx.fillStyle = "#0a0a0a9f";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Update and draw all balls
  balls.forEach((ball) => {
    ball.update(DT);
    ball.draw();
  });

  // Broad-phase and narrow-phase collision detection
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const ball1 = balls[i];
      const ball2 = balls[j];

      const dx = ball2.x - ball1.x;
      const dy = ball2.y - ball1.y;
      const distSquared = dx * dx + dy * dy;
      const minDist = ball1.radius + ball2.radius;

      // Collision detected
      if (distSquared < minDist * minDist) {
        const pairKey = `${i}-${j}`;
        // console.log(collisionPairs.size);

        if (!collisionPairs.has(pairKey)) {
          // First contact - apply collision physics
          if (elasticCollision(ball1, ball2)) {
            collisionPairs.add(pairKey);

            // Generate new ball from collision (with average energy/velocity)
            if (
              ball1.collisionCooldown === 0 &&
              ball2.collisionCooldown === 0
            ) {
              const newX = (ball1.x + ball2.x) / 2;
              const newY = (ball1.y + ball2.y) / 2;
              const newVx = (speedScale * (ball1.vx + ball2.vx)) / 2; // Increase velocity by 1.5x
              const newVy = (speedScale * (ball1.vy + ball2.vy)) / 2;

              const newBall = new Ball(
                newX,
                newY,
                newVx,
                newVy,
                BALL_RADIUS,
                getRandomColor(),
              );
              newBall.collisionCooldown = 30; // Prevent immediate re-collision

              // If too many balls, remove the oldest one to maintain performance

              if (balls.length >= maxBalls) {
                balls.shift(); // Remove first (oldest) ball
              }

              balls.push(newBall);

              ball1.collisionCooldown = 30;
              ball2.collisionCooldown = 30;

              console.log(`Collision! Total balls: ${balls.length}`);
            }
          }
        }
      } else {
        // No longer colliding - remove from tracking
        const pairKey = `${i}-${j}`;
        if (collisionPairs.has(pairKey)) {
          collisionPairs.delete(pairKey);
        }
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();
