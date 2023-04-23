<?php
include('db.php');
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$req = file_get_contents("php://input");
$req = json_decode($req, true);

// UpdatePage
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $req["id"];
    $page_name = $req["page_name"];
    $page_name_en = $req["page_name_en"];

    $old_page_name_en = SearchOne("pages", ["id" => $id])["page_name_en"];
    Update("pages", $id, ["page_name" => $page_name, "page_name_en" => $page_name_en]);
    UpdateWhere("pages", ["page_name_en" => $old_page_name_en], ["page_name_en" => $page_name_en]);

    echo json_encode(["status" => true, "message" => null, "result" => null], JSON_UNESCAPED_UNICODE);
}