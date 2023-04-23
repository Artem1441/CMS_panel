<?php
include('db.php');
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$req = file_get_contents("php://input");
$req = json_decode($req, true);

// GetSection
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $page_name_en = $req["page_name_en"];
    $section_name_en = $req["section_name_en"];

    $section = SearchOne("sections", ["page_name_en" => $page_name_en, "section_name_en" => $section_name_en]);
    if(!$section) {
        echo json_encode(["status" => false, "message" => "Произошла ошибка с поиском section", "result" => null], JSON_UNESCAPED_UNICODE);
        return;
    };
    echo json_encode(["status" => true, "message" => null, "result" => $section], JSON_UNESCAPED_UNICODE);
}