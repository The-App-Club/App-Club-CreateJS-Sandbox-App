import * as TWEEN from '@tweenjs/tween.js';
import * as easeljs from '@createjs/easeljs';

function refresh() {
  initStages();
  initText();
  initCircles();
}

function init() {
  initStages();
  initText();
  initCircles();
  animate();
}

function initStages() {
  offsetX = (window.innerWidth - parameter.textCanvasDomWidth) / 2;
  offsetY = (window.innerHeight - parameter.textCanvasDomWidth / 2) / 2;
  textCanvasDom = new easeljs.Stage('text');
  textCanvasDom.canvas.width = parameter.textCanvasDomWidth;
  textCanvasDom.canvas.height = parameter.textCanvasDomHeight;

  backgroundCanvasDom = new easeljs.Stage('background');
  backgroundCanvasDom.canvas.width = window.innerWidth;
  backgroundCanvasDom.canvas.height = window.innerHeight;
}

function initText() {
  // https://www.createjs.com/docs/easeljs/classes/Text.html
  textDom = new easeljs.Text(
    defaultText,
    `${parameter.fontSize}px '${fontFamilyName}'`,
    defaultTextColor
  );
  textDom.textAlign = 'center';
  textDom.x = parameter.textCanvasDomWidth / 2;
}

function initCircles() {
  circles = [];
  for (let i = 0; i < parameter.textCanvasDomWidth; i++) {
    // ここが画像とかにできると面白そう
    const shapeDom = new easeljs.Shape();
    const r = 7;
    const x = window.innerWidth * Math.random();
    const y = window.innerHeight * Math.random();
    const color = colors[Math.floor(i % colors.length)];
    const alpha = 0.2 + Math.random() * 0.5;
    shapeDom.alpha = alpha;
    shapeDom.radius = r;
    shapeDom.graphics.beginFill(color).drawCircle(0, 0, r);
    shapeDom.x = x;
    shapeDom.y = y;
    circles.push(shapeDom);
    backgroundCanvasDom.addChild(shapeDom);
    shapeDom.movement = 'float';
    tweenCircle(shapeDom);
  }
}

function animate() {
  backgroundCanvasDom.update();
  requestAnimationFrame(animate);
}

function tweenCircle(circleDom, dir) {
  // https://greensock.com/docs/v2/TweenLite
  if (circleDom.tween) {
    circleDom.tween.kill();
  }
  if (dir == 'in') {
    circleDom.tween = TweenLite.to(circleDom, 0.4, {
      x: circleDom.originX,
      y: circleDom.originY,
      ease: Quad.easeInOut,
      alpha: 1,
      radius: 5,
      scaleX: 0.4,
      scaleY: 0.4,
      onComplete: function () {
        circleDom.movement = 'jiggle';
        tweenCircle(circleDom);
      },
    });
  } else if (dir == 'out') {
    circleDom.tween = TweenLite.to(circleDom, 0.8, {
      x: window.innerWidth * Math.random(),
      y: window.innerHeight * Math.random(),
      ease: Quad.easeInOut,
      alpha: 0.2 + Math.random() * 0.5,
      scaleX: 1,
      scaleY: 1,
      onComplete: function () {
        circleDom.movement = 'float';
        tweenCircle(circleDom);
      },
    });
  } else {
    if (circleDom.movement == 'float') {
      circleDom.tween = TweenLite.to(circleDom, 5 + Math.random() * 3.5, {
        x: circleDom.x + -100 + Math.random() * 180,
        y: circleDom.y + -100 + Math.random() * 180,
        ease: Quad.easeInOut,
        alpha: 0.2 + Math.random() * 0.5,
        onComplete: function () {
          tweenCircle(circleDom);
        },
      });
    } else {
      circleDom.tween = TweenLite.to(circleDom, 0.05, {
        x: circleDom.originX + Math.random() * 3,
        y: circleDom.originY + Math.random() * 3,
        ease: Quad.easeInOut,
        onComplete: function () {
          tweenCircle(circleDom);
        },
      });
    }
  }
}

function formText() {
  for (let i = 0, l = textPixels.length; i < l; i++) {
    circles[i].originX = offsetX + textPixels[i].x;
    circles[i].originY = offsetY + textPixels[i].y;
    tweenCircle(circles[i], 'in');
  }
  textFormed = true;
  if (textPixels.length < circles.length) {
    for (let j = textPixels.length; j < circles.length; j++) {
      circles[j].tween = TweenLite.to(circles[j], 0.4, {alpha: 0.1});
    }
  }
}

