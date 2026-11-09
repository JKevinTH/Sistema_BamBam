<?php
require "conexion.php";
requerir_sesion();
 
$d = json_decode(file_get_contents("php://input"), true) ?? [];
$lineas = $d["lineas"] ?? [];
$tipo = strtolower($d["tipo_pago"] ?? "efectivo");
if (!in_array($tipo, ["efectivo", "tarjeta", "transferencia"], true)) $tipo = "efectivo";
 
if (empty($_SESSION["claveE"])) {
    echo json_encode(["error" => "Tu usuario no tiene un empleado asignado"]);
    exit;
}
if (!$lineas) {
    echo json_encode(["error" => "Agrega al menos un producto"]);
    exit;
}
 
$subtotal = 0; $descuento = 0; $filas = [];
foreach ($lineas as $l) {
    $prod = trim($l["producto"] ?? "");
    $cant = (int)($l["cantidad"] ?? 0);
    $pu   = (float)($l["precio"] ?? 0);
    $pct  = min(100, max(0, (float)($l["descuento"] ?? 0)));
    if ($prod === "" || $cant <= 0 || $pu <= 0) {
        echo json_encode(["error" => "Hay una línea con datos inválidos"]);
        exit;
    }
    $bruto = $cant * $pu;
    $desc  = $bruto * $pct / 100;
    $subtotal  += $bruto;
    $descuento += $desc;
    // [producto, cantidad, precio, descuento en %, total de la línea]
    $filas[] = [$prod, $cant, $pu, $pct, $bruto - $desc];
}
$total = $subtotal - $descuento;
 
$conn->begin_transaction();
 
$stmt = $conn->prepare(
  "INSERT INTO puntoventa (Fecha, Descuento, Subtotal, Total, TipoPago, ClaveE)
   VALUES (CURDATE(), ?, ?, ?, ?, ?)"
);
$clave = $_SESSION["claveE"];
$stmt->bind_param("dddss", $descuento, $subtotal, $total, $tipo, $clave);
$stmt->execute();
$numero = $conn->insert_id;
 
$stmt = $conn->prepare(
  "INSERT INTO ventas (NumeroV, Producto, Cantidad, PU, descuento, pago, Total)
   VALUES (?, ?, ?, ?, ?, ?, ?)"
);
foreach ($filas as [$p, $c, $pu, $pct, $t]) {
    $stmt->bind_param("isiddsd", $numero, $p, $c, $pu, $pct, $tipo, $t);
    $stmt->execute();
}
 
$conn->commit();
echo json_encode(["ok" => true, "numero" => $numero, "total" => $total]);
 