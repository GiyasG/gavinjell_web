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
       echo $selector;
       $to = $em;
       $subject = "Confirmation for $em";
       $header = "Confirmation from";
       $message = "Please click the link below to verify and activate your account ";
       $message .= 'http://localhost/opp_php/#/verifyemail/'.$selector.'/'.$token;
       $sentmail = mail($to,$subject,$message,$header);

       if($sentmail)
                {
       echo '{"info":[{"ConfirmationStatus":"New email for confirmation sent", "isEmailConfirmed":true}]}';
       }
       else
             {
       echo '{"info":[{"ConfirmationStatus":"There was an error while sending the confirmation email", "isEmailConfirmed":false}]}';
       }
     };
  }

  try {
    $auth->resendConfirmationForEmail($postdata->em, $callback);
      }
      catch (\Delight\Auth\ConfirmationRequestNotFound $e) {
        $outp ='{"info":[{"ConfirmationStatus":"No earlier request found that could be re-sent", "isEmailConfirmed":false}]}';
      }
      catch (\Delight\Auth\TooManyRequestsException $e) {
        $outp ='{"info":[{"ConfirmationStatus":"There have been too many requests -- try again later", "isEmailConfirmed":false}]}';
      }
}


echo ($outp);
?>
