const tbody = document.getElementById("tablaInventario");
const CAMPOS = [
  ["codigo", "number"], ["nombre", "text"], ["categoria", "text"],
  ["cantidad", "number"], ["unidad", "text"], ["estado", "text"]
];

function fila(d = {}, nuevo = false) {
  const tr = document.createElement("tr");
  tr.dataset.nuevo = nuevo ? "1" : "0";

  CAMPOS.forEach(([k, tipo]) => {
    const td = document.createElement("td");
    const i = document.createElement("input");
    i.type = tipo;
    i.name = k;
    i.value = d[k] ?? "";
    if (tipo === "number") i.step = "any";
    if (k === "codigo" && !nuevo) i.readOnly = true;
    td.appendChild(i);
    tr.appendChild(td);
  });

  const f = document.createElement("td");
  f.textContent = d.fechaAct ?? "";
  tr.appendChild(f);

  const x = document.createElement("td");
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = "Eliminar";
  b.onclick = () => eliminar(tr, d.codigo, nuevo);
  x.appendChild(b);
  tr.appendChild(x);

  tbody.appendChild(tr);
}

async function cargar() {
  const filas = await (await fetch("api/inventario_listar.php")).json();
  tbody.innerHTML = "";
  filas.forEach(d => fila(d));
}

async function eliminar(tr, codigo, nuevo) {
  if (nuevo) { tr.remove(); return; }
  if (!confirm("¿Eliminar este insumo? También se borra su detalle de ventas ligado.")) return;
  const datos = new FormData();
  datos.append("codigo", codigo);
  await fetch("api/inventario_eliminar.php", { method: "POST", body: datos });
  cargar();
}

async function guardarTodo() {
  for (const tr of tbody.querySelectorAll("tr")) {
    const d = {};
    tr.querySelectorAll("input").forEach(i => d[i.name] = i.value);
    const res = await fetch("api/inventario_guardar.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d)
    });
    const r = await res.json();
    if (r.error) { alert(r.error); return; }
  }
  alert("Inventario guardado");
  cargar();
}

document.getElementById("btnAceptar").addEventListener("click", guardarTodo);
document.getElementById("btnNuevo").addEventListener("click", () => fila({}, true));
document.getElementById("btnCancelar").addEventListener("click", cargar);
cargar();
