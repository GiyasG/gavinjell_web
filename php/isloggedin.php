<?php
session_start();

if ( $_GET ) {
    foreach ( $_GET as $key => $value ) {
        $choosendb = $key;
        // echo $choosendb;
    }
}
require '../vendor/autoload.php';
  $db = new \PDO('mysql:dbname=1092877;host=localhost;charset=utf8mb4', '1092877', 'xP9tM715UK');
  $auth = new \Delight\Auth\Auth($db);
  $outp1 = "";

  if ($auth->isLoggedIn()) {
    $outp1 ='{"isIn":true}';
    if ($auth->hasRole(\Delight\Auth\Role::ADMIN)) {
      $outp2 = '{"Role": "Admin"}';
    } else {
      $outp2 = '{"Role": null}';
    }
  } else {
    $outp1 ='{"isIn":false}';
    $outp2 = '{"Role": null}';
  }

if ($choosendb == 'home') {
  include('class/mysql_crud.php');
  $db = new Database();
  if (isset($db)) {

    $tb = new Table();
    $res = $tb->get_ParentResult('authority', 'photos');
    $res[0]['about'] = html_entity_decode($res[0]['about']);
    $res[0]['about'] = str_replace('"','\"',$res[0]['about']);
    // echo ($res[0]['about']);
  $outp3 ='{"all":['.json_encode($res).']}';
  // echo (json_encode($outp3));
} else {
  $outp3 ='{"all":["No items found"]}';
}

if (isset($db)) {
  $tb = new Table();
  $res = $tb->get_ParentResult('authority', 'contacts');

  $outp4 ='{"contact":['.json_encode($res).']}';
} else {
  $outp4 ='{"contact":["No items found"]}';
}

if (isset($db)) {
  $tb = new Table();
  $res = $tb->get_ParentResult('authority', 'slides');
  $arr = [];
  foreach ($res as $key => $value) {
    $res1 = $tb->get_ParentResult($res[$key]['nameofdb'],null,'id='.$res[$key]['idofdb']);
      foreach ($res1 as $key1 => $value1) {
        // print_r ($res1[$key1]['id']);
        $tbl1 = substr($res[$key]['nameofdb'], 0, -1);
        // echo $tbl1;
        // print_r ($value1);
        $res2 = $tb->get_ParentResult('photos',null,$tbl1.'_id='.$res1[$key1]['id']);
        $res1[$key1]['image']=$res2[$key1]['image'];
        $res1[$key1]['nameofdb']=$tbl1;
        // $res1[$key1]['nameofdb']=$res[$key]['nameofdb'];
        // print_r ($res2);
      }
    $arr = array_merge($arr, $res1);
  }
  $outp5 ='{"slide":['.json_encode($arr).']}';
} else {
  $outp5 ='{"slide":["No items found"]}';
}
$outp = '{"isloggedin":['.$outp1.','.$outp2.','.$outp3.','.$outp4.','.$outp5.']}';
} else {
  $outp = '{"isloggedin":['.$outp1.','.$outp2.']}';
}

echo ($outp);
?>
