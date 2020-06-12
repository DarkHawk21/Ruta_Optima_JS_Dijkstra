var canvas = document.getElementById("mapa");

if (canvas && canvas.getContext) {
  var ctx = canvas.getContext("2d");
}

$(document).ready(function () {
  clearInformation();
  sizeCanvas();
  drawGrid();

  $("#btnCreateVertice").click(function () {
    clearForms();
    $(".formVertices").slideDown(300);
    $("#positionX").focus();
  });

  $("#btnCreateEdge").click(function () {
    clearForms();
    $(".formEdges").slideDown(300);
    $("#positionX").focus();
  });

  $("#btnRoute").click(function () {
    clearForms();
    $(".formCalculate").slideDown(300);
  });

  $("#btnClear").click(function () {
    clearInformation();
  });

  $("#btnCrearV").click(function (e) {
    e.preventDefault();
    let x = parseInt($("#positionX").val());
    let y = parseInt($("#positionY").val());
    let nameV = $("#nameVertice").val();

    if (
      x >= 0 &&
      y >= 0 &&
      x <= 100 &&
      y <= 100 &&
      nameV != "" &&
      x != null &&
      y != null &&
      nameV != null
    ) {
      let coordenada = [x, y];
      let existe = false;
      let queExiste = "";

      if (Object.keys(coordenadas).length > 0) {
        // Valida que las coordenadas no existan ya en el grafo.
        for (const vertice in coordenadas) {
          for (let i = 0; i < coordenadas[vertice].length; i++) {
            if (coordenadas[vertice][0] == x && coordenadas[vertice][1] == y) {
              existe = true;
              queExiste += `Ya existen las coordenadas (${x},${y}) | `;
              i = coordenadas[vertice].length;
            }
          }
        }

        // Valida que el nombre del vertice a ingresar no tenga el mismo nombre que alguno ya almacenado.
        if ([nameV] in grafo) {
          existe = true;
          queExiste += `Ya existe un vertice con el nombre ${nameV} | `;
        }

        if (!existe) {
          coordenadas[nameV] = [x, y];
          grafo[nameV] = {};
          $(".form select option").each(function () {
            $(this).remove();
          });
          drawVertex(x, y, 7, nameV);
          fillSelects();
          clearFormData();
          $("#positionX").focus();
        } else {
          alert(queExiste);
        }
      } else {
        coordenadas[nameV] = [x, y];
        grafo[nameV] = {};
        $(".form select option").each(function () {
          $(this).remove();
        });
        drawVertex(x, y, 7, nameV);
        fillSelects();
        clearFormData();
        $("#positionX").focus();
      }
    } else {
      alert("Por favor introduce los datos.");
    }
  });

  $("#btnCrearE").click(function (e) {
    e.preventDefault();
    let initialV = $("#initialV").val();
    let finalV = $("#finalV").val();

    if (initialV != "" && finalV != "" && initialV != null && finalV != null) {
      if (initialV != finalV) {
        let x1 = coordenadas[initialV][0];
        let y1 = coordenadas[initialV][1];
        let x2 = coordenadas[finalV][0];
        let y2 = coordenadas[finalV][1];
        let peso = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        peso = Math.round(peso);

        if (aristas.length > 0) {
          let existe = false;
          let queExiste = `Ya existe una arista desde el vértice ${initialV} hasta el vértice ${finalV}.`;

          for (let i = 0; i < aristas.length; i++) {
            if (
              (aristas[i][0] == initialV && aristas[i][1] == finalV) ||
              (aristas[i][0] == finalV && aristas[i][1] == initialV)
            ) {
              existe = true;
              i = aristas.length;
            }
          }

          if (!existe) {
            grafo[initialV][finalV] = peso;
            grafo[finalV][initialV] = peso;
            aristas.push([initialV, finalV]);
            aristas.push([finalV, initialV]);
            drawEdge(x1, y1, x2, y2, peso);
            clearFormData();
          } else {
            alert(queExiste);
          }
        } else {
          grafo[initialV][finalV] = peso;
          grafo[finalV][initialV] = peso;
          aristas.push([initialV, finalV]);
          aristas.push([finalV, initialV]);
          drawEdge(x1, y1, x2, y2, peso);
          clearFormData();
        }
      } else {
        alert(
          `No se puede conectar ${initialV} con ${finalV}, ya que son los mismos vértices. El sistema no lo acepta.`
        );
      }
    } else {
      alert("Por favor introduce los datos.");
    }
  });

  $("#btnCalcRoute").click(function (e) {
    e.preventDefault();
    let initialV = $("#initialVC").val();
    let finalV = $("#finalVC").val();

    if (initialV != "" && finalV != "" && initialV != null && finalV != null) {
      if (initialV != finalV) {
        let dks = dijkstra(grafo, initialV, finalV);
        let distance = dks["distancia"];
        let route = dks["ruta"];

        for (let i = 0; i < route.length; i++) {
          if (i < route.length - 1) {
            drawEdge(
              coordenadas[route[i]][0],
              coordenadas[route[i]][1],
              coordenadas[route[i + 1]][0],
              coordenadas[route[i + 1]][1],
              null,
              600,
              true
            );
            $("#distance").html(
              `<strong>Peso total:</strong> ${distance}<br><strong>Ruta:</strong> (${route})`
            );
            $("#distance").slideDown(300);
          }
        }
      } else {
        alert("¡Ya estás en tu destino!");
      }
    } else {
      alert("Por favor introduce los datos.");
    }
  });
});

