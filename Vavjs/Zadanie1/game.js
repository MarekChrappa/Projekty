
var gameWidth = 400; //tiles
var gameHeight = 200; // tiles
var size = 10; //px
var roadSize = 6; //tiles

function addStyle() {
    var style = document.createElement('STYLE');
    style.innerHTML = 'table,th,td { min-width: '+size+'px; height: '+size+'px; }';
    document.body.appendChild(style);
}
addStyle();

function grid() {
    var gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';
    var gameTable = document.getElementById('game-table');
    if(gameTable === null) {
        gameTable = document.createElement('table');
        gameTable.id = 'game-table';
        gameContainer.appendChild(gameTable);
    }

    var tableString = '<tbody>';
    for(var y=0;y<gameHeight;y++) {
        tableString += '<tr>';
        for(var x=0;x<gameWidth;x++) {
            tableString += '<td data-p="'+x+','+y+'"></td>';
        }
        tableString += '</tr>';
    }
    tableString += '</tbody>';
    
    gameTable.innerHTML = tableString;
}

function drawWithStyle(points,style) {
    for(var i=0;i<points.length;i++) {
        if(typeof points[i] !== 'undefined') {
            var pe = document.querySelector('td[data-p="'+points[i][0]+','+points[i][1]+'"]');
            if(pe !== null) pe.className = style;
        }
        else console.log('points['+i+'] is undefined');
    }
}

var prevTx = -1;
var prevTy = -1;
function drawPlayer(tx,ty) {
    var playerPoints = [
        [tx,ty+1],[tx+1,ty+1],[tx+2,ty+1],[tx+3,ty+1],[tx+4,ty+1],
    ];
    var wheels = [
        [tx,ty],[tx+3,ty],
        [tx,ty+2],[tx+3,ty+2]
    ];

    var prevPlayerPoints = [
        [prevTx,prevTy],[prevTx+3,prevTy],
        [prevTx,prevTy+1],[prevTx+1,prevTy+1],[prevTx+2,prevTy+1],[prevTx+3,prevTy+1],[prevTx+4,prevTy+1],
        [prevTx,prevTy+2],[prevTx+3,prevTy+2]
    ];

    if(prevTx === -1) prevPlayerPoints = [];
    prevTx = tx;
    prevTy = ty;

    drawWithStyle(prevPlayerPoints,'road');
    drawWithStyle(playerPoints,'car');
    drawWithStyle(wheels,'wheel');
}

