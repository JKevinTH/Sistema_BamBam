<?php
// Cambia la contraseña si le pusiste una a root.
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
header("Content-Type: application/json; charset=utf-8");

set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
});

$conn = new mysqli("127.0.0.1", "root", "", "proyectop", 3306);
$conn->set_charset("utf8mb4");
$dirSesiones = __DIR__ . "/sesiones";
if (!is_dir($dirSesiones)) {
    mkdir($dirSesiones, 0777, true);
}
session_save_path($dirSesiones);

session_set_cookie_params([
    "lifetime" => 0,
    "path"     => "/",
    "secure"   => false,
    "httponly" => true,
    "samesite" => "Lax",
]);
session_start();

function requerir_sesion() {
    if (empty($_SESSION["usuario"])) {
        http_response_code(401);
        echo json_encode(["error" => "No has iniciado sesión"]);
        exit;
    }
}
