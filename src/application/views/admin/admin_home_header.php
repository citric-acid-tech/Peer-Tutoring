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
	<!-- Full Calendar -->
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/fullcalendar/packages/core/main.min.css', NULL, 'css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/fullcalendar/packages/daygrid/main.min.css', NULL, 'css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/fullcalendar/packages/list/main.min.css', NULL, 'css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/fullcalendar/packages/timegrid/main.min.css', NULL, 'css') ?>" />
	<!-- Full Calendar: Interaction has no css -->
	<!-- Full Calendar: RRule has no css -->
	<!-- Full Calendar: Locale has no css -->
	<!-- Jquery DataTables -->
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/jquery-newdatatables/datatables.min.css', NULL, 'css') ?>" />
	<!-- Trumbowyg -->
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/trumbowyg/dist/ui/trumbowyg.min.css', NULL, 'css') ?>" />
	<!-- More Trumbowyg Plugins in the Future -->
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/trumbowyg/dist/plugins/colors/ui/trumbowyg.colors.min.css', NULL, 'css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/trumbowyg/dist/plugins/emoji/ui/trumbowyg.emoji.min.css', NULL, 'css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/trumbowyg/dist/plugins/table/ui/trumbowyg.table.min.css', NULL, 'css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/trumbowyg/dist/plugins/specialchars/ui/trumbowyg.specialchars.min.css', NULL, 'css') ?>" />
	<!-- Nice Select -->
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/niceselect/jquery-nice-select-1.1.0/css/nice-select.css', NULL, 'css') ?>" />
	
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/css/general.css', NULL, 'css') ?>" />
	<link rel="stylesheet" type="text/css" href="<?= asset_url('assets/css/admin.css', NULL, 'css') ?>" />

	<script src="<?= asset_url('assets/ext/jquery/jquery.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/bootstrap/js/bootstrap.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-ui/jquery-ui.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-qtip/jquery.qtip.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/moment/moment.min.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/datejs/date.js', NULL, 'js') ?>"></script>
	<script src="<?= asset_url('assets/ext/jquery-mousewheel/jquery.mousewheel.js', NULL, 'js') ?>"></script>
	<!-- Add Font Awesome for icons -->
	<script type="text/javascript" src="<?= asset_url('assets/ext/fontawesome/js/all.min.js', NULL, 'js') ?>"></script>
	<!-- Full Calendar -->
	<script type="text/javascript" src="<?= asset_url('assets/ext/fullcalendar/packages/core/main.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/fullcalendar/packages/daygrid/main.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/fullcalendar/packages/list/main.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/fullcalendar/packages/timegrid/main.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/fullcalendar/packages/interaction/main.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/fullcalendar/packages/rrule/main.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/fullcalendar/packages/core/locales-all.min.js', NULL, 'js') ?>"></script>
	<!-- Fuse.js -->
	<script type="text/javascript" src="<?= asset_url('assets/ext/fuse/Fuse-3.4.5/dist/fuse.js', NULL, 'js') ?>"></script>
	<!-- Jquery DataTables -->
	<script type="text/javascript" src="<?= asset_url('assets/ext/jquery-newdatatables/datatables.min.js', NULL, 'js') ?>"></script>
	<!-- Trumbowyg -->
	<script type="text/javascript" src="<?= asset_url('assets/ext/trumbowyg/dist/trumbowyg.min.js', NULL, 'js') ?>"></script>
	<!-- More Trumbowyg Plugins in the Future -->
	<script type="text/javascript" src="<?= asset_url('assets/ext/trumbowyg/dist/langs/zh_cn.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/trumbowyg/dist/plugins/colors/trumbowyg.colors.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/trumbowyg/dist/plugins/emoji/trumbowyg.emoji.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/trumbowyg/dist/plugins/fontfamily/trumbowyg.fontfamily.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/trumbowyg/dist/plugins/fontsize/trumbowyg.fontsize.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/trumbowyg/dist/plugins/history/trumbowyg.history.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/trumbowyg/dist/plugins/lineheight/trumbowyg.lineheight.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/trumbowyg/dist/plugins/table/trumbowyg.table.min.js', NULL, 'js') ?>"></script>
	<script type="text/javascript" src="<?= asset_url('assets/ext/trumbowyg/dist/plugins/specialchars/trumbowyg.specialchars.min.js', NULL, 'js') ?>"></script>
	<!-- Nice Select -->
	<script type="text/javascript" src="<?= asset_url('assets/ext/niceselect/jquery-nice-select-1.1.0/js/jquery.nice-select.min.js', NULL, 'js') ?>"></script>

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

				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#header-menu" aria-expanded="false" aria-controls="navbar" onClick="Admin.naviconGo(this);">
                	<span class="sr-only">Toggle navigation</span>
                	<span class="icon-bar bar1"></span>
                	<span class="icon-bar bar2"></span>
                	<span class="icon-bar bar3"></span>
            	</button>
			</div>

			<div id="header-menu" class="collapse navbar-collapse">
				<ul class="nav navbar-nav navbar-right">
					<?php $active = ($active_menu == PRIV_SERVICES_CONFIG) ? 'active' : '' ?>
					<li class="<?= $active ?>">
						<a href="<?= site_url('admin/services_config') ?>" class="menu-item" title="<?= lang('services_config_hint') ?>">
							<?= lang('services_configuration') ?>
						</a>
					</li>

                    <?php $active = ($active_menu == PRIV_ADMIN_APPOINTMENTS_MANAGEMENT) ? 'active' : '' ?>
					<li class="<?= $active ?>">
						<a href="<?= site_url('admin/appointments_management') ?>" class="menu-item" title="<?= lang('admin_appointments_management_hint') ?>">
							<?= lang('admin_appointments_management') ?>
						</a>
					</li>

					<?php $active = ($active_menu == PRIV_STATISTICS) ? 'active' : '' ?>
					<li class="<?= $active ?>">
						<a href="<?= site_url('admin/statistics') ?>" class="menu-item" title="<?= lang('statistics_hint') ?>">
							<?= lang('statistics') ?>
						</a>
					</li>

                    <?php $active = ($active_menu == PRIV_ADMIN_SETTINGS) ? 'active' : '' ?>
					<li class="<?= $active ?>">
						<a href="<?= site_url('admin/admin_settings') ?>" class="menu-item" title="<?= lang('admin_settings_hint') ?>">
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