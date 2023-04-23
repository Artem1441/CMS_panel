<?php
include('db.php');
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$req = file_get_contents("php://input");
$req = json_decode($req, true);

// UpdateData
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $req["id"];
    $data = $req["data"];
    Update("sections", $id, ["data" => $data]);

    echo json_encode(["status" => true, "message" => null, "result" => null], JSON_UNESCAPED_UNICODE);
}