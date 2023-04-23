<?php
include('db.php');
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$req = file_get_contents("php://input");
$req = json_decode($req, true);

// CreateLoginAndPassword
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // login will be 16 characters, password will be 8 characters
    $login = "";
    $password = "";
    $characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    $numbers = "0123456789";

    for ($i = 0; $i < 16; $i++) $login = $login . $characters[rand(0, strlen($characters) - 1)];
    for ($i = 0; $i < 4; $i++) $password = $password . $chars[rand(0, strlen($chars) - 1)];
    for ($i = 0; $i < 4; $i++) $password = $password . $numbers[rand(0, strlen($numbers) - 1)];

    $isExistTable = IsExistTable("one_user");
    if (!$isExistTable) {
        CreateTable("one_user", [
            "login" => "varchar(255) NOT NULL",
            "password" => "varchar(255) NOT NULL",
        ]);
        Insert("one_user", ["login" => $login, "password" => password_hash($password, PASSWORD_DEFAULT)]);
    } else {
        $id = GetId(); // if id = -1 it means, that the table is empty
        if ($id == -1) Insert("one_user", ["login" => $login, "password" => password_hash($password, PASSWORD_DEFAULT)]);
        else Update("one_user", $id, ["login" => $login, "password" => password_hash($password, PASSWORD_DEFAULT)]);
    }

    echo "Логин: " . $login . "\n" . "Пароль: " . $password;
}

// LoginInSystem
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // if table is not exist
    $isExistTable = IsExistTable("one_user");
    if (!$isExistTable) {
        echo json_encode(["status" => false, "message" => "Сначала создайте БД (обратитесь к программисту)", "result" => null], JSON_UNESCAPED_UNICODE);
        return;
    };

    // if one user is founded - check his login and password with requested login and password
    $user = GetAll("one_user")[0];
    if (count($user) == 0) {
        echo json_encode(["status" => false, "message" => "Сначала создайте логин и пароль (обратитесь к программисту)", "result" => null], JSON_UNESCAPED_UNICODE);
        return;
    };

    $login = $req["login"];
    $password = $req["password"];

    $isLogin = $user["login"] === $login;
    $isPassword = password_verify($password, $user["password"]);

    if (!$isLogin || !$isPassword) 
    {
        echo json_encode(["status" => false, "message" => "Логин или пароль введены неверно", "result" => null], JSON_UNESCAPED_UNICODE);
        return;
    };
    echo json_encode(["status" => true, "message" => null, "result" => null], JSON_UNESCAPED_UNICODE); // success
}
