<?php
session_start();
$_SESSION["n"] = ($_SESSION["n"] ?? 0) + 1;
header("Content-Type: text/plain");
echo "session_id: " . session_id() . "\n";
echo "visitas: " . $_SESSION["n"] . "\n";
echo "save_path: " . session_save_path() . "\n";