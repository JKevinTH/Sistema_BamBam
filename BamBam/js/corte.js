const filas = [...document.querySelectorAll(".tabla_corte tbody tr")];
const pie = document.querySelectorAll(".tabla_corte thead")[1].querySelectorAll("th");
const fmt = n => "$" + n.toLocaleString("es-MX");
const horaInicio = new Date().toTimeString().slice(0, 8);

function calcular() {
  let ci = 0, di = 0, cf = 0, df = 0;

  filas.forEach(tr => {
    const c = tr.querySelectorAll("td");
    const valor = parseFloat(c[0].textContent.replace(/[^0-9.]/g, "")) || 0;
    const a = parseInt(c[1].querySelector("input").value, 10) || 0;
    const b = parseInt(c[3].querySelector("input").value, 10) || 0;
    c[2].textContent = fmt(a * valor);
    c[4].textContent = fmt(b * valor);
    ci += a; di += a * valor;
    cf += b; df += b * valor;
  });

  pie[1].textContent = ci;
  pie[2].textContent = fmt(di);
  pie[3].textContent = cf;
  pie[4].textContent = fmt(df);

  const t = document.querySelectorAll(".tarjetas .tarjeta p");
  t[0].textContent = fmt(di);
  t[1].textContent = fmt(df);
  document.querySelector(".tarjeta_diferencia p").textContent = fmt(df - di);

  return { inicio: di, final: df };
}

async function guardar() {
  const { final } = calcular();
  const res = await fetch("api/corte_guardar.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ horai: horaInicio, total: final })
  });
  const r = await res.json();
  if (r.error) { alert(r.error); return; }
  alert("Corte de caja guardado");
}

filas.forEach(tr => tr.querySelectorAll("input").forEach(i => i.addEventListener("input", calcular)));
document.getElementById("btnGuardar").addEventListener("click", guardar);
calcular();
