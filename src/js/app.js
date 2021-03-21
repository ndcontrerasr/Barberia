// alert('Listo');
 
let pagina = 1;

const cita = {
	nombre: '',
	fecha: '',
	hora: '',
	servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
	iniciarApp();
});

function iniciarApp() {
	mostrarServicios();

	// Cambio de tamaño de la pagina
	tamañoPagina();

	// Resalta el Div actual segun el tab que se preciones
	mostrarSeccion();

	// Oculta el una seccion el tab que se precione
	cambiarSeccion();

	// Paginacion siguiente, anterior
	paginaSig();
	paginaAnt();
	Ocultar();

	// Muestra el resumen de la cita (o mensaje de error)
	mostrarResumen();

	// Reconocer los datos de la cita escritos
	nombreCita();
	fechaCita();
	horaCita();
}

function nombreCita() {
	const nombreInpunt = document.querySelector('#nombre');

	// Quitar el mensaje cuando se escribe en la pagina
	nombreInpunt.addEventListener('input', e => {
		// Quitar el mensaje
		mostrarAlerta('', 'retirar', 'Pnombre');
	});

	nombreInpunt.addEventListener('change', e => {
		const nombreTexto = e.target.value.trim();

		// VALIDACION DE QUE NOMBRETEXTO DEBE TENER
		if (nombreTexto === '' || nombreTexto.length < 5) {
			mostrarAlerta('Nombre no valido', 'error', 'Pnombre');
		}
		else {
			cita.nombre = nombreTexto;
			// console.log(cita.nombre);
		}
	});
}

function fechaCita() {
	const fechaInpunt = document.querySelector('#fecha');
	
	fechaInpunt.addEventListener('change', e => {
		
		const fechaDate = e.target.value;
		
		borrarMensaje('Pdate');

		const hoy = new Date();
		let fecha = `${hoy.getFullYear()}-`;
		
		if (hoy.getMonth()+1<10) {
			fecha = fecha + '0';
		}
		
		fecha = fecha + `${hoy.getMonth()+1}-`;

		if (hoy.getDate()<10) {
			fecha = fecha + '0';
		}
		
		fecha = fecha + `${hoy.getDate()}`;
		// console.log(fecha);

		if (fecha >= fechaDate) {
			mostrarAlerta('La fecha ya vencio', 'error', 'Pdate');
		} else {
			cita.fecha = fechaDate
			// console.log(cita.fecha);
		}
	});
}

function horaCita() {
	const horaInpunt = document.querySelector('#Hora');
	
	horaInpunt.addEventListener('change', e => {
		
		const horaDate = e.target.value;
		// console.log(horaDate);
		borrarMensaje('Phora');

		if (horario(horaDate)) {
			mostrarAlerta('Hora no valida', 'error', 'Phora');
		}
		else {
			cita.hora = horaDate;
			// console.log(cita.hora);
		}
	});
}

function horario(horaDate) {
	if (horaDate > '19:30'){
		// console.log('1');
		return true;
	}
	else if (horaDate < '06:30') {
		// console.log('2');
		return true;
	} else if (horaDate > '11:30' && horaDate < '13:30') {
		// console.log('3');		
		return true;
	}
	return false;
}

function mostrarAlerta(a, tipo, dato) {
	
	borrarMensaje(dato);

	if (tipo != 'retirar') {
	
		const alerta = document.createElement('P');
	
		alerta.textContent = a;
		alerta.classList.add(`alerta`);
		alerta.classList.add(`alerta-${dato}`);
	
		if ( tipo === 'error') {
			alerta.classList.add('error');
		}

		const formulario = document.querySelector(`.${dato}`);

		// const formulario = document.querySelector('.formulario');
		formulario.appendChild(alerta);
	}
}

function borrarMensaje(dato) {
	const alertaP = document.querySelector(`.alerta-${dato}`);

	if(alertaP) {
		alertaP.remove();
	}
}

