var canv = document.createElement('canvas');
canv.id = 'someId';
canv.width = 1600;
canv.height = 800;
const ctx = canv.getContext('2d');


function drawPlayer(tx,ty) {
    console.log("cc")
    let base_image = new Image();
    base_image.src = 'https://cdn.pixabay.com/photo/2020/01/19/15/02/ufo-4778062_960_720.png';
        // https://pixabay.com/vectors/ufo-alien-ship-spaceship-alien-4778062/ copiright
        base_image.onload = function(){
            ctx.drawImage(base_image, tx * 48,ty * 48, 48, 48);
        }
}
function grid() {
 

    var gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    document.body.appendChild(canv); // adds the canvas to the body element
    document.getElementById('game-container').appendChild(canv); // adds the canvas to #someBox


    /*
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
    */
}


grid();
drawPlayer(10,10);


document.addEventListener('keydown',function(ev){
    if(ev.keyCode === 38 ||ev.keyCode === 84 ) movePlayer(-1);
    else if(ev.keyCode === 40|| ev.keyCode === 71) movePlayer(1);
    else if(ev.keyCode === 32 || ev.keyCode === 13) {
        grid();
        testBump();
    }
});