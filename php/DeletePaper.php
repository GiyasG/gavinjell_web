<?php

if ( $_POST ) {
    foreach ( $_POST as $key => $value ) {
        $postdata = json_decode($key);
        // print_r ($postdata);
        // echo ($postdata->id);
    }
  }

if (isset($postdata->aid)) {
  include('class/mysql_crud.php');
  $db = new Database();
  $db->connect();
  $db->delete('papers', 'id='.$postdata->id.' and authority_id ='.$postdata->aid); // Table name, Column Names, JOIN, WHERE conditions, ORDER BY conditions
  $res = $db->getResult();
  print_r ($res);

if (!$res) {
    die('Cant connect: ' . mysql_error());
  } else {
            echo '{"info":"Deleted"}';
      }
  $db->disconnect();
}
?>
