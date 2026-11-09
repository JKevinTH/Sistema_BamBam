<?php
require "conexion.php";
requerir_sesion();

$d = json_decode(file_get_contents("php://input"), true) ?? [];
$codigo    = (int)($d["codigo"] ?? 0);
$nombre    = trim($d["nombre"] ?? "");
$categoria = trim($d["categoria"] ?? "");
$cantidad  = (float)($d["cantidad"] ?? 0);
$unidad    = trim($d["unidad"] ?? "");
$estado    = trim($d["estado"] ?? "");

if ($codigo <= 0 || $nombre === "" || $categoria === "" || $unidad === "" || $estado === "") {
    echo json_encode(["error" => "Completa todos los campos (código $codigo)"]);
    exit;
}

// Inserta si el código es nuevo, actualiza si ya existe
$stmt = $conn->prepare(
  "INSERT INTO inventario (codigo, nombre, categoria, cantidad, unidad, estado, fechaAct)
   VALUES (?, ?, ?, ?, ?, ?, CURDATE()) AS nuevo
   ON DUPLICATE KEY UPDATE nombre = nuevo.nombre, categoria = nuevo.categoria,
     cantidad = nuevo.cantidad, unidad = nuevo.unidad, estado = nuevo.estado,
     fechaAct = CURDATE()"
);
$stmt->bind_param("issdss", $codigo, $nombre, $categoria, $cantidad, $unidad, $estado);
$stmt->execute();
echo json_encode(["ok" => true]);
