class Eprojectile extends GameObject{
    constructor(x, y, smer, dmg, size, life) {
      super(game)
        this.image = resourceManager.getImageSource('strela');

        this.projectile = true;
        this.physical = true;

        this.x = x 
        this.y = y

        this.size = size
        this.damage = dmg
        this.direction = smer
        this.speed = 5
        this.sedback = 10
  
        this.dx = 10
        this.maxLife = life
        this.life = 0
      }
    
      move(dt) {
  
        if(this.direction == -1.5)
          this.x = this.x - this.speed
        if(this.direction == 1.5 )
          this.x = this.x + this.speed
        
        if( (game.objects[3].x < this.x + this.size/2  &&  game.objects[3].x > this.x - this.size/2)  
        &&  (game.objects[3].y > this.y - this.size/2 && game.objects[3].y < this.y + this.size/2))
        {
          game.hit_Sound.play();
          game.objects[3].hp -= this.damage;
          game.objects[3].x -= this.sedback;
          this.physical = false;
        }
        
          this.life += dt
          this.size -= 0.2
          if (this.life > this.maxLife) 
            this.physical = false
      }
  
      draw(ctx) {
          ctx.save()
          ctx.translate(this.x, this.y)
          ctx.drawImage(this.image, -10, -10, this.size, this.size/2)
          ctx.restore()
      }
    }
  