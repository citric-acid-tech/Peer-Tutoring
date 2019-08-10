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
	<title>CLE Peer Tutoring | <?= $company_name ?></title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

	<link rel="icon" type="image/x-icon" href="<?= asset_url('assets/img/favicon.ico') ?>" />

	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/bootstrap/css/bootstrap.min.css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/jquery-ui/jquery-ui.min.css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/jquery-qtip/jquery.qtip.min.css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/trumbowyg/ui/trumbowyg.min.css') ?>" />
	<!-- Add Font Awesome for icons -->
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/fontawesome/css/all.min.css') ?>" />

	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/css/general.css') ?>">

	<script src="<?= asset_url('assets/ext/jquery/jquery.min.js') ?>"></script>
	<script src="<?= asset_url('assets/ext/bootstrap/js/bootstrap.min.js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-ui/jquery-ui.min.js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-qtip/jquery.qtip.min.js') ?>"></script>
	<script src="<?= asset_url('assets/ext/datejs/date.js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-mousewheel/jquery.mousewheel.js') ?>"></script>
	<script src="<?= asset_url('assets/ext/trumbowyg/trumbowyg.min.js') ?>"></script>
	<!-- Add Font Awesome for icons -->
	<script type="text/javascript" src="<?= asset_url('assets/ext/fontawesome/js/all.min.js') ?>"></script>

	<script>
		// Global JavaScript Variables - Used in all backend pages.
		var availableLanguages = <?= json_encode($this->config->item('available_languages')) ?>;
		var EALang = <?= json_encode($this->lang->language) ?>;
	</script>
	
	<style>
		/* Styles of Home Header */
		#header {
			background-color: #296d97;
			border-bottom: 1px solid #4197cb;
			border-radius: 0;
			margin-bottom: 15px;
		}
		#header #header-logo {
			padding: 24px;
			padding-left: 40px;
			height: 100px;
		}
		#header #header-logo img {
			float: left;
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
	
	<style>
		/* Additional Styles */
		#branching_home {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		.platform {
			text-align: center;
		}
		.platform a {
			text-decoration: none;
			font-size: 36px;
			color: rgba(41, 109, 151, 0.6);
			font-weight: bold;
			font-family: Gill Sans, Gill Sans MT, Myriad Pro, DejaVu Sans Condensed, Helvetica, Arial," sans-serif", "微软雅黑";
			transition: color 0.2s;
		}
		.platform a:hover, .platform a:focus {
			color: rgba(41, 109, 151, 1.0);
		}
		
		.platform_icons {
			transition: transform 0.2s;
		}
		.platform a:hover .platform_icons, .platform a:focus .platform_icons {
			transform: rotateY(180deg);
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
				</div>
			</div>
		</div>
	</nav>
	<!-- End of Home Header -->
	
	
	<!-- CONTENTS -->
	<div id="branching_home" class="container">
		<div class="row">
			<div class="col-sm-4 platform">
				<a href= <?= site_url('backend') ?> >
					<div class="platform_icons">
						<i class="fas fa-user-cog fa-2x"></i>
					</div>
					<div class="platform_texts">
						<?= lang('home_selection_admin') ?>
					</div>
				</a>
			</div>
			<div class="col-sm-4 platform">
				<a href= <?= site_url('appointments') ?> >
					<div class="platform_icons">
						<i class="fas fa-user-edit fa-2x"></i>
					</div>
					<div class="platform_texts">
						<?= lang('home_selection_student') ?>
					</div>
				</a>
			</div>
			<div class="col-sm-4 platform">
				<a href= <?= site_url('backend') ?> >
					<div class="platform_icons">
						<i class="fas fa-chalkboard-teacher fa-2x"></i>
					</div>
					<div class="platform_texts">
						<?= lang('home_selection_tutor') ?>
					</div>
				</a>
			</div>
		</div>
	</div>
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
	
	<script>
		//	Language Selection
    	var GlobalVariables = {
    	    'csrfToken'             : <?= json_encode($this->security->get_csrf_hash()) ?>,
    	    'baseUrl'               : <?= json_encode($base_url) ?>
    	};
	</script>
	
	<script src="<?= asset_url('assets/js/backend.js') ?>"></script>
	<script src="<?= asset_url('assets/js/general_functions.js') ?>"></script>
</body>

</html>