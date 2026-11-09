<?php
require "conexion.php";
requerir_sesion();

$clave = $_POST["clave"] ?? "";
$tipo  = $_POST["tipo"] ?? "";

if ($tipo === "entrada") {
    $stmt = $conn->prepare(
      "INSERT INTO asistencia (ClaveE, fecha, entrada)
       SELECT ?, CURDATE(), CURTIME() FROM DUAL
       WHERE NOT EXISTS (SELECT 1 FROM asistencia WHERE ClaveE = ? AND fecha = CURDATE())"
    );
    $stmt->bind_param("ss", $clave, $clave);
} elseif ($tipo === "salida") {
    $stmt = $conn->prepare(
      "UPDATE asistencia SET salida = CURTIME()
       WHERE ClaveE = ? AND fecha = CURDATE() AND entrada IS NOT NULL AND salida IS NULL"
    );
    $stmt->bind_param("s", $clave);
} else {
    echo json_encode(["error" => "Tipo inválido"]);
    exit;
}
$stmt->execute();
echo json_encode(["ok" => $stmt->affected_rows > 0]);
