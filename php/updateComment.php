<?php

require '../vendor/autoload.php';
  $db1 = new \PDO('mysql:dbname=1092877;host=localhost;charset=utf8mb4', '1092877', 'xP9tM715UK');
  $auth = new \Delight\Auth\Auth($db1);
$outp3 = "";
if (($auth->isLoggedIn()) || ($auth->hasRole(\Delight\Auth\Role::ADMIN))) {
  $outp3 = '{"AdminIsIn":true}';
  $adminOk = true;
} else {
  $outp3 = '{"AdminIsIn":false}';
  $adminOk = false;
}

if ($adminOk) {
  if (isset($_POST)) {
    // print_r($_POST);
    include('class/mysql_crud.php');
    $db = new Database();
    $db->connect();
    $db->update('comments',
                array('comment'=>htmlentities($_POST['comment'])),
                'id=\''.$_POST['idofdb'].'\'');

  $res2 = $db->getResult();

  $outp1 = '{"uitem":['.json_encode($_POST).']}';
  $outp2 = '{"message": "The record updated successfully"}';
  $outp  = '{"info":['.$outp1.','.$outp2.']}';
  echo ($outp);
  } else {
  $outp1 = '{"newitem":"null"}';
  $outp2 = '{"message": "Some error occured"}';
  $outp  = '{"info":['.$outp1.','.$outp2.']}';
  }
}
$db->disconnect();
?>
