class boss {
    // Initialization
    constructor(lvl) {
        this.canvas = document.getElementById("canvas");
        this.image = resourceManager.getImageSource('boss');
    
        this.enemy = true;
        this.boss = true;
        this.physical = true;

        this.body = 80;
        this.lvl = lvl;
        this.nasobitel = 15;

        this.life = 350 + (this.lvl * this.nasobitel);
        this.hitdmg = 25 + (this.lvl * this.nasobitel);

        this.exp = [];
        this.firePower = 30;
        this.dmg = 12 + (this.lvl * this.nasobitel) ;

        this.size = 10
        this.speed = 0.5
        this.dx = this.speed;
        this.dy = 1.5;

        this.x = canvas.width - 5
        this.y = canvas.height/2
        this.rotation = 0;
    }
    
    vytvorL()
    {
      if(this.exp.length < this.firePower)
      {
        this.exp.push(new Eprojectile(this.x, this.y, -1.5, this.dmg, 50, 15));	
        game.boss_shot_Sound.play(); 
      }
        
    }

    // Movement logic
    move(dt) {
        for (var i in this.exp) 
            this.exp[i].move(dt)
        if(this.x > this.canvas.width/2)
            this.x -=  + this.dx
        if(this.y < game.objects[3].y )
            this.y += this.dy
        if(this.y > game.objects[3].y )
            this.y -= this.dy
        if(this.life <= 0)
        {
            this.physical = false;
            game.body += this.body
        }
        
        this.vytvorL();
        this.rotation += 0.008
    }
    
    // Render self
    draw(ctx) {
        ctx.save()
  
        for (var i in this.exp) {
          this.exp[i].draw(ctx)
          if(this.exp[i].physical == false)
            this.exp.splice(i, 1);
        }
  
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.scale(this.size, this.size)
        ctx.drawImage(this.image, -20, -20, 40, 40)  
        ctx.restore()
      }
}
