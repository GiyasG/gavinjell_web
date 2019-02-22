<?php
require '../vendor/autoload.php';
$db = new \PDO('mysql:dbname=1092877;host=localhost;charset=utf8mb4', '1092877', 'xP9tM715UK');
// or
// $db = new \PDO('sqlite:../Databases/php_auth.sqlite');

$auth = new \Delight\Auth\Auth($db);

// $result = \processRequestData($auth);

$outp = "";

if ($outp != "") {$outp .= ",";}
// $outp .= '{"LastOperation":"'.$result).'",';
$outp .= '{"SessionID":"'.\session_id().'",';
$outp .= '"isLoggedIn":"'.$auth->isLoggedIn().'",';
$outp .= '"AuthCheck":"'.$auth->check().'",';
$outp .= '"getUserId":"'.$auth->getUserId().'",';
$outp .= '"AuthId":"'.$auth->id().'",';
$outp .= '"getEmail":"'.$auth->getEmail().'",';
$outp .= '"getUsername":"'.$auth->getUsername().'",';
$outp .= '"getStatus":"'.$auth->getStatus().'",';
$outp .= '"SupermModerator":"'.$auth->hasRole(\Delight\Auth\Role::SUPER_MODERATOR)).'",';
$outp .= '"isRemembered":"'.$auth->isRemembered().'",';
$outp .= '"getIpAddress":"'.$auth->getIpAddress().'",';
$outp .= '"createCookieName":"'.\Delight\Auth\Auth::createCookieName('session').'",';
$outp .= '"createRandomString":"'.\Delight\Auth\Auth::createRandomString()).'",';
$outp .= '"Auth::createUuid()":"'.\Delight\Auth\Auth::createUuid().'"}';


$outp ='{"litems":['.$outp.']}';
echo ($outp);
?>
