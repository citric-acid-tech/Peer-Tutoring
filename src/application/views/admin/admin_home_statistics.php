<script src="<?= asset_url('assets/js/admin_statistics_helper.js') ?>"></script>
<script src="<?= asset_url('assets/js/admin_statistics.js') ?>"></script>
<script>
	//	csrfToken is for safety, a random hash value --> hard-to-guess string, to protect a form
	//	baseUrl is a constant of your base address, which is set in the external config.php
	//	availableProviders owns a list of available tutors -->         availableProviders : < ?= json_encode($available_providers) ?>,
	//	availableServices owns a list of available services -->         availableServices  : < ?= json_encode($available_services) ?>,
	//	secretaryProviders : seems unnecessary --> secretaryProviders : < ?= json_encode($secretary_providers) ?>,
	//	dateFormat retrieves the date format stored in database: currently "DMY" - will be used in helper & general javsscript file
	//	timeFormat retrieves the time format stored in database: currently "regular" - will be used in general javascript file
	//	customers seem not needed here --> customers          : < ?= json_encode($customers) ?>,
	//	user is mainly used in backend, seem not necessary here --> 
	//  user               : {
	//      id         : < ?= $user_id ?>,
	//      email      : < ?= json_encode($user_email) ?>,
	//      role_slug  : < ?= json_encode($role_slug) ?>,
	//      privileges : < ?= json_encode($privileges) ?>
	//  }
    var GlobalVariables = {
        csrfToken          : <?= json_encode($this->security->get_csrf_hash()) ?>,
		baseUrl            : <?= json_encode($base_url) ?>,
        dateFormat         : <?= json_encode($date_format) ?>,
        timeFormat         : <?= json_encode($time_format) ?>
    };

    $(document).ready(function() {
		AdminStatistics.initialize(true);
    });
</script>

<div id="settings-page" class="container-fluid admin-page">
    <div class="row" style="margin:auto;">
    	<div class="container">
    		<div style="text-align:center;">
    			<input id="start_date" class="btn btn-primary" value="<?= lang('start_date') ?>" type="button" title="<?= lang('start_date') ?>" style="margin:10px;width:100px;height:50px;" readonly />
    			<button id="clear_dates" class="btn btn-default" type="button" title="<?= lang('clear_dates') ?>" style="margin:10px;width:50px;height:50px;"><i class="fas fa-minus fa-lg"></i></button>
    			<input id="end_date" class="btn btn-primary" value="<?= lang('end_date') ?>" type="button" title="<?= lang('end_date') ?>" style="margin:10px;width:100px;height:50px;" readonly />
    		</div>
    	</div>
		<table id="service_statistics" class="table">
			<thead>
				<tr>
					<th>#</th>
					<th><?= lang('service_type') ?></th>
					<th><?= lang('bs0') ?></th>
					<th><?= lang('bs1') ?></th>
					<th><?= lang('bs2') ?></th>
					<th><?= lang('bs3') ?></th>
				</tr>
			</thead>
			<tfoot>
				<tr><td colspan="6"><strong><?= lang('ad_set_stat_former_half_hint') ?><a href="mailto:11710116@mail.sustech.edu.cn"><?= lang('contact_us') ?></a></strong></td></tr>
			</tfoot>
			<tbody></tbody>
		</table>
    </div>
</div>