# JavaScript Physics Simulations

This project contains a collection of JavaScript-based physics simulations rendered on an HTML `<canvas>`. It demonstrates various physical concepts such as gravity, collision detection, and energy conservation.

<video controls src="20260327-2251-35.1047710.mp4" title="Title"></video>

## Files & Simulations

The project consists of three main simulation scripts, each offering a different experiment. To switch between them, simply update the `<script>` tag in `index.html`.

### 1. `CollideAndMultiply.js` (Current Default)

A simulation of multiple balls moving in a 2D space.

- **Features:**
  - Multiple balls with elastic collision detection.
  - Boundary checking (walls, floor, ceiling).
  - Configurable gravity and damping settings.
  - Kinetic energy calculation.
- **Key Classes/Functions:** `Ball`, `elasticCollision`.

### 2. `gravitylike-index.js`

A simulation of a single ball bouncing under the influence of gravity.

- **Features:**
  - Realistic gravity simulation (`gravity * dt`).
  - Horizontal and vertical motion.
  - Coefficient of restitution (energy loss on bounce).
  - Automatic restart when motion stops.
- **Key Variables:** `gravity`, `CoffRestY`, `CoffRestX`.

### 3. `index.js`

A simpler bouncing ball implementation.

- **Features:**
  - Basic vertical bouncing logic.
  - Height dampening on each bounce.
  - Simple state management (`dy`, `direction`).

## How to Run

1. Open `index.html` in your web browser.
2. The simulation will start automatically on the canvas.

## Customization

To run a different simulation:

1. Open `index.html` in a code editor.
2. Locate the script tag:
   ```html
   <script src="CollideAndMultiply.js"></script>
   ```
