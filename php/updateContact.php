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
  if (isset($_POST['item'])) {
    $items = $_POST['item'];
  }
          $rid = toDbase($items);

          $outp2 = '{"message": "The record updated successfully"}';
          $outp1 = '{"updateitem":['.json_encode($items).']}';
          $outp  = '{"info":['.$outp1.','.$outp2.','.$outp3.']}';

          echo ($outp);
      }else{
  $outp2 = '{"message": "null"}';
  $outp1 = '{"updateitem":"null"}';
  $outp  = '{"info":['.$outp1.','.$outp2.','.$outp3.']}';
}

//********************************************************************//
function toDbase($items) {
  include('class/mysql_crud.php');
  $db = new Database();
	$db->connect();
	$db->setName('SET NAMES \'utf8\'');

// echo $items['id'];
$db->update('contacts',array('propertytype'=>$items['propertytype'],
            'country'=>$items['country'],
            'city'=>$items['city'],
            'postcode'=>$items['postcode'],
            'street'=>$items['street'],
            'phone'=>$items['phone'],
            'email'=>$items['email'],
            'authority_id'=>$items['authority_id']),
            'id=\''.$items['id'].'\'');

			$res = $db->getResult();
      // print_r($res);
			if (!$res)
			{
        // print_r($res);
			die('Cant connect1: ' . mysql_error());
    } else {
      // print_r($res);
      return $res;
    }
    $db->disconnect();
  }

?>
