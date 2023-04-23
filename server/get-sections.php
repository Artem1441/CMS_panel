<?php
include('db.php');
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$req = file_get_contents("php://input");
$req = json_decode($req, true);

// GetSections
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $isExistTable = IsExistTable("sections");
    if (!$isExistTable) CreateTable("sections", [
        "page_name_en" => "varchar(255) NOT NULL",
        "section_name" => "varchar(255) NOT NULL",
        "section_name_en" => "varchar(255) NOT NULL",
        "type" => "varchar(255) NOT NULL",
        "inputs" => "JSON",
        "data" => "JSON",
    ]);

    $page_name_en = $req["page_name_en"];
    $sections = GetAllWhere("sections", ["page_name_en" => $page_name_en]);

    echo json_encode(["status" => true, "message" => null, "result" => $sections], JSON_UNESCAPED_UNICODE);
}

