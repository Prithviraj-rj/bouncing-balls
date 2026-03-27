const ctx = test.getContext("2d");
const edge = 900;
const r = 10;
test.width = edge;
test.height = edge;
console.log(ctx);
function clear() {
  //   console.log("cleari");
  ctx.fillStyle = "rgba(7, 7, 7, 0.6)";
  ctx.fillRect(0, 0, edge, edge);
}
function ball({ x, y }) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(93, 255, 6)";
  ctx.arc(x + r, y - r, r, 0, 2 * Math.PI);
  ctx.fill();
}

function corner({ x, y }) {
  ctx.beginPath();
  ctx.fillStyle = "rgba(43, 43, 42, 1)";
  ctx.arc(x + r, y - r, r, 0, 2 * Math.PI);
  ctx.fill();
}
function trasnxy({ x, y }) {
  return {
    x: x,
    y: edge - y,
  };
}
const x0 = 0;
const xmax = edge - 2 * r;
const y0 = 0;
const ymax = edge - 2 * r;

let dy = ymax;
let dx = 50;

const FPS = 30;
const dt = 1 / FPS;
const gravity = 900; // pixels per second squared
// coefficient of restitution change range 0 to 1
const CoffRestY = 1; // energy loss on bounce in y
const CoffRestX = 1; // energy loss on bounce in x
let Vy = 0; // pixels per second(initital velocity)
let bounceCounty = 0;
let bounceCountx = 0;
let prevVy;
let prevVx;
const VxInitial = 500;
let Vx = VxInitial;

function motion() {
  // Update position based on current velocity
  dy = dy - Vy * dt;
  dx = dx + Vx * dt;

  let bounced = false;

  // Check for bounce at bottom FIRST
  if (dy <= y0) {
    bounceCounty += 1;
    dy = 0;
    bounced = true;
    // Reverse Vy and apply energy loss
    Vy = -Vy * CoffRestY;

    // console.log((Vy * CoffRestY).toFixed(2));
    // console.log(
    //   "Bounce #" + bounceCount + ", Vy: " + Math.abs(Vy.toFixed(2)),
    // );
  }

  // Apply gravity ONLY if there's energy loss or ball didn't bounce with perfect elasticity
  if (CoffRestY < 1 || !bounced) {
    Vy = Vy + gravity * dt;
  }

  //   console.log(Math.abs((gravity * dt).toFixed(2)) + "hello");
  //   if (Math.abs((gravity * dt).toFixed(2)) <= 0.01) {
  //     console.log("hit");
  //   }
  //cheack if bounce at boundaries
  if (dx <= x0 || dx >= xmax) {
    Vx = -Vx * CoffRestX;
  }

  // stop/ restart condition - only when there's actual energy loss
  if (CoffRestY < 1 || CoffRestX < 1) {
    if (prevVy && prevVx) {
      const deltaVy = Vy - prevVy;
      const deltaVx = Vx - prevVx;
      if (Math.abs(deltaVy.toFixed(4)) + Math.abs(deltaVx.toFixed(4)) < 0.1) {
        Vy = 0;
        Vx = VxInitial;
        bounceCounty = 0;
        prevVy = null;
        prevVx = null;
        dy = ymax;
        dx = 50;
        console.log("Restarted after " + bounceCounty + " bounces");
      }
      // console.log(deltaVy.toFixed(2));
    }
  }

  prevVy = Vy;
  prevVx = Vx;
  clear();
  ball(trasnxy({ x: dx, y: dy }));
  corner(trasnxy({ x: xmax + r, y: ymax + r }));
  corner(trasnxy({ x: x0 - r, y: y0 - r }));
  corner(trasnxy({ x: x0 - r, y: ymax + r }));
  corner(trasnxy({ x: xmax + r, y: y0 - r }));
  // console.log(Vy);
}
setInterval(motion, 1000 / FPS);
// clear();
// ball(trasnxy({ x: xmax, y: ymax }));
// ball(trasnxy({ x: x0, y: y0 }));
// ball(trasnxy({ x: x0, y: ymax }));
// ball(trasnxy({ x: xmax, y: y0 }));
