import * as TWEEN from "@tweenjs/tween.js";

const boxDom = document.createElement("div");
boxDom.style.setProperty("background-color", "#008800");
boxDom.style.setProperty("width", "100px");
boxDom.style.setProperty("height", "100px");
document.body.appendChild(boxDom);

// Setup the animation loop.
function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}
requestAnimationFrame(animate);

const coords = { x: 0, y: 0 }; // Start at (0, 0)
const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
  .to({ x: 300, y: 200 }, 1000) // Move to (300, 200) in 1 second.
  .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
  .onUpdate(() => {
    // Called after tween.js updates 'coords'.
    // Move 'box' to the position described by 'coords' with a CSS translation.
    boxDom.style.setProperty(
      "transform",
      `translate(${coords.x}px, ${coords.y}px)`
    );
  });
tween.start();