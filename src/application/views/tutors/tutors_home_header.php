<!DOCTYPE html>
<html lang="en">

<head>
	<title>CLE Peer Tutoring | <?= $company_name ?>	</title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

	<link rel="icon" type="image/x-icon" href="<?= asset_url('assets/img/favicon.ico') ?>" />

	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/bootstrap/css/bootstrap.min.css', NULL, 'css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/jquery-ui/jquery-ui.min.css', NULL, 'css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/jquery-qtip/jquery.qtip.min.css', NULL, 'css') ?>" />
	<!-- Add Font Awesome for icons -->
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/fontawesome/css/all.min.css', NULL, 'css') ?>" />
	<!-- Cropper -->
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/cropper/cropper.min.css', NULL, 'css') ?>" />

	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/css/general.css', NULL, 'css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/css/tutors.css', NULL, 'css') ?>" />

	<script src="<?= asset_url('assets/ext/jquery/jquery.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/bootstrap/js/bootstrap.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-ui/jquery-ui.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-qtip/jquery.qtip.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/datejs/date.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/moment/moment.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-mousewheel/jquery.mousewheel.js', NULL, 'js') ?>"></script>
	<!-- Add Font Awesome for icons -->
	<script type="text/javascript" src="<?= asset_url('assets/ext/fontawesome/js/all.min.js', NULL, 'js') ?>"></script>
	<!-- Validate -->
	<script type="text/javascript" src="<?= asset_url('assets/ext/validate/validate.min.js', NULL, 'js') ?>"></script>
	<!-- Cropper -->
	<script type="text/javascript" src="<?= asset_url('assets/ext/cropper/cropper.min.js', NULL, 'js') ?>"></script>

	<script>
		// Global JavaScript Variables - Used in all backend pages.
		var availableLanguages = <?= json_encode($this->config->item('available_languages')) ?>;
		var EALang = <?= json_encode($this->lang->language) ?>;
	</script>
</head>

<body>
	<nav id="header" class="navbar">
		<div class="container-fluid">
			<div class="navbar-header">
				<div id="header-logo" class="navbar-brand">
					<a href="<?= site_url() ?>">
						<img src="<?= base_url('assets/img/logo.png') ?>">
					</a>
				</div>

				<button class="navbar-toggle header-home" style="color: snow;" onClick="window.location.href = '<?= site_url() ?>';"><i class="fas fa-home fa-2x"></i></button>
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#header-menu" aria-expanded="false" aria-controls="navbar" onClick="Tutors.naviconGo(this);">
                	<span class="sr-only">Toggle navigation</span>
                	<span class="icon-bar bar1"></span>
                	<span class="icon-bar bar2"></span>
                	<span class="icon-bar bar3"></span>
            	</button>
			</div>

			<div id="header-menu" class="collapse navbar-collapse">
				<ul class="nav navbar-nav navbar-right">
					<?php $active = ($active_menu == PRIV_APPOINTMENTS_MANAGEMENT) ? 'active' : '' ?>
					<li class="<?= $active ?>">
						<a href="<?= site_url('tutors') ?>" class="menu-item" title="<?= lang('my_appointment_hint') ?>">
							<?= lang('appointments_management') ?>
						</a>
					</li>

					<?php $active = ($active_menu == PRIV_TUTORS_SETTINGS) ? 'active' : '' ?>
					<li class="<?= $active ?>">
						<a href="<?= site_url('tutors/settings') ?>" class="menu-item" title="<?= lang('settings_hint') ?>">
							<?= lang('settings') ?>
						</a>
					</li>

					<li>
						<a href="<?= site_url('user/logout') ?>" class="menu-item" title="<?= lang('log_out_hint') ?>">
							<?= lang('log_out') ?>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>

	<div id="notification" style="display: none;"></div>

	<div id="loading" style="display: none;">
		<div class="any-element animation is-loading">
			&nbsp;
		</div>
	</div>