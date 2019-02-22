<?php
require '../vendor/autoload.php';
  $db1 = new \PDO('mysql:dbname=1092877;host=localhost;charset=utf8mb4', '1092877', 'xP9tM715UK');
  $auth = new \Delight\Auth\Auth($db1);
$outp3 = "";
if (($auth->isLoggedIn()) && ($auth->hasRole(\Delight\Auth\Role::ADMIN))) {
  $outp3 = '{"AdminIsIn":true}';
  $adminOk = true;
} else {
  $outp3 = '{"AdminIsIn":false}';
  $adminOk = false;
}

if ($adminOk) {
  if (isset($_POST)) {
    if (isset($_POST)) {
      foreach ( $_POST as $key => $value ) {
        $postdata = json_decode($key);
      }
      $id = $postdata->itemid;
      $nameofdb = $postdata->nofdb;
     }

    include('class/mysql_crud.php');
    $db = new Database();
    $db->connect();
    $db->delete('slides', 'idofdb ='.$id.' and nameofdb =\''.$nameofdb.'\''); // Table name, Column Names, JOIN, WHERE conditions, ORDER BY conditions
    $res = $db->getResult();
    // print_r ($res);
    if (!$res) {
      die('Cant connect: ' . mysql_error());
    } else {
              echo '{"info":"Deleted"}';
        }
    $db->disconnect();
  }
}
?>
