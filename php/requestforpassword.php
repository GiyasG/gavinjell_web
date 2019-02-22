<?php

if ( $_POST ) {
    foreach ( $_POST as $key => $value ) {
        $key = str_replace("-dot-", ".", $key);
        $key = str_replace("-sqbl-", "[", $key);
        $postdata = json_decode($key);
    }
    // print_r ($postdata);

require '../vendor/autoload.php';

$db = new \PDO('mysql:dbname=1092877;host=localhost;charset=utf8mb4', '1092877', 'xP9tM715UK');
$auth = new \Delight\Auth\Auth($db);
$outp = "";
if (isset($postdata->em)) {
    $em = $postdata->em;
    $callback = function ($selector, $token) use ($em) {
       // echo $selector;
       $to = $em;
       $subject = "Confirmation for $em";
       $header = "Confirmation from";
       $message = "Please click the link below to verify and activate your account ";
       $message .= 'http://localhost/opp_php/#/changepassword/'.$selector.'/'.$token;
       $sentmail = mail($to,$subject,$message,$header);

       if($sentmail)
                {
       echo '{"info":[{"ConfirmationStatus":"Request has been generated. Check your email.", "isEmailConfirmed":true}]}';
       }
       else
             {
       echo '{"info":[{"ConfirmationStatus":"There was an error while sending the confirmation email", "isEmailConfirmed":false}]}';
       }
     };
  }

  try {
    $auth->forgotPassword($postdata->em, $callback);
      }
      catch (\Delight\Auth\InvalidEmailException $e) {
        $outp ='{"info":[{"ConfirmationStatus":"Invalid email address", "isEmailConfirmed":false}]}';
      }
      catch (\Delight\Auth\EmailNotVerifiedException $e) {
          $outp ='{"info":[{"ConfirmationStatus":"Email not verified", "isEmailConfirmed":false}]}';
      }
      catch (\Delight\Auth\ResetDisabledException $e) {
          $outp ='{"info":[{"ConfirmationStatus":"Password reset is disabled", "isEmailConfirmed":false}]}';
      }
      catch (\Delight\Auth\TooManyRequestsException $e) {
          $outp ='{"info":[{"ConfirmationStatus":"Too many requests", "isEmailConfirmed":false}]}';
      }
}


echo ($outp);
?>
