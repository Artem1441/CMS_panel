<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


if ($_FILES['file']) {
    $tempFileName = $_FILES["file"]["tmp_name"];
    $error = $_FILES["file"]["error"];

    $name = floor(microtime(true) * 1000) . ".webp";
    $path = 'images/' . $name;

    if ($error > 0) echo json_encode(["status" => false, "message" => "Что-то пошло не так", "result" => null], JSON_UNESCAPED_UNICODE);
    else {
        if (move_uploaded_file($tempFileName, $path)) {
            echo json_encode(["status" => true, "message" => null, "result" => 'images/' . $name], JSON_UNESCAPED_UNICODE);
        } else {
            if ($error > 0) echo json_encode(["status" => false, "message" => "Что-то пошло не так 2", "result" => null], JSON_UNESCAPED_UNICODE);
        }
    }
} else {
    if ($error > 0) echo json_encode(["status" => false, "message" => "Файл не найден", "result" => null], JSON_UNESCAPED_UNICODE);
}