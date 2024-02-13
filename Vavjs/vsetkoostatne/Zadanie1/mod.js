/**
 * u1 - Marek Chrappa
 */

//var gameWidth = 400; //tiles
//var gameHeight = 200; // tiles
var size = 10; //px not important
var roadSize = 60; //tiles

var counter_road= 13;
var counter_edge = 13;

var canv = document.createElement('canvas');
canv.id = 'someId';
canv.width = gameWidth;
canv.height = gameHeight;
ctx = canv.getContext('2d');
ctx.fillStyle = "green";
//?debug=true
var urlParams = new URLSearchParams(window.location.search);
var debug = urlParams.get('debug')  
var debug_mode

if(debug === "true"){
    console.log('debug_mode working ')
    debug_mode = true
}

var button1 = document.createElement("button");
button1.innerHTML = "Reset";
button1.onclick = function(){
    score = 0;
    iter = 0;
    speed = 75;
    playerTx = 1;
    playerTy = Math.floor(gameHeight/2);
    
    clearInterval(ival);
    ival = setInterval(gameLoop,speed);
    generateLine()
    fillRoadLine(line)
}

document.body.appendChild(button1);

button3 = document.createElement("button");
button3.innerHTML = "Start music";
var music
button3.onclick = function(){
    //https://www.bensound.com/royalty-free-music/track/inspire
    music = new Audio('https://www.bensound.com/bensound-music/bensound-inspire.mp3');
    music.play();

    if(debug_mode)
        console.log("Start music")
}
document.body.appendChild(button3);

button4 = document.createElement("button");
button4.innerHTML = "Stop music";
button4.onclick = function(){
    if(debug_mode)
        console.log("Stop music")
    music.pause()
}
document.body.appendChild(button4);

let textNode = document.createTextNode(""); 
    document.body.appendChild(textNode);

var GrassImage = new Image();
GrassImage.onload = function(){
    image.src = this.src;   
};
GrassImage.src = 'https://images.pexels.com/photos/1587548/pexels-photo-1587548.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
//https://www.pexels.com/photo/top-view-photo-of-grass-1587548/
var PlayerImage = new Image();
PlayerImage.onload = function(){
    image.src = this.src;   
};
PlayerImage.src = 'https://cdn.pixabay.com/photo/2017/07/11/09/18/van-2492912_960_720.png';
//https://pixabay.com/vectors/van-vintage-cartoon-vehicle-2492912/


var RoadImage = new Image();
RoadImage.onload = function(){
    image.src = this.src;   
};
RoadImage.src = 'https://media.istockphoto.com/photos/white-studio-background-picture-id1040250650?b=1&k=20&m=1040250650&s=612x612&w=0&h=b-ijOD-3NFHSgUW7cwBel6j4ubmIQDS8Q7jOjTO2U08=';
//https://www.pexels.com/search/grey/

var RedImage = new Image();
RedImage.onload = function(){
    image.src = this.src;   
};
RedImage.src = 'https://www.publicdomainpictures.net/pictures/200000/nahled/plain-red-background.jpg';
//https://www.freepik.com/free-photos-vectors/red-texture

var WhiteImage = new Image();
WhiteImage.onload = function(){
    image.src = this.src;   
};
WhiteImage.src = 'https://img.freepik.com/free-photo/textured-background-white-tone_53876-128610.jpg?w=2000';
//https://www.freepik.com/free-photos-vectors/white-texture

generateLine();

var gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    document.body.appendChild(canv);
    document.getElementById('game-container').appendChild(canv); 

window.drawWithStyle = function(points,style) {
    for(var g=0;g<points.length;g++) {
        if(typeof points[g] !== 'undefined') {
            if(style == 'red')
                img = RedImage
            else
                img = WhiteImage 
            ctx.drawImage(img, points[g][0],  points[g][1], counter_edge,counter_edge);             
        }
    }
    if(debug_mode){
        console.log("Draw lines")
    }
}

function drawroad(points,style)
{
    for(var g=0;g<points.length;g=g+counter_road) {
        if(typeof points[g] !== 'undefined') {            
            ctx.drawImage(RoadImage, points[g][0],  points[g][1], counter_road, counter_road);
        }
    }
    if(debug_mode){
        console.log("Draw Road")
    }
}

function Stats(){
    if(debug_mode)
        console.log("Draw Stats")
    textNode.nodeValue = "Stats: Speed:"  + speed + " Score: " + score
}
setInterval(Stats, 1000);


window.drawPlayer = function(tx,ty) {
    ctx.drawImage(PlayerImage, tx, ty, 48, 48);
    
    if(prevTx === -1) prevPlayerPoints = [];
    prevTx = tx;
    prevTy = ty;
    if(debug_mode){
        console.log("Draw car")
    }
}

window.undrawLine = function() {
    ctx.drawImage(GrassImage, 0,  0, canv.width, canv.height);  
}

window.fillEdgeLine = function(line) {
    var edgeLine = [];
    for(var i=0;i<line.length;i = i + counter_edge) {
        edgeLine.push([line[i][0],line[i][1]-roadSize]);
        edgeLine.push([line[i][0],line[i][1]+roadSize]);
    }
    return edgeLine;
}

var road = []
window.drawLine = function(line) {

    var linePoints = fillLinePoints(line); 
    road = fillRoadLine(linePoints);
    drawroad(road,'darkgrey');

    var edge = fillEdgeLine(linePoints);
    drawEdgeLine(edge)
}

var playerTx = 1;
var playerTy = Math.floor(gameHeight/2);

document.addEventListener('keydown',function(ev){
    if(ev.keyCode === 38 ||ev.keyCode === 84 ) movePlayer(-24);
    else if(ev.keyCode === 40 || ev.keyCode === 71) movePlayer(24);
    else if(ev.keyCode === 32 || ev.keyCode === 13) {
        grid();
        testBump();
    }
});