<?php
$driver = 'mysql';
$host = 'localhost';
$db_name = 'adminka';
$db_user = 'root';
$db_pass = 'mysql';
$charset = 'utf8';
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
];
try {
    $pdo = new PDO(
        "$driver:host=$host; dbname=$db_name;charset=$charset",
        $db_user,
        $db_pass,
        $options
    );
} catch (PDOException $i) {
    die('Ошибка в подкл к бд');
}

function DBCheckError($query)
{
    $errInfo = $query->errorInfo();
    if ($errInfo[0] !== PDO::ERR_NONE) {
        echo $errInfo[2];
        exit();
    }
    return true;
}

function CreateTable($table_name, $sql_obj)
{
    global $pdo;
    $sql_string = "";
    foreach ($sql_obj as $key => $value) {
        $sql_string = $sql_string . " " . $key . " " . $value . ",";
    }
    $query = $pdo->prepare("CREATE TABLE " . $table_name . "(id int NOT NULL AUTO_INCREMENT," . $sql_string . "primary key (id)) ENGINE=InnoDB  DEFAULT CHARSET=utf8;");
    $query->execute();
    DBCheckError($query);
}

function IsExistTable($name)
{
    global $pdo;

    $sql = "SHOW TABLES LIKE '" . $name . "';";
    $query = $pdo->prepare($sql);
    $query->execute();
    DBCheckError($query);
    $value = $query->fetch();
    if ($value != false) {
        return true;
    } else {
        return false;
    }
}

function GetAll($table_name)
{
    global $pdo;
    $sql = "SELECT * FROM $table_name";

    $query = $pdo->prepare($sql);
    $query->execute();
    dbCheckError($query);
    return $query->fetchAll();
}

function GetAllWhere ($table_name, $sql_obj_where) {
    global $pdo;
    $sql = "SELECT * FROM $table_name";

    if (!empty($sql_obj_where)) {
        $i = 0;
        foreach ($sql_obj_where as $key => $value) {
            if (!is_numeric($value)) {
                $value = "'" . $value . "'";
            }
            if ($i === 0) {
                $sql = $sql . " WHERE $key = $value";
            } else {
                $sql = $sql . " AND $key = $value";
            }
            $i++;
        }
    }

    $query = $pdo->prepare($sql);
    $query->execute();
    dbCheckError($query);
    return $query->fetchAll();
}

function SearchOne($table_name, $sql_obj)
{
    global $pdo;
    $sql = "SELECT * FROM $table_name";
    if (!empty($sql_obj)) {
        $i = 0;
        foreach ($sql_obj as $key => $value) {
            if (!is_numeric($value)) {
                $value = "'" . $value . "'";
            }
            if ($i === 0) {
                $sql = $sql . " WHERE $key = $value";
            } else {
                $sql = $sql . " AND $key = $value";
            }
            $i++;
        }
    }
    // $sql = $sql . " LIMIT 1";
    $query = $pdo->prepare($sql);
    $query->execute();
    dbCheckError($query);
    return $query->fetch();
    // fetchAll для вывода двумерного массива
}

function Insert($table_name, $sql_obj)
{
    global $pdo;

    $i = 0;
    $col = "";
    $mask = "";
    foreach ($sql_obj as $key => $value) {
        if ($i === 0) {
            $col = $col . $key;
            $mask = $mask . "'" . $value . "'";
        } else {
            $col = $col . ", $key";
            $mask = $mask . ", '" . $value . "'";
        }
        $i++;
    }
    $sql = "INSERT INTO $table_name ($col) VALUES ($mask)";


    $query = $pdo->prepare($sql);
    $query->execute($sql_obj);
    dbCheckError($query);

    return $pdo->lastInsertId();
}

function Update($table_name, $id, $sql_obj)
{
    global $pdo;

    $i = 0;
    $str = "";
    foreach ($sql_obj as $key => $value) {
        if ($i === 0) {
            $str = $str . $key . " = '" . $value . "'";
        } else {
            $str = $str . ", " . $key . " = '" . $value . "'";
        }
        $i++;
    }

    $sql = "UPDATE $table_name SET $str WHERE id = $id";
    $query = $pdo->prepare($sql);
    $query->execute($sql_obj);
    dbCheckError($query);
}

function UpdateWhere($table_name, $sql_obj_where, $sql_obj)
{
    global $pdo;

    $i = 0;
    $str = "";
    foreach ($sql_obj as $key => $value) {
        if ($i === 0) {
            $str = $str . $key . " = '" . $value . "'";
        } else {
            $str = $str . ", " . $key . " = '" . $value . "'";
        }
        $i++;
    }

    $sql = "UPDATE $table_name SET $str";

    if (!empty($sql_obj_where)) {
        $i = 0;
        foreach ($sql_obj_where as $key => $value) {
            if (!is_numeric($value)) {
                $value = "'" . $value . "'";
            }
            if ($i === 0) {
                $sql = $sql . " WHERE $key = $value";
            } else {
                $sql = $sql . " AND $key = $value";
            }
            $i++;
        }
    }

    $query = $pdo->prepare($sql);
    $query->execute($sql_obj);
    dbCheckError($query);
}

function Delete($table_name, $id)
{
    global $pdo;
    $sql = "DELETE FROM $table_name WHERE id = $id";
    $query = $pdo->prepare($sql);
    $query->execute();
    dbCheckError($query);
}

function DeleteWhere($table_name, $sql_obj_where)
{
    global $pdo;
    $sql = "DELETE FROM $table_name";

    if (!empty($sql_obj_where)) {
        $i = 0;
        foreach ($sql_obj_where as $key => $value) {
            if (!is_numeric($value)) {
                $value = "'" . $value . "'";
            }
            if ($i === 0) {
                $sql = $sql . " WHERE $key = $value";
            } else {
                $sql = $sql . " AND $key = $value";
            }
            $i++;
        }
    }

    $query = $pdo->prepare($sql);
    $query->execute();
    dbCheckError($query);
}

function GetId()
{
    $user = GetAll("one_user");
    if (count($user) == 0) {
        return -1;
    }
    return $user[0]["id"];
}