function sizeCanvas(size = 600) {
  canvas.width = size;
  canvas.height = size;
}

function drawGrid(size = 600) {
  ctx.strokeStyle = "#F5F5F5";

  for (var x = 0; x <= size; x += 6) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
  }

  for (var y = 0; y <= size; y += 6) {
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
  }

  ctx.stroke();
}

function emptyCanvas(size = 600) {
  canvas.width = size;
  drawGrid();
}

function drawVertex(x, y, r = 7, nameOfVertex, size = 600) {
  let escala = Math.round(size / 100);
  let xPixel = x * escala;
  let yPixel = y * escala;

  if (ctx) {
    ctx.textAlign = "center";
    ctx.font = "10pt Verdana";
    ctx.fillStyle = "#000000";
    ctx.fillText(nameOfVertex, xPixel, size - yPixel + 23);

    ctx.fillStyle = "#7030A0";
    ctx.beginPath();
    ctx.arc(xPixel, size - yPixel, r, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawEdge(
  x1,
  y1,
  x2,
  y2,
  weight = null,
  size = 600,
  optimalRoute = false
) {
  let escala = Math.round(size / 100);
  let x1Pixel = x1 * escala;
  let y1Pixel = y1 * escala;
  let x2Pixel = x2 * escala;
  let y2Pixel = y2 * escala;
  let xMedioPixel = Math.round(((x1 + x2) / 2) * escala);
  let yMedioPixel = Math.round(((y1 + y2) / 2) * escala);

  if (ctx) {
    if (optimalRoute) {
      ctx.beginPath();
      ctx.strokeStyle = "#C00303";
    } else {
      ctx.textAlign = "center";
      ctx.font = "10pt Verdana";
      ctx.fillStyle = "#000000";
      ctx.fillText(weight, xMedioPixel + 15, size - yMedioPixel);
      ctx.strokeStyle = "#7030A0";
    }

    ctx.lineWidth = 3;
    ctx.moveTo(x1Pixel, size - y1Pixel);
    ctx.lineTo(x2Pixel, size - y2Pixel);
    ctx.stroke();
  }
}

function clearInformation() {
  emptyCanvas();
  $(".form input:not(input[type='submit'])").val("");
  $(".form select").val("");
  $("#distance").html("");
  $("#distance").slideUp(300);
}

function clearFormData() {
  $(".form input:not(input[type='submit'])").val("");
  $(".form select").val("");
}

function clearForms() {
  $(".form").slideUp(300);
}

function fillSelects() {
  let initialV = document.getElementById("initialV");
  let finalV = document.getElementById("finalV");
  let initialVC = document.getElementById("initialVC");
  let finalVC = document.getElementById("finalVC");

  let optionDefault1 = document.createElement("option");
  optionDefault1.text = "...";
  optionDefault1.value = "";
  initialV.add(optionDefault1);

  let optionDefault2 = document.createElement("option");
  optionDefault2.text = "...";
  optionDefault2.value = "";
  finalV.add(optionDefault2);

  let optionDefault3 = document.createElement("option");
  optionDefault3.text = "...";
  optionDefault3.value = "";
  initialVC.add(optionDefault3);

  let optionDefault4 = document.createElement("option");
  optionDefault4.text = "...";
  optionDefault4.value = "";
  finalVC.add(optionDefault4);

  let nodos = Object.keys(grafo);

  for (let i = 0; i < nodos.length; i++) {
    let optionInitial = document.createElement("option");
    optionInitial.text = nodos[i];
    optionInitial.value = nodos[i];
    initialV.add(optionInitial);

    let optionInitialC = document.createElement("option");
    optionInitialC.text = nodos[i];
    optionInitialC.value = nodos[i];
    initialVC.add(optionInitialC);

    let optionFinal = document.createElement("option");
    optionFinal.text = nodos[i];
    optionFinal.value = nodos[i];
    finalV.add(optionFinal);

    let optionFinalC = document.createElement("option");
    optionFinalC.text = nodos[i];
    optionFinalC.value = nodos[i];
    finalVC.add(optionFinalC);
  }
}