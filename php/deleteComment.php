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
  $db->delete($postdata->db, 'id='.$postdata->id.' and authority_id ='.$postdata->aid); // Table name, Column Names, JOIN, WHERE conditions, ORDER BY conditions
  $res = $db->getResult();

if (!$res) {
    die('Cant connect: ' . mysql_error());
  } else {
            echo '{"info":"Deleted"}';
      }
  $db->disconnect();
}
?>
