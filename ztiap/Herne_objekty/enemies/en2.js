class en2 {
    // Initialization
    constructor(gtx,gty) {
        this.canvas = document.getElementById("canvas");
        this.image = resourceManager.getImageSource('en2');
    
        this.enemy = true;
        this.enemy2 = true;
        this.physical = true;

        this.get_x = gtx;
        this.get_y = gty;

        this.nasobitel = 5
        this.life = 45 + (this.nasobitel * game.lvl);
        this.hitdmg = 10 + (this.nasobitel * game.lvl);

        this.speed_slow = 3;
        this.speed_fast = 8;
        this.dx = this.speed_fast;

        this.x = canvas.width - 5
        this.y = Math.random() * canvas.height
        this.size = 1
        this.rotation = -1.5
        this.body = 20
    }
  
    // Movement logic
    move(dt) {

        if(this.x > this.get_x){
            this.x -= this.dx;
            this.rotation = -1.5
        }
        if(this.x < this.get_x){
            this.x += this.dx
            this.rotation = 1.5
        }
        if(this.y > this.get_y)
            this.y -= this.dx
        if(this.y < this.get_y)
            this.y += this.dx

        if( (this.get_x <= this.x + 10  &&  this.get_x >= this.x - 10)  &&  (this.get_y >= this.y - 10 && this.get_y <= this.y + 10)){
            this.get_x = game.objects[3].x 
            this.get_y = game.objects[3].y
            this.dx = this.speed_slow;
        }
        if(this.life <= 0){
            this.physical = false;
            game.body += this.body
        }
            
    }
    
    // Render self
    draw(ctx) {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(this.rotation)
      ctx.scale(this.size, this.size)
      ctx.drawImage(this.image, -20, -20, 40, 40)  
      ctx.restore()
    }
}