<?php
require "conexion.php";
requerir_sesion();
$r = $conn->query(
  "SELECT e.ClaveE, e.Nombre, e.Apellido, e.Rol, e.Horario, a.entrada, a.salida
   FROM empleados e
   LEFT JOIN asistencia a ON a.ClaveE = e.ClaveE AND a.fecha = CURDATE()
   ORDER BY e.Nombre"
);
echo json_encode($r->fetch_all(MYSQLI_ASSOC));
