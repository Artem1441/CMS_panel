<?php
include('db.php');
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$req = file_get_contents("php://input");
$req = json_decode($req, true);

// UpdateSection
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $req["id"];
    $section_name = $req["section_name"];
    $section_name_en = $req["section_name_en"];
    $type = $req["type"];
    $inputs = json_decode($req["inputs"], true);

    $data;
    if ($type == "array") {
        $data = array((object) []);
        foreach ($inputs as &$input) {
            $value;
            if ($input["type"] == "text") $value = "";
            if ($input["type"] == "number") $value = "";
            if ($input["type"] == "img") $value = ["src" => "", "alt" => ""];
            $data[0]->{$input["titleEn"]} = $value;
        }
    } else { // object only
        $data = (object) [];
        foreach ($inputs as &$input) {
            $value;
            if ($input["type"] == "text") $value = "";
            if ($input["type"] == "number") $value = "";
            if ($input["type"] == "img") $value = ["src" => "", "alt" => ""];
            $data->{$input["titleEn"]} = $value;
        }
    }

    Update("sections", $id, ["section_name" => $section_name, "section_name_en" => $section_name_en,  "type" => $type,  "inputs" => json_encode($inputs, JSON_UNESCAPED_UNICODE), "data" => json_encode($data, JSON_UNESCAPED_UNICODE)]);

    echo json_encode(["status" => true, "message" => null, "result" => null], JSON_UNESCAPED_UNICODE);
}