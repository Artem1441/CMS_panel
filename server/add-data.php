<?php
include('db.php');
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$req = file_get_contents("php://input");
$req = json_decode($req, true);

// AddData
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $req["id"];
    $inputs = json_decode($req["inputs"], true);
    $data = json_decode($req["data"]);

    $obj = (object)[];

    foreach ($inputs as &$input) {
        $value;
        if ($input["type"] == "text") $value = "";
        if ($input["type"] == "number") $value = "";
        if ($input["type"] == "img") $value = ["src" => "", "alt" => ""];
        $obj->{$input["titleEn"]} = $value;
    }

    array_unshift($data, $obj);
    Update("sections", $id, ["data" => json_encode($data, JSON_UNESCAPED_UNICODE)]);

    echo json_encode(["status" => true, "message" => null, "result" => null], JSON_UNESCAPED_UNICODE);
}