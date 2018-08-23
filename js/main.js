//primero importar el módulo
import Gallery from './modules.mjs';

//después de la carga del contenido...
(async () => {	
	const galeria = new Gallery({
		images : [
			'media/images/imagen1.jpg',
			'media/images/imagen2.jpg',
			'media/images/imagen3.jpg',
			'media/images/imagen4.jpg',
			'media/images/imagen5.jpg',
			'media/images/imagen6.jpg',
			'media/images/imagen7.jpg',
			'media/images/imagen8.jpg',
			'media/images/imagen9.jpg',
			'media/images/imagen10.jpg',
			'media/images/imagen11.jpg',
		],
		container : document.querySelector('.gallery'),
		arrowPrev : document.querySelector('.arrow.prev'),
		arrowNext : document.querySelector('.arrow.next')
	});
	galeria.createNavigation();
})();