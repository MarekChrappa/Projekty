class Button{
    // Initialization
    constructor(id,x, y , width, height,imgName) {
        
        this.image = resourceManager.getImageSource(imgName);
    
        this.hrac = false;
        this.button = true;

        this.x = x
        this.y = y 
		this.width = width
        this.height = height  		
		this.id=id;
		
    }
  
    // Movement logic
    move(dt) {
       
	    if(game.mousePosition.x>this.x 
      && game.mousePosition.y>this.y 
      && game.mousePosition.x<(this.x+this.width) 
      && game.mousePosition.y<(this.y+this.height)){
		if(game.mousePressed){
			//debugger;
			if(this.id=='level' || this.id =='menu'){
				if(game.music.play_started) game.music.play();
			game.objects = level();
			game.mousePressed=false;} 
			if(this.id=='menu'){
                game.objects = menu();}
            if(this.id=='start'){
                game.objects = start();
                game.mousePressed=false;}
            if(this.id=='hscore'){
                game.objects = hscore();
                game.mousePressed=false;} 
            if(this.id=='gover'){
                game.objects = gover();
                game.mousePressed=false;}   
			if(this.id=='instructions'){
			    game.objects = instructions();
                game.mousePressed=false;} 
			if(this.id=='sound'){
				if(game.music.play_started){
                    game.music.stop();
                    game.hit_Sound.sound.volume = 0;
                    game.destroyPlayer_Sound.sound.volume = 0;
                    game.destroyEnemy_Sound.sound.volume = 0;
                    game.boss_Sound.volume = 0;
                    game.clickSound.sound.volume = 0;
                    game.boss_shot_Sound.sound.volume = 0;
                    game.boss_Sound.sound.volume = 0;
				}
				else{ //game.music.refresh();  //vzdy zacne hrat hudba od znova
					game.music.play();		
					game.hit_Sound.sound.volume = 0.5;
                    game.destroyPlayer_Sound.sound.volume = 0.5;
                    game.destroyEnemy_Sound.sound.volume = 0.5;
                    game.boss_Sound.volume = 0.5;
                    game.clickSound.sound.volume = 0.5;
                    game.boss_shot_Sound.sound.volume = 0.5;
                    game.boss_Sound.sound.volume = 0.5;
				}					
				game.mousePressed=false;				
				} 
					}  
        console.log("hover: "+this.id);
    }}
  
    // Render self
    draw(ctx) {
      ctx.save()    
      ctx.drawImage(this.image,this.x, this.y, this.width, this.height )  
      ctx.restore()
    }
}

class BaseObject {
    constructor(
        x, 
        y,
        width,
        height,
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    onClickHandler = null;
    onMouseUpHandler = null;
    onMouseDownHandler = null;

    render(ctx) {
        const {x, y, width, height} = this;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }

    handleEvent(ev) {
        if (this.onClickHandler && this.isClicked(ev)) {
            this.onClickHandler(ev);
        }
    }

    onMouseDownHandler(fn) {
        this.onMouseDownHandler = fn;
    }

    onMouseUp(fn) {
        this.onMouseUpHandler = fn;
    }

    onClick(fn) {
        this.onClickHandler = fn;
    }

    isClicked(ev) {
        if (isMouseClickEvent(ev)) {
            const mouseX = ev.offsetX;
            const mouseY = ev.offsetY;
            if (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height) {
                return true;
            }
        }
        return false;
    }
}
