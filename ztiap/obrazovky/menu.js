menu = function() {
  var sceneObjects = []
  game.level = false;
  sceneObjects.push(new Background("black_background") );
   sceneObjects.push(new Button('level', canvas.width/2 - 100,50,125,50, "play") );
   sceneObjects.push(new Button('instructions', canvas.width/2 - 125,125,200,50, "instructions") );
   sceneObjects.push(new Button('hscore', canvas.width/2 - 125,185,200,50, "score") );

   sceneObjects.push(new Button('start', canvas.width/2 - 125,250,50,50, "back") );
   sceneObjects.push(new Button('instructions', canvas.width/2 - 50,250,50,50, "options") );
   sceneObjects.push(new Button('sound', canvas.width/2 + 25,250,50,50, "music") );
   

   //sceneObjects.push(new Button('sound',canvas.width - 60,0,60,60, "sound") );
  return sceneObjects;
};