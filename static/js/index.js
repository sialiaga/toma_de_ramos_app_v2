document.addEventListener('DOMContentLoaded', function() {



// Realiza una solicitud GET a la URL de todos los cursos
const URL_BASE = window.location.origin

// DOM VARS
let searchInput = document.getElementById("searchInput");
let selectElement = document.getElementById("miSelect"); 
const showLoadingAlert = () => {
  return Swal.fire({
    title: 'Cargando...',
    allowEscapeKey: false,
    allowOutsideClick: false,
    showConfirmButton: false,
    html:'<div class="spinner-border" role="status"><span class="sr-only"></span></div>',
    onBeforeOpen: () => {
      Swal.showLoading();
      
    },
  })
};
let is_mode_advance = false
const loading = showLoadingAlert;
let tmp_loading = '';





// AUX VARS
let DATA_CURSOS;
let ramosSelected = []
let tipoBusqueda = "TITULO"
const diaSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']
const banned_words = [
  "de", "a", "en", "con", "por", "para", "sin", "ante", "sobre",
  "entre", "tras", "durante", "según", "mediante", "y", "o", "pero", "aunque",
  "porque", "si", "cuando", "mientras", "así que", "por lo tanto", "además",
  "por otro lado", "sin embargo", "por tanto", "de hecho", "e", "y", "la"
];

fetch(URL_BASE+'/api/cursos')
  .then(response => {
    if (response.ok) {
      // Si la respuesta es exitosa, convierte la respuesta a JSON
      return response.json();
    }
    throw new Error('Error al obtener los datos');
  })
  .then(data => {
    // Imprime la respuesta en la consola
    DATA_CURSOS = data;
    console.log(data);
  })
  .catch(error => {
    console.error(error);
    redNotification();
  });






let redNotification = () => {
  notie.alert({
    type: 3,
    text: 'Hubo dificultades de conexión al intentar completar la operación',
    buttonText: 'OK',
    time: 5,
    callback: function () {
      location.reload();
    }
  })
}


let changePageMode = (show_alert = true) => {
  if (is_mode_advance == false) {
    is_mode_advance = true
    localStorage.setItem("pageMode", true)

    if (show_alert) Swal.fire({
      title:"Modo Ayudante",
      text:'El modo ayudante te permite agregar ramos en los cuales planeas realizar algun labor de ayudante durante el semestre, solamente podras agregar Catedras o Laboratorios y los creditos no seran cotemplados.'
    });
    
    // document.getElementById("advance-addtool").hidden = false
    document.getElementById("navbar-ico-text").innerHTML = "TR(A)"
    document.title = "TR(A)"
    document.getElementById("navbar-base").classList.replace("bg-secondary","bg-dark");
    document.getElementById('navbar-ico').classList.replace("btn-dark","btn-secondary")
    document.getElementById('navbar-ico').innerText = "Modo Estudiante";
    agregarOpcionesBusqueda("NRC")
    agregarOpcionesBusqueda("CREDITO")
    
    
  }
  else {
    is_mode_advance = false
    localStorage.setItem("pageMode", false)

    if (show_alert) Swal.fire("Modo Estudiante");
    
    // document.getElementById("advance-addtool").hidden = true
    document.getElementById("navbar-ico-text").innerHTML = "TR"
    document.title = "TR"
    document.getElementById("navbar-base").classList.replace("bg-dark", "bg-secondary");
    document.getElementById('navbar-ico').classList.replace("btn-secondary","btn-dark")
    document.getElementById('navbar-ico').innerText = "Modo Ayudante";

    EliminarOpcionesBusqueda("NRC")
    EliminarOpcionesBusqueda("CREDITO")
    
  }
}

let agregarOpcionesBusqueda = (new_opcion) => {
  var selectElement = document.getElementById("miSelect");

  var newOption = document.createElement("option");
  newOption.value = new_opcion;
  newOption.textContent = new_opcion;
  selectElement.appendChild(newOption);
}

let EliminarOpcionesBusqueda = (select_opcion) => {
  var selectElement = document.getElementById("miSelect");

  selectElement.value = "TITULO";
  tipoBusqueda = "TITULO";
  document.getElementById("searchInput").placeholder = `Buscar Ramo - ${tipoBusqueda}`;

  for (var i = 0; i < selectElement.options.length; i++) {
    var option = selectElement.options[i];
    if (option.value === select_opcion) {
        selectElement.remove(i);
        break;
  }
}
}

let stringToColorCode = (inputString) => {
  let hash = 0;
  for (let i = 0; i < inputString.length; i++) {
    hash = (hash * 397) ^ (inputString.charCodeAt(i) * 743);
  }
  const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "00000".substring(0, 6 - color.length) + color;
}

let lightenColor = (hex, factor) => {
  // Parse el color HEX a RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Aumenta los componentes de color
  r = Math.min(255, r + factor);
  g = Math.min(255, g + factor);
  b = Math.min(255, b + factor);

  // Convierte de nuevo a HEX
  const newHex = `${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;

  return newHex;
}

let is_LightColor = (hexColor, umbral = 128) => {
  // Convierte el color hexadecimal a valores RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calcula la luminancia
  const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;

  // Compara la luminancia con el umbral
  return luminancia > umbral;
}

let make_color = (base, tipo="C") => {
  const sumaDigitos = (numero) => numero.toString().split('').reduce((suma, digito) => suma + parseInt(digito, 10), 0);
  const type = sumaDigitos(base)
  const new_base = stringToColorCode(String(base))
  const hex_base = "F1"
  console.log(type)
  let result;
  if (base%2) {
    result = "#" + new_base[1] + new_base[2] + hex_base + new_base[0] + new_base[3]
  }
  else {
    result = "#" + new_base[3] + new_base[0] + new_base[2] + new_base[1] + hex_base
  }
  
  factor = is_LightColor(result) ? 0 : 100
  if (tipo != "C") {
    
    factor += 30
    console.log("Is ayun")
    
  }
  console.log(factor)
  
  return lightenColor(result, factor)
}

const resume_title = (title) => {
  const palabras = title.split(' ');
  const iniciales = palabras
    .filter(palabra => !banned_words.includes(palabra.toLowerCase()))
    .map(palabra => palabra[0])
    .slice(0, 5);
  return iniciales.join('');
};

let refresh_horario = async (NRC) => {
  // loading()
  try {

    if (localStorage.getItem(`ramos${NRC}Horario`) == null) {
      let horarioData = await get_HorarioNrc(NRC);
      //!ACA ES DONDE HAY QUE CAMBIAR Y HACER LAS CONSULTAS, GIL
      if (is_mode_advance){
        opciones = horarioData.filter((x) => x.TIPO!=="CLAS").map((x)=>x.TIPO);
        if (opciones.length === 0){
          
          //Poner una alerta el ramo no tiene ayudantias
          // return 'No existen ayudantias';
          //
        }else if(opciones.length===1){
          horarioData = horarioData.filter((x) => x.TIPO!=="CLAS");
          // horarioData[0].setAttribute('ayudantia',true);
          // horarioData = horarioData.map((x) => x.AYUDANTIA = true)
          // horarioData = horarioData.map((x) => x.ayudantia = true)
          horarioData.map((x) => x['ayudantia'] = true)
          console.log('Estoy aca EN DONDE HAY UNA OPCION');

          


        }
        else{
  
          const inputOptions = {
            [opciones[0]]: `${opciones[0]}`,
            [opciones[1]]: `${opciones[1]}`
          };
          
          const { value: tipo_ayudantia } =  await Swal.fire({
            title: "Que tipo de ayudantia quieres hacer?",
            input: "radio",
            inputOptions,
            inputValidator: (value) => {
              if (!value) {
                return "Necesitas elegir algo!";
              }
            }
          });
       
          horarioData = horarioData.filter((x) => {return x.TIPO!=="CLAS" && x.TIPO === tipo_ayudantia});
          // horarioData[0].setAttribute('ayudantia',true);
          // horarioData = horarioData.map((x) => x["AYUDANTIA"] = true)
          console.log('Este es mi horario Data')
          console.log(horarioData)
          horarioData.map((x) => x['ayudantia'] = true)
          console.log(horarioData)
        
        }
      }
      if(is_mode_advance){
        if(opciones.length!=0){
          console.log(opciones)
          console.log(horarioData)
          localStorage.setItem(`ramos${NRC}Horario`, JSON.stringify(horarioData));
        }else{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Este ramo no tiene ayudantias",
          });
          ramosSelected.pop()
          
        }


      }else{

        localStorage.setItem(`ramos${NRC}Horario`, JSON.stringify(horarioData));
      }
    }

    if (localStorage.getItem(`ramos${NRC}Pruebas`) == null) {
      const pruebasData = await get_PruebasNrc(NRC);
      localStorage.setItem(`ramos${NRC}Pruebas`, JSON.stringify(pruebasData));
    }

    if (localStorage.getItem(`ramos${NRC}Examen`) == null) {
      const examenData = await get_ExamenNrc(NRC);
      localStorage.setItem(`ramos${NRC}Examen`, JSON.stringify(examenData));
    }
    tmp_loading = loading();
    refresh_page();
  } catch (error) {
    console.error(error);
    ramosSelected = ramosSelected.filter(elemento => elemento.NRC !== NRC);
    localStorage.setItem('ramosSelectedSave', JSON.stringify(ramosSelected));
    localStorage.removeItem(`ramos${NRC}Horario`); 
    localStorage.removeItem(`ramos${NRC}Pruebas`); 
    localStorage.removeItem(`ramos${NRC}Examen`); 
    redNotification();
  }finally{
    try{
      tmp_loading.close();

    }catch{
      //
    }
  }
};

let refresh_page = () => {
  actualizar_pruebas();
  actualizar_examenes();
  actualizar_horario();
  actualizar_creditos();
  actualizar_lista();
  
  check_ramos();
}

let check_ramos = () => {
  let contenedor = document.getElementById("clean-all");
  contenedor.innerHTML = "";


  if (ramosSelected.length != 0) {
    // Crear el elemento de limpieza
    const link = document.createElement("a");
    link.href = "#";
    link.className = "link-danger";

    // Agregar el evento de clic
    link.addEventListener("click", remove_all);

    link.innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
    </svg>`

    // Agregar el enlace al contenedor
    contenedor.appendChild(link);
  }
};

let remove_all = () => {
  let creditHeader = document.getElementById("creditosHeader");
  creditHeader.classList.remove("border-danger")
  ramosSelected = []
  localStorage.clear(); 
  refresh_page();
}

let get_HorarioNrc = (nrcRamo) => {
  return fetch(URL_BASE+'/api/curso/NRC/' + nrcRamo + '/horario')
    .then(response => {
      if (response.ok) {
        // Si la respuesta es exitosa, convierte la respuesta a JSON y retorna la promesa
        return response.json();
      }
      throw new Error('Error al obtener los datos');
    })
    .catch(error => {
      console.error(error);
      redNotification();
    });
}

let get_RamoNrc = (nrcRamo) => {
  return fetch(URL_BASE+'/api/curso/NRC/' + nrcRamo)
    .then(response => {
      if (response.ok) {
        // Si la respuesta es exitosa, convierte la respuesta a JSON y retorna la promesa
        return response.json();
      }
      throw new Error('Error al obtener los datos');
    })
    .catch(error => {
      console.error(error);
      redNotification();
    });
}

let get_PruebasNrc = (nrcRamo) => {
  return fetch(URL_BASE+'/api/curso/NRC/' + nrcRamo + '/pruebas')
    .then(response => {
      if (response.ok) {
        // Si la respuesta es exitosa, convierte la respuesta a JSON y retorna la promesa
        return response.json();
      }
      throw new Error('Error al obtener los datos');
    })
    .catch(error => {
      console.error(error);
      redNotification();
    });
}

let get_ExamenNrc = (nrcRamo) => {
  return fetch(URL_BASE+'/api/curso/NRC/' + nrcRamo + '/examen')
    .then(response => {
      if (response.ok) {
        // Si la respuesta es exitosa, convierte la respuesta a JSON y retorna la promesa
        return response.json();
      }
      throw new Error('Error al obtener los datos');
    })
    .catch(error => {
      console.error(error);
      redNotification();
    });
}

let actualizar_horario =  () => {
  crearHorario();
  console.log("actualizar_horario")
  ramosSelected.map(async ramo => {
    // console.log('this is my print')
    // console.log(ramo)
    console.log('esto es lo que se fetchea del local');
    let clases = JSON.parse(localStorage.getItem(`ramos${ramo.NRC}Horario`));
    console.log(clases)

   
    console.log('estoy console logeando');
    // console.log(clases);
    clases.map(clase => {
        
        console.log(clase)
        diaSemana.map(dia =>{
          if (clase[dia] != "") {
            let startClase = clase[dia].split("-")[0]
            let EndClase = clase[dia].split("-")[1]
            for (let i = parseInt(startClase.split(":")[0]); `${i}:20` != EndClase; i++) {
              // console.log(`${dia} ${startClase} ${EndClase}`)
              // console.log("ADD HOUR")
              let celda = document.getElementById(`${i}-${dia}`);
              let class_ramo; 
              if (celda.innerHTML == "") {
                celda.style.border = "";
                class_ramo = "fontSizing"
              }
              else {
                mostrarNotificacion("¡Existe Tope de horario!", "#c86262");
                celda.style.border = "3px solid red";
                class_ramo = "fontSizing mt-1"
              }
              if (clase.ayudantia){
                celda.innerHTML += `<div class="${class_ramo}" style="background-color: #${make_color(ramo.NRC, clase.TIPO[0])}; font-size: 90%">
                                  <p style="margin: 0%"><i>[${clase.TIPO[0]}] ${resume_title(ramo.TITULO)}</i></p> 
                                  <p style="font-size: 80%;margin: 0%"> <i>${clase.SALA.replace("-","")} </i></p>
                                  </div>`


              }else{
                celda.innerHTML += `<div class="${class_ramo}" style="background-color: #${make_color(ramo.NRC, clase.TIPO[0])}; font-size: 90%">
                                  <p style="margin: 0%">[${clase.TIPO[0]}] ${resume_title(ramo.TITULO)}</p> 
                                  <p style="font-size: 80%;margin: 0%"> ${clase.SALA.replace("-","")} </p>
                                  </div>`

              }
              
              
            }
            
          }
        })
      })
    });
}

let actualizar_lista = () => {
  let contenedor = document.getElementById("ListaRamos");
  contenedor.innerHTML = "";

  ramosSelected.map(ele => {
    // Variables con los datos a reemplazar
    var ramo = ele.TITULO;
    var profesor = ele.PROFESOR;
    var nrc = ele.NRC;

    var color_nrc = make_color(nrc);

    // Crea un nuevo elemento <div> para la card
    var card = document.createElement("div");
    card.className = "card mb-3";
    card.style.backgroundColor = "#" + color_nrc;

    let isMouseHover = false
    card.addEventListener("mouseleave", function (event) {
      card.classList.remove("list-group-item-danger");
      card.style.backgroundColor = "#" + color_nrc;
      card.style.cursor = ""
      
    }, false);
    card.addEventListener("mouseover", function (event) {
      card.classList.add("list-group-item-danger");
      card.style.backgroundColor = ""
      card.style.cursor = "pointer"
    }, false);

    // Agrega un evento click a la card para eliminar el elemento
    card.addEventListener("click", function() {
      eliminar_ramo(nrc);
    });

    // Crea un nuevo elemento <div> para el contenido de la card
    var cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Contenido HTML del nuevo elemento
    if(ele.ayudantia){
      cardBody.innerHTML = `
        <h5 class="card-title"><i>[${resume_title(ramo)}] ${ramo}</i></h5>
        <p class="card-text"><i>Profesor: ${profesor}</i></p>
        <p class="card-text"><i>NRC: ${nrc}</i></p>
      `;

    }else{
      cardBody.innerHTML = `
        <h5 class="card-title">[${resume_title(ramo)}] ${ramo}</h5>
        <p class="card-text">Profesor: ${profesor}</p>
        <p class="card-text">NRC: ${nrc}</p>
      `;
    }

    // Agrega el nuevo elemento al contenedor
    card.appendChild(cardBody);
    contenedor.appendChild(card);
  });

}

let actualizar_pruebas = () => {
  let contenedor = document.getElementById("ListaPruebas");
  contenedor.innerHTML = ""
  ramosSelected.map(ramo => {
    JSON.parse(localStorage.getItem(`ramos${ramo.NRC}Pruebas`)).map(prueba => {
        let hora = diaSemana.map(dia => prueba[dia]).filter(valor => valor !== "")[0];
        contenedor.innerHTML += `
        <div class="col-xxl-6 col-sm-12 mt-1">
          <div class="card" style="background-color: #${make_color(ramo.NRC)};">
              <div class="card-body">
                  <p class="h6 fw-bold">${prueba.TITULO}</p>
                  <p class="simple-text">Descripción: ${prueba.TIPO}</p>
                  <p class="simple-text">Fecha: ${prueba.FIN}</p>
                  <p class="simple-text">Hora: ${hora}</p>
                  <p class="simple-text">Sala: ${prueba.SALA}</p>
              </div>
          </div>
        </div>`
      })
    })
  }

let actualizar_examenes = () => {
  let contenedor = document.getElementById("ListaExamenes");
  contenedor.innerHTML = ""
  ramosSelected.map(ramo => {
    JSON.parse(localStorage.getItem(`ramos${ramo.NRC}Examen`)).map(examen => {
        let hora = diaSemana.map(dia => examen[dia]).filter(valor => valor !== "")[0];
        contenedor.innerHTML += `
        <div class="col-xxl-6 col-sm-12 mt-1">
          <div class="card" style="background-color: #${make_color(ramo.NRC)};">
              <div class="card-body">
                  <p class="h6 fw-bold">${examen.TITULO}</p>
                  <p class="simple-text">Descripción: ${examen.TIPO}</p>
                  <p class="simple-text">Fecha: ${examen.FIN}</p>
                  <p class="simple-text">Hora: ${hora}</p>
                  <p class="simple-text">Sala: ${examen.SALA}</p>
              </div>
          </div>
        </div>`
      })
    })
  }

let actualizar_creditos = () => {
  let creditCounter = document.getElementById("CreditValue");
  let creditHeader = document.getElementById("creditosHeader");
  let counter = 0
  creditCounter.innerHTML = 0
  ramosSelected.map(ramo => {
      console.log(ramo)
      if (ramo.ayudantia){
        //
      }else{

        counter += parseInt(ramo.CREDITO)
      }
      if (counter > 33) {
        mostrarNotificacion("¡Existe Tope de Creditos!", "#c86262")
        creditHeader.classList.add("border-danger")
      }
      else {
        creditHeader.classList.remove("border-danger")
      }
      creditCounter.innerHTML = counter
      return
    })
}

let eliminar_ramo = (nrcRamo) => {
  console.log(nrcRamo)
  console.log("Borrado")
  ramosSelected = ramosSelected.filter(elemento => elemento.NRC !== nrcRamo);
  refresh_page();
  localStorage.setItem('ramosSelectedSave', JSON.stringify(ramosSelected));
  localStorage.removeItem(`ramos${nrcRamo}Horario`); 
  localStorage.removeItem(`ramos${nrcRamo}Pruebas`); 
  localStorage.removeItem(`ramos${nrcRamo}Examen`); 
}

let Agregar_ramo = (ramoSelect) => {
  // Aca debe estar la logica
  console.log("Elemento seleccionado: ", ramoSelect);
  if (is_mode_advance){
    ramoSelect['ayudantia'] = true;
  }
  ramosSelected.push(ramoSelect)
  console.log(ramosSelected)
  localStorage.setItem('ramosSelectedSave', JSON.stringify(ramosSelected));
  
  refresh_horario(ramoSelect.NRC)
}

let crearHorario = () => {
  let tabla = document.getElementById("horario");
  tabla.innerHTML = ""
  for (let i = 8; i < 20; i++) {
    // Obtén una referencia al elemento tbody
    

    // Crea un nuevo elemento <tr>
    var nuevoFila = document.createElement("tr");
    nuevoFila.classList.add("equal-row");
    // Define el contenido HTML para la nueva fila
    nuevoFila.innerHTML = '<th scope="row">'+ `${i}:30` +'</th>' +
                        '<th scope="row">'+ `${i+1}:20` +'</th>' +
                        '<td class="casilla" ' + ` id="${i}-LUNES"` +  '></td>' +
                        '<td class="casilla" ' + ` id="${i}-MARTES"` +  '></td>' +
                        '<td class="casilla" ' + ` id="${i}-MIERCOLES"` +  '></td>' +
                        '<td class="casilla" ' + ` id="${i}-JUEVES"` +  '></td>' +
                        '<td class="casilla" ' + ` id="${i}-VIERNES"` +  '></td>' +
                        '<td class="casilla" ' + ` id="${i}-SABADO"` +  '></td>' +
                        '<td class="casilla" ' + ` id="${i}-DOMINGO"` +  '></td>';

    // Agrega la nueva fila al tbody
    tabla.appendChild(nuevoFila);
  }
}

let busqueda = () => {
  let searchText = searchInput.value.toLowerCase();
  console.log('Texto de búsqueda: ' + searchText);

  if (searchText == "") {
      // Si no hay texto de búsqueda, oculta la lista de resultados
      document.querySelector(".search-results").style.display = "none";
      return;
  }

  const regex = new RegExp(searchText.toString(), 'i');
  let res = DATA_CURSOS.filter(elemento => {
      return regex.test(elemento[tipoBusqueda].toString());
  }).filter(elementoRes => {
    return !ramosSelected.some(elementoRamo => elementoRamo.NRC === elementoRes.NRC);
  });

  // Obtén el elemento de la lista de resultados
  let resultsList = document.getElementById("resultsList");
  resultsList.innerHTML = ""; // Limpia la lista de resultados

  if (res.length > 0) {
      // Si hay resultados, muestra la lista de resultados
      document.querySelector(".search-results").style.display = "block";

      // Recorre los resultados y agrega elementos <li> a la lista de resultados
      for (let i = 0; i < res.length; i++) {
        let result = res[i];
    
        let title = document.createElement("h5");
        title.textContent = result.TITULO;
        
        let professor = document.createElement("h6");
        professor.textContent = result.PROFESOR;
        
        let nrc = document.createElement("p");
        nrc.textContent = `NRC: ${result.NRC}`;
        
        let item = document.createElement("li");
        item.appendChild(title);
        item.appendChild(professor);
        item.appendChild(nrc);
        
        item.addEventListener("click", function() {
          document.querySelector(".search-results").style.display = "none";
          tmp_loading = loading();
          // tmp_loading
          Agregar_ramo(result)
        });

        //Agregar elemento a la lista
        resultsList.appendChild(item);
    }
  } else {
    document.querySelector(".search-results").style.display = "none";
  }
};

let SaveHorario = () => {
  const elementToConvert = document.getElementById('MainTable'); 

  html2canvas(elementToConvert, { scale: 2, quality: 1 }).then(function(canvas) {
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);

        // Crea un enlace de descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mi_imagen.png'; // Nombre predeterminado del archivo
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Libera el recurso URL
        URL.revokeObjectURL(url);
    });
  });
}

