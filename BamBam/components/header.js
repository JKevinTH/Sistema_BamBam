class Miheader extends HTMLElement {
    connectedCallback() {
        this.innerHTML =`
        <nav class="sidebar">
            
            <h2>Pizzeria BAMBAM</h2>
            <a href="index.html" class="activo">Inicio</a>
            <a href="ventas.html" class="ventas-a">Ventas</a>
            <a href="corte_de_caja.html" class="corte-a">Corte de caja</a>
            <a href="inventario.html" class="inventario-a">Inventario</a>
            <a href="personal.html" class="personal-a">Personal</a>

            <hr>

            <div class="menu_inferior">
                <a href="login.html" class="cerrar-sesion">
                Cerrar sesión
                </a>
            </div>
            
        </nav>
        `;
    }
}
customElements.define('mi-header', Miheader);