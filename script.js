let lista = JSON.parse(localStorage.getItem("listaJheny")) || [];
let proveedores = JSON.parse(localStorage.getItem("proveedoresJheny")) || [];

function actualizarOpcionesProveedor() {
  const proveedorInput = document.getElementById("proveedorInput");
  const proveedorSelector = document.getElementById("proveedorSelector");

  proveedorInput.innerHTML = "";
  proveedorSelector.innerHTML = "";

  if (proveedores.length === 0) {
    const option = document.createElement("option");
    option.textContent = "Sin proveedores →";
    option.disabled = true;
    option.selected = true;
    proveedorInput.appendChild(option);
    return;
  }

  proveedores.forEach(nombre => {
    const option = document.createElement("option");
    option.value = nombre;
    option.textContent = nombre;
    proveedorInput.appendChild(option);
  });

  const todosOption = document.createElement("option");
  todosOption.value = "Todos";
  todosOption.textContent = "Todos";
  proveedorSelector.appendChild(todosOption);

  proveedores.forEach(nombre => {
    const option = document.createElement("option");
    option.value = nombre;
    option.textContent = nombre;
    proveedorSelector.appendChild(option);
  });
}

function mostrarGestionProveedores() {
  const panel = document.getElementById("gestionProveedores");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
  renderizarListaProveedores();
}

function agregarProveedor() {
  const input = document.getElementById("nuevoProveedorInput");
  const nombre = input.value.trim();

  if (nombre && !proveedores.includes(nombre)) {
    proveedores.push(nombre);
    localStorage.setItem("proveedoresJheny", JSON.stringify(proveedores));
    input.value = "";
    actualizarOpcionesProveedor();
    renderizarListaProveedores();
  }
}

function eliminarProveedor(nombre) {
  proveedores = proveedores.filter(p => p !== nombre);
  lista = lista.filter(item => item.proveedor !== nombre);
  localStorage.setItem("proveedoresJheny", JSON.stringify(proveedores));
  guardarLista();
  actualizarOpcionesProveedor();
  renderizarListaProveedores();
  filtrarPorProveedor("Todos");
}

