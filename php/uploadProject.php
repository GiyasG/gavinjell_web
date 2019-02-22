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
  // print_r($_POST['item']);
  if (isset($_POST['item'])) {
    $items = $_POST['item'];
    // print_r($items);
  }
  if(!isset($_FILES['file'])){
    $outp2 = '{"message": "No image selected"}';
    $outp1 = '{"newitem": "null"}';
    $outp  = '{"info":['.$outp1.','.$outp2.']}';
    echo ($outp);
  } elseif (!isset($items['title'])) {
    $outp2 = '{"message": "Please fill a title field"}';
    $outp1 = '{"newitem": "null"}';
    $outp  = '{"info":['.$outp1.','.$outp2.']}';
    echo ($outp);
    return;
  } elseif (!isset($items['started'])) {
      $outp2 = '{"message": "Please fill a start date"}';
      $outp1 = '{"newitem": "null"}';
      $outp  = '{"info":['.$outp1.','.$outp2.']}';
      echo ($outp);
      return;
  } elseif (!isset($items['finished'])) {
    $outp2 = '{"message": "Please fill an expected closure date"}';
    $outp1 = '{"newitem": "null"}';
    $outp  = '{"info":['.$outp1.','.$outp2.']}';
    echo ($outp);
    return;
  }

  if(isset($_FILES['file'])){
      $errors= array();
      $file_name = $_FILES['file']['name'];
      $file_size =$_FILES['file']['size'];
      $file_tmp =$_FILES['file']['tmp_name'];
      $file_type=$_FILES['file']['type'];
      $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
      $extensions = array("jpeg","jpg","png","pdf");
      if(in_array($file_ext,$extensions )=== false){
           $errors[]="File extension not allowed, please choose a JPEG or PNG file.";
      }
      if($file_size > 1097152){
          $errors[]='File size cannot exceed 1 MB';
      }
      if(file_exists('../img/'.$file_name)) {
        $errors[]='File '.$file_name.' already exists';
      }
      if(empty($errors)==true){
          $currentDate = date('ymdhms');
          $newFileName = $currentDate.$file_name;
          move_uploaded_file($file_tmp,"../img/".$newFileName);
          if (!isset($items['url'])) {
            $items['url'] = "";
          }
          if (!isset($items['description'])) {
            $items['description'] = "";
          }
          $sid = toDbase($items, $newFileName);

          if (isset($sid)) {
            $items['authority_id'] = $items['id'];
            $items['id'] = $sid[0];
          }
          $items['image'] = $newFileName;
          $outp1 = '{"newitem":['.json_encode($items).']}';
          $outp2 = '{"message": "The record and the image uploaded successfully"}';
          $outp  = '{"info":['.$outp1.','.$outp2.','.$outp3.']}';
          echo ($outp);
      }else{
          print_r($errors[0]);
      }
  }
} else {
  $outp1 = '{"newitem":"null"}';
  $outp2 = '{"message": "null"}';
  $outp  = '{"info":['.$outp1.','.$outp2.','.$outp3.']}';
}

//*******************************************************//
function toDbase($items, $newFileName) {
  // echo $items['authority_id'];
  include('class/mysql_crud.php');

  $db = new Database();
  $db->connect();
  $db->setName('SET NAMES \'utf8\'');

  $db->insert('projects',array('title'=>$items['title'],
              'url'=>$items['url'],
              'started'=>$items['started'],
              'finished'=>$items['finished'],
              'description'=>htmlentities($items['description']),
              'authority_id'=>$items['id']
          ));

  $projectLastId = $db->lastId;
  // echo $db->getSql();

  $res = $db->getResult();
  // print_r($res[0]);
  if (!$res)
  {
  die('Cant connect: ' . mysql_error());
} else {
        $db->insert('photos',array('project_id'=>$projectLastId,
                    'image'=>$newFileName,
                    'description'=>$items['title']
                    ));
        $res1 = $db->getResult();
        if (!$res1) {
          die('Cant connect: ' . mysql_error());
        } else {
          if (isset($items['author']['name'])) {
            foreach ($items['author']['name'] as $key => $value) {
              // echo ($items['author']['name'][$key]['id']);
              $db->insert('projects_team',array('project_id'=>$projectLastId,
              'team_id'=>$items['author']['name'][$key]['id']));
              $res2 = $db->getResult();
              // print_r ($res2);
            }
          }
          return $res;
        }
    }
$db->disconnect();
}

?>
