class en1 extends GameObject{
    // Initialization
    constructor(lvl) {
        super(game)
        this.canvas = document.getElementById("canvas");
        this.image = resourceManager.getImageSource('en3');
    
        this.enemy = true;
        this.enemy1 = true;
        this.physical = true;

        this.vzdialenost = 0;
        this.vz;
        this.nasobitel = 5;

        this.exp = [];
        this.hitdmg = 15;
        this.firePower = 1;
        this.dmg = 15 + (game.lvl * this.nasobitel);

        if(this.lvl = lvl % 5 == 0 && this.level != 0)
            this.nasobitel += 10
        this.life = 100 + (this.lvl * this.nasobitel);
        this.body = 30;
        
        this.x = canvas.width - 5
        this.y = Math.random() * canvas.height
        this.dx = 1
        this.dy = 1
        this.size = Math.random() + .5
        this.rotation = -1.5
    }
  
    vytvorL()
    {
      if(this.exp.length < this.firePower)
        this.exp.push(new Eprojectile(this.x, this.y, this.rotation, this.dmg, 40, 20));	
    }	

    // Movement logic
    move(dt) {
        this.vzdialenost = 0;

        for (var i in this.exp) 
            this.exp[i].move(dt)

        if(game.objects[3].x > this.x)
        {
            this.vzdialenost = game.objects[3].x - this.x
            this.vz = -1;
            this.rotation = 1.5;
        }
        if(game.objects[3].x < this.x)
        {
            this.vzdialenost = this.x - game.objects[3].x
            this.vz = 1;
            this.rotation = -1.5;
        }
        
        if(this.vzdialenost < 250 )
        {
            if(this.vz == 1)
            {
                this.x += this.dx 
                
                if(this.y < game.objects[3].y)
                    this.y += this.dy
                if(this.y > game.objects[3].y)
                    this.y -= this.dy
                this.vytvorL(this.lasers)
            }
            if(this.vz == -1)
                this.x -= this.dx 
        }
        if(this.vzdialenost > 500){
            if(this.vz == 1)
                this.x -= this.dx 
            if(this.vz == -1)
                this.x += this.dx
        }
        if(this.vzdialenost < 500  && this.vzdialenost > 250)    
            this.vytvorL(this.lasers)

        if(this.x == canvas.width - 1 )
            this.x = 1
        if(this.x <= 0)
            this.x = canvas.width - 2;

        if(this.life <= 0){
            this.physical = false;
            game.body +=  this.body
        }
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