'use strict';

export default class Gallery {
  constructor(data) {
    this.animationSpeed = 20;
    this.currentImage = 0;
    if(typeof data !== 'undefined'){
      this._images = data.images;
      this.container  = data.container;
      this.arrowPrev = data.arrowPrev;
      this.arrowNext = data.arrowNext;
      this.animationSpeed = data.animationSpeed ? data.animationSpeed : 20;
      this.currentImage = data.startImage ? data.startImage : 0;
    }

    this.dots = Array();
    this.active = false;
    this._mainImage = null;
    this.createMainContainer();

    //variables para el funcionamiento interno
    this._leftImage = false;
    this._rightImage = false;
    this.startTouchPosition = 0;
    this.endTouchPosition = 0;

    let el = this;
    let image = new Image();
    image.addEventListener('load', () => {
      el._mainImage = el.createImage(el._images[el.currentImage], 0);
      el._mainImage = el._mainImage;
      el._mainContainer.appendChild(el._mainImage);
      el.container.appendChild(el._mainContainer);
      if(el._images.length > 1){
        el._mainContainer.addEventListener('touchstart', () => { el.startTouch(event) }, {pasive:false});
        el._mainContainer.addEventListener('touchmove', () => { el.dragImage(event) }, {pasive:false});
        el._mainContainer.addEventListener('touchend', () => { el.endTouch(event) }, {pasive:false});
        el.preloadNextPrev();
      }
    });
    image.src = this._images[this.currentImage];
    if(this._images.length > 1) {
      this.arrowNext.addEventListener('click', () => { el.nextImage() }, {pasive:false});
      this.arrowPrev.addEventListener('click', () => { el.prevImage() }, {pasive:false});
    }
  }

  createMainContainer(){
    this._mainContainer = document.createElement('div');
    this._mainContainer.classList.add('mainContainer');
    this._mainContainer.style.position = 'relative';
    this._mainContainer.style.display = 'block';
    this._mainContainer.style.width = '100%';
    this._mainContainer.style.height = '100%';
    this._mainContainer.style.overflow = 'hidden';
  }

  preloadNextPrev(){
    return new Promise((resolve, reject)=>{
      let prevImg = this.currentImage - 1 < 0 ? this._images.length - 1 : this.currentImage - 1;
      let nextImg = this.currentImage + 1 > this._images.length - 1 ? 0 : this.currentImage + 1;
      let img1 = new Image();
      let img2 = new Image();
      img1.src = this._images[prevImg];
      img2.src = this._images[nextImg];
      img1.onload = () => resolve();
      img2.onload = () => resolve();
    });
  }

  startTouch(e){
    if(!this.active){
      let ev = e || event || window.event;
      let tob = ev.changedTouches[0];
      let bleft = parseInt(this._mainContainer.offsetLeft);
      let sx = parseInt(tob.clientX);
      this._leftImage = false;
      this._rightImage = false;
      this.startTouchPosition = sx - bleft;
      this.endTouchPosition = false;
      this.active = true;
    }
  }

  endTouch(e){
    let ev = e || event || window.event;
    let tob = ev.changedTouches[0];
    let bleft = parseInt(this._mainContainer.offsetLeft);
    let sx = parseInt(tob.clientX);
    this.endTouchPosition = sx - bleft;
    if(this.endTouchPosition > this.startTouchPosition){
      this.endMoveLeft();
      this.currentImage = this.currentImage - 1 < 0 ? this._images.length - 1 : this.currentImage - 1;
    }else if(this.endTouchPosition < this.startTouchPosition){
      this.endMoveRight();
      this.currentImage = this.currentImage + 1 > this._images.length - 1 ? 0 : this.currentImage + 1;
    }
    this.startTouchPosition = false;
  }

  dragImage(e){
    let ev = e || event || window.event;
    let tob = ev.changedTouches[0];
    let bleft = parseInt(this._mainContainer.offsetLeft);
    let sx = parseInt(tob.clientX);
    this.createNextPrevImages();
    this._leftImage.style.left = `${0 - this._mainContainer.offsetWidth + sx - bleft - this.startTouchPosition}px`;
    this._mainImage.style.left = `${sx - bleft - this.startTouchPosition}px`;
    this._rightImage.style.left = `${this._mainContainer.offsetWidth + sx - bleft - this.startTouchPosition}px`;
  }

  nextImage(){
    if(!this.active){
      this.createNextPrevImages();
      this._leftImage.style.left = `${0 - this._mainContainer.offsetWidth}px`;
      this._mainImage.style.left = `${0}px`;
      this._rightImage.style.left = `${this._mainContainer.offsetWidth}px`;
      let el = this;
      window.requestAnimationFrame( function(){el.endMoveLeft()} );
      this.currentImage--;if(this.currentImage < 0){this.currentImage = this._images.length-1;}
    }
  }

