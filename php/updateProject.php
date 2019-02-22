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
    // print_r($_FILES['file']);
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
          $rid = toDbase($items, $newFileName);

          $items['image'] = '../img/'.$newFileName;
          $outp2 = '{"message": "The record and the image updated successfully"}';
          $outp1 = '{"updateitem":['.json_encode($items).']}';
          $outp  = '{"info":['.$outp1.','.$outp2.','.$outp3.']}';

          echo ($outp);
      }else{
          print_r($errors[0]);
      }
  }
  else{
    $newFileName = $items['image'];
    toDbase($items, $newFileName);

    $outp2 = '{"message": "The record updated with the current image successfully"}';
    $outp1 = '{"updateitem":['.json_encode($items).']}';
    $outp  = '{"info":['.$outp1.','.$outp2.','.$outp3.']}';

    echo ($outp);
  }

} else {
  $outp2 = '{"message": "null"}';
  $outp1 = '{"updateitem":"null"}';
  $outp  = '{"info":['.$outp1.','.$outp2.','.$outp3.']}';
}

//********************************************************************//
function toDbase($items, $newFileName) {
  include('class/mysql_crud.php');
  $db = new Database();
	$db->connect();
	$db->setName('SET NAMES \'utf8\'');


$db->update('projects',array('title'=>$items['title'],
            'description'=>htmlentities($items['description']),
            'started'=>$items['started'],
            'finished'=>$items['finished']),
            'id=\''.$items['id'].'\'');

			$res = $db->getResult();
			if (!$res)
			{
        echo "ERROR 1";
			die('Cant connect1: ' . mysql_error());
    } else {
      $db->update('photos',array('image'=>$newFileName,
                  'description'=>$items['title']),
                  'project_id='.$items['id']);
                $res1 = $db->getResult();
          			if (!$res1) {
                  echo "ERROR 2";
                } else {
                  if (isset($items['author'])) {
                    foreach ($items['author'] as $key => $value) {
                      $db->insert('projects_team',array('project_id'=>$items['id'],
                      'team_id'=>$items['author'][$key]['id']));
                      $res2 = $db->getResult();
                    }
                  }
                }
    }

$db->disconnect();
}


?>
