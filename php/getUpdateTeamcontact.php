<?php

if ( $_POST ) {
    foreach ( $_POST as $key => $value ) {
        $postdata = json_decode($key);
        // print_r ($postdata);
    }
  }

if (isset($postdata->id)) {
  include('class/mysql_crud.php');
  $db = new Database();
  $db->connect();
  $db->setName('SET NAMES \'utf8\'');

  // if (isset($db)) {
  $db->select('tcontacts','*',null,'id='.$postdata->id); // Table name, Column Names, JOIN, WHERE conditions, ORDER BY conditions
  $res = $db->getResult();

  if (!$res) {
    print_r($res);
    die('Cant connect:');
  } else {
    $outp = json_encode($res);
    echo ($outp);
  }
  $db->disconnect();
}

?>
