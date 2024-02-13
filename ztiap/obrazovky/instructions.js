instructions = function() {
  var sceneObjects = []
  sceneObjects.push(new Background("black_background") );
   //sceneObjects.push(new Button('menu',0,0,60,60, "home") );
   sceneObjects.push(new Button('menu',0,0,60,60, "back") );
   
   sceneObjects.push(new text("Instructions:",canvas.width/2 - 100,100,25));
   sceneObjects.push(new text("Pohyb - W, A, S, D alebo šipky",canvas.width/2 - 132,150,25));
   sceneObjects.push(new text("Strelba - spacebar",canvas.width/2 - 180,200,25));
  return sceneObjects;
};

