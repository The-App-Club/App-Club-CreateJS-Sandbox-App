/// @ts-check
import * as p5 from 'p5';

const mycode = (p, isDebug = true, stats, parameter) => {
  // https://p5js.org/examples/instance-mode-instantiation.html
  // https://codepen.io/jacorre/pen/bgbNXr
  class Bullet {
    constructor(x, y, angle, speed, radius) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.speed = speed;
      this.radius = radius;
    }

    move() {
      this.x = this.x + Math.cos(this.angle) * this.speed;
      this.y = this.y + Math.sin(this.angle) * this.speed;
    }

    draw() {
      p.circle(this.x, this.y, this.radius);
    }
  }

  let bullets = [];

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
  };

  p.draw = () => {
    p.clear();
    stats.update();
    p.background(parameter.backgroundColor);

    if (isDebug) {
      console.log(
        '[global info]',
        p.frameCount,
        p.mouseX,
        p.mouseY,
        p.width,
        p.height
      );
    }

    if (p.frameCount % 10 === 0) {
      const angle = p.atan2(
        p.mouseY - parameter.fireStartOffsetY,
        p.mouseX - parameter.fireStartOffsetX
      );
      const bullet = new Bullet(
        parameter.fireStartOffsetX,
        parameter.fireStartOffsetY,
        angle,
        parameter.bulletSpeed,
        parameter.bulletRadius
      );
      bullets.push(bullet);
    }

    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i];
      bullet.move();
      bullet.draw();
    }

    // ステージ範囲外は描画対象外
    bullets = bullets.filter((bullet) => {
      return (
        bullet.x >= 0 &&
        bullet.x < p.width &&
        bullet.y >= 0 &&
        bullet.y < p.height
      );
    });
  };
};

let myp5;
let isDebug = false;

let parameter = {
  fireStartOffsetX: 111,
  fireStartOffsetY: 111,
  bulletSpeed: 11,
  bulletRadius: 10,
  backgroundColor: `#eeeeee`,
};

let stats;
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = 0;
stats.domElement.style.top = 0;
document.body.appendChild(stats.domElement);

let controllerInfo = {
  'Fire Start OffsetX': parameter.fireStartOffsetX,
  'Fire Start OffsetY': parameter.fireStartOffsetY,
  'Bullet Radius': parameter.bulletRadius,
  'Bullet Speed': parameter.bulletSpeed,
  'Background Color': parameter.backgroundColor,
};

const gui = new dat.GUI();
gui.width = 300;
gui.addColor(controllerInfo, 'Background Color').onChange((event) => {
  detectChangeParameter(event, 'Background Color');
});
gui
  .add(controllerInfo, 'Fire Start OffsetX', 100, window.innerWidth, 1)
  .onChange((event) => {
    detectChangeParameter(event, 'Fire Start OffsetX');
  });
gui
  .add(controllerInfo, 'Fire Start OffsetY', 100, window.innerHeight, 1)
  .onChange((event) => {
    detectChangeParameter(event, 'Fire Start OffsetY');
  });
gui.add(controllerInfo, 'Bullet Radius', 1, 100, 0.1).onChange((event) => {
  detectChangeParameter(event, 'Bullet Radius');
});
gui.add(controllerInfo, 'Bullet Speed', 1, 100, 1).onChange((event) => {
  detectChangeParameter(event, 'Bullet Speed');
});

function detectChangeParameter(event, keyName) {
  if (keyName === 'Background Color') {
    parameter.backgroundColor = event;
  }
  if (keyName === 'Fire Start OffsetX') {
    parameter.fireStartOffsetX = event;
  }
  if (keyName === 'Fire Start OffsetY') {
    parameter.fireStartOffsetY = event;
  }
  if (keyName === 'Bullet Radius') {
    parameter.bulletRadius = event;
  }
  if (keyName === 'Bullet Speed') {
    parameter.bulletSpeed = event;
  }
  initialize();
}

function initialize() {
  if (myp5) {
    myp5.remove();
  }
  myp5 = new p5((p) => {
    mycode(p, isDebug, stats, parameter);
  });
}

initialize();
