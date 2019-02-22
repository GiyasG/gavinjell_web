<?php
session_start();
// print_r ($_GET['db']);

if ( isset($_GET['db']) ) {
        $choosendb = $_GET['db'];
        // echo $choosendb;
    } else {
      return;
    }
if ( isset($_GET['id']) ) {
            $id = $_GET['id'];
        } else {
          $id = null;
        }

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require '../vendor/autoload.php';
  $db1 = new \PDO('mysql:dbname=1092877;host=localhost;charset=utf8mb4', '1092877', 'xP9tM715UK');
  $auth = new \Delight\Auth\Auth($db1);
$outp3 = "";
$uid = null;
if ($auth->isLoggedIn()) {
  $uid = $auth->getUserId();
  if ($auth->hasRole(\Delight\Auth\Role::ADMIN)) {
    $outp3 ='{"isIn":true, "Role": "Admin", "UID":'.$uid.'}';
  } else {
    $outp3 = '{"isIn":true, "Role": null, "UID":'.$uid.'}';
  }
} else {
  $outp3 ='{"isIn":false, "Role": null, "UID": null}';
}

include('class/mysql_crud.php');
$db = new Database();
$db->connect();

if ($id != null) {
if (isset($db)) {

  $tb = new Table();

  switch ($choosendb) {
    case 'projects':
  if (isset($tb)) {
    $res1 = $tb->get_ParentResult('projects',null,'id='.$id);
    $res2 = $tb->get_ParentResult('photos',null,'project_id='.$id);
    $res3 = $tb->get_ParentResult('comments',null,'idofdb='.$id);
          $res1[0]['image']=$res2[0]['image'];
          $res1[0]['description'] = html_entity_decode($res1[0]['description']);
          $proj ='{"projects":['.json_encode($res1).']}';
          $papr ='{"papers":[null]}';
          $team ='{"teams":[null]}';
          $cnt ='{"contact":[null]}';
          $sld ='{"slides":[null]}';
          if (isset($res3)) {
            foreach ($res3 as $key3 => $value13) {
              $res3[$key3]['comment'] = html_entity_decode($res3[$key3]['comment']);
              $res3[$key3]['UID'] = $uid;
              $res3[$key3]['updated_at'] = Date('dMy H:i', strtotime($res3[$key3]['updated_at']));
            }
            $cmt = '{"comment":['.json_encode($res3).']}';
          } else {
            $cmt = '{"comment":[null]}';
          }
  } else {
    $proj ='{"project":["No items found"]}';
  }
      break;
    case 'papers':
    if (isset($tb)) {
    $res1 = $tb->get_ParentResult('papers',null,'id='.$id);
    $res2 = $tb->get_ParentResult('photos',null,'paper_id='.$id);
    $res3 = $tb->get_ParentResult('comments',null,'idofdb='.$id);
          $res1[0]['image']=$res2[0]['image'];
          $res1[0]['description'] = html_entity_decode($res1[0]['description']);
    $papr ='{"papers":['.json_encode($res1).']}';
    $proj ='{"projects":[null]}';
    $team ='{"teams":[null]}';
    $cnt ='{"contact":[null]}';
    $sld ='{"slides":[null]}';
    $cmt = '{"comment":[null]}';
    if (isset($res3)) {
      foreach ($res3 as $key3 => $value13) {
        $res3[$key3]['comment'] = html_entity_decode($res3[$key3]['comment']);
        $res3[$key3]['UID'] = $uid;
        $res3[$key3]['updated_at'] = Date('dMy H:i', strtotime($res3[$key3]['updated_at']));
      }
      $cmt = '{"comment":['.json_encode($res3).']}';
    } else {
      $cmt = '{"comment":[null]}';
    }
  } else {
    $papr ='{"papers":["No items found"]}';
  }
      break;
    case 'teams':
    if (isset($tb)) {
    $res1 = $tb->get_ParentResult('teams',null,'id='.$id);
    $res2 = $tb->get_ParentResult('photos',null,'team_id='.$id);
          $res1[0]['image']=$res2[0]['image'];
          $res1[0]['about'] = html_entity_decode($res1[0]['about']);
          // print_r ($res1[0]);

          foreach ($res1 as $key1 => $value1) {
            $res_project = $tb->get_JointResult('projects', 'projects_team', 'teams', $res1[$key1]['id']);
            // print_r ($res_project);
            if ($res_project) {
              foreach ($res_project as $key2 => $value2) {
                $res1[$key1]['project'][$key2]['project_id'] = $res_project[$key2]['project_id'];
                $res1[$key1]['project'][$key2]['title'] = $res_project[$key2]['title'];
              }
            }
          }
          foreach ($res1 as $key1 => $value1) {
            $res_paper = $tb->get_JointResult('papers', 'papers_team', 'teams', $res1[$key1]['id']);
            // print_r ($res_paper);
            if ($res_paper) {
              foreach ($res_paper as $key2 => $value2) {
                $res1[$key1]['paper'][$key2]['paper_id'] = $res_paper[$key2]['paper_id'];
                $res1[$key1]['paper'][$key2]['title'] = $res_paper[$key2]['title'];
              }
            }
          }

    $team ='{"teams":['.json_encode($res1).']}';
    // echo $team;
    $papr ='{"papers":[null]}';
    $proj ='{"projects":[null]}';
    $cnt ='{"contact":[null]}';
    $sld ='{"slides":[null]}';
    $cmt = '{"comment":[null]}';
  } else {
    $team ='{"teams":["No items found"]}';
  }
      break;
    // default:
    //   // code...
    //   break;
  }
 }
}

