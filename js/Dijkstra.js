// Este objeto almacena todo el contenido de nuestro grafo.
const grafo = {};

// Este objeto almacena todas las coordenadas de cada vertice.
const coordenadas = {};

// Este arreglo almacena todas las aristas de conexión entre vértices.
const aristas = [];

// Esta función nos genera un mensaje indicando en que paso del algoritmo nos encontramos.
function log(mensaje) {
	const imprime = false;
	
    if (imprime) {
        console.log(mensaje);
    }
}

// Esta función nos retorna el nodo con menor peso al que podemos acceder.
const nodoPesoMenor = (pesos, procesados) => {
    return Object.keys(pesos).reduce((menor, nodo) => {
        if (menor === null || pesos[nodo] < pesos[menor]) {
            if (!procesados.includes(nodo)) {
                menor = nodo;
            }
        }
        return menor;
    }, null);
};

// Esta función nos retorna la ruta más barata hasta el nodo final dado el peso de cada arista.
const dijkstra = (grafo, nodoInicial, nodoFinal) => {
	// Siguiendo el peso menor para llegar a cada nodo.
    let pesos = {};
    pesos[nodoFinal] = "Infinity";
    pesos = Object.assign(pesos, grafo[nodoInicial]);

    // Siguiendo los caminos / rutas al visitar cada nodo.
    const nodosPadre = {
		nodoFinal: null
	};

    for (let nodoHijo in grafo[nodoInicial]) {
        nodosPadre[nodoHijo] = nodoInicial;
    }

    // Almacenando a los nodos que ya han sido procesados.
    const procesados = [];

    let nodo = nodoPesoMenor(pesos, procesados);

    while (nodo) {
        let peso = pesos[nodo];
		let nodosHijo = grafo[nodo];
		
        for (let n in nodosHijo) {
            if (String(n) === String(nodoInicial)) {
                log("¡No podemos regresar al inicio!");
            } else {
                log("Nombre del nodo inicial: " + nodoInicial);
                log("Evaluando el peso hasta el nodo " + n + " (buscando desde el nodo " + nodo + ")");
				log("Último peso: " + pesos[n]);
				
				let nuevoPeso = peso + nodosHijo[n];
				
				log("Nuevo peso: " + nuevoPeso);
				
                if (!pesos[n] || pesos[n] > nuevoPeso) {
                    pesos[n] = nuevoPeso;
					nodosPadre[n] = nodo;
					
                    log("Nodos padre y pesos actualizados.");
                } else {
                    log("Ya existe una mejor ruta.");
                }
            }
		}
		
        procesados.push(nodo);
        nodo = nodoPesoMenor(pesos, procesados);
    }

    let rutaOptima = [nodoFinal];
	let nodoPadre = nodosPadre[nodoFinal];
	
    while (nodoPadre) {
        rutaOptima.push(nodoPadre);
        nodoPadre = nodosPadre[nodoPadre];
	}

	rutaOptima.reverse();

    const resultados = {
        distancia: pesos[nodoFinal],
        ruta: rutaOptima
	};

    return resultados;
};