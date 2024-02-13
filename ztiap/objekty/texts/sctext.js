class sctext
{
  constructor(x,y,vl) 
  {
	this.canvas = document.getElementById("canvas");
	
    this.x = x
    this.y = y
    this.width = 100  //width
    this.height = 100 //height 		
    this.vl = vl
  }

   
  move(dt)
  {
  }
  
  draw(ctx) {
    ctx.save()    
    ctx.font = this.vl + 'px Arial';
    ctx.fillText(game.body,this.x,this.y);
    ctx.restore()
  }
}