function mostrarResumen() {
	// Destructuring
	const { nombre, fecha, hora, servicios } = cita;

	// Selecionar resumen
	const resumenDiv = document.querySelector('#parte-3');
	
	// Limpiar el Html
	// resumenDiv.innerHTML = ''
	// console.log(resumenDiv);
	while( resumenDiv.firstChild) {
		resumenDiv.removeChild( resumenDiv.firstChild );
	}

	if (Object.values(cita).includes('')) {
		const noServicio = document.createElement('P');

		noServicio.textContent = 'Faltan datos por digitar';

		noServicio.classList.add('invalidar-cita');
		noServicio.classList.add('texto_centrado');

		// agregar a resumen el Div
		resumenDiv.appendChild(noServicio);

		return;
	}

	resumenDiv.classList.add('resumen');

	// Validacion de objeto
	const nombreCita = document.createElement('P');
	nombreCita.innerHTML = `<span>Nombre: </span> ${nombre}`;

	resumenDiv.appendChild(nombreCita);

	const fechaCita = document.createElement('P');
	fechaCita.innerHTML = `<span>Fecha: </span> ${fecha}`;

	resumenDiv.appendChild(fechaCita);

	const horaCita = document.createElement('P');
	horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

	resumenDiv.appendChild(horaCita);
	
	const conServicio =document.createElement('DIV');
	conServicio.classList.add('conServicio');

	const servicioServicio = document.createElement('P');
	
	servicioServicio.classList.add('servicio');
	servicioServicio.classList.add('texto_centrado');
	servicioServicio.textContent = 'Servicios solicitados';
	
	resumenDiv.appendChild(servicioServicio);
	let costo = 0;
	// Iterar sobre los servicios
	servicios.forEach( servicio => {
		
		const { id, nombre, precio } = servicio;

		const newServicio = document.createElement('DIV');
		newServicio.classList.add('newservicio');

		const textoServicio = document.createElement('P');
		textoServicio.classList.add('nombre');
		textoServicio.textContent = nombre;

		const precioServicio = document.createElement('P');
		precioServicio.classList.add('precio');
		precioServicio.textContent = precio;
		// console.log(textoServicio);

		// calcular el costo final
		costo = costo + parseInt(precio.split(" ", 2)[1]);

		// Colocar texto y precio en el div
		newServicio.appendChild(textoServicio);
		newServicio.appendChild(precioServicio);

		conServicio.appendChild(newServicio);
	});

	const newServicio = document.createElement('DIV');
	newServicio.classList.add('newservicio');
	
	const totalServicio = document.createElement('P');
	totalServicio.textContent = 'Total';

	totalServicio.classList.add('nombre');
	
	const costoServicio = document.createElement('P');
	costoServicio.textContent = `$ ${costo}`;

	newServicio.appendChild(totalServicio);
	newServicio.appendChild(costoServicio);
	// console.log(costo)

	costoServicio.classList.add('precio');

	conServicio.appendChild(newServicio);

	resumenDiv.appendChild(conServicio);

}

function paginaSig() {
	// console.log('siguiente');
	const siguiente = document.querySelector('#despues');
	siguiente.addEventListener('click', () => {
		if (pagina<3){
			// llamada a la funvion de mostrar secciones
			funMostrar(pagina+1);
		}
		// console.log(pagina);
	});
}

function paginaAnt() {
	// console.log('anterior');
	const antes = document.querySelector('#antes');
	antes.addEventListener('click', () => {
		if (pagina>1){
			// llamada a la funvion de mostrar secciones
			funMostrar(pagina-1);
		}
		// console.log(pagina);
	});
}

function mostrarSeccion() {
	const seccionActual = document.querySelector(`#parte-${pagina}`);
	seccionActual.classList.add('mostrar-seccion');

	// Resaltar boton
	const tab = document.querySelector(`[data-paso="${pagina}"]`);
	tab.classList.add('actual');
}