  prevImage(){
    if(!this.active){
      this.createNextPrevImages()
      this._leftImage.style.left = `${0 - this._mainContainer.offsetWidth}px`;
      this._mainImage.style.left = `${0}px`;
      this._rightImage.style.left = `${this._mainContainer.offsetWidth}px`;
      let el = this;
      window.requestAnimationFrame( function(){el.endMoveRight()} );
      this.currentImage++;if(this.currentImage > this._images.length-1){this.currentImage = 0;}
    }
  }

  createNextPrevImages(){
    if(this._leftImage === false){
      let prevImg = this.currentImage - 1 < 0 ? this._images.length - 1 : this.currentImage - 1;
      this._leftImage = this.createImage(this._images[prevImg], `${0 - this._mainContainer.offsetWidth}px`);
      this._mainContainer.insertBefore(this._leftImage, this._mainContainer.childNodes[0]);  
    }
    if(this._rightImage === false){
      let nextImg = this.currentImage;
      nextImg++;if(nextImg > this._images.length-1){nextImg = 0;}
      this._rightImage = this.createImage(this._images[nextImg], `${this._mainContainer.offsetWidth}px`);
      this._mainContainer.appendChild(this._rightImage);
    }
  }

  endMoveLeft(){
    let move = this._mainContainer.offsetWidth / this.animationSpeed;
    if(typeof this._leftImage == 'object'){
      if(parseInt(this._leftImage.style.left) + move < 0 ){
        this._leftImage.style.left = `${parseInt(this._leftImage.style.left) + move}px`;
        this._mainImage.style.left = `${parseInt(this._mainImage.style.left) + move}px`;
        let el = this;
        window.requestAnimationFrame( function(){el.endMoveLeft()} );
      }else{
        this._leftImage.style.left = `${0}px`;
        this._mainContainer.removeChild(this._mainImage);
        this._mainContainer.removeChild(this._rightImage);
        this._mainImage = this._leftImage;
        this._leftImage = false;
        this._rightImage = false;
        this.preloadNextPrev();
        this.updateDots();
        this.active = false;
      }
    }
  }

  endMoveRight(){
    let move = this._mainContainer.offsetWidth / this.animationSpeed;
    if(typeof this._rightImage == 'object'){
      if(parseInt(this._rightImage.style.left) - move > 0 ){
        this._rightImage.style.left = `${parseInt(this._rightImage.style.left) - move}px`;
        this._mainImage.style.left = `${parseInt(this._mainImage.style.left) - move}px`;
        let el = this;
        window.requestAnimationFrame( function(){el.endMoveRight()} );
      }else{
        this._rightImage.style.left = `${0}px`;
        this._mainContainer.removeChild(this._mainImage);
        this._mainContainer.removeChild(this._leftImage);
        this._mainImage = this._rightImage;
        this._leftImage = false;
        this._rightImage = false;
        this.preloadNextPrev();
        this.updateDots();
        this.active = false;
      }
    }
  }

  createImage(url, position){
    let mainImage = document.createElement('div');
    mainImage.classList.add('mainImage');
    mainImage.style.backgroundImage = `url(${url})`;
    mainImage.style.position = 'absolute';
    mainImage.style.left = position;
    mainImage.style.top = 0;
    mainImage.style.width = '100%';
    mainImage.style.height = '100%';
    mainImage.style.backgroundSize = 'cover';
    mainImage.style.backgroundPosition = 'center';
    return mainImage;
  }

  goTo(num){
    this._leftImage = this.createImage(this._images[num], `${0 - this._mainContainer.offsetWidth}px`);
    this._rightImage = this.createImage(this._images[num], `${this._mainContainer.offsetWidth}px`);
    this._mainContainer.appendChild(this._leftImage);
    this._mainContainer.appendChild(this._rightImage);
    if(num > this.currentImage){
      this.endMoveRight();
    }else if(num < this.currentImage){
      this.endMoveLeft();
    }
    this.currentImage = num;
  }

  updateDots(){
    if(this.dots.length > 0){
      for(let i = 0; i < this.dots.length; i++){
        this.dots[i].classList.remove('jumpRight');
        this.dots[i].classList.remove('jumpLeft');
        if(i == this.currentImage && !this.dots[i].classList.contains('active')){
          this.dots.selectedIntex = i;
          this.dots[i].classList.add('active');
        }else{
          this.dots[i].classList.remove('active');
        }
      }
      if(this.dots.length / 2 < this.dots.selectedIntex){
        this.dots[this.dots.selectedIntex].classList.add('jumpLeft');
      }else if(this.dots.length / 2 > this.dots.selectedIntex){
        this.dots[this.dots.selectedIntex].classList.add('jumpRight');
      }

      console.log(this.dots.selectedIntex)

    }
  }

  createNavigation(){
    let navContainer = document.createElement('div');
    navContainer.classList.add('navigation');
    let el = this;
    for(let i = 0; i < this._images.length; i++){
      let dot = document.createElement('div');
      dot.classList.add('dot');
      navContainer.appendChild(dot);
      this.dots.push(dot);
      dot.addEventListener('click', ()=>{el.goTo(i);}, false);
    }
    this.container.appendChild(navContainer);
    this.updateDots();
  }
}