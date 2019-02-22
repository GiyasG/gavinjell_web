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
    include('class/mysql_crud.php');
    $db = new Database();
    $db->connect();
    $db->delete('projects_team', 'project_id ='.$_POST["projectid"].' and team_id ='.$_POST["teamid"]); // Table name, Column Names, JOIN, WHERE conditions, ORDER BY conditions
    $res = $db->getResult();
    print_r ($res);
    if ($res[0]==0) {
      $db->delete('papers_team', 'paper_id ='.$_POST["projectid"].' and team_id ='.$_POST["teamid"]); // Table name, Column Names, JOIN, WHERE conditions, ORDER BY conditions
      $res1 = $db->getResult();
      print_r ($res1);
    }
  if (!$res) {
      die('Cant connect: ' . mysql_error());
    } else {
              echo '{"info":"Deleted"}';
        }
    $db->disconnect();
  }
}
?>