function cambiarSeccion() {
	const enlaces = document.querySelectorAll('.tabs button');

	enlaces.forEach( enlace => {
		enlace.addEventListener('click', e => {
			e.preventDefault();
			
			// llamada a la funvion de mostrar secciones
			funMostrar(parseInt(e.target.dataset.paso));
		});
	});
}

function funMostrar(e) {

	// Eliminar el tab anterior
	let tab = document.querySelector(`[data-paso="${pagina}"]`);
	tab.classList.remove('actual');

	// Denir que boton se a clickeado
	pagina = e;

	// Quitar Mostrar seccion
	document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');

	// Agregar mostrar-seccion en la pocision del click
	const seccion =document.querySelector(`#parte-${pagina}`);
	seccion.classList.add('mostrar-seccion');

	// Resaltar boton
	tab = document.querySelector(`[data-paso="${pagina}"]`);
	tab.classList.add('actual');

	Ocultar();
}

function Ocultar() {
	const paginaSiguiente = document.querySelector('#despues');
    const paginaAnterior = document.querySelector('#antes');

    if(pagina == 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina == 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); // Estamos en la página 3, carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
}


async function mostrarServicios() {
	try {
		const resultado = await fetch('./servicios.json');
		const db = await resultado.json();
		let {servicios} = db;
		// console.log(servicios);

		servicios.forEach( servicio => {
			const { id, nombre, precio } =servicio;

			//DOM Scripting
			const nombreServicio = document.createElement('P');
			nombreServicio.textContent = nombre;
			nombreServicio.classList.add('nombre-servicio');
			// console.log(nombreServicio);

			//Generar el precio del servicio
			const precioServicio = document.createElement('P');
			precioServicio.textContent = `$ ${precio}`;
			precioServicio.classList.add('precio-servicio');

			//Genrar div contenedor de servicio
			const servicioDiv = document.createElement('DIV');
			servicioDiv.classList.add('servicio');
			servicioDiv.id = id;

			// Selecciona un sevicio para la cita
			servicioDiv.onclick = seleccionarServicio;

			//inyectar precio y nombre al div de servicio
			servicioDiv.appendChild(nombreServicio);
			servicioDiv.appendChild(precioServicio);

			// Inyectarlo en el HTML
			document.querySelector('#servicios').appendChild(servicioDiv);
			// console.log(servicioDiv);
		})
	} catch (error) {
		// statements
		console.log(error);
	}
}

function seleccionarServicio(e) {
	// console.log('hola');
	let elemento;
	
	// Forzar que el elemento al cual le demos click sea el DIV
	if (e.target.tagName == 'P') {
		elemento = e.target.parentElement;
		// console.log('click en el P');
	} else {
		elemento = e.target;
		// console.log('click en el DIV');
	}
	
	// Cambiar de color los elementos selecionados
	if (elemento.classList.contains('seleccionado')) {
		elemento.classList.remove('seleccionado');
		eliminarServicio(elemento);
	} else {
		elemento.classList.add('seleccionado');
		agrerarServicio(elemento);
	}
}

function eliminarServicio(elemento){
	const valor = parseInt( elemento.id);
	const { servicios } = cita;
	cita.servicios = servicios.filter( servicio => servicio.id !== valor);
	// console.log(cita);
}

function agrerarServicio(elemento){
	
	const servicioObj = {
		id: parseInt( elemento.id),
		nombre: elemento.firstElementChild.textContent,
		precio: elemento.firstElementChild.nextElementSibling.textContent
	}

	const { servicios } = cita;

	cita.servicios = [...servicios, servicioObj];

	// console.log(cita);
}

function tamañoPagina() {
	window.addEventListener("resize", function(){
	    // tu código aquí
	    // console.log('La pantalla ha cambiado de tamaño');
	    var ancho = screen.width;
 		// var alto = window.height();
 		// console.log(ancho);
	});
}