// Ariel peralta

var timer;
var totalColumnas = 7;
var totalFilas = 7;

var juegoDulces = {
	// titulo principal este cambiando de color
	textoLuminoso: function(selector){
		timer = setInterval(function(){
			$(selector).animate({
				color: 'white'
			}).animate({
				color: 'yellow'
			},500).animate({
				color: 'white'
			}).animate({
				color: 'yellow'
			},500);
		},2000);
	},
	// funcion que almacena dulces en pantalla
	obtenerArregloDulces: function(type, index){
		var col1 = $('.col-1').children();
		var col2 = $('.col-2').children();
		var col3 = $('.col-3').children();
		var col4 = $('.col-4').children();
		var col5 = $('.col-5').children();
		var col6 = $('.col-6').children();
		var col7 = $('.col-7').children();

		var columns = $([col1, col2, col3, col4, col5, col6, col7]);

		if (typeof index === 'number') {
			var filas = $([col1.eq(index), col2.eq(index), col3.eq(index), col4.eq(index), col5.eq(index), col6.eq(index), col7.eq(index)]);
		} else {
			index = '';
		}
		if (type == 'columns') {
			return columns;
		} else if (type == 'filas' && index !== ''){
			return filas;
		}
	},
	//funcion que devolvera una fila de dulces en un arreglo que se podra recorrer con mas facilidad
	filaDulces: function (index) {
		var filadulce = juegoDulces.obtenerArregloDulces('filas', index);
		return filadulce;
	},
	//funcion nos devolvera una columna de dulces en un arreglo que se podra recorrer con mas facilidad
	columnaDulces: function (index) {
		var columnaDulce = juegoDulces.obtenerArregloDulces('columns');
		return columnaDulce[index];
	},
	//recorrido por cada una de las columnas del tablero para encontrar combinacione de dulces
	validarColumnas: function(){		
		for (var j = 0; j < totalColumnas; j++){
			var cont = 0;
			var pos = [];  // guardara posiciones de la primer combinacion
			var extraPos = []; // guardara posiciones de la segunda combinación
			var columna = juegoDulces.columnaDulces(j);  // obtenemos un arreglo de la columna J
			var comp = columna.eq(0);
			var gap = false;
			for (var i = 1; i < columna.length; i++){
				var prevDulce = comp.attr('src');  // Primer dulce
				var currDulce = columna.eq(i).attr('src');  // Segundo dulce
				if (prevDulce != currDulce){
					if (pos.length >= 3) {
						gap = true;         // brecha entre una combinacion y otra
					} else {
						pos = [];
					}
					cont = 0;
				} else {
					if (cont == 0){
						if (!gap) {
							pos.push(i - 1);
						} else {
							extraPos.push(i - 1);					
						}
					}
					if (!gap) {
						pos.push(i);
					} else {
						extraPos.push(i);
					}
					cont++;
				}
				comp = columna.eq(i);
			}
			// Si hay una segunda combinacion unimos las posiciones en un solo arreglo
			if (extraPos.length > 2) {  
				pos = $.merge(pos, extraPos);
			}
			if (pos.length <= 2){
				pos = [];
			}
			combo = pos.length;
			// si hubo una o mas combinaciones preparamos los dulces para ser eliminados
			if (combo >= 3) {
				for (var a = 0; a < pos.length; a++){
					$(columna.eq(pos[a])).addClass('delete');
				}
				juegoDulces.establecerMarcador(combo);
			}
		}
	},
	//recorrido por cada una de las filas del tablero para encontrar combinacione de dulces
	validarFilas: function(){		
		for (var j = 0; j < totalFilas; j++){
			var cont = 0;
			var pos = []; // guardara las posiciones de la primer combinacion
			var extraPos = []; // guardara las posicione de la segunda combinación
			var candyRow = juegoDulces.filaDulces(j); // obtenemos un arreglo de la fila J
			var comp =  candyRow[0];
			var gap = false;
			for (var i = 1; i < candyRow.length; i++){
				var prevDulce = comp.attr('src');  // Primer dulce
				var currDulce = candyRow[i].attr('src');  // Primer dulce
				if ( !(prevDulce == currDulce)){
					if (pos.length >= 3) {
						gap = true;  // brecha entre una combinacion y otra
					} else {
						pos = [];
					}
					cont = 0;
				} else {
					if ( cont == 0){
						if (!gap) {
							pos.push(i - 1);
						} else {
							extraPos.push(i - 1);					
						}
					}
					if (!gap) {
						pos.push(i);
					} else {
						extraPos.push(i);
					}
					cont++;
				}
				comp = candyRow[i];;
			}
			// Si hay una segunda combinacion unimos las posiciones en un solo arreglo
			if (extraPos.length > 2) {
				pos = $.merge(pos, extraPos);
			}
			if (pos.length <= 2){
				pos = [];
			}
			combo = pos.length;
			// si hubo una o mas combinaciones preparamos los dulces para ser eliminados
			if (combo >= 3) {
				for (var a = 0; a < pos.length; a++){
					$(candyRow[pos[a]]).addClass('delete');
				}
				juegoDulces.establecerMarcador(combo);
			}

		}
	},
	// Asignamos el puntaje adecuado para las combinaciones encontradas
	establecerMarcador: function(combo){
		var puntaje = Number($('#score-text').text());
		switch (combo){
			case 3:
				puntaje += 25;
				break;
			case 4:
				puntaje += 50;
				break;
			case 5:
				puntaje += 75;
				break;
			case 6:
				puntaje += 100;
				break;
			case 7:
				puntaje += 200;
				break;
		}
		$('#score-text').text(puntaje);
	},
	// Una vez encontradas las combinaciones procedemos a quitar los dulces 
	// del tablero
	eliminarDulcesAnimacion: function(){
		$('img.delete').effect('pulsate', 400);
		$('img.delete').animate({
			opacity: '0'
		}, { 
			duration: 300
		})
		.animate({
			opacity: '0'
		}, {
			duration: 400,
			complete: function(){
				juegoDulces.resolver()
					.then(juegoDulces.checkTableroPromesa)
					.catch(juegoDulces.checkPromesaError);
			},
			queue: true
		});
	},
	// En caso positivo de haber quitado las combinaciones de los dulces
	// volvemos a chequear el tablero para rellenar los dulces faltantes 
	checkTableroPromesa: function(result){
		if (result) {
			juegoDulces.checkTablero();
		}
	},
	// En caso de haber un error, lo mostramos en la consola
	checkPromesaError: function(error){
		console.log(error);
	},
	// Validamos que tipo de resultado obtuvimos al tratar de quitar los dulces del tablero
	resolver: function(){
		return new Promise(function(resolve, reject){
			if ($('img.delete').remove()){
				resolve(true);
			} else {
				reject('No se pudo eliminar el dulce');
			}
		});
	},
	// Chequeamos el tablero y rellenamos de dulces
	checkTablero: function(){
		var top = 7;
		var column = $("[class^='col-']");

		column.each(function(){
			var dulces = $(this).children().length;
			var agrega = top - dulces;
			for (var i = 0; i < agrega; i++){
				var tipoDulce = Math.floor(Math.random()*4)+1;
				if ((i == 0) && (dulces < 1)){
					$(this).append('<img src="image/' + tipoDulce + '.png" class="elemento"></img>');
				} else {
					$(this).find('img:eq(0)').before('<img src="image/' + tipoDulce + '.png" class="elemento"></img>')
				}
			}
		});
		// Una vez rellenado el tablero llamamos a las funciones que permiten la interactividad
		juegoDulces.agregarDulcesEventos();		
		juegoDulces.validarColumnas();
		juegoDulces.validarFilas();
		if ($('img.delete').length != 0) {
			juegoDulces.eliminarDulcesAnimacion();
		}
	},
	//eventos para que podamos mover los dulces y crear nuevas combinaciones
	agregarDulcesEventos: function(){
		$('img').draggable({
			containment: '.panel-tablero',
			droppable: 'img',
			revert: true,
			grid: [100, 100],
			zIndex: 5,
			drag: function(event, ui){
				ui.position.top = Math.min(100, ui.position.top);
				ui.position.bottom = Math.min(100, ui.position.bottom);
				ui.position.left = Math.min(100, ui.position.left);
				ui.position.right = Math.min(100, ui.position.right);
			}
		});
		$('img').droppable({
			drop: function(event, ui){
				var dulceDrag = $(ui.draggable);
				var dragSrc = dulceDrag.attr('src');
				var dulceDrop = $(this);
				var dropSrc = dulceDrop.attr('src');
				dulceDrag.attr('src', dropSrc);
				dulceDrop.attr('src', dragSrc);
				setTimeout(function(){
					juegoDulces.checkTablero();
					if ($('img.delete').length === 0) {
						dulceDrag.attr('src', dropSrc);
						dulceDrop.attr('src', dragSrc);
					} else {
						var mov = Number($('#movimientos-text').text());
						mov++;
						$('#movimientos-text').text(mov);
					}
				},500);
			}
		});
	},
	// Al finalizar el juego quitamos los eventos de los dulces
	// ocultamos el tablero y la ventana que muestra el tiempo
	endGame: function(){
		$('img').draggable('disable');
		$('img').droppable('disable');
		$('div.panel-tablero, div.time').effect('explode', 'slow');
		$('h1.main-titulo').addClass('title-over').text('Gracias por Jugar!');
		$('div.score, div.move, div.panel-score').width('100%');
	},
	// Iniciamos el juego asignando el evento clic 
	initGame: function(){
		juegoDulces.textoLuminoso('h1.main-titulo');
		$('.btn-reinicio').on('click', function(){
			if ($(this).text() == 'Reiniciar'){
				location.reload(true);
			}
			$(this).text('Reiniciar'); // Una vez iniciado el juego cambiamos la opcion del boton
			juegoDulces.checkTablero(); 
			// Iniciamos el contador del juego 
			$('#timer').timer({
				countdown: true,
				format: '%M:%S',
				duration: '2m',
				callback: function(){
					// Una vez finalizado el tiempo finalizamos el juego
					juegoDulces.endGame();
				}
			});
		});
	}

}

// Una vez cargada la pagina mandamos a inicializar el juego
$(function() {
	juegoDulces.initGame();
})