<?php
require "conexion.php";
requerir_sesion();

$d = json_decode(file_get_contents("php://input"), true) ?? [];
$horai = $d["horai"] ?? "";
$total = (float)($d["total"] ?? 0);

if (!preg_match('/^\d{2}:\d{2}:\d{2}$/', $horai)) {
    echo json_encode(["error" => "Hora de inicio inválida"]);
    exit;
}
if (empty($_SESSION["claveE"])) {
    echo json_encode(["error" => "Tu usuario no tiene un empleado asignado"]);
    exit;
}

$stmt = $conn->prepare(
  "INSERT INTO cortecaja (fecha, horai, horac, total, claveE)
   VALUES (CURDATE(), ?, CURTIME(), ?, ?)"
);
$clave = $_SESSION["claveE"];
$stmt->bind_param("sds", $horai, $total, $clave);
$stmt->execute();
echo json_encode(["ok" => true, "id" => $conn->insert_id]);
