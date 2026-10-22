
const $ = id => document.getElementById(id);

const tratar = $("tratar");
const filtrar = $("filtrar");
const reiniciar = $("reiniciar");
const selectorDosis = $("dosis");

let fase = 0;
let temporizador = null;
let progresoActual = 0;
let dosis = 40;

function actualizarProgreso(valor, texto) {
    progresoActual = valor;
    $("progreso").style.width = `${valor}%`;
    $("porcentaje").textContent = `${valor}%`;
    $("fase").textContent = texto;
}

function mostrarExplicacion(titulo, texto) {
    $("tituloExplicacion").textContent = titulo;
    $("explicacion").textContent = texto;
}

function limpiarTemporizador() {
    if (temporizador !== null) {
        clearInterval(temporizador);
        temporizador = null;
    }
}

function reiniciarSimulacion() {
    limpiarTemporizador();

    fase = 0;
    progresoActual = 0;
    dosis = Number(selectorDosis.value);

    $("estado").textContent = "Preparado";
    $("saco").style.display = "none";
    $("textoSaco").textContent = "Saco sin sumergir";

    $("aguaInicial").style.height = "75%";
    $("aguaInicial").style.background = "";
    $("suspension").style.opacity = "1";

    $("aguaTratada").style.height = "0";
    $("aguaTratada").style.background = "";
    $("floculos").style.opacity = "0";

    $("aguaEmbudo").style.height = "0";
    $("aguaFinal").style.height = "0";
    $("zonaGotas").innerHTML = "";

    $("reduccion").textContent = "—";
    $("volumen").textContent = "0 ml";
    $("turbidezInicial").textContent = "100%";

    tratar.disabled = false;
    filtrar.disabled = true;
    selectorDosis.disabled = false;

    actualizarProgreso(0, "Esperando inicio del experimento");

    mostrarExplicacion(
        "¿Cómo funciona el proceso?",
        "El agua contiene partículas suspendidas, como tierra y polvo. Selecciona una dosis y comienza el tratamiento para observar las etapas del prototipo PROSA."
    );
}

function comenzarTratamiento() {
    if (fase !== 0) return;

    fase = 1;
    dosis = Number(selectorDosis.value);
    selectorDosis.disabled = true;
    tratar.disabled = true;

    $("estado").textContent = "Tratamiento";
    $("saco").style.display = "block";
    $("textoSaco").textContent = "Saco sumergido: liberación conceptual";

    $("aguaTratada").style.height = "70%";
    $("aguaTratada").style.background =
        "linear-gradient(#c9b88e, #9b8965)";

    mostrarExplicacion(
        "Etapa 1. Adición del mucílago",
        `Se introduce el saco de nopal en el agua. En esta representación, el mucílago se libera y entra en contacto con las partículas suspendidas. La dosis seleccionada es ${dosis} g/L.`
    );

    let paso = 0;

    temporizador = setInterval(() => {
        paso++;

        const avance = Math.min(Math.round(paso / 20 * 50), 50);
        actualizarProgreso(avance, "Liberación y mezcla");

        if (paso >= 20) {
            limpiarTemporizador();

            $("floculos").style.opacity = "1";
            $("suspension").style.opacity = "0.45";
            $("estado").textContent = "Floculación simulada";
            $("textoSaco").textContent = "Partículas en agregación";

            mostrarExplicacion(
                "Etapa 2. Formación de flóculos",
                "El mucílago puede favorecer que algunas partículas se agrupen y formen flóculos. Su tamaño y cantidad dependen de las características del agua, la dosis y las condiciones de mezcla."
            );

            filtrar.disabled = false;
            actualizarProgreso(50, "Tratamiento completado; listo para filtrar");
        }
    }, 100);
}

function crearGotas() {
    $("zonaGotas").innerHTML = "";

    for (let i = 0; i < 3; i++) {
        const gota = document.createElement("div");
        gota.className = "gota";
        gota.style.animationDelay = `${i * 0.2}s`;
        $("zonaGotas").appendChild(gota);
    }

    $("zonaGotas").style.left = "50%";
    $("zonaGotas").style.top = "55%";
}

function comenzarFiltracion() {
    if (fase !== 1) return;

    fase = 2;
    filtrar.disabled = true;
    $("estado").textContent = "Filtrando";

    crearGotas();

    $("aguaEmbudo").style.height = "43px";

    mostrarExplicacion(
        "Etapa 3. Filtración por gravedad",
        "El agua pasa por el papel filtro. Los flóculos y otras partículas que sean mayores que los poros pueden quedar retenidos. Las sustancias disueltas pueden atravesar el filtro."
    );

    let paso = 0;

    // Estos porcentajes solo ilustran el cambio visual.
    // No representan una eficiencia medida del mucílago.
    const reduccionIlustrativa = {
        30: 65,
        40: 75,
        50: 80
    };

    const reduccion = reduccionIlustrativa[dosis];

    temporizador = setInterval(() => {
        paso++;

        const avanceFiltrado = Math.min(paso / 30, 1);
        const porcentajeTotal = Math.round(
            50 + avanceFiltrado * 50
        );

        actualizarProgreso(porcentajeTotal, "Paso del agua por el filtro");

        $("aguaInicial").style.height =
            `${75 - avanceFiltrado * 20}%`;

        $("aguaTratada").style.height =
            `${70 - avanceFiltrado * 20}%`;

        $("aguaFinal").style.height =
            `${avanceFiltrado * 65}%`;

        $("aguaEmbudo").style.height =
            `${43 * (1 - avanceFiltrado)}px`;

        $("volumen").textContent =
            `${Math.round(avanceFiltrado * 65)} ml`;

        $("reduccion").textContent =
            `${Math.round(avanceFiltrado * reduccion)}%*`;

        if (paso >= 30) {
            limpiarTemporizador();

            $("zonaGotas").innerHTML = "";
            $("estado").textContent = "Finalizado";

            $("aguaInicial").style.background =
                "linear-gradient(#aa956e, #81704e)";

            $("aguaTratada").style.background =
                "linear-gradient(#c9b88e, #9b8965)";

            mostrarExplicacion(
                "Etapa 4. Recolección y evaluación",
                `La filtración ha terminado. Se han representado 65 ml de agua recolectada y una reducción visual ilustrativa del ${reduccion}% para la dosis de ${dosis} g/L. Para conocer la eficiencia real, mide la turbidez de las muestras antes y después del tratamiento.`
            );

            actualizarProgreso(100, "Simulación terminada");

            // Permitir ejecutar nuevamente mediante reinicio
            fase = 3;
        }
    }, 100);
}

tratar.addEventListener("click", comenzarTratamiento);
filtrar.addEventListener("click", comenzarFiltracion);
reiniciar.addEventListener("click", reiniciarSimulacion);

selectorDosis.addEventListener("change", () => {
    dosis = Number(selectorDosis.value);
});

reiniciarSimulacion();
