const ctx = test.getContext("2d");
const edge = 700;
const radius = 20;
test.width = edge;
test.height = edge;
console.log(ctx);
function clear() {
  //   console.log("cleari");
  ctx.fillStyle = "rgba(22, 22, 22, 0.4)";
  ctx.fillRect(0, 0, edge, edge);
}
function ball({ x, y }) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(93, 255, 6)";
  ctx.arc(x, y - radius, radius, 0, 2 * Math.PI);
  ctx.fill();
}
function trasnxy({ x, y }) {
  return {
    x: x,
    y: edge - y,
  };
}

let dy = edge - 2 * radius;
// tweek these dont be shy
const FPS = 120;
let direction = -1;
let speed = 8;
let bounceCount = 0;
let h = edge;

function motion() {
  if (dy <= 0) {
    bounceCount += 1;
    direction = +1;
    h = h * 0.9; // you can add other loss functions to mimic real life scenarios
  } else if (dy >= h - 2 * radius) {
    direction = -1;
  }
  console.log(bounceCount);
  dy = dy + speed * direction; // upgrade to variable speed like gravity
  clear();
  ball(trasnxy({ x: edge / 2, y: dy }));
}
setInterval(motion, 1000 / FPS);
