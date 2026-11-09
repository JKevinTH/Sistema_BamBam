const $ = id => document.getElementById(id);
const dinero = n => "$" + Number(n).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
let carrito = [];

async function cargarNumero() {
  const d = await (await fetch("api/venta_siguiente.php")).json();
  $("numVenta").textContent = "No. de venta: " + String(d.numero).padStart(2, "0");
}

const totalLinea = l => l.cantidad * l.precio * (1 - l.descuento / 100);

function celda(contenido) {
  const td = document.createElement("td");
  if (contenido instanceof Node) td.appendChild(contenido);
  else td.textContent = contenido;
  return td;
}

/* ---------- Venta en curso (tabla de arriba) ---------- */
function pintar() {
  const tbody = $("tablaVentas");
  tbody.innerHTML = "";

  if (carrito.length === 0) {
    const tr = document.createElement("tr");
    const td = celda("No hay productos agregados");
    td.colSpan = 6;
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

  carrito.forEach((l, i) => {
    const tr = document.createElement("tr");
    [l.producto, l.cantidad, l.descuento + "%", dinero(l.precio), dinero(totalLinea(l))]
      .forEach(v => tr.appendChild(celda(v)));

    const b = document.createElement("button");
    b.type = "button";
    b.textContent = "Quitar";
    b.onclick = () => { carrito.splice(i, 1); pintar(); };
    tr.appendChild(celda(b));
    tbody.appendChild(tr);
  });

  $("totalVenta").textContent = dinero(carrito.reduce((s, l) => s + totalLinea(l), 0));
}

/* ---------- Ventas guardadas en la base (tabla de abajo) ---------- */
async function cargarHistorial() {
  const tbody = $("tablaHistorial");
  const filas = await (await fetch("api/ventas_listar.php")).json();
  tbody.innerHTML = "";

  if (!Array.isArray(filas) || filas.length === 0) {
    const tr = document.createElement("tr");
    const td = celda("Aún no hay ventas registradas");
    td.colSpan = 8;
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  let anterior = null;
  filas.forEach(f => {
    const tr = document.createElement("tr");
    if (anterior !== null && f.NumeroV !== anterior) tr.className = "nueva-venta";
    anterior = f.NumeroV;

    const chipVenta = document.createElement("span");
    chipVenta.className = "chip-venta";
    chipVenta.textContent = "#" + f.NumeroV;

    const pago = String(f.pago ?? "").toLowerCase();
    const chipPago = document.createElement("span");
    chipPago.className = "chip-pago pago-" + pago;
    chipPago.textContent = pago ? pago.charAt(0).toUpperCase() + pago.slice(1) : "—";

    tr.appendChild(celda(chipVenta));
    tr.appendChild(celda(f.Fecha ?? "—"));
    tr.appendChild(celda(f.Producto));
    tr.appendChild(celda(f.Cantidad));
    tr.appendChild(celda(dinero(f.PU)));
    tr.appendChild(celda(Number(f.descuento) + "%"));
    tr.appendChild(celda(dinero(f.Total)));
    tr.appendChild(celda(chipPago));
    tbody.appendChild(tr);
  });
}

function agregar() {
  const producto  = $("producto").value.trim();
  const cantidad  = parseInt($("cantidad").value, 10);
  const precio    = parseFloat($("precio").value);
  const descuento = parseFloat($("descuento").value) || 0;

  if (!producto || !(cantidad > 0) || !(precio > 0)) {
    alert("Completa producto, cantidad y precio");
    return;
  }
  if (descuento < 0 || descuento > 100) {
    alert("El descuento debe estar entre 0 y 100");
    return;
  }
  carrito.push({ producto, cantidad, precio, descuento });
  ["producto", "cantidad", "descuento", "precio"].forEach(id => $(id).value = "");
  pintar();
}

async function finalizar(e) {
  e.preventDefault();
  if (carrito.length === 0) { alert("Agrega al menos un producto"); return; }

  const res = await fetch("api/ventas_finalizar.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo_pago: $("pago").value, lineas: carrito })
  });
  const r = await res.json();
  if (r.error) { alert(r.error); return; }

  alert("Venta " + r.numero + " guardada. Total: " + dinero(r.total));
  carrito = [];
  pintar();
  cargarNumero();
  cargarHistorial();
}

function cancelar(e) {
  e.preventDefault();
  if (carrito.length && !confirm("¿Cancelar la venta en curso?")) return;
  carrito = [];
  pintar();
}

$("btnAgregar").addEventListener("click", agregar);
$("btnFinalizar").addEventListener("click", finalizar);
$("btnCancelar").addEventListener("click", cancelar);
pintar();
cargarNumero();
cargarHistorial();