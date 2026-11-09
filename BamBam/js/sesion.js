// Verifica la sesión y muestra el usuario real en "Usuario: ..."
fetch("api/sesion.php")
  .then(r => {
    if (r.status === 401) { location.href = "login.html"; return null; }
    return r.json();
  })
  .then(d => {
    if (!d || !d.usuario) return;
    document.querySelectorAll(".inicio_usuario p").forEach(p => {
      p.textContent = "Usuario: " + d.usuario;
    });
  })
  .catch(() => {});
