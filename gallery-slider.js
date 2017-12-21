function Gallery(datos){
	var elem = this;
	
	elem.gallery 	= datos['gallery']; //Contenedor de la galeria
	elem.images 	= datos['images']; //Array de imagenes
	elem.leftArrow 	= datos['leftArrow']; //Flecha izquierda de la galeria
	elem.rightArrow = datos['rightArrow']; //Flecha derecha de la galeria
	elem.speed 		= datos['speed'] || 300; //Velocidad de transicion de la galeria
	elem.animation 	= datos['animation'] || 'linear'; //Animacion de la galeria


	elem.active = false;

	//obtiene la imagen actual
	elem.getCurrentImage = function(){
		return elem.images.indexOf( $(elem.gallery).find('img').attr('src') );
	}

	//obtiene la imagen siguiente
	elem.getNextImage = function(){
		var currImg = elem.getCurrentImage();
		if(currImg +1 > elem.images.length-1){
			return elem.images[0];
		}else{
			return elem.images[currImg + 1];
		}
	}

	//obtiene la imagen anterior
	elem.getPrevImage = function(){
		var currImg = elem.getCurrentImage();
		if(currImg -1 < 0){
			return elem.images[elem.images.length-1];
		}else{
			return elem.images[currImg - 1];
		}
	}

	//crea la siguiente imagen
	elem.createNextImage = function(){
		var img = $('<img />');
		$(img).attr('src',elem.getNextImage()).attr('width', $(elem.gallery).width()).attr('height', $(elem.gallery).height());
		$(img).css({
			position : 'absolute',
			left : $(elem.gallery).width(),
			top : 0
		});
		$(img).on('error', function(){
			$(this).addClass('error');
		})
		return img;
	}

	//crea la imagen anterior
	elem.createPrevImage = function(){
		var img = $('<img />');
		$(img).attr('src',elem.getPrevImage()).attr('width', $(elem.gallery).width()).attr('height', $(elem.gallery).height());
		$(img).css({
			position : 'absolute',
			left : 0 - $(elem.gallery).width(),
			top : 0
		});
		$(img).on('error', function(){
			$(this).addClass('error');
		})
		return img;	
	}

	//precarga la siguiente imagen y la anterior
	elem.preloadPrevNext = function(){
		var img = new Image();
		img.src = elem.getNextImage();
		var img2 = new Image();
		img2.src = elem.getPrevImage();
	}

	//pasa a la siguiente imagen
	elem.nextPhoto = function(){
		if(!elem.active){
			elem.active = true;
			var mainImg = $(elem.gallery).find('img');
			var nextImage = elem.createNextImage();
			$(elem.gallery).append(nextImage);
			$(nextImage).animate({
				left:0
			},elem.speed,elem.animation);
			$(mainImg).animate({
				left:0 - $(elem.gallery).width()
			},elem.speed,elem.animation, function(){$(this).remove();elem.active = false;elem.preloadPrevNext();});
		}
	}

	//pasa a la siguiente imagen
	elem.prevPhoto = function(){
		if(!elem.active){
			elem.active = true;
			var mainImg = $(elem.gallery).find('img');
			var prevImage = elem.createPrevImage();
			$(elem.gallery).append(prevImage);
			$(prevImage).animate({
				left:0
			},elem.speed,elem.animation);
			$(mainImg).animate({
				left:$(elem.gallery).width()
			},elem.speed,elem.animation, function(){$(this).remove();elem.active = false;elem.preloadPrevNext();});
		}
	}

	//Añadir los eventos a la galeria
	$(elem.leftArrow).on('click', function(){elem.prevPhoto();});
	$(elem.rightArrow).on('click', function(){elem.nextPhoto();});

	$(elem.gallery).on('swipeleft', function(){elem.nextPhoto();});
	$(elem.gallery).on('swiperight', function(){elem.prevPhoto();});


	return elem;
}
