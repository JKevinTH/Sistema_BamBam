<?php
require "conexion.php";
requerir_sesion();
echo json_encode(["usuario" => $_SESSION["usuario"]]);
