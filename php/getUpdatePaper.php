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

  $db->select('papers','*',null,'authority_id='.$postdata->ida.' and id='.$postdata->id); // Table name, Column Names, JOIN, WHERE conditions, ORDER BY conditions
  $res = $db->getResult();

  $tb = new Table();
  foreach ($res as $key1 => $value1) {
    $res_joint = $tb->get_JointResult('teams', 'papers_team', 'papers', $res[$key1]['id']);
    // print_r ($res_joint);
    if ($res_joint) {
      foreach ($res_joint as $key2 => $value2) {
        $res[$key1]['author'][$key2]['team_id'] = $res_joint[$key2]['team_id'];
        $res[$key1]['author'][$key2]['name'] = $res_joint[$key2]['name'];
        $res[$key1]['author'][$key2]['title'] = $res_joint[$key2]['titlet'];
        $res[$key1]['author'][$key2]['surname'] = $res_joint[$key2]['surname'];
      }
    }
  }
// print_r($res);
  if (!$res) {
    die('Cant connect: ' . mysql_error());
  } else {
    $res[0]['description'] = html_entity_decode($res[0]['description']);
    $res[0]['description'] = str_replace('"','\'',$res[0]['description']);

    $db->select('teams','id, titlet, name, surname');
    $team = $db->getResult();
    // print_r ($team);
    // echo "Team:";
    if (isset($team)) {
      foreach ($team as $key => $value) {
        $res[0]['team'][$key]["id"] = $team[$key]["id"];
        $res[0]['team'][$key]['name'] = $team[$key]["titlet"]." ".$team[$key]["name"]." ".$team[$key]["surname"];
      }
    }

          $db->select('photos','image',null,'paper_id='.$res[0]['id']);
          $photo = $db->getResult();
          if (isset($photo[0])) {
            $res[0]['image'] = $photo[0]["image"];
          }
    $outp = json_encode($res);

    echo ($outp);

  }
  $db->disconnect();
}

?>