let SaveEvaluaciones = () => {
  const elementToClone = document.getElementById('EvaluacionesTable');
  const clone = elementToClone.cloneNode(true);

  
  clone.classList.remove('col-sm-12', 'col-lg-6', 'col-xxl-12');
  clone.classList.add('col-12');

  clone.querySelector('#pruebaList').classList.remove('resume-list-eval');
  clone.querySelector('#examenList').classList.remove('resume-list-eval');

  clone.querySelector('#pruebaListRow').classList.remove('col-xxl-8', 'col-sm-12');
  clone.querySelector('#pruebaListRow').classList.add('col-8');
  
  clone.querySelector('#examenListRow').classList.remove('col-xxl-4', 'col-sm-12');
  clone.querySelector('#examenListRow').classList.add('col-4');

  Array.from(clone.querySelector('#ListaPruebas').children).forEach((node) => {
    node.classList.remove('col-sm-12', 'col-xxl-6');
    node.classList.add('col-6');
  });

  // Agrega el clon al cuerpo del documento temporalmente
  document.body.appendChild(clone);

  // Captura una imagen del clon
  html2canvas(clone, { scale: 2, quality: 1 }).then(function(canvas) {
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);

        // Crea un enlace de descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mi_imagen.png'; // Nombre predeterminado del archivo
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Elimina el clon
        document.body.removeChild(clone);

        // Libera el recurso URL
        URL.revokeObjectURL(url);
    });
  });
}

