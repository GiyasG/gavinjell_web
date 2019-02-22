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
    foreach ( $_POST as $key => $value ) {
      $postdata = json_decode($key);
    }
    $id = $postdata->itemid;
    $nameofdb = $postdata->nofdb;
   }
}
// echo $id;
if (isset($_POST)) {
  include('class/mysql_crud.php');
  $db = new Database();
  $db->connect();

  $tb = new Table();
  $resj = $tb->get_ParentResult($nameofdb, 'photos', $id);
  $db->select($nameofdb,'*', null, 'id ='.$id);
  $res = $db->getResult();
  // print_r ($resj);
  // print_r ($res);
  if ($resj[0] && $res[0]) {
    // echo ($res[0]['authority_id']);
    $db->insert('slides',array('authority_id'=>$res[0]['authority_id'],
    'nameofdb'=>$nameofdb,
    'idofdb'=>$id
  ));
  $res2 = $db->getResult();
  // print_r ($res2);
  $outp1 = '{"newitem":[{"authority_id":'.$res[0]['authority_id'].',
             "title":"'.$resj[0]['title'].'",
             "image":"'.$resj[0]['image'].'",
             "nameofdb":"'.$nameofdb.'",
             "id":"'.$id.'"}]}';
  $outp2 = '{"message": "The record uploaded successfully"}';
  $outp  = '{"info":['.$outp1.','.$outp2.']}';
  echo ($outp);
  } else {
  $outp1 = '{"newitem":"null"}';
  $outp2 = '{"message": "null"}';
  $outp  = '{"info":['.$outp1.','.$outp2.']}';
}

//*******************************************************//

$db->disconnect();
}
?>
