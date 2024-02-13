const IMAGES = [
	{name: 'background', src: 'grafika/background.jpg'},
    {name: 'black_background', src: 'grafika/black.jpg'},
    {name: 'blue', src: 'grafika/blue.jpg'},

    {name: 'hrac', src: 'grafika/hrac.png'},
    {name: 'en2', src: 'grafika/finalrakety-05.png'},
    {name: 'en3', src: 'grafika/finalrakety-03.png'},
    {name: 'boss', src: 'grafika/finalrakety-02.png'},

    {name: 'strela', src: 'grafika/projectile.png'},

    {name: 'play', src: 'grafika/ikoneckyyy-01.png'},
    {name: 'home', src: 'grafika/home.png'},
    {name: 'score', src: 'grafika/ikoneckyyy-02.png'},
    {name: 'options',src:'grafika/options.png'},
    {name: 'instructions',src:'grafika/ikoneckyyy-03.png'},
    {name: 'music', src: 'grafika/ikoneckyyy-07.png'},
    {name: 'back', src: 'grafika/ikoneckyyy-04.png'},
];
// toto sluzi na inicialne loadnutie vsetkych obrazkov... aby to nebolo ako hidden image v html
class ResourceManager {
    loadedImages = new Map();

    async init() {
        await this.loadImages();
    }

    async loadImages() {
        await Promise.all(
            IMAGES.map(image => this.loadImage(image)),
        )
    }
	
    // dynamicky vytvorenie Image objectov spolu s tym aby sa nacitali obrazky
    // pouzili sa promise a async/await -> lepsie sa pracuje s asynchronnymi operaciami pri nacitavani obrazkov
    // nejaky tutorial ako to funguje -> 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
    async loadImage(imgResource) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imgResource.src;			
            img.onload = () => {
                this.loadedImages.set(imgResource.name, img);
                resolve(img);
            }
            img.onerror = (err) => {
                reject(err);
            }
        });
    }

    // ziskat js object Image, ktory sa posle do canvas
    getImageSource(imageName) {
        const image = this.loadedImages.get(imageName);
        if (image == null) {
            throw new Error(`Image '${imageName}' not found`);
        }
        return image;
    }
}