let SaveDetalles = () => {
  const elementToClone = document.getElementById('DetallesTable');
  const clone = elementToClone.cloneNode(true);

  clone.querySelector('#ListaRamosBody').classList.remove('resume-list');

  clone.classList.remove('col-sm-12', 'col-lg-6', 'col-xxl-12');
  clone.classList.add('col-6');


  // Agrega el clon al cuerpo del documento temporalmente
  document.body.appendChild(clone);

  // Captura una imagen del clon
  html2canvas(clone, { scale: 2, quality: 1 }).then(function(canvas) {
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);

        // Crea un enlace de descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mi_imagen.png'; // Nombre predeterminado del archivo
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Elimina el clon
        document.body.removeChild(clone);

        // Libera el recurso URL
        URL.revokeObjectURL(url);
    });
  });
}

let mostrarNotificacion = (notiText, color) => {
  var TextSpace = document.getElementById("notification_text");
  TextSpace.innerHTML = notiText
  var notification = document.getElementById("notification");
  notification.style.display = "block";
  notification.style.backgroundColor = color
  setTimeout(function() {
      cerrarNotificacion();
  }, 5000); // 10000 ms = 10 segundos
}

let cerrarNotificacion = () => {
  var notification = document.getElementById("notification");
  notification.style.display = "none";
 }

