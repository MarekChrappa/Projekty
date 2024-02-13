class hrac extends GameObject {
    // Initialization
    constructor() {
      super(game)
        this.image = resourceManager.getImageSource('hrac');

        this.hrac = true;
        this.button = false;
        
        this.hp = 150;
        this.x = 10
        this.y = canvas.height/2
        this.dx = 20
        this.dy = 20
        this.size = Math.random() + .3
        this.rotation = 0;

        this.lasers = [];
        this.firePower = 10; 
    }
  
    // Movement logic
    move(dt) {
      for (var i in this.lasers) {
        this.lasers[i].move(dt)
      }
      
      if(this.hp <= 0){
        game.destroyPlayer_Sound.play();
        game.objects = gover();
        game.lvl = 1;
      }
      //lavo
      if (keys[37] || keys[65])
      {
        if (this.x>0) 
          this.x =this.x -this.dx*dt;
        else
          this.x = canvas.width;
        if (this.rotation > -1.5)
          this.rotation -= 0.2;
        if (this.rotation < -1.5)
          this.rotation += 0.2;  
      }

      //pravo
      if (keys[39] || keys[68])
      {
        if (this.x < canvas.width) 
          this.x += this.dx*dt;
        else 
          this.x = 0;
        if (this.rotation < 1.5)
          this.rotation += 0.2;
        if (this.rotation > 1.5)
          this.rotation -= 0.2;
      } 
        
      //hore
      if (keys[38] || keys[87])
      {
        if (this.y > 5) 
          this.y -= this.dy*dt;
        else
          this.y = canvas.height;  
        if(this.rotation < 0)
          this.rotation += 0.2
        if(this.rotation > 0)
          this.rotation -= 0.2
      } 
        
      //dole
      if (keys[40] || keys[83])
      {
        if (this.y <= canvas.height)
          this.y += this.dy*dt;
        else
          this.y = 0;
        if(this.rotation < 3)
        this.rotation += 0.2;
      } 

      if(keys[32])
        this.vytvorL(this.lasers)
      if(game.mousePressed){
      game.clickSound.play();
	    }
    }

    vytvorL()
    {
      if(this.lasers.length < this.firePower)
        this.lasers.push(new Projectile(this.x, this.y, this.rotation));	
    }	 
  
  draw(ctx) 
  {  
    ctx.save()
   
    for (var i in this.lasers) {
      this.lasers[i].draw(ctx)
      if(this.lasers[i].physical == false)
        this.lasers.splice(i, 1);
    }

    for (var i in game.objects) {
      if(game.objects[i].enemy == true)
      {
        if( (game.objects[i].x < this.x + 20 && game.objects[i].x > this.x - 20) && game.objects[i].y > this.y - 20 &&  game.objects[i].y < this.y + 20)
        {
          this.hp -= game.objects[i].hitdmg;
          this.x = this.x - 50;

          if(game.objects[i].enemy2 == true)
            game.objects[i].physical = false
        }
      }
    }

    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
      //ctx.scale(this.size, this.size)
    ctx.drawImage(this.image, -20, -20, 40, 40)   
    ctx.restore()
    }
}