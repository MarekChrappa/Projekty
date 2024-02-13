const resourceManager = new ResourceManager();

window.onmousemove = function (event){
  game.onmousemove(event);
}
window.onmousedown = function (event){
  game.onmousedown(event);
}
window.onmouseup = function (event){
  game.onmouseup(event);
}
window.onmousemove = function (event){
  game.onmousemove(event);
}
window.onkeydown= function(event){
	keys[event.keyCode]= true;
}
window.onkeyup= function(event){
	keys[event.keyCode] =false
}
var keys={};
var game = new Game(document.getElementById("canvas"));
    game.start();

