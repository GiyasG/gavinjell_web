<?php

$sl = $_GET['selector'];
$tk = $_GET['token'];

require '../vendor/autoload.php';

if (isset($sl)) {
  $db = new \PDO('mysql:dbname=1092877;host=localhost;charset=utf8mb4', '1092877', 'xP9tM715UK');
  $auth = new \Delight\Auth\Auth($db);
  $outp = "";
  try {
      $auth->confirmEmail($sl, $tk);
      $outp ='{"info":[{"ConfirmationStatus":"Email confirmed. You may now login.", "isEmailConfirmed":true}]}';
    }
  catch (\Delight\Auth\InvalidSelectorTokenPairException $e) {
    $outp ='{"info":[{"ConfirmationStatus":"Invalid token", "isEmailConfirmed":false}]}';
  }
  catch (\Delight\Auth\TokenExpiredException $e) {
    $outp ='{"info":[{"ConfirmationStatus":"Token expired", "isEmailConfirmed":false}]}';
  }
  catch (\Delight\Auth\UserAlreadyExistsException $e) {
    $outp ='{"info":[{"ConfirmationStatus":"Email address already exists", "isEmailConfirmed":false}]}';
  }
  catch (\Delight\Auth\TooManyRequestsException $e) {
    $outp ='{"info":[{"ConfirmationStatus":"Too many requests", "isEmailConfirmed":false}]}';
  }

}
echo ($outp);
?>
