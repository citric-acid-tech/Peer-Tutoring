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

	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/bootstrap/css/bootstrap.min.css', NULL, 'css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/jquery-ui/jquery-ui.min.css', NULL, 'css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/jquery-qtip/jquery.qtip.min.css', NULL, 'css') ?>" />
	<!-- Add Font Awesome for icons -->
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/fontawesome/css/all.min.css', NULL, 'css') ?>" />

	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/css/general.css', NULL, 'css') ?>">
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/css/welcome.css', NULL, 'css') ?>">

	<script src="<?= asset_url('assets/ext/jquery/jquery.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/bootstrap/js/bootstrap.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-ui/jquery-ui.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-qtip/jquery.qtip.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/datejs/date.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-mousewheel/jquery.mousewheel.js', NULL, 'js') ?>"></script>
	<!-- Add Font Awesome for icons -->
	<script type="text/javascript" src="<?= asset_url('assets/ext/fontawesome/js/all.min.js', NULL, 'js') ?>"></script>

	<script>
		// Global JavaScript Variables - Used in all backend pages.
		var availableLanguages = <?= json_encode($this->config->item('available_languages')) ?>;
		var EALang = <?= json_encode($this->lang->language) ?>;
	</script>
</head>

<body>

	<!-- Home Header -->
	<nav id="header" class="navbar">
		<div class="container-fluid">
			<div class="navbar-header">
				<div id="header-logo" class="navbar-brand">
					<a href="https://cle.sustech.edu.cn/" target="_blank">
						<img src="<?= base_url('assets/img/logo.png') ?>">
					</a>
				</div>
			</div>
		</div>
	</nav>
	<!-- End of Home Header -->
	
	
	<!-- CONTENTS -->
	<div id="branching_home" class="container">
		<div class="row">
			<div class="col-sm-4 platform" style="display: none;">
				<a href= <?= site_url('admin') ?> >
					<div class="platform_icons">
						<i class="fas fa-user-cog fa-2x"></i>
					</div>
					<div class="platform_texts">
						<?= lang('home_selection_admin') ?>
					</div>
				</a>
			</div>
			<div class="col-sm-6 platform">
				<a href= <?= site_url('students') ?> >
					<div class="platform_icons">
						<i class="fas fa-user-edit fa-2x"></i>
					</div>
					<div class="platform_texts">
						<?= lang('home_selection_student') ?>
					</div>
				</a>
			</div>
			<div class="col-sm-6 platform">
				<a href= <?= site_url('tutors') ?> >
					<div class="platform_icons">
						<i class="fas fa-chalkboard-teacher fa-2x"></i>
					</div>
					<div class="platform_texts">
						<?= lang('home_selection_tutor') ?>
					</div>
				</a>
			</div>
			<div class="col-sm-12 warning-txt">
				<?= lang('size_too_small') ?>
			</div>
		</div>
	</div>
	<!-- CONTENTS -->
	
	
	<!-- Home Footer -->
	<div id="footer">
		<div id="footer-content" class="col-xs-12 col-sm-12">
			<a href= <?= site_url('admin') ?> >
				<i class="fas fa-user-cog"></i>
				<?= lang('home_selection_admin') ?>
			</a>
			&nbsp;|&nbsp;
			<a href="https://cle.sustech.edu.cn/" target="_blank">
				CENTER FOR LANGUAGE EDUCATION
			</a>
			&nbsp;|&nbsp;
			<span id="select-language" class="label label-success sl_but">
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
	
	<script src="<?= asset_url('assets/js/backend.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/js/general_functions.js', NULL, 'js') ?>"></script>
</body>

</html>