<?php
// print_r ($_POST);
// str_replace("-dot-", ".", $_POST);
if ( $_POST ) {
    foreach ( $_POST as $key => $value ) {
        $key = str_replace("-dot-", ".", $key);
        $key = str_replace("-sqbl-", "[", $key);
        $postdata = json_decode($key);
    }

}

require '../vendor/autoload.php';
$db = new \PDO('mysql:dbname=1092877;host=localhost;charset=utf8mb4', '1092877', 'xP9tM715UK');
// or
// $db = new \PDO('sqlite:../Databases/php_auth.sqlite');

$auth = new \Delight\Auth\Auth($db);

// $result = \processRequestData($auth);

$outp = "";

if (isset($postdata->rm)) {
  if ($postdata->rm == "1") {
    // keep logged in for one year
    $rememberDuration = (int) (60 * 60 * 24 * 31);
  }
  else {
    // do not keep logged in after session ends
    $rememberDuration = null;
  }

try {
    $auth->login($postdata->em, $postdata->ps, $rememberDuration);
    $outp .= '{"SessionID":"'.\session_id().'",';
    $outp .= '"isLoggedIn":"'.$auth->isLoggedIn().'",';
    // $outp .= '"AuthCheck":"'.$auth->check().'",';
    $outp .= '"getUserId":"'.$auth->getUserId().'",';
    // $outp .= '"AuthId":"'.$auth->id().'",';
    $outp .= '"getEmail":"'.$auth->getEmail().'",';
    $outp .= '"getUsername":"'.$auth->getUsername().'",';
    // $outp .= '"getStatus":"'.$auth->getStatus().'",';
    $outp .= '"Admin":"'.$auth->hasRole(\Delight\Auth\Role::ADMIN).'",';
    $outp .= '"isRemembered":"'.$auth->isRemembered().'",';
    $outp .= '"getIpAddress":"'.$auth->getIpAddress().'"}';
    // $outp .= '"createCookieName":"'.\Delight\Auth\Auth::createCookieName('session').'",';
    // $outp .= '"createRandomString":"'.\Delight\Auth\Auth::createRandomString().'",';
    // $outp .= '"Auth::createUuid()":"'.\Delight\Auth\Auth::createUuid().'"}';
}
catch (\Delight\Auth\InvalidEmailException $e) {
    $outp ='{"Error":"Wrong email address"}';
    // die('Wrong email address');
}
catch (\Delight\Auth\InvalidPasswordException $e) {
    $outp ='{"Error":"Wrong password"}';
    // die('Wrong password');
}
catch (\Delight\Auth\EmailNotVerifiedException $e) {
    $outp ='{"Error":"Email not verified"}';
    // die('Email not verified');
}
catch (\Delight\Auth\TooManyRequestsException $e) {
    $outp ='{"Error":"Too many requests"}';
    // die('Too many requests');
}
}

  $outp ='{"isloggedin":['.$outp.']}';
  echo ($outp);
?>
