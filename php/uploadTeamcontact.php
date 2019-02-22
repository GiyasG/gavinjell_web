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
    $items = $_POST['item'];
    $aid = $_POST['aid'];
    $id = $_POST['id'];
    // print_r ( $_POST);
   }
  if (!isset($items['country'])) {
    $outp2 = '{"message": "Please fill a country field"}';
    $outp1 = '{"newitem": "null"}';
    $outp  = '{"info":['.$outp1.','.$outp2.']}';
    echo ($outp);
    return;
  } elseif (!isset($items['city'])) {
      $outp2 = '{"message": "Please fill a city field"}';
      $outp1 = '{"newitem": "null"}';
      $outp  = '{"info":['.$outp1.','.$outp2.']}';
      echo ($outp);
      return;
  } elseif (!isset($items['postcode'])) {
    $outp2 = '{"message": "Please fill a postcode field"}';
    $outp1 = '{"newitem": "null"}';
    $outp  = '{"info":['.$outp1.','.$outp2.']}';
    echo ($outp);
    return;
  } elseif (!isset($items['street'])) {
    $outp2 = '{"message": "Please fill a street field"}';
    $outp1 = '{"newitem": "null"}';
    $outp  = '{"info":['.$outp1.','.$outp2.']}';
    echo ($outp);
    return;
  } elseif (!isset($items['email'])) {
    $outp2 = '{"message": "fill the email field"}';
    $outp1 = '{"newitem": "null"}';
    $outp  = '{"info":['.$outp1.','.$outp2.']}';
    echo ($outp);
    return;
  } elseif (filter_var($items['email'], FILTER_VALIDATE_EMAIL)) {
    $outp2 = '{"message": "email is not a valid email address"}';
    $outp1 = '{"newitem": "null"}';
    $outp  = '{"info":['.$outp1.','.$outp2.']}';
    echo ($outp);
    return;
  }

  if(empty($errors)==true) {

  if (!isset($items['propertytype'])) {
    $items['propertytype'] = "";
  }
  if (!isset($items['phone'])) {
    $items['phone']="";
  }
  if (!isset($items['email'])) {
    $items['email']="";
  }
          $sid = toDbase($items, $aid, $id);

          if (isset($sid)) {
            $items['authority_id'] = $items['id'];
            $items['id'] = $sid[0];
          }

          $outp1 = '{"newitem":['.json_encode($items).']}';
          $outp2 = '{"message": "The record and the image uploaded successfully"}';
          $outp  = '{"info":['.$outp1.','.$outp2.','.$outp3.']}';
          echo ($outp);
      } else {
          print_r($errors[0]);
      }
} else {
  $outp1 = '{"newitem":"null"}';
  $outp2 = '{"message": "null"}';
  $outp  = '{"info":['.$outp1.','.$outp2.','.$outp3.']}';
}

//*******************************************************//
function toDbase($items, $aid, $id) {
  // echo $items['authority_id'];
  include('class/mysql_crud.php');

  $db = new Database();
  $db->connect();
  $db->setName('SET NAMES \'utf8\'');

  $db->insert('tcontacts',array('propertytype'=>$items['propertytype'],
              'country'=>$items['country'],
              'city'=>$items['city'],
              'postcode'=>$items['postcode'],
              'street'=>$items['street'],
              'phone'=>$items['phone'],
              'email'=>$items['email'],
              'authority_id'=>$aid,
              'team_id'=>$id
          ));

  $contactLastId = $db->lastId;
  // echo $db->getSql();

  $res = $db->getResult();
  if (!$res)
  {
  // print_r($res);
  die('Cant connect: ' . mysql_error());
  } else {
        $db->insert('contacts_team',array('tcontact_id'=>$contactLastId,
        'team_id'=>$items['id']));
        $res2 = $db->getResult();
        // print_r ($res2);
    return $res;
  }

$db->disconnect();
}

?>
