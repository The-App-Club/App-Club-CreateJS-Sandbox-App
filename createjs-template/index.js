// https://qiita.com/tonkotsuboy_com/items/8cc5c77aa91b1a3ac321
// https://www.createjs.com/docs/easeljs/classes/Stage.html
// https://stackoverflow.com/questions/20444891/typeerror-createjs-sprite-is-not-a-constructor
// https://ics.media/tutorial-createjs/displayobject/
// https://ics.media/tutorial-createjs/quickstart/
// https://www.mikechambers.com/blog/files/voronoi/
// https://www.createjs.com/downloads
// https://github.com/paperjs/paper.js/tree/develop/examples/Paperjs.org
// http://paperjs.org/examples/
// http://www.mikechambers.com/blog/2011/03/24/javascript-voronoi-port/

window.addEventListener('load', () => {
  init();
  loop();
});

let stage, shape;

function init() {
  stage = new createjs.Stage('workspace');

  stage.canvas.width = window.innerWidth;
  stage.canvas.height = window.innerHeight;

  shape = new createjs.Shape();
  shape.graphics.beginFill('SkyBlue');
  shape.graphics.drawCircle(0, 0, 100);
  shape.x = 10;
  shape.y = 10;
  stage.addChild(shape);

  const tween = createjs.Tween.get(shape, {loop: true})
    .wait(300)
    .to({x: 270, y: window.innerHeight / 2, scale: 0.2}, 700)
    .to({x: window.innerWidth, y: window.innerHeight, scale: 1.4}, 1200)
    .to({x: window.innerWidth, y: window.innerHeight / 2, scale: 3}, 1200)
    .to({x: 230, y: window.innerHeight, scale: 0.1}, 700);

  // const  tween = createjs.Tween.get(shape, {loop: true})
  //   .wait(300)
  //   .to({x: 270, y: window.innerHeight / 2, scale: 0.2}, 700, (progress) => {
  //     console.log('[step1 tween]', progress);
  //     return tween
  //   })
  //   .to(
  //     {x: window.innerWidth, y: window.innerHeight, scale: 1.4},
  //     1200,
  //     (progress) => {
  //       console.log('[step2 tween]', progress);
  //       return tween
  //     }
  //   )
  //   .to(
  //     {x: window.innerWidth, y: window.innerHeight / 2, scale: 3},
  //     1200,
  //     (progress) => {
  //       console.log('[step3 tween]', progress);
  //       return tween
  //     }
  //   )
  //   .to({x: 230, y: window.innerHeight, scale: 0.1}, 700, (progress) => {
  //     console.log('[step4 tween]', progress);
  //     return tween
  //   });
}

function loop() {
  stage.update();
  requestAnimationFrame(() => loop());
}
