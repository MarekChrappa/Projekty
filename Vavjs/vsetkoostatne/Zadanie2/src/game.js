//Marek Chrappa

class Game {
    constructor(player_id, player_name, car, max_game_id ) {
        console.log(car)
        if(car == 1)
            this.car_url = 'https://cdn.pixabay.com/photo/2017/07/11/09/18/van-2492912_960_720.png'
        if(car == 2)
            this.car_url = 'https://banner2.cleanpng.com/20171212/423/vector-retro-green-car-5a3091e79d6474.2514898815131325196447.jpg'
        if(car == 3)
            this.car_url = 'https://e7.pngegg.com/pngimages/770/844/png-clipart-car-graphic-design-vehicles-compact-car-car.png'

        
        this.draw = 2;

        this.red = []
        this.white = []
        this.road = []
        this.wheels = [];
        this.playerPoints = []
        
        this.player_id = player_id;
        this.player_name = player_name;
        this.game_id = max_game_id;

        this.score = 0;
        this.speed = 0;


        this.gameWidth = 800; //tiles
        this.gameHeight = 400; // tiles
        this.size = 10;
        this.roadSize = 60;
        this.counter_road= 3;
        this.counter_edge = 3;

        this.playerTx = 1;
        this.playerTy = Math.floor(this.gameHeight/2);
    
        this.iter = 0;
        this.speed = 75;
        this.score = 0;

        this.prevTx = -1;
        this.prevTy = -1;

        this.line = [];

      //game
    }

    getScore()
    {
        return this.score
    }

    getSpeed()
    {
        return this.speed
    }

    add_to_database()
    {
        var gg = {
            id: this.game_id,
            score: 0,
            speed: 0,
            user_id: this.player_id,
            user_name: this.player_name,
        }
        return gg
    }

    start_game(){
        this.generateLine();
        this.ival = setInterval(this.gameLoop.bind(this),this.speed);
    }

    drawPlayer(tx,ty) {
        this.playerPoints = [
            [tx,ty+1],[tx+1,ty+1],[tx+2,ty+1],[tx+3,ty+1],[tx+4,ty+1],
        ];
        this.wheels = [
            [tx,ty],[tx+3,ty],
            [tx,ty+2],[tx+3,ty+2]
        ];

        var prevPlayerPoints = [
            [this.prevTx,this.prevTy],[this.prevTx+3,this.prevTy],
            [this.prevTx,this.prevTy+1],[this.prevTx+1,this.prevTy+1],[this.prevTx+2,this.prevTy+1],[this.prevTx+3,this.prevTy+1],[this.prevTx+4,this.prevTy+1],
            [this.prevTx,this.prevTy+2],[this.prevTx+3,this.prevTy+2]
        ];

        if(this.prevTx === -1) prevPlayerPoints = [];
        this.prevTx = tx;
        this.prevTy = ty;

        //drawWithStyle(prevPlayerPoints,'road');
        //drawWithStyle(playerPoints,'car');
        //drawWithStyle(wheels,'wheel');

    }

    random(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }


    fillRoadLine(line) {
        var roadLine = [];
        for(var i=0;i<line.length;i++) {
            for(var j=-this.roadSize+1;j<this.roadSize;j++) {
                roadLine.push([line[i][0],line[i][1]+j]);
            }
        }
        return roadLine;
    }
    fillEdgeLine(line) {
        var edgeLine = [];
        for(var i=0;i<line.length;i++) {
            edgeLine.push([line[i][0],line[i][1]-this.roadSize]);
            edgeLine.push([line[i][0],line[i][1]+this.roadSize]);
        }
        return edgeLine;
    }

    generateLine() {
        for(var i=0;i<this.gameWidth*2;i++) this.line.push(Math.floor(this.gameHeight/2));
    }

    fillLinePoints(line) {
        var help = this.gameWidth
        return line.filter(function(point,index){
            return index < help;
        }).map(function(point,index){
            return [index,point];
        });
    }

    drawEdgeLine(line) {
        this.red = [];
        this.white = [];

        var div = 6;
        var th = 2;
        var iterd = this.iter % div;
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
        this.red = line.filter(function(point,index){
            var point0d = point[0] % div;
            return redDivs.indexOf(point0d) > -1;
        });
        this.white = line.filter(function(point,index){
            var point0d = point[0] % div;
            return whiteDivs.indexOf(point0d) > -1;
        });
    }

    getPoints()
    {
        this.ReturnPoints = [
            {
                draw: this.draw
            },
            {
                style: 'red',
                points: this.red
            },
            {
                style: 'white',
                points: this.white
            },
            {
                style: 'gray',
                points: this.road
            },
            {
                style: 'car',
                points: this.playerPoints,
                url: this.car_url
            },
        ]
        //console.log(this.car_url)

        if(this.draw == 2)
            this.draw = 1;
        return this.ReturnPoints;
    }

    drawLine(line) {
        var linePoints = this.fillLinePoints(line); 
        this.road = this.fillRoadLine(linePoints);
        //drawWithStyle(road,'road');
        var edge = this.fillEdgeLine(linePoints);
        this.drawEdgeLine(edge);
    }



    bumpLine() {
        var gW = this.gameWidth;
        var gW2 = gW/2;
        var gW4 = gW/4;
        var gH = this.gameHeight;
        var gH2 = gH/2;
        var bump = this.random(0,gH-1);

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
                this.line[i] = Math.floor(Math.sqrt((r*r)-((fx-ox)*(fx-ox)))+oy);
                if(bump < gH2) this.line[i] = -Math.floor(Math.sqrt((r*r)-((fx-ox)*(fx-ox)))-oy);
            }
        }
        else {
            for(var i=gW+1;i<(gW*2)-1;i++) {
                line[i] = Math.floor(gH2);
            }
        }
    }

    collision() {
        var tx = this.playerTx;
        var ty = this.playerTy;
        var playerPoints = [
            [tx,ty],[tx+3,ty],
            [tx,ty+1],[tx+1,ty+1],[tx+2,ty+1],[tx+3,ty+1],[tx+4,ty+1],
            [tx,ty+2],[tx+3,ty+2]
        ];

        var linePoints = this.fillLinePoints([this.line[0],this.line[1],this.line[2],this.line[3],this.line[4],this.line[5]]);
        var megaLinePoints = this.fillRoadLine(linePoints).concat(this.fillEdgeLine(linePoints));;

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

    moveLine()
    {
        this.line.shift();
        this.line.push(Math.floor(this.gameHeight/2));
    }

    gameLoop(){
        //undrawLine();
        if((this.iter % this.gameWidth) === 0 && this.iter !== 0) 
            this.bumpLine();
        this.moveLine();

        this.drawLine(this.line);
        this.drawPlayer(this.playerTx,this.playerTy);
        if((this.iter % (this.gameWidth * 3)) === 0 && this.iter !== 0) {
            if(this.speed > 5) {
                this.speed = Math.floor(this.speed * 0.8);
                console.log('faster: '+this.speed);
                clearInterval(this.ival);
                this.ival = setInterval(this.gameLoop.bind(this),this.speed);
            }
        }

        if(this.collision()) {
            console.log('collision');
            this.draw = 0;
            clearInterval(this.ival);
        }
        this.iter++;
        this.score += this.speed;
    }
            
    movePlayer(points) {
        this.playerTy = this.playerTy + points;
        if(this.playerTy<0) this.playerTy=0;
        if(this.playerTy > this.gameHeight-3) this.playerTy = this.gameHeight-3;
    }
}

module.exports = Game