<?php
// print_r ($_POST);
// str_replace("-dot-", ".", $_POST);
if ( $_POST ) {
    foreach ( $_POST as $key => $value ) {
        $key = str_replace("-dot-", ".", $key);
        $key = str_replace("-sqbl-", "[", $key);
        $postdata = json_decode($key);
    }

    // print_r($postdata->un);

require '../vendor/autoload.php';
$db = new \PDO('mysql:dbname=1092877;host=localhost;charset=utf8mb4', '1092877', 'xP9tM715UK');
$auth = new \Delight\Auth\Auth($db);
$outp = "";
if (isset($postdata->ps)) {

try {
    $auth->resetPassword($postdata->sl, $postdata->tk, $postdata->ps);
    echo '{"info":[{"ConfirmationStatus":"Password has been changed", "isEmailConfirmed":true}]}';
   }
   catch (\Delight\Auth\InvalidSelectorTokenPairException $e) {
    echo '{"info":[{"ConfirmationStatus":"invalid token", "isEmailConfirmed":false}]}';
   }
   catch (\Delight\Auth\TokenExpiredException $e) {
     echo '{"info":[{"ConfirmationStatus":"token expired", "isEmailConfirmed":false}]}';
   }
   catch (\Delight\Auth\ResetDisabledException $e) {
     echo '{"info":[{"ConfirmationStatus":"password reset is disabled", "isEmailConfirmed":false}]}';
   }
   catch (\Delight\Auth\InvalidPasswordException $e) {
     echo '{"info":[{"ConfirmationStatus":"invalid password", "isEmailConfirmed":false}]}';
   }
   catch (\Delight\Auth\TooManyRequestsException $e) {
     echo '{"info":[{"ConfirmationStatus":"too many requests", "isEmailConfirmed":false}]}';
   }

 }
}
?>
