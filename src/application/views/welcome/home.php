<!DOCTYPE html>
<html lang="en">
<!--
这是整个网站的首页面，在这里，用户可以选择登陆三个客户端.
基本逻辑:
选择教师端->CAS认证->获得学生信息->是否是注册教师(peer tutor)? 进入页面 : 拒绝访问
选择学生端->CAS认证->获得学生信息->认证成功? 进入页面 : 拒绝访问
选择管理员->认证(账号密码?)->是否是管理员身份? 进入页面 : 拒绝访问
-->

<head>
	<title>
		<?= $company_name ?>| Easy!Appointments</title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

	<link rel="icon" type="image/x-icon" href="<?= asset_url('assets/img/favicon.ico') ?>">

	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/bootstrap/css/bootstrap.min.css') ?>">
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/jquery-ui/jquery-ui.min.css') ?>">
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/jquery-qtip/jquery.qtip.min.css') ?>">
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/trumbowyg/ui/trumbowyg.min.css') ?>">

	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/css/general.css') ?>">

	<script src="<?= asset_url('assets/ext/jquery/jquery.min.js') ?>"></script>
	<script src="<?= asset_url('assets/ext/bootstrap/js/bootstrap.min.js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-ui/jquery-ui.min.js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-qtip/jquery.qtip.min.js') ?>"></script>
	<script src="<?= asset_url('assets/ext/datejs/date.js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-mousewheel/jquery.mousewheel.js') ?>"></script>
	<script src="<?= asset_url('assets/ext/trumbowyg/trumbowyg.min.js') ?>"></script>

	<script>
		// Global JavaScript Variables - Used in all backend pages.
		var availableLanguages = <?= json_encode($this->config->item('available_languages')) ?>;
		var EALang = <?= json_encode($this->lang->language) ?>;
	</script>
	
	<style>
		/* Styles of Home Header */
		#header {
			background-color: #296d97;
			border-bottom: 4px solid #4197cb;
			box-shadow: none;
			border-radius: 0;
			margin-bottom: 15px;
		}
		#header #header-logo {
			padding: 6px;
		}
		#header #header-logo img {
			float: left;
			height: 50px;
			margin-right: 10px;
		}
	</style>
	
	<style>
		/* Styles of Home Footer */
		#footer {
			background-color: #f7f7f7;
			border-top: 1px solid #ddd;
			font-size: 11px;
			overflow: auto;
			text-align: center;
		}
		#footer #footer-content {
			padding: 10px 15px;
			display: inline-block;
			float: left;
			line-height: 2;
		}
	</style>
	
</head>

<body>

	<!-- Home Header -->
	<nav id="header" class="navbar">
		<div class="container-fluid">
			<div class="navbar-header">
				<div id="header-logo" class="navbar-brand">
					<img src="<?= base_url('assets/img/logo.png') ?>">
					<span>
						<?= $company_name ?>
					</span>
				</div>
			</div>
		</div>
	</nav>
	<!-- End of Home Header -->
	
	
	<!-- CONTENTS -->
	
	<!-- CONTENTS -->
	
	
	<!-- Home Footer -->
	<div id="footer">
		<div id="footer-content" class="col-xs-12 col-sm-12">
			<a href="https://cle.sustech.edu.cn/">CENTER FOR LANGUAGE EDUCATION</a>
			&nbsp;|&nbsp;
			<span id="select-language" class="label label-success">
        		<?= ucfirst($this->config->item('language')) ?>
        	</span>
		</div>
	</div>
	<!-- End of Home Footer -->
	
	<script src="<?= asset_url('assets/js/backend.js') ?>"></script>
	<script src="<?= asset_url('assets/js/general_functions.js') ?>"></script>
</body>

</html>