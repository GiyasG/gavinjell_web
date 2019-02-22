<!doctype html>
<html lang="en" ng-app="GJApp">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dr. Jell's Lab</title>

<link rel="stylesheet" href="css/bootstrap.css">
<link rel="stylesheet" href="css/main.css">
<!-- <link rel="stylesheet" href="css/styles.css"> -->
<script type="text/javascript" src="bower_components/tinymce/tinymce.js"></script>
<!-- <script type="text/javascript" src="bower_components/angular/angular.js"></script> -->
<script src="lib/angular.min.js"></script>
<script src="bower_components/angular-ui-tinymce/src/tinymce.js"></script>
<script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
<script src="lib/angular-ui-router.min.js"></script>
<script src="lib/ui-bootstrap-tpls-2.5.0.min.js"></script>
<!-- <script src="lib/ui-bootstrap-0.11.2.min.js"></script> -->
<script src="lib/ng-file-upload-shim.min.js"></script>
<script src="lib/ng-file-upload.min.js"></script>


<script src="lib/jquery.min.js"></script>
<script src="lib/bootstrap.min.js"></script>

<script src="src/gjapp.module.js"></script>
<script src="src/loading/loading.component.js"></script>
<script src="src/loading/loading.interceptor.js"></script>

<script src="src/data.module.js"></script>


<script src="src/data.service.js"></script>

<script src="src/tinymce.controller.js"></script>

<script src="src/home.controller.js"></script>
<script src="src/navbar.controller.js"></script>
<script src="src/modalinstance.controller.js"></script>

<script src="src/projects.component.js"></script>
<script src="src/projects.controller.js"></script>

<script src="src/papers.component.js"></script>
<script src="src/papers.controller.js"></script>

<script src="src/teams.component.js"></script>
<script src="src/teams.controller.js"></script>

<!-- <script src="src/contact.component.js"></script>
<script src="src/contact.controller.js"></script> -->

<!-- <script src="src/cart.component.js"></script>
<script src="src/cart.controller.js"></script>

<script src="src/checkout.component.js"></script>
<script src="src/checkout.controller.js"></script> -->

<script src="src/verify.component.js"></script>
<script src="src/verify.controller.js"></script>

<script src="src/changepassword.component.js"></script>
<script src="src/changepassword.controller.js"></script>

<script src="src/admin.component.js"></script>
<script src="src/admin.controller.js"></script>

<script src="src/project.component.js"></script>
<script src="src/project.controller.js"></script>

<script src="src/paper.component.js"></script>
<script src="src/paper.controller.js"></script>

<script src="src/team.component.js"></script>
<script src="src/team.controller.js"></script>

<script src="src/routes.js"></script>

<!-- <script src="lib/script.js"></script> -->

</head>
<body>
    <loading class="loading-indicator"></loading>

<div ui-view class="container">
  <div ui-view="navbar"></div>
  <div ui-view="content"></div>

  <!-- <div ui-view="basket"></div> -->
</div>
<footer class="navbar-inverse navbar-fixed-bottom">
  <div class="text-center">
    <p>Dr. Jell's Lab 2018 <span class="glyphicon glyphicon-copyright-mark"></span></p>
  </div>
</footer>

<script type="text/javascript">
$(document).on('click','.navbar-collapse.in',function(e) {
  if( $(e.target).is('a:not(".dropdown-toggle")') ) {
      $(this).collapse('hide');
  }
});
</script>

</body>
</html>
