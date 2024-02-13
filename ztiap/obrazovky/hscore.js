hscore = function() {
    var sceneObjects = []
    sceneObjects.push(new Background("black_background") );
    sceneObjects.push(new text("Najlepšie score:",canvas.width/2 - 250,100,25));
    sceneObjects.push(new text(game.bestscore,canvas.width/2,100,25));
    
    sceneObjects.push(new text("Tvoje score: ",canvas.width/2 - 250,200,25));
    sceneObjects.push(new text(game.body,canvas.width/2 ,200,25));

    sceneObjects.push(new Button('menu', canvas.width - 60,0,60,60, "back") );
    sceneObjects.push(new Button('start',0,0,60,60, "home") );

    sceneObjects.push(new obraz('blue',-10,350,1400,100));
    return sceneObjects;
  };