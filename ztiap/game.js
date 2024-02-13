class Game extends GameObject  {
 constructor(canvas) {
    super(undefined, 0, 0, canvas.width, canvas.height)
	 this.canvas = canvas;
	 this.music=new Sound("./sounds/battleThemeA.mp3");		
     this.music.play_started=true;	

	 this.clickSound = new Sound("./sounds/jump.mp3");
     this.clickSound.sound.volume = 0.5;
     
     this.hit_Sound = new Sound("./sounds/Hhit.wav");
     this.hit_Sound.sound.volume = 0.5;

     this.destroyPlayer_Sound = new Sound("./sounds/gmover.wav");
     this.destroyPlayer_Sound.sound.volume = 0.5;

     this.destroyEnemy_Sound = new Sound("./sounds/hit.mp3");
     this.destroyEnemy_Sound.sound.volume = 0.5;

     this.boss_shot_Sound = new Sound("./sounds/bossshot.wav");
     this.boss_shot_Sound.sound.volume = 0.5;

     this.boss_Sound = new Sound("./sounds/boss.flac");
     this.boss_Sound.sound.volume = 0.5;

     this.level = false;
     this.lvl = 1;
     this.enems = 2
     this.enems2 = 1
     this.trvanie = 0;
     this.maxtrvanie = 45

     this.bestscore = 0;
     this.body = 0;

    
    this.mousePosition = {
      x: 0,
      y: 0
     };
     this.mousePressed = false;
    }

    time = Date.now();
	
	onmousemove(event) {
        this.mousePosition.x = event.offsetX || event.layerX;
        this.mousePosition.y = event.offsetY || event.layerY;
    };

    onmousedown(event) {
        this.mousePressed = true;
        this.click = true;
    };
    
    onmouseup (event) {
        this.mousePressed = false;
        this.click = false;
    };
  

    
    ctx = canvas.getContext("2d");

    async start() {
        console.log('starting game');
        await resourceManager.init();
        console.log('resouces loaded');
       
        this.objects = start(); 		
        this.startLoop();
    }

    // spusta nekonecnu slucku
    startLoop() {
        this.nodes = []
        this.time = Date.now();
        this.step();
    }

    step() {      
        // Get time delta
        
        const now = Date.now();
        const dt = (now - this.time) / 100;
        this.time = now;

        this.check();
        this.move(dt);
        this.render(this.ctx);

        requestAnimationFrame(() => this.step());
    }

    check()
    { 
        if((game.objects.length < 11 || this.trvanie == this.maxtrvanie) && game.level == true)
        {
            this.trvanie = 0;
            this.lvl++;
            this.enems++;
            this.enems2++;

            console.log(this.lvl);

            if(this.lvl % 4 == 0 && this.lvl != 0)
            {
                game.boss_Sound.play(); 
                game.objects.push(new boss(this.lvl));
                game.objects[3].hp += this.lvl * 10;
            }
            else
            {
                if(this.lvl % 3 == 0 && this.lvl != 0)
                    this.enems2++;
                for (let i = 0; i < this.enems; i++) {
                    game.objects.push(new en1(this.lvl));
                }
                for (let i = 0; i < this.enems2; i++) {
                    game.objects.push(new en2(game.objects[3].x, game.objects[3].y ));
                }   
                game.objects.push(new boss(this.lvl));
            }

            if(this.lvl % 5 == 0 && this.lvl != 0 && this.maxtrvanie > 10)
                this.maxtrvanie -= 2.5
        }	
    }

    timer()
    {
        this.trvanie += 1;
        //console.log(this.trvanie);
        return
    }

    move(dt) {

        game.objects.forEach((object) => {
            object.move(dt);
        });
        
        for (var i in game.objects) {
            if(game.objects[i].physical == false)
            {
                //console.log(game.body);
                game.objects.splice(i, 1);
                game.destroyEnemy_Sound.play();
            }
          }
    }

    

    // cistenie Canvasu
    clearCtx() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // render len zobrazuje a pozadie sa nacita raz pri inicializacii
    render() {
        this.clearCtx();
      
        // Render all objects in scene
        this.objects.forEach((object) => {
            object.draw(this.ctx);
        });
    }
}
