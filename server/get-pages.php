<?php
include('db.php');
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// GetPages
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $isExistTable = IsExistTable("pages");
    if (!$isExistTable) CreateTable("pages", [
        "page_name" => "varchar(255) NOT NULL",
        "page_name_en" => "varchar(255) NOT NULL",
    ]);
    $pages = GetAll("pages");

    echo json_encode(["status" => true, "message" => null, "result" => $pages], JSON_UNESCAPED_UNICODE);
}