if (isset($db)) {
  $tb = new Table();
  $res = $tb->get_ParentResult('authority', 'photos');

  // print_r ($res);
  $res[0]['about'] = html_entity_decode($res[0]['about']);
  $res[0]['about'] = str_replace('"','\"',$res[0]['about']);

  $outp1 ='{"all":['.json_encode($res).']}';
} else {
  $outp1 ='{"all":["No items found"]}';
}

if ($id==null) {
/* PROJECTS */
  $res = $tb->get_ParentResult('authority', 'projects');

    foreach ($res as $key1 => $value1) {
      $res_joint = $tb->get_JointResult('teams', 'projects_team', 'projects', $res[$key1]['id']);
      if ($res_joint) {
        foreach ($res_joint as $key2 => $value2) {
          $res[$key1]['author'][$key2]['team_id'] = $res_joint[$key2]['team_id'];
          $res[$key1]['author'][$key2]['name'] = $res_joint[$key2]['name'];
          $res[$key1]['author'][$key2]['title'] = $res_joint[$key2]['titlet'];
          $res[$key1]['author'][$key2]['surname'] = $res_joint[$key2]['surname'];
        }
      }
    }
  $records_number  = sizeof($res);
  $records_per_page = 6;

  for ($i=0; $i < $records_number; $i++) {
      $res[$i]['about'] = html_entity_decode($res[$i]['about']);
      $res[$i]['about'] = str_replace('"','\"',$res[$i]['about']);
      $res[$i]['description'] = html_entity_decode($res[$i]['description']);
      $res[$i]['description'] = str_replace('"','\"',$res[$i]['description']);
  }

  if ($choosendb == "projects" && $records_number != 0) {
    $proj = Projects("projects", $db, $res, $records_number, $records_per_page);
  } elseif ($choosendb == "admin" && $records_number != 0) {
    $records_per_page = $records_number;
    $proj = Projects("projects",$db, $res, $records_number, $records_per_page);
  } elseif ($choosendb != "projects" && $choosendb != "admin" || $records_number == 0) {
    $proj ='{"projects":null}';
  }

/* Publications */

$res = $tb->get_ParentResult('authority', 'papers');

foreach ($res as $key1 => $value1) {
  $res_joint = $tb->get_JointResult('teams', 'papers_team', 'papers', $res[$key1]['id']);
  if ($res_joint) {
    foreach ($res_joint as $key2 => $value2) {
      $res[$key1]['author'][$key2]['team_id'] = $res_joint[$key2]['team_id'];
      $res[$key1]['author'][$key2]['name'] = $res_joint[$key2]['name'];
      $res[$key1]['author'][$key2]['title'] = $res_joint[$key2]['titlet'];
      $res[$key1]['author'][$key2]['surname'] = $res_joint[$key2]['surname'];
    }
  }
}

$records_number  = sizeof($res);
$records_per_page = 3;

for ($i=0; $i < $records_number; $i++) {
    $res[$i]['about'] = html_entity_decode($res[$i]['about']);
    $res[$i]['about'] = str_replace('"','\"',$res[$i]['about']);
    $res[$i]['description'] = html_entity_decode($res[$i]['description']);
    $res[$i]['description'] = str_replace('"','\"',$res[$i]['description']);
}

if ($choosendb == "papers" && $records_number != 0) {
  $papr = Projects("papers", $db, $res, $records_number, $records_per_page);
}  elseif ($choosendb == "admin" && $records_number != 0) {
  $records_per_page = $records_number;
  $papr = Projects("papers",$db, $res, $records_number, $records_per_page);
} elseif ($choosendb != "papers" && $choosendb != "admin" || $records_number == 0) {
  $papr ='{"papers":null}';
}

/* TEAMS */

$res = $tb->get_ParentResult('authority', 'teams');

foreach ($res as $key1 => $value1) {
  $res_contact = $tb->get_JointResult('tcontacts', 'contacts_team', 'teams', $res[$key1]['id']);
  // print_r ($res_joint);
  if ($res_contact) {
    foreach ($res_contact as $key2 => $value2) {
      // echo $key2;
      // print_r ($value2);
      $res[$key1]['contact'][$key2]['id'] = $res_contact[$key2]['tcontact_id'];
      $res[$key1]['contact'][$key2]['country'] = $res_contact[$key2]['country'];
      $res[$key1]['contact'][$key2]['city'] = $res_contact[$key2]['city'];
      $res[$key1]['contact'][$key2]['street'] = $res_contact[$key2]['street'];
      $res[$key1]['contact'][$key2]['postcode'] = $res_contact[$key2]['postcode'];
      $res[$key1]['contact'][$key2]['phone'] = $res_contact[$key2]['phone'];
      $res[$key1]['contact'][$key2]['email'] = $res_contact[$key2]['email'];
    }
  }
}
// foreach ($res as $key1 => $value1) {
//   $res_project = $tb->get_JointResult('projects', 'projects_team', 'teams', $res[$key1]['id']);
//   // print_r ($res_project);
//   if ($res_project) {
//     foreach ($res_project as $key2 => $value2) {
//       $res[$key1]['project'][$key2]['project_id'] = $res_project[$key2]['project_id'];
//       $res[$key1]['project'][$key2]['title'] = $res_project[$key2]['title'];
//     }
//   }
// }
// foreach ($res as $key1 => $value1) {
//   $res_paper = $tb->get_JointResult('papers', 'papers_team', 'teams', $res[$key1]['id']);
//   // print_r ($res_paper);
//   if ($res_paper) {
//     foreach ($res_paper as $key2 => $value2) {
//       $res[$key1]['paper'][$key2]['paper_id'] = $res_paper[$key2]['paper_id'];
//       $res[$key1]['paper'][$key2]['title'] = $res_paper[$key2]['title'];
//     }
//   }
// }

$records_number  = sizeof($res);
  // print_r ($res);
  // echo "RECORDS number: ".$records_number;
$records_per_page = 3;

for ($i=0; $i < $records_number; $i++) {
    $res[$i]['about'] = html_entity_decode($res[$i]['about']);
    $res[$i]['about'] = str_replace('"','\"',$res[$i]['about']);
    // $res[$i]['description'] = html_entity_decode($res[$i]['description']);
    // $res[$i]['description'] = str_replace('"','\"',$res[$i]['description']);
}

if ($choosendb == "teams" && $records_number != 0) {
  $team = Projects("teams", $db, $res, $records_number, $records_per_page);
  // print_r ($team);
}  elseif ($choosendb == "admin" && $records_number != 0) {
  $records_per_page = $records_number;
  $team = Projects("teams",$db, $res, $records_number, $records_per_page);
} elseif ($choosendb != "teams" && $choosendb != "admin" || $records_number == 0) {
  $team ='{"teams":null}';
}

// ************* Contact ***************** //
if (isset($db)) {
  $tb = new Table();
  $res = $tb->get_ParentResult('authority', 'contacts');

  $cnt ='{"contact":['.json_encode($res).']}';
} else {
  $cnt ='{"contact":["No items found"]}';
}
// ************* Slides ***************** //
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
        $res1[$key1]['nameofdb']=$res[$key]['nameofdb'];
        $res1[$key1]['authority_id']=$res[$key]['authority_id'];
        // print_r ($res2);
      }
    $arr = array_merge($arr, $res1);
  }
  $sld ='{"slide":['.json_encode($arr).']}';
} else {
  $sld ='{"slide":["No items found"]}';
}

  $cmt = '{"comment":["No items found"]}';
}

