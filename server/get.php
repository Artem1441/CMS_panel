<?php
include('db.php');
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $page = $_GET["page"];
    $obj = (object)[];
    $sections = GetAllWhere("sections", ["page_name_en" => $page]);

    foreach ($sections as $section) {
        if ($section["type"] == "object") $obj->{$section["section_name_en"]} = json_decode($section["data"], true);
        else $obj->{$section["section_name_en"]} = array_slice(json_decode($section["data"], true), 1);
    }

    echo json_encode($obj, JSON_UNESCAPED_UNICODE);
}