<?php
include('db.php');
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$req = file_get_contents("php://input");
$req = json_decode($req, true);

// CreatePage
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $isExistTable = IsExistTable("pages");
    if(!$isExistTable) CreateTable("pages", ["page_name" => "varchar(255) NOT NULL", "page_name_en" => "varchar(255) NOT NULL"]);

    $page_name = $req["page_name"];
    $page_name_en = $req["page_name_en"];

    if ($page_name == "" || $page_name_en == "") {
        echo json_encode(["status" => false, "message" => "Название страницы не может быть пустым", "result" => null], JSON_UNESCAPED_UNICODE);
        return;
    }

    $matchingResultsName = SearchOne("pages", ["page_name" => $page_name]);
    $matchingResultsNameEn = SearchOne("pages", ["page_name_en" => $page_name_en]);
    if ($matchingResultsName) {
        echo json_encode(["status" => false, "message" => "Такая страница уже существует. '" . $page_name . "' использовать нельзя", "result" => null], JSON_UNESCAPED_UNICODE);
        return;
    };
    if ($matchingResultsNameEn) {
        echo json_encode(["status" => false, "message" => "Такая страница уже существует. '" . $page_name_en . "' использовать нельзя", "result" => null], JSON_UNESCAPED_UNICODE);
        return;
    }

    Insert("pages", ["page_name" => $page_name, "page_name_en" => $page_name_en]);
    
    echo json_encode(["status" => true, "message" => null, "result" => null], JSON_UNESCAPED_UNICODE);
}