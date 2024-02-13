gover = function() {
    var sceneObjects = []
    game.level = false

    if(game.body > game.bestscore)
      game.bestscore = game.body
    sceneObjects.push(new Background("black_background") );
    
    sceneObjects.push(new text("Game Over",canvas.width/2 - 100,100,40));
    sceneObjects.push(new text("Tvoje score: ",canvas.width/2 - 100,150,25));
    sceneObjects.push(new sctext(canvas.width/2 + 100 ,150,25));

    sceneObjects.push(new Button('level', canvas.width/2 - 50,200,125,50, "play") );
    sceneObjects.push(new Button('hscore',canvas.width/2 - 80,270,180,60, "score") );
    sceneObjects.push(new Button('menu',canvas.width/2 - 80,350,60,60, "home") );
     sceneObjects.push(new Button('menu',canvas.width/2 + 38,350,60,60, "options") );
    return sceneObjects;
  };