function explode() {
  for (let i = 0, l = textPixels.length; i < l; i++) {
    tweenCircle(circles[i], 'out');
  }
  if (textPixels.length < circles.length) {
    for (let j = textPixels.length; j < circles.length; j++) {
      circles[j].tween = TweenLite.to(circles[j], 0.4, {alpha: 1});
    }
  }
}
function updateText(t) {
  textDom.text = t;
  textDom.font = `${parameter.fontSize}px '${fontFamilyName}'`;
  textDom.textAlign = 'center';
  textDom.x = parameter.textCanvasDomWidth / 2;
  textDom.y = parameter.textCanvasDomHeight / 4;
  textCanvasDom.addChild(textDom);
  textCanvasDom.update();

  const textCanvasDomContext = document.getElementById('text').getContext('2d');
  const pixelData = textCanvasDomContext.getImageData(
    0,
    0,
    parameter.textCanvasDomWidth,
    parameter.textCanvasDomHeight
  ).data;
  textPixels = [];
  // このロジックでキャンバスに描いたテキストの座標を取得しているのがすごい
  for (let i = pixelData.length; i >= 0; i -= 4) {
    if (pixelData[i] !== 0) {
      const x = (i / 4) % parameter.textCanvasDomWidth;
      const y = Math.floor(Math.floor(i / parameter.textCanvasDomWidth) / 4);
      if (x && x % 8 == 0 && y && y % 8 == 0) {
        textPixels.push({
          x: x,
          y: y + parameter.textCanvasDomHeight / 16 + parameter.fontDeltaPosY,
        });
      }
    }
  }

  textCanvasDomContext.clearRect(
    0,
    0,
    parameter.textCanvasDomWidth,
    parameter.textCanvasDomHeight
  );

  formText();
}

function createText(t) {
  textDom.text = t;
  textDom.font = `${parameter.fontSize}px '${fontFamilyName}'`;
  textDom.textAlign = 'center';
  textDom.x = parameter.textCanvasDomWidth / 2;
  textDom.y = parameter.textCanvasDomHeight / 4;
  textCanvasDom.addChild(textDom);
  textCanvasDom.update();

  const textCanvasDomContext = document.getElementById('text').getContext('2d');
  const pixelData = textCanvasDomContext.getImageData(
    0,
    0,
    parameter.textCanvasDomWidth,
    parameter.textCanvasDomHeight
  ).data;
  textPixels = [];
  // このロジックでキャンバスに描いたテキストの座標を取得しているのがすごい
  for (let i = pixelData.length; i >= 0; i -= 4) {
    if (pixelData[i] !== 0) {
      const x = (i / 4) % parameter.textCanvasDomWidth;
      const y = Math.floor(Math.floor(i / parameter.textCanvasDomWidth) / 4);
      if (x && x % 8 == 0 && y && y % 8 == 0) {
        textPixels.push({x: x, y: y + parameter.textCanvasDomHeight / 16});
      }
    }
  }

  textCanvasDomContext.clearRect(
    0,
    0,
    parameter.textCanvasDomWidth,
    parameter.textCanvasDomHeight
  );

  formText();
}

function handleInputText(event) {
  const inputDom = document.getElementById('inputText');
  if (textFormed) {
    explode();
    if (inputDom.value != '') {
      setTimeout(() => {
        createText(inputDom.value);
      }, 800);
    } else {
      textFormed = false;
    }
  } else {
    createText(inputDom.value);
  }
}

let fontFamilyName = `Source Sans Pro`;
let defaultText = 'Default Text';
let defaultTextColor = '#eee';
let backgroundCanvasDom, textCanvasDom;
let circles, textPixels, textFormed;
let offsetX, offsetY, textDom;
const colors = ['#B2949D', '#FFF578', '#FF5F8D', '#37A9CC', '#188EB2'];

let stats;
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = 0;
stats.domElement.style.top = 0;
document.body.appendChild(stats.domElement);

let parameter = {
  fontSize: 120,
  fontDeltaPosY: 0,
  textCanvasDomWidth: window.innerHeight,
  textCanvasDomHeight: window.innerHeight / 2,
};

let controllerInfo = {
  'Font Size': 120,
  'Font Delta Pos Y': 0,
  Animation: () => {
    handleInputText();
  },
};

const gui = new dat.GUI();
gui.width = 300;
gui.add(controllerInfo, 'Font Size', 60, 150, 1).onChange((event) => {
  detectChangeParameter(event, 'Font Size');
});
gui.add(controllerInfo, 'Font Delta Pos Y', -300, 300, 1).onChange((event) => {
  detectChangeParameter(event, 'Font Delta Pos Y');
});
gui.add(controllerInfo, 'Animation');

function detectChangeParameter(event, keyName) {
  if (keyName === 'Font Size') {
    parameter.fontSize = event;
  }
  if (keyName === 'Font Delta Pos Y') {
    parameter.fontDeltaPosY = event;
  }
  refresh();
  const inputDom = document.getElementById('inputText');
  updateText(inputDom.value);
}

function loop() {
  requestAnimationFrame(loop);
  stats.begin();
  stats.end();
}

loop();

window.addEventListener('load', init);
window.addEventListener('resize', refresh);
