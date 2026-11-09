<?php
require "conexion.php";
requerir_sesion();
$stmt = $conn->prepare("DELETE FROM inventario WHERE codigo = ?");
$stmt->bind_param("i", $_POST["codigo"]);
$stmt->execute();
echo json_encode(["ok" => true]);
