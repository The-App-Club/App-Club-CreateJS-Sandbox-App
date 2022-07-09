import * as p5 from 'p5';

const mycode = (p, isDebug = true, stats, parameter) => {
  let bullets = [];
  let bullet;
  // https://zenn.dev/baroqueengine/books/a19140f2d9fc1a/viewer/fa4900#%E5%8A%9B%E3%81%A8%E9%81%8B%E5%8B%95%E6%96%B9%E7%A8%8B%E5%BC%8F
  // https://medium.com/@patrickferris17/teach-physics-and-programming-from-the-browser-4e22229d8a0a
  // https://codepen.io/patricoferris/pen/djRbQv?editors=0010
  class Bullet {
    constructor(position, mass, radius, velocity, acceleration, angle) {
      this.position = position;
      this.velocity = velocity;
      this.mass = mass;
      this.radius = radius;
      this.velocity = velocity;
      this.acceleration = acceleration;
      this.angle = angle;
    }

    applyForce(force) {
      force.mult(this.mass);
      // force.add(p.createVector(p.cos(this.angle), p.sin(this.angle)));
      this.acceleration.add(force);
    }

    move() {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
    }

    render() {
      p.circle(this.position.x, this.position.y, this.radius);
    }
  }

  p.windowResized = () => {
    // https://p5js.org/reference/#/p5/windowResized
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);

    bullet = new Bullet(
      p.createVector(parameter.fireStartOffsetX, parameter.fireStartOffsetY),
      parameter.mass,
      parameter.bulletRadius,
      p.createVector(parameter.bulletVelocityX, parameter.bulletVelocityY),
      p.createVector(
        parameter.bulletAccelerationX,
        parameter.bulletAccelerationY
      )
    );
  };

  p.draw = () => {
    p.clear();
    stats.update();
    p.background(parameter.backgroundColor);

    if (p.frameCount % parameter.frameCount === 0) {
      const baseAngle = p.atan2(
        p.mouseY - parameter.fireStartOffsetY,
        p.mouseX - parameter.fireStartOffsetX
      );
      const angle = baseAngle;
      bullet = new Bullet(
        p.createVector(parameter.fireStartOffsetX, parameter.fireStartOffsetY),
        parameter.mass,
        parameter.bulletRadius,
        p.createVector(parameter.bulletVelocityX, parameter.bulletVelocityY),
        p.createVector(
          parameter.bulletAccelerationX,
          parameter.bulletAccelerationY
        ),
        angle
      );

      bullets.push(bullet);
    }

    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i];
      bullet.applyForce(p.createVector(parameter.forceX, parameter.forceY));
      bullet.move();
      bullet.render();
    }
  };
};

let myp5;
let isDebug = false;

let parameter = {
  frameCount: 60,
  fireStartOffsetX: window.innerWidth / 2,
  fireStartOffsetY: window.innerHeight / 2,
  bulletVelocityX: 0,
  bulletVelocityY: 0,
  bulletAccelerationX: 0,
  bulletAccelerationY: 0,
  forceX: 0,
  forceY: 0,
  mass: 1,
  bulletRadius: 30,
  backgroundColor: `#eeeeee`,
};

let stats;
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = 0;
stats.domElement.style.top = 0;
document.body.appendChild(stats.domElement);

let controllerInfo = {
  'Frame Count': parameter.frameCount,
  'Fire Start OffsetX': parameter.fireStartOffsetX,
  'Fire Start OffsetY': parameter.fireStartOffsetY,
  'Bullet Velocity X': parameter.bulletVelocityX,
  'Bullet Velocity Y': parameter.bulletVelocityY,
  'Bullet Acceleration X': parameter.bulletAccelerationX,
  'Bullet Acceleration Y': parameter.bulletAccelerationY,
  'Force X': parameter.forceX,
  'Force Y': parameter.forceY,
  Mass: parameter.mass,
  'Bullet Radius': parameter.bulletRadius,
  'Background Color': parameter.backgroundColor,
};

const gui = new dat.GUI();
gui.width = 300;
gui.add(controllerInfo, 'Frame Count', 1, 60, 1).onChange((event) => {
  detectChangeParameter(event, 'Frame Count');
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
gui
  .add(controllerInfo, 'Bullet Velocity X', -10, 10, 0.01)
  .onChange((event) => {
    detectChangeParameter(event, 'Bullet Velocity X');
  });
gui
  .add(controllerInfo, 'Bullet Velocity Y', -10, 10, 0.01)
  .onChange((event) => {
    detectChangeParameter(event, 'Bullet Velocity Y');
  });
gui
  .add(controllerInfo, 'Bullet Acceleration X', -10, 10, 0.01)
  .onChange((event) => {
    detectChangeParameter(event, 'Bullet Acceleration X');
  });
gui
  .add(controllerInfo, 'Bullet Acceleration Y', -10, 10, 0.01)
  .onChange((event) => {
    detectChangeParameter(event, 'Bullet Acceleration Y');
  });
gui.add(controllerInfo, 'Force X', -1, 1, 0.0001).onChange((event) => {
  detectChangeParameter(event, 'Force X');
});
gui.add(controllerInfo, 'Force Y', -1, 1, 0.0001).onChange((event) => {
  detectChangeParameter(event, 'Force Y');
});
gui.add(controllerInfo, 'Mass', 0.1, 10, 0.1).onChange((event) => {
  detectChangeParameter(event, 'Mass');
});
gui.add(controllerInfo, 'Bullet Radius', 1, 100, 1).onChange((event) => {
  detectChangeParameter(event, 'Bullet Radius');
});
gui.addColor(controllerInfo, 'Background Color').onChange((event) => {
  detectChangeParameter(event, 'Background Color');
});

function detectChangeParameter(event, keyName) {
  if (keyName === 'Frame Count') {
    parameter.frameCount = event;
  }
  if (keyName === 'Fire Start OffsetX') {
    parameter.fireStartOffsetX = event;
  }
  if (keyName === 'Fire Start OffsetY') {
    parameter.fireStartOffsetY = event;
  }
  if (keyName === 'Bullet Velocity X') {
    parameter.bulletVelocityX = event;
  }
  if (keyName === 'Bullet Velocity Y') {
    parameter.bulletVelocityY = event;
  }
  if (keyName === 'Force X') {
    parameter.forceX = event;
  }
  if (keyName === 'Force Y') {
    parameter.forceY = event;
  }
  if (keyName === 'Mass') {
    parameter.mass = event;
  }
  if (keyName === 'Bullet Acceleration X') {
    parameter.bulletAccelerationX = event;
  }
  if (keyName === 'Bullet Acceleration Y') {
    parameter.bulletAccelerationY = event;
  }
  if (keyName === 'Bullet Radius') {
    parameter.bulletRadius = event;
  }
  if (keyName === 'Background Color') {
    parameter.backgroundColor = event;
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
