<?php
require "conexion.php";

$usuario = $_POST["usuario"] ?? "";
$clave   = $_POST["contrasena"] ?? "";

$stmt = $conn->prepare("SELECT IDusuario, Nombre, Contrasena FROM usuario WHERE Nombre = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$u = $stmt->get_result()->fetch_assoc();

// Contraseñas en texto plano (como están hoy en la tabla).
if ($u && hash_equals($u["Contrasena"], $clave)) {
    session_regenerate_id(true);
    $_SESSION["usuario"]   = $u["Nombre"];
    $_SESSION["idusuario"] = $u["IDusuario"];

    // Empleado al que se le registran ventas y cortes
    $s = $conn->prepare("SELECT ClaveE FROM empleados WHERE IDusuario = ? ORDER BY ClaveE LIMIT 1");
    $s->bind_param("i", $u["IDusuario"]);
    $s->execute();
    $e = $s->get_result()->fetch_assoc();
    $_SESSION["claveE"] = $e["ClaveE"] ?? null;

    header("Location: ../index.html");
    exit;
}
header("Location: ../login.html?error=1");
