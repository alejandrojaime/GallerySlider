'use strict';

class Gallery {
  constructor(data) {
    const el = this; //para evitar duplicados en los eventos

    el._images = data.images;
    el.animationSpeed = data.animationSpeed ? data.animationSpeed : 20;
    el.currentImage = data.startImage ? data.startImage : 0;
    el.container  = data.container;
    el.arrowPrev = data.arrowPrev;
    el.arrowNext = data.arrowNext;
    el._mainImage = null;
    el._mainContainer = document.createElement('div');
    el._mainContainer.classList.add('mainContainer');
    el._mainContainer.style.position = 'relative';
    el._mainContainer.style.display = 'block';
    el._mainContainer.style.width = '100%';
    el._mainContainer.style.height = '100%';
    el._mainContainer.style.overflow = 'hidden';

    //variables para el funcionamiento interno
    el._leftImage = false;
    el._rightImage = false;
    el.startTouchPosition = 0;
    el.endTouchPosition = 0;

    let image = new Image();
    image.addEventListener('load', function(){
      el._mainImage = createImage(el._images[el.currentImage], 0);
      el._mainImage = el._mainImage;
      el._mainContainer.appendChild(el._mainImage);
      el.container.appendChild(el._mainContainer);
      if(el._images.length > 1){
        el._mainContainer.addEventListener('touchstart', () => { startTouch(event, el) }, {pasive:false});
        el._mainContainer.addEventListener('touchmove', () => { dragImage(event, el) }, {pasive:false});
        el._mainContainer.addEventListener('touchend', () => { endTouch(event, el) }, {pasive:false});
        preloadNextPrev();
      }      
    });
    image.src = el._images[el.currentImage];
    if(el._images.length > 1){
      el.arrowNext.addEventListener('click', () => { nextImage(el) }, {pasive:false});
      el.arrowPrev.addEventListener('click', () => { prevImage(el) }, {pasive:false});
    }

    function preloadNextPrev(){
      let prevImg = el.currentImage - 1 < 0 ? el._images.length - 1 : el.currentImage - 1;
      let nextImg = el.currentImage + 1 > el._images.length - 1 ? 0 : el.currentImage + 1;
      new Image().src = el._images[prevImg];
      new Image().src = el._images[nextImg];
    }

    function startTouch(e, el){
      let ev = e || event || window.event;
      let tob = ev.changedTouches[0];
      let bleft = parseInt(el._mainContainer.offsetLeft);
      let sx = parseInt(tob.clientX);
      el._leftImage = false;
      el._rightImage = false;
      el.startTouchPosition = sx - bleft;
      el.endTouchPosition = false;
    }

    function endTouch(e, el){
      let ev = e || event || window.event;
      let tob = ev.changedTouches[0];
      let bleft = parseInt(el._mainContainer.offsetLeft);
      let sx = parseInt(tob.clientX);
      el.endTouchPosition = sx - bleft;
      if(el.endTouchPosition > el.startTouchPosition){
        endMoveLeft();
        el.currentImage = el.currentImage - 1 < 0 ? el._images.length - 1 : el.currentImage - 1;
      }else if(el.endTouchPosition < el.startTouchPosition){
        endMoveRight();
        el.currentImage = el.currentImage + 1 > el._images.length - 1 ? 0 : el.currentImage + 1;
      }
      el.startTouchPosition = false;
    }

    function dragImage(e, el){
      let ev = e || event || window.event;
      let tob = ev.changedTouches[0];
      let bleft = parseInt(el._mainContainer.offsetLeft);
      let sx = parseInt(tob.clientX);
      createNextPrevImages();
      el._leftImage.style.left = `${0 - el._mainContainer.offsetWidth + sx - bleft - el.startTouchPosition}px`;
      el._mainImage.style.left = `${sx - bleft - el.startTouchPosition}px`;
      el._rightImage.style.left = `${el._mainContainer.offsetWidth + sx - bleft - el.startTouchPosition}px`;
    }

    function nextImage(){
      createNextPrevImages()
      el._leftImage.style.left = `${0 - el._mainContainer.offsetWidth}px`;
      el._mainImage.style.left = `${0}px`;
      el._rightImage.style.left = `${el._mainContainer.offsetWidth}px`;
      window.requestAnimationFrame( function(){endMoveLeft()} );
      el.currentImage--;if(el.currentImage < 0){el.currentImage = el._images.length-1;}
    }

    function prevImage(el){
      createNextPrevImages()
      el._leftImage.style.left = `${0 - el._mainContainer.offsetWidth}px`;
      el._mainImage.style.left = `${0}px`;
      el._rightImage.style.left = `${el._mainContainer.offsetWidth}px`;
      window.requestAnimationFrame( function(){endMoveRight()} );
      el.currentImage++;if(el.currentImage > el._images.length-1){el.currentImage = 0;}
    }

    function createNextPrevImages(){
      if(el._leftImage === false){
        let prevImg = el.currentImage - 1 < 0 ? el._images.length - 1 : el.currentImage - 1;
        el._leftImage = createImage(el._images[prevImg], `${0 - el._mainContainer.offsetWidth}px`);
        el._mainContainer.insertBefore(el._leftImage, el._mainContainer.childNodes[0]);  
      }
      if(el._rightImage === false){
        let nextImg = el.currentImage;
        nextImg++;if(nextImg > el._images.length-1){nextImg = 0;}
        el._rightImage = createImage(el._images[nextImg], `${el._mainContainer.offsetWidth}px`);
        el._mainContainer.appendChild(el._rightImage);
      }
    }

    function endMoveLeft(){
      let move = el._mainContainer.offsetWidth / el.animationSpeed;
      if( parseInt(el._leftImage.style.left) + move < 0 ){
        el._leftImage.style.left = `${parseInt(el._leftImage.style.left) + move}px`;
        el._mainImage.style.left = `${parseInt(el._mainImage.style.left) + move}px`;
        window.requestAnimationFrame( function(){endMoveLeft()} );
      }else{
        el._leftImage.style.left = `${0}px`;
        el._mainContainer.removeChild(el._mainImage);
        el._mainContainer.removeChild(el._rightImage);
        el._mainImage = el._leftImage;
        el._leftImage = false;
        el._rightImage = false;
        preloadNextPrev();
      }
    }

    function endMoveRight(){
      let move = el._mainContainer.offsetWidth / el.animationSpeed;
      if( parseInt(el._rightImage.style.left) - move > 0 ){
        el._rightImage.style.left = `${parseInt(el._rightImage.style.left) - move}px`;
        el._mainImage.style.left = `${parseInt(el._mainImage.style.left) - move}px`;
        window.requestAnimationFrame( function(){endMoveRight()} );
      }else{
        el._rightImage.style.left = `${0}px`;
        el._mainContainer.removeChild(el._mainImage);
        el._mainContainer.removeChild(el._leftImage);
        el._mainImage = el._rightImage;
        el._leftImage = false;
        el._rightImage = false;
        preloadNextPrev();
      }
    }

    function createImage(url, position){
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

  }
}

export default Gallery