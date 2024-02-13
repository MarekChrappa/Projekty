class obraz
{
    constructor(imgName,x,y,width,height,rotation) {
        this.canvas = document.getElementById("canvas");
        this.image = resourceManager.getImageSource(imgName);

        this.x = x
        this.y = y 
        this.width = width  //width
        this.height = height //height 	
        this.rotation = rotation	
      }
    
      move(dt)
      {
      }
    
      draw(ctx) {
        ctx.save(); 
        ctx.rotate(this.rotation)   
        ctx.drawImage(this.image,this.x, this.y, this.width, this.height );  
        ctx.restore();
      }
}