function random(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

var line = [];
function generateLine() {
    for(var i=0;i<gameWidth*2;i++) line.push(Math.floor(gameHeight/2));
}
generateLine();

function undrawLine() {
    var linePoints = document.querySelectorAll('.road,.red,.white');
    for(var i=0;i<linePoints.length;i++) {
        linePoints[i].className = '';
    }
}

function fillRoadLine(line) {
    var roadLine = [];
    for(var i=0;i<line.length;i++) {
        for(var j=-roadSize+1;j<roadSize;j++) {
            roadLine.push([line[i][0],line[i][1]+j]);
        }
    }
    return roadLine;
}
function fillEdgeLine(line) {
    var edgeLine = [];
    for(var i=0;i<line.length;i++) {
        edgeLine.push([line[i][0],line[i][1]-roadSize]);
        edgeLine.push([line[i][0],line[i][1]+roadSize]);
    }
    return edgeLine;
}

function fillLinePoints(line) {
    return line.filter(function(point,index){
        return index < gameWidth;
    }).map(function(point,index){
        return [index,point];
    });
}

function drawEdgeLine(line) {
    var red = [];
    var white = [];
    var div = 6;
    var th = 2;
    var iterd = iter % div;
    var redDivs = [];
    var whiteDivs = [];
    if(iterd === 0) {
        redDivs = [0,1,2];
        whiteDivs = [3,4,5];
    }
    else if (iterd === 1) {
        redDivs = [0,1,5];
        whiteDivs = [2,3,4];
    }
    else if (iterd === 2) {
        redDivs = [0,4,5];
        whiteDivs = [1,2,3];
    }
    else if (iterd === 3) {
        redDivs = [3,4,5];
        whiteDivs = [0,1,2];
    }
    else if (iterd === 4) {
        redDivs = [2,3,4];
        whiteDivs = [0,1,5];
    }
    else if (iterd === 5) {
        redDivs = [1,2,3];
        whiteDivs = [0,4,5];
    }
    red = line.filter(function(point,index){
        var point0d = point[0] % div;
        return redDivs.indexOf(point0d) > -1;
    });
    white = line.filter(function(point,index){
        var point0d = point[0] % div;
        return whiteDivs.indexOf(point0d) > -1;
    });
    drawWithStyle(red,'red');
    drawWithStyle(white,'white');
}

function drawLine(line) {
    var linePoints = fillLinePoints(line); 
    var road = fillRoadLine(linePoints);
    drawWithStyle(road,'road');
    var edge = fillEdgeLine(linePoints);
    drawEdgeLine(edge);
}

function moveLine(){
    line.shift();
    line.push(Math.floor(gameHeight/2));
}

function bumpLine() {
    var gW = gameWidth;
    var gW2 = gW/2;
    var gW4 = gW/4;
    var gH = gameHeight;
    var gH2 = gH/2;
    var bump = random(0,gH-1);

    var bumpOffset = bump - gH2;
    if(bump < gH2) bumpOffset = gH2 - bump;
    if(bump !== Math.floor(gH2)) {
        var bx = gW+gW2;
        var by = bump;
        var sx = gW+1;
        var sy = gH2;
        var xx = gW+gW4;
        var xy = ((bump - gH2)/2)+gH2; 
        if(bump < gH2) xy = bump + (bumpOffset/2);
        var mx = gW+gW2;
        var my = gH2;
        var slope = gW2 / bumpOffset; //old Math.floor(gW/2) / (Math.floor(gH/2) - bump);
        var ox = gW+gW2;
        var oy = xy - (slope * (ox-xx));
        if(bump < gH2) oy = (slope * (ox-xx)) + xy;
        var r = by-oy;
        if(bump < gH2) r = oy-by;
        var ex = gW-2;
        var ey = Math.floor(gH/2);
        for(var i=gW+1;i<(gW*2)-1;i++) {
            var fx = i;
            line[i] = Math.floor(Math.sqrt((r*r)-((fx-ox)*(fx-ox)))+oy);
            if(bump < gH2) line[i] = -Math.floor(Math.sqrt((r*r)-((fx-ox)*(fx-ox)))-oy);
        }
    }
    else {
        for(var i=gW+1;i<(gW*2)-1;i++) {
            line[i] = Math.floor(gH2);
        }
    }
}

function collision() {
    var tx = playerTx;
    var ty = playerTy;
    var playerPoints = [
        [tx,ty],[tx+3,ty],
        [tx,ty+1],[tx+1,ty+1],[tx+2,ty+1],[tx+3,ty+1],[tx+4,ty+1],
        [tx,ty+2],[tx+3,ty+2]
    ];

    var linePoints = fillLinePoints([line[0],line[1],line[2],line[3],line[4],line[5]]);
    var megaLinePoints = fillRoadLine(linePoints).concat(fillEdgeLine(linePoints));;

    var allIn = true;
    playerPoints.forEach(function(playerPoint){
        var isIn = false;
        megaLinePoints.forEach(function(linePoint){
            if(playerPoint[0] === linePoint[0] && playerPoint[1] === linePoint[1]) isIn = true;
        });
        if(!isIn) allIn = false;
    });
    return !allIn;
}

grid();
var playerTx = 1;
var playerTy = Math.floor(gameHeight/2);

var iter = 0;
var speed = 75;
var score = 0;
function gameLoop(){
    undrawLine();
    if((iter % gameWidth) === 0 && iter !== 0) bumpLine();
    moveLine();
    drawLine(line);
    drawPlayer(playerTx,playerTy);
    if((iter % (gameWidth * 3)) === 0 && iter !== 0) {
        if(speed > 5) {
            speed = Math.floor(speed * 0.8);
            console.log('faster: '+speed);
            clearInterval(ival);
            ival = setInterval(gameLoop,speed);
        }
    }

    if(collision()) {
        console.log('collision');
        clearInterval(ival);
    }
    iter++;
    score += speed;
}
var ival = setInterval(gameLoop,speed);

function movePlayer(points) {
    playerTy = playerTy + points;
    if(playerTy<0) playerTy=0;
    if(playerTy > gameHeight-3) playerTy = gameHeight-3;
}

document.addEventListener('keydown',function(ev){
    if(ev.keyCode === 38) movePlayer(-1);
    else if(ev.keyCode === 40) movePlayer(1);
    else if(ev.keyCode === 32 || ev.keyCode === 13) {
        grid();
        testBump();
    }
});