function renderizarListaProveedores() {
  const ul = document.getElementById("listaProveedores");
  ul.innerHTML = "";
  proveedores.forEach(nombre => {
    const li = document.createElement("li");
    li.textContent = nombre + " ";

    const btn = document.createElement("button");
    btn.textContent = "Eliminar";
    btn.classList.add("eliminar");
    btn.onclick = () => eliminarProveedor(nombre);

    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function guardarLista() {
  localStorage.setItem("listaJheny", JSON.stringify(lista));
}

function agregarProducto() {
  const nombreInput = document.getElementById("productoInput");
  const cantidadInput = document.getElementById("cantidadInput");
  const proveedor = document.getElementById("proveedorInput").value;
  const mensajeError = document.getElementById("mensajeError");

  const nombre = nombreInput.value.trim();
  const cantidad = cantidadInput.value.trim();

  let error = false;

  if (nombre === "") {
    nombreInput.classList.add("input-error");
    error = true;
  } else {
    nombreInput.classList.remove("input-error");
  }

  if (cantidad === "") {
    cantidadInput.classList.add("input-error");
    error = true;
  } else {
    cantidadInput.classList.remove("input-error");
  }

  if (error) {
    mensajeError.style.display = "block";
    mensajeError.textContent = "Hola mama, parece que te has dejado algo sin completar...";
    return;
  }

  mensajeError.style.display = "none";
  lista.push({ nombre, cantidad, proveedor });

  nombreInput.value = "";
  cantidadInput.value = "";

  guardarLista();
  filtrarPorProveedor(document.getElementById("proveedorSelector").value);

  mensajeError.textContent = "El producto se ha añadido a la lista ✅";
  mensajeError.style.display = "block";
  setTimeout(() => mensajeError.style.display = "none", 2000);
}

function eliminarProducto(index) {
  lista.splice(index, 1);
  guardarLista();
  filtrarPorProveedor(document.getElementById("proveedorSelector").value);
}

function imprimirLista() {
  const proveedorSeleccionado = document.getElementById("proveedorSelector")?.value;
  const itemsAImprimir = (proveedorSeleccionado && proveedorSeleccionado !== "Todos")
    ? lista.filter(item => item.proveedor === proveedorSeleccionado)
    : lista;

  const contenido = document.getElementById("listaOrganizada").innerHTML;
  const ventanaImpresion = window.open('', '', 'height=600,width=800');
  ventanaImpresion.document.write('<html><head><title>Lista de Compras</title><style>body{font-family: Poppins, sans-serif;}table{width: 100%;border-collapse: collapse;}th, td{padding: 8px;text-align: left;}th{background-color: #f2f2f2;}</style></head><body>');
  ventanaImpresion.document.write('<img src="logo.png" alt="Logotipo" style="max-width: 150px; height: auto; margin-bottom: 20px;">');
  ventanaImpresion.document.write('<h1>Lista de Compras</h1>');
  ventanaImpresion.document.write('<table border="1"><thead><tr><th>Proveedor</th><th>Producto</th><th>Cantidad</th></tr></thead><tbody>');

  itemsAImprimir.forEach(item => {
    ventanaImpresion.document.write(`<tr><td>${item.proveedor}</td><td style="padding-right: 40px;">${item.nombre}</td><td>${item.cantidad}</td></tr>`);
  });

  ventanaImpresion.document.write('</tbody></table>');
  ventanaImpresion.document.write('</body></html>');
  ventanaImpresion.document.close();
  ventanaImpresion.print();
}

function filtrarPorProveedor(proveedor) {
  if (proveedor === "Todos") {
    mostrarLista();
    return;
  }

  const contenedor = document.getElementById("listaOrganizada");
  contenedor.innerHTML = "";

  const filtrados = lista
    .filter(item => item.proveedor === proveedor)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  const resultado = document.createElement("div");

  if (filtrados.length === 0) {
    resultado.innerHTML = `<p>No hay productos del proveedor <strong>${proveedor}</strong>.</p>`;
    contenedor.appendChild(resultado);
    return;
  }

  const tituloProveedor = document.createElement("h3");
  tituloProveedor.innerHTML = `<strong>${proveedor}</strong>`;
  resultado.appendChild(tituloProveedor);

  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th style="text-align:left;">Proveedor</th>
      <th style="text-align:left;">Producto</th>
      <th style="text-align:left;">Cantidad</th>
      <th></th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  filtrados.forEach(item => {
    const index = lista.indexOf(item);
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.proveedor}</td>
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
    `;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("eliminar");
    btnEliminar.onclick = () => eliminarProducto(index);

    const tdBoton = document.createElement("td");
    tdBoton.appendChild(btnEliminar);
    tr.appendChild(tdBoton);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  resultado.appendChild(table);
  contenedor.appendChild(resultado);
}

function mostrarLista() {
  const contenedor = document.getElementById("listaOrganizada");
  contenedor.innerHTML = "";

  const agrupado = {};
  lista.forEach(item => {
    if (!agrupado[item.proveedor]) {
      agrupado[item.proveedor] = [];
    }
    agrupado[item.proveedor].push(item);
  });

  for (const [proveedor, productos] of Object.entries(agrupado)) {
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    const tituloProveedor = document.createElement("h3");
    tituloProveedor.innerHTML = `<strong>${proveedor}</strong>`;
    contenedor.appendChild(tituloProveedor);

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th style="text-align:left;">Proveedor</th>
        <th style="text-align:left;">Producto</th>
        <th style="text-align:left;">Cantidad</th>
        <th></th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    productos.forEach((item, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.proveedor}</td>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
      `;

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.classList.add("eliminar");
      btnEliminar.onclick = () => eliminarProducto(index);

      const tdBoton = document.createElement("td");
      tdBoton.appendChild(btnEliminar);
      tr.appendChild(tdBoton);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    contenedor.appendChild(table);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarOpcionesProveedor();
  filtrarPorProveedor("Todos");
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
      .catch(err => console.error('❌ Error al registrar el Service Worker:', err));
  });
}