selectElement.addEventListener("change", function () {
  tipoBusqueda = selectElement.value;
  document.getElementById("searchInput").placeholder = `Buscar Ramo - ${tipoBusqueda}`;
  console.log("Valor seleccionado: " + tipoBusqueda);
  
});

searchInput.addEventListener("input", busqueda);
searchInput.addEventListener("focus", busqueda);

document.addEventListener("click", function(event) {
  if (event.target !== searchInput) {
    document.querySelector(".search-results").style.display = "none";
  }
});


crearHorario();

if (localStorage.getItem('ramosSelectedSave') !== null) {
  ramosSelected = JSON.parse(localStorage.getItem('ramosSelectedSave'));
  ramosSelected.map(data => refresh_horario(data.NRC))
  
}


document.getElementById('SaveHorarioBtn').addEventListener('click', SaveHorario);
document.getElementById('SaveEvaluacionesBtn').addEventListener('click', SaveEvaluaciones);
document.getElementById('SaveDetallesBtn').addEventListener('click', SaveDetalles);
document.getElementById('SaveDetallesBtn').addEventListener('click', SaveDetalles);

document.getElementById('navbar-ico').addEventListener('click', changePageMode);

if (localStorage.getItem('pageMode') == "true") {
  changePageMode(false)
} else {
  localStorage.setItem("pageMode", false)
}

});