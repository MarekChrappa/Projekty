level = function() {
  var sceneObjects = []
  game.level = true;
  game.lvl = 1;
  game.trvanie = 0;
  game.body  = 0;
  game.enems = 5;
  game.enems2 = 1;

  setInterval(() => game.timer(), 2000)

  this.nodes = []
  
  sceneObjects.push(new Background("background") );
  sceneObjects.push(new Button('menu',0,0,60,60, "home") );
  sceneObjects.push(new Button('sound',canvas.width - 60,0,60,60, "music") );
  sceneObjects.push(new hrac() );

  sceneObjects.push(new text('HP: ', 125, 40, 40));
  sceneObjects.push(new hptext(200, 40, 40));

  sceneObjects.push(new text('score: ', 550, 40, 40));
  sceneObjects.push(new sctext(700, 40, 40));

  sceneObjects.push(new text('Vlna: ', 1000, 40, 40));
  sceneObjects.push(new lvltext(1125, 40, 40));

  for (let i = 0; i < 2; i++) {
    sceneObjects.push(new en1(0));
    }
  
  sceneObjects.push(new en2(100,100));
  return sceneObjects;
};