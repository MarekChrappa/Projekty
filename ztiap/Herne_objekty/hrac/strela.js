class Projectile extends GameObject{
  constructor(x,y,smer) {
    super(game)
      this.image = resourceManager.getImageSource('strela');
      this.projectile = true;

      this.size = 40
      this.damage = 10

      this.x = x 
      this.y = y
      
      this.direction = smer
      this.speed = 10

      this.dx = 10
      this.dy = -25
      this.maxLife = 8
      this.life = 0

      this.physical = true;
    }
  
    move(dt) {

      if(this.direction > -0.65 && this.direction < 0.65)
        this.y = this.y - this.speed
      if(this.direction > 2.8 &&  this.direction < 3.1 )
        this.y = this.y + this.speed
      if(this.direction > 1  && this.direction < 3)
        this.x = this.x + this.speed
      if(this.direction < -0.2)
        this.x = this.x - this.speed
      
      for (var i in game.objects) {
        if( (game.objects[i].enemy == true) && (game.objects[i].x < this.x + this.size/2  &&  game.objects[i].x > this.x - this.size/2)  
        &&  (game.objects[i].y > this.y - this.size/2 && game.objects[i].y < this.y + this.size/2))
        {
          game.objects[i].life = game.objects[i].life - this.damage
          this.physical = false;

          game.hit_Sound.play();
        }
      }

        this.life += dt
        this.size -= 0.5
        if (this.life > this.maxLife) 
          this.physical = false
    }

    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.drawImage(this.image, -10, -10, this.size, this.size)
        ctx.restore()
    }
  }
