<?php
require "conexion.php";
requerir_sesion();
$r = $conn->query(
  "SELECT codigo, nombre, categoria, cantidad, unidad, estado, fechaAct
   FROM inventario ORDER BY nombre"
);
echo json_encode($r->fetch_all(MYSQLI_ASSOC));
