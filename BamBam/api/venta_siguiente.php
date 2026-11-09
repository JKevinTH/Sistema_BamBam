<?php
require "conexion.php";
requerir_sesion();
$r = $conn->query("SELECT COALESCE(MAX(NumeroV), 0) + 1 AS numero FROM puntoventa");
echo json_encode($r->fetch_assoc());
