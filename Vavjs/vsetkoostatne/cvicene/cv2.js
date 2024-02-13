const element = document.getElementById("button");
element.addEventListener("click", myFunction);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function myFunction() {

    ctx.fillStyle = "#FF00FF";
    ctx.fillRect(50, 50, 250, 150);
  }