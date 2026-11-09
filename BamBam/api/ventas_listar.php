<?php
require "conexion.php";
requerir_sesion();

$r = $conn->query(
  "SELECT v.NumeroV, p.Fecha, v.Producto, v.Cantidad, v.PU,
          v.descuento, v.Total, v.pago
   FROM ventas v
   LEFT JOIN puntoventa p ON p.NumeroV = v.NumeroV
   ORDER BY v.NumeroV DESC, v.IDventa ASC
   LIMIT 200"
);
echo json_encode($r->fetch_all(MYSQLI_ASSOC));