// ************ Output ************** //
$outp = '{"items":['.$outp1.','.$proj.','.$papr.','.$team.','.$cnt.','.$outp3.','.$sld.','.$cmt.']}';

$db->disconnect();

echo ($outp);
// ************************** //
function Projects($dbname, $db, $res, $records_number, $records_per_page)
{
  $proj = "";
  $whole_pages = floor($records_number/$records_per_page);
  $last_page = $records_number-($whole_pages*$records_per_page);
  // echo "DBname: ".$dbname;
  // echo "Records per page: ".$records_per_page;
  // echo "records number: ".$records_number;
  // echo "whole: ".$whole_pages;
  // echo "last: ".$last_page;
  $pages = $whole_pages + $last_page;
  $page_projects = [];
  $c_page = 0;
  if ($last_page >= 0) {
    for ($l=0; $l <= $whole_pages-1; $l++) {
      for ($i=0; $i < $records_per_page; $i++) {
        $page_projects[$l][$i] = array_shift($res);
        if (isset($page_projects[$l][$i]['about'])) {
          $page_projects[$l][$i]['about'] = html_entity_decode($page_projects[$l][$i]['about']);
          $page_projects[$l][$i]['about'] = str_replace('"','\"',$page_projects[$l][$i]['about']);
        } elseif (isset($page_projects[$l][$i]['description'])) {
          $page_projects[$l][$i]['description'] = html_entity_decode($page_projects[$l][$i]['description']);
          $page_projects[$l][$i]['description'] = str_replace('"','\"',$page_projects[$l][$i]['description']);
        }
        switch ($dbname) {
          case 'projects':
            $db->select('photos','image',null,'project_id='.$page_projects[$l][$i]['id']);
            break;
          case 'papers':
            $db->select('photos','image',null,'paper_id='.$page_projects[$l][$i]['id']);
            break;
          case 'teams':
            $db->select('photos','image',null,'team_id='.$page_projects[$l][$i]['id']);
            break;
          // default:
          //   // code...
          //   break;
        }
        $photo = $db->getResult();
        if (isset($photo[0])) {
          $page_projects[$l][$i]['image'] = $photo[0]["image"];
        } else {
          $page_projects[$l][$i]['image'] = "temp.jpg";
        }
      }
    }
  }
  if ($last_page > 0) {
    for ($i=0; $i < $last_page; $i++) {
      $page_projects[$l][$i] = array_shift($res);
      switch ($dbname) {
        case 'projects':
          $db->select('photos','image',null,'project_id='.$page_projects[$l][$i]['id']);
          break;
        case 'papers':
          $db->select('photos','image',null,'paper_id='.$page_projects[$l][$i]['id']);
          break;
        case 'teams':
          $db->select('photos','image',null,'team_id='.$page_projects[$l][$i]['id']);
          break;
        // default:
        //   // code...
        //   break;
      }

      $photo = $db->getResult();
      if (isset($photo[0])) {
        $page_projects[$l][$i]['image'] = $photo[0]["image"];
      } else {
        $page_projects[$l][$i]['image'] = "temp.jpg";
      }
    }
  }

  switch ($dbname) {
    case 'projects':
      $proj = '{"projects":['.json_encode($page_projects).']}';
      break;
    case 'papers':
      $proj = '{"papers":['.json_encode($page_projects).']}';
      break;
    case 'teams':
      $proj = '{"teams":['.json_encode($page_projects).']}';
      break;
    // default:
    //   // code...
    //   break;
  }

  if (!isset($proj)) {
    switch ($dbname) {
      case 'projects':
        $proj ='{"projects":null}';
        break;
      case 'papers':
        $proj ='{"papers":null}';
        break;
      case 'teams':
        $proj ='{"teams":null}';
        break;
    }
  }

  return $proj;
}

?>
