<?php
// print_r ($_POST);
// str_replace("-dot-", ".", $_POST);
if ( $_POST ) {
    foreach ( $_POST as $key => $value ) {
        $key = str_replace("-dot-", ".", $key);
        $key = str_replace("-sqbl-", "[", $key);
        $postdata = json_decode($key);
    }

    // print_r ($postdata->rm);

    $em = $postdata->em;
    if (isset($postdata->un)) {
      $un = $postdata->un;
    } else {
      $un = $em;
    }

require '../vendor/autoload.php';
$db = new \PDO('mysql:dbname=1092877;host=localhost;charset=utf8mb4', '1092877', 'xP9tM715UK');
$auth = new \Delight\Auth\Auth($db);
$outp = "";
if (isset($postdata->rm)) {
  if ($postdata->rm == 2) {
    $callback = function ($selector, $token) use ($em, $un) {

       $sl = urlencode($selector);
       $tk = urlencode($token);
       $to = $em;
       $subject = "Confirmation for $un";
       $header = "Confirmation from";
       $message = "Please click the link below to verify and activate your account ";
       $message .= 'http://localhost/opp_php/#/verifyemail/'.$sl.'/'.$tk;
       $sentmail = mail($to,$subject,$message,$header);

       if($sentmail)
                {
       echo '{"sitems":[{"Info":"Your confirmation link has been sent to your e-mail address"}]}';
       }
       else
             {
       echo '{"sitems":[{"Error":"There was an error while sending to your email"}]}';
       }
     };
  } else {
    $callback = null;
  }
}

try {
    $auth->registerWithUniqueUsername($em, $postdata->ps, $un, $callback);
        if ($callback == null) {
          echo '{"sitems":[{"Info":"Your email has been registered"}]}';
        }
   }
    catch (\Delight\Auth\InvalidEmailException $e) {
      echo '{"sitems":[{"Error":"invalid email address"}]}';
    }
    catch (\Delight\Auth\InvalidPasswordException $e) {
      echo '{"sitems":[{"Error":"invalid password"}]}';
    }
    catch (\Delight\Auth\UserAlreadyExistsException $e) {
      echo '{"sitems":[{"Error":"email address already exists"}]}';
    }
    catch (\Delight\Auth\DuplicateUsernameException $e) {
      echo '{"sitems":[{"Error":"username already exists"}]}';
    }

}

  // $outp ='{"sitems":['.$outp.']}';
  // echo ($outp);

  // function myUrlEncode($string) {
  //     $entities = array('%21', '%2A', '%27', '%28', '%29', '%3B', '%3A', '%40', '%26', '%3D', '%2B', '%24', '%2C', '%2F', '%3F', '%25', '%23', '%5B', '%5D');
  //     $replacements = array('!', '*', "'", "(", ")", ";", ":", "@", "&", "=", "+", "$", ",", "/", "?", "%", "#", "[", "]");
  //     return str_replace($entities, $replacements, urlencode($string));
  // }

?>
