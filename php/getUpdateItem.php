<?php

if ( $_POST ) {
    foreach ( $_POST as $key => $value ) {
        $postdata = json_decode($key);
    }
  }

if (isset($postdata->id)) {
  include('class/mysql_crud.php');
  $db = new Database();
  $db->connect();
  $db->setName('SET NAMES \'utf8\'');

  $db->select('authority','*',null,'id='.$postdata->id); // Table name, Column Names, JOIN, WHERE conditions, ORDER BY conditions
  $res = $db->getResult();

  if (!$res) {
    die('Cant connect: ' . mysql_error());
  } else {

    $db->select('photos','image',null,'authority_id='.$res[0]['id']);
    $photo = $db->getResult();
    if (isset($photo[0])) {
      $res[0]['image'] = $photo[0]["image"];
    }

    $res[0]['about'] = html_entity_decode($res[0]['about']);
    $res[0]['about'] = str_replace('"','\"',$res[0]['about']);
    // echo ($res[0]['about']);
    $outp = json_encode($res);

    echo ($outp);

  }
  $db->disconnect();
}

?>
