const tbody = document.getElementById("tablaPersonal");
const hora = h => h ? h.slice(0, 5) : "—";

function celda(texto) {
  const td = document.createElement("td");
  td.textContent = texto;
  return td;
}

async function cargar() {
  const filas = await (await fetch("api/personal_listar.php")).json();
  tbody.innerHTML = "";
  let presentes = 0, sinRegistrar = 0;

  filas.forEach(f => {
    const tr = document.createElement("tr");

    const tdNombre = document.createElement("td");
    const b = document.createElement("b");
    b.textContent = f.Nombre + " " + f.Apellido;
    tdNombre.appendChild(b);
    tr.appendChild(tdNombre);

    tr.appendChild(celda(f.Rol));
    tr.appendChild(celda(f.Horario));
    tr.appendChild(celda(hora(f.entrada)));
    tr.appendChild(celda(hora(f.salida)));

    const tdEstado = document.createElement("td");
    const sp = document.createElement("span");
    let tipo = null, etiqueta = "";
    if (!f.entrada)      { sp.className = "estado sin-registrar"; sp.textContent = "Sin registrar"; tipo = "entrada"; etiqueta = "Registrar entrada"; sinRegistrar++; }
    else if (!f.salida)  { sp.className = "estado presente";      sp.textContent = "Presente";      tipo = "salida";  etiqueta = "Registrar salida";  presentes++; }
    else                 { sp.className = "estado";               sp.textContent = "Salió"; }
    tdEstado.appendChild(sp);
    tr.appendChild(tdEstado);

    const tdAccion = document.createElement("td");
    if (tipo) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-tabla" + (tipo === "entrada" ? " principal" : "");
      btn.textContent = etiqueta;
      btn.onclick = () => registrar(f.ClaveE, tipo);
      tdAccion.appendChild(btn);
    }
    tr.appendChild(tdAccion);
    tbody.appendChild(tr);
  });

  const t = document.querySelectorAll(".tarjetas .tarjeta p");
  if (t[0]) t[0].textContent = presentes;
  if (t[1]) t[1].textContent = sinRegistrar;
}

async function registrar(clave, tipo) {
  const datos = new FormData();
  datos.append("clave", clave);
  datos.append("tipo", tipo);
  const r = await (await fetch("api/personal_registrar.php", { method: "POST", body: datos })).json();
  if (r.error) alert(r.error);
  cargar();
}

cargar();
