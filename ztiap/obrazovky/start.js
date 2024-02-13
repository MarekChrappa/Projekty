start = function() {
    var sceneObjects = []
     sceneObjects.push(new Background("black_background") );
     sceneObjects.push(new Button('menu', canvas.width/2 - 100,150,100,50, "play") );
     
     
     sceneObjects.push(new obraz('hrac',300, -250, 200, 200,  0.8 ));  
     sceneObjects.push(new obraz('en3'   ,550,  325, 200, 200,  -0.3 ));
     sceneObjects.push(new obraz('boss'   ,1000,  0, 200, 200,  0 ));  
    return sceneObjects;
  };