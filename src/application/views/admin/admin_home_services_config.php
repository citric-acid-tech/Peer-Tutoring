<script src="<?= asset_url('assets/js/admin-service_config_service_type_helper.js') ?>"></script>
<script src="<?= asset_url('assets/js/admin-service_config_tutor_helper.js') ?>"></script>
<script src="<?= asset_url('assets/js/admin-service_config_service_calendar_helper.js') ?>"></script>
<script src="<?= asset_url('assets/js/admin-service_config.js') ?>"></script>
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
		AdminServiceConfig.initialize(true);
    });
</script>

<div id="services-page" class="container-fluid admin-page">

	<ul class="nav nav-tabs" role="tablist">
		<li role="presentation" class="active">
			<a href="#service-calendar" aria-controls="service-calendar" role="tab" data-toggle="tab">
				<?= lang('calendar') ?>
			</a>
		</li>
		<li role="presentation">
			<a href="#tutor_config" aria-controls="tutor_config" role="tab" data-toggle="tab">
				<?= lang('select_by_tutor_tab') ?>
			</a>
		</li>
		<li role="presentation">
			<a href="#service_type_config" aria-controls="service_type_config" role="tab" data-toggle="tab">
				<?= lang('select_by_time_tab') ?>
			</a>
		</li>
	</ul>   

	<div class="tab-content">
		<!-- Check Available Time in Calendar Tab -->
		<div role="tabpanel" class="tab-pane active" id="service-calendar">
			<!-- toolbar -->
			<div class="btn-toolbar calendar-btns">
				<div class="btn-group">
					<button id="create_event" class="btn btn-primary" title="Create an Event">Create an Event</button>
				</div>
			</div>
			<!-- Guess what, a large calendar! -->
			<div id="admin-full-calendar"></div>
		</div>
	
		<!-- Select by Tutor Tab -->
		<div role="tabpanel" class="tab-pane" id="tutor_config">
			<div class="container">
				<div class="wrapper row">
					<!-- filter tutors -->
					<div class="col-xs-12 col-sm-4">
						<div class="form-group filter-box">
							<label class="control-label" for="tutor-name">Search for a Tutor</label>
							<input type="text" class="form-control" id="tutor-name" placeholder="Search for a tutor" title="Search for a tutor" autocomplete="off" />
							<span class="help-block">
								Type in the input box to find some tutors you wish.
							</span>
						</div>
						<!-- results -->
						<h3><?= lang('tutor') ?></h3>
						<div class="results"></div>
					</div>
					
					<div class="col-xs-12 col-sm-1"><hr class="split-column-content"></div>
					
					<!-- Check and Edit tutors -->
					<div class="col-xs-12 col-sm-7 tutor-details-form">
						<div class="btn-toolbar">
							<!-- Initial Group -->
							<div class="btn-group">
								<button id="tutor-edit" class="btn btn-primary" title="<?= lang('edit') ?>">
									<i class="fas fa-edit"></i>
									&nbsp;
									<?= lang('edit') ?>
								</button>
							</div>
							<div class="btn-group">
								<button id="tutor-new-tutor" class="btn btn-primary" title="New Tutor">
									<i class="fas fa-plus"></i>
									&nbsp;
									New Tutor
								</button>
							</div>
							<!-- Editing Group -->
							<div class="btn-group">
								<button id="tutor-save" class="btn btn-primary" title="<?= lang('save') ?>">
									<i class="fas fa-save"></i>
									&nbsp;
									<?= lang('save') ?>
								</button>
							</div>
							<div class="btn-group">
								<button id="tutor-cancel" class="btn btn-default" title="<?= lang('cancel') ?>">
									<i class="fas fa-times"></i>
									&nbsp;
									<?= lang('cancel') ?>
								</button>
							</div>
						</div>
						<h3><?= lang('details') ?></h3>
						<!-- Left Column -->
						<div class="col-xs-12 col-sm-12 col-md-6">
							<div class="form-group">
							    <label class="control-label" for="tutor-id">Tutor ID</label>
							    <input id="tutor-id" class="form-control" readonly>
							</div>
							<div class="form-group">
							    <label class="control-label" for="first-name"><?= lang('first_name') ?></label>
							    <input id="first-name" class="form-control" readonly>
							</div>
							<div class="form-group">
							    <label class="control-label" for="last-name"><?= lang('last_name') ?></label>
							    <input id="last-name" class="form-control" readonly>
							</div>
							<div class="form-group">
							    <label class="control-label" for="phone-number"><?= lang('phone_number') ?></label>
							    <input id="phone-number" class="form-control" readonly>
							</div>
							<div class="form-group">
							    <label class="control-label" for="address"><?= lang('address') ?></label>
							    <textarea id="address" class="form-control" rows="2" style="resize:none;" readonly></textarea>
							</div>
						</div>
						<!-- Right Column -->
						<div class="col-xs-12 col-sm-12 col-md-6">
							<div class="form-group">
							    <label class="control-label" for="email"><?= lang('email') ?></label>
							    <input id="email" class="form-control" readonly>
							</div>
							<div class="form-group">
							    <label class="control-label" for="personal-page"><?= lang('personal_page') ?></label>
							    <input id="personal-page" class="form-control" readonly>
							</div>
							<div class="form-group">
							    <label class="control-label" for="introduction"><?= lang('introduction') ?></label>
							    <textarea id="introduction" class="form-control" rows="5" style="resize:none;" readonly></textarea>
							</div>
							<div class="form-group">
							    <label class="control-label" for="flexible-column" style="color:rgba(41,109,151,1.0);font-size:16px;"><?= lang('flexible_column') ?></label>
							    <input id="flexible-column" class="form-control" readonly>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Select by Time Tab -->
		<div role="tabpanel" class="tab-pane" id="service_type_config">
			<div class="container">
				<div class="wrapper row">
					<!-- filter service types -->
					<div class="col-xs-12 col-sm-4">
						<div class="form-group filter-box">
							<label class="control-label" for="service_type-service_type">Search for a service type</label>
							<input type="text" class="form-control" id="service_type-service_type" placeholder="Search for a service type" title="Search for a service type" autocomplete="off" />
							<span class="help-block">
								Type in the input box to find some service types you wish.
							</span>
						</div>
						<!-- results -->
						<h3><?= lang('service_type') ?></h3>
						<div class="results"></div>
					</div>
					
					<div class="col-xs-12 col-sm-1"><hr class="split-column-content"></div>
					
					<!-- Check and Edit service types -->
					<div class="col-xs-12 col-sm-7 service_type-details-form">
						<!-- Left Column -->
						<div class="col-xs-12 col-sm-12 col-md-6">
							<div class="btn-toolbar">
								<!-- Initial Group -->
								<div class="btn-group">
									<button id="service_type-edit" class="btn btn-primary" title="<?= lang('edit') ?>">
										<i class="fas fa-edit"></i>
										&nbsp;
										<?= lang('edit') ?>
									</button>
								</div>
								<div class="btn-group">
									<button id="service_type-new-service_type" class="btn btn-primary" title="New Tutor">
										<i class="fas fa-plus"></i>
										&nbsp;
										New Tutor
									</button>
								</div>
								<!-- Editing Group -->
								<div class="btn-group">
									<button id="service_type-save" class="btn btn-primary" title="<?= lang('save') ?>">
										<i class="fas fa-save"></i>
										&nbsp;
										<?= lang('save') ?>
									</button>
								</div>
								<div class="btn-group">
									<button id="service_type-cancel" class="btn btn-default" title="<?= lang('cancel') ?>">
										<i class="fas fa-times"></i>
										&nbsp;
										<?= lang('cancel') ?>
									</button>
								</div>
							</div>
							<h3><?= lang('details') ?></h3>
							<div class="form-group">
							    <label class="control-label" for="service_type-id">Service ID</label>
							    <input id="service_type-id" class="form-control" readonly>
							</div>
							<div class="form-group">
							    <label class="control-label" for="service_type-name"><?= lang('name') ?></label>
							    <input id="service_type-name" class="form-control" readonly>
							</div>
							<div class="form-group">
							    <label class="control-label" for="service_type-description"><?= lang('description') ?></label>
							    <textarea id="service_type-description" class="form-control" style="resize: none;" rows="3" readonly></textarea>
							</div>
						</div>
						<!-- Right Column -->
						<div class="col-xs-12 col-sm-12 col-md-6">
							<h3><?= lang('current_tutors_in_this_service_type') ?></h3>
							<hr />
							<div class="current_tutors_in_this_service_type"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
</div>
