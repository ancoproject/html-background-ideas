
//RELOJ
function reloj(){
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const hora = `${hours}:${minutes}`;
        document.getElementById('clock').innerHTML = hora;;
}
setInterval(reloj, 1000);
reloj();

//CALENDARIO
function generarCalendario(mes, año){
    const diasContenedor = document.getElementById('dias');
    diasContenedor.innerHTML = '';

    const titulo = document.getElementById('titulo');
    const nombresMeses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    titulo.textContent = `${nombresMeses[mes]}`;

    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const totalDias = ultimoDia.getDate();

    let diaSemana = primerDia.getDay();
    diaSemana = (diaSemana === 0) ? 6 : diaSemana - 1;

    let fila = document.createElement('tr');
    for(let i = 0; i < diaSemana; i++){
        fila.appendChild(document.createElement('td'));
    }
    const hoy = new Date();
    for (let dia = 1; dia<= totalDias; dia++){
        const celda = document.createElement('td');
        celda.textContent = dia;

        if(
            dia === hoy.getDate() &&
            mes === hoy.getMonth() &&
            año === hoy.getFullYear()
        ){
            celda.classList.add('hoy');
        }
        fila.appendChild(celda);
        if((dia + diaSemana) % 7 === 0 || dia === totalDias){
            diasContenedor.appendChild(fila);
            fila = document.createElement('tr');
        }
    }
}
const fechaActual = new Date();
generarCalendario(fechaActual.getMonth(), fechaActual.getFullYear());

//NOTAS
function agregarNota(){
    const texto = document.getElementById('input-notes').value.trim();
    if (texto === "") return;

    const notaContainer = document.createElement("p");
    notaContainer.classList.add("nota");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const span = document.createElement("span");
    span.textContent = texto;

    checkbox.addEventListener("change", function(){
        if (this.checked) {
            span.classList.add("terminada");
        } else {
            span.classList.remove("terminada");
        }
    });
    notaContainer.appendChild(checkbox);
    notaContainer.appendChild(span);

    document.getElementById("notes").appendChild(notaContainer);

    document.getElementById("input-notes").value = "";
}
function eliminarTerminadas(){ 
    const notas = document.querySelectorAll("#notes .nota"); 
    notas.forEach(nota => { 
        const checkbox = nota.querySelector("input[type='checkbox']"); 
        if (checkbox.checked) { 
            nota.remove();
        } 
    }); 
}


async function getWeeklyContributions(username) {
  const response = await fetch(`https://api.github.com/users/${username}/events`);
  const events = await response.json();

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)); // lunes inicio

  // Inicializar conteo por día
  const counts = Array(7).fill(0);

  events.forEach(event => {
    const date = new Date(event.created_at);
    if (date >= startOfWeek && date <= now) {
      const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // lunes=0, domingo=6
      if (["PushEvent", "PullRequestEvent", "IssuesEvent"].includes(event.type)) {
        counts[dayIndex]++;
      }
    }
  });

  // Renderizar cuadraditos
  const grid = document.querySelector(".grid");
  grid.innerHTML = "";
  counts.forEach(count => {
    const day = document.createElement("div");
    day.className = "day";
    day.dataset.count = Math.min(count, 4); // limitar a 4 niveles
    grid.appendChild(day);
  });
}

// Llama a la función con tu usuario de GitHub
getWeeklyContributions("ancoproject");

