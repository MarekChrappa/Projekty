class text
{
  constructor(tx,x,y,f) 
  {
	this.canvas = document.getElementById("canvas");
	
    this.x = x
    this.y = y 
    this.width = 100  //width
    this.height = 100 //height 		
    this.tx = tx;
    this.f = f;
  }

   
  move(dt)
  {
  }
  
  draw(ctx) {
    ctx.save()    
    ctx.font = this.f + 'px Arial';
    ctx.fillText(this.tx,this.x,this.y);
    ctx.restore()
  }
}


