<?php

require '../vendor/autoload.php';
  $db1 = new \PDO('mysql:dbname=1092877;host=localhost;charset=utf8mb4', '1092877', 'xP9tM715UK');
  $auth = new \Delight\Auth\Auth($db1);
$outp3 = "";
if (($auth->isLoggedIn()) || ($auth->hasRole(\Delight\Auth\Role::ADMIN))) {
  $outp3 = '{"AdminIsIn":true}';
  $uid = $auth->getUserId();
  $usem = $auth->getEmail();
  $uname = $auth->getUsername();
  if ($uname == null) {
    $uname = strtok($usem, '@').'@';
  }
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
    $db->insert('comments',array('authority_id'=>$_POST['authority_id'],
    'nameofdb'=>$_POST['nameofdb'],
    'idofdb'=>$_POST['idofdb'],
    'user_id'=>$uid,
    'uname'=>$uname,
    'comment'=>htmlentities($_POST['comment'])
    ));
  $res2 = $db->getResult();

  $_POST['id'] = $db->lastId;
  $_POST['uname'] = $uname;

  $outp1 = '{"newitem":['.json_encode($_POST).']}';
  $outp2 = '{"message": "The record uploaded successfully"}';
  $outp  = '{"info":['.$outp1.','.$outp2.']}';
  echo ($outp);
  } else {
  $outp1 = '{"newitem":"null"}';
  $outp2 = '{"message": "null"}';
  $outp  = '{"info":['.$outp1.','.$outp2.']}';
  }
}
$db->disconnect();
?>
