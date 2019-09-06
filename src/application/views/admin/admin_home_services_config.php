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
        timeFormat         : <?= json_encode($time_format) ?>,
		semester_json      : <?= $semester_json ?>,
		curLanguage        : <?= json_encode($language) ?>
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
				<?= lang('tutor') ?>
			</a>
		</li>
		<li role="presentation">
			<a href="#service_type_config" aria-controls="service_type_config" role="tab" data-toggle="tab">
				<?= lang('service_type') ?>
			</a>
		</li>
	</ul>   

	<div class="tab-content">
		<!-- Large Service Calendar -->
		<div role="tabpanel" class="tab-pane active" id="service-calendar">
			<!-- toolbar -->
			<div class="container calendar_upper_header" style="text-align:center;">
				<div class="col-xs-12">
					<h4 style="font-weight: bolder; font-family: Gill Sans, Gill Sans MT, Myriad Pro, DejaVu Sans Condensed, Helvetica, Arial,' sans-serif';color: rgb(41, 109, 151);padding: 10px 0;">
						<select id="calendar_semester" title="Semester" style="min-width:150px;"></select>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<select id="calendar_week_number" title="Week Number" style="min-width:150px;"></select>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<select id="calendar_tutor" title="Tutor" style="min-width:150px;"></select>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<input type="button" id="calendar_gotodate" class="btn btn-primary" value="Go to Date" title="Go to Date" style="font-weight: bolder;" />
					</h4>
				</div>
			</div>
			<!-- Guess what, a large calendar! -->
			<div id="admin-full-calendar"></div>
			<div class="popup">
				<div class="curtain"></div>
				<div id="cal_edit_popup">
					<form>
						<div class="popup-title"><h2>Edit Service</h2></div>
						<hr />
						<input id="edit_service_id" type="hidden" />
						<div class="popup-container">
							<select id="edit_service_service_type" title="Service Type *" style="height:28px;width:27%;"></select>
							&nbsp;&nbsp;
							<input id="edit_service_date" type="text" placeholder="Date *" title="Date *" style="height:28px;width:16%" readonly />
							&nbsp;<strong>-</strong>&nbsp;
							<input id="edit_service_st" type="time" style="width:18%;height:28px;" />
							<strong>~</strong>
							<input id="edit_service_et" type="time" style="width:18%;height:28px;" />
						</div>
						<div class="popup-container">
							<select id="edit_service_tutor" title="Tutor *" style="height:28px;width:42%;"></select>
							&nbsp;&nbsp;
							<input id="edit_service_appointed" type="text" title="Applied" style="height:28px;width:18%;text-align:right;" readonly />
							&nbsp;
							<strong>/</strong>
							&nbsp;
							<input id="edit_service_capacity" type="number" min="1" placeholder="Capacity *" title="Capacity *" style="height:28px;width:20%;" />
						</div>
						<div class="popup-container">
							<textarea id="edit_service_description" type="text" placeholder="Service Description" rows="3" title="Service Description" style="resize:none;"></textarea>
						</div>
						<div class="popup-container">
							<textarea id="edit_service_address" type="text" placeholder="Address *" rows="2" title="Address *" style="resize:none;"></textarea>
						</div>
						<hr />
						<!-- Buttons -->
						<div class="popup-container">
							<button id="popup_edit_delete" type="button" class="popup_buttons" value="Delete This Service" style="width:6%;background-color: rgba(255, 0, 0, 0.75);"><i class="fas fa-trash-alt"></i></button>
							<button id="popup_edit_confirm" type="button" class="popup_buttons" value="Confirm" style="width:40%;">Confirm</button>
							<button id="popup_edit_cancel" type="button" class="popup_buttons" value="Cancel" style="width:40%;">Cancel</button>
						</div>
					</form>
				</div>
				<div id="cal_add_popup">
					<form>
						<div class="popup-title"><h2>Add Service</h2></div>
						<hr />
						<div class="popup-container">
							<select id="add_service_service_type" title="Service Type *" style="height:28px;width:27%;"></select>
							&nbsp;&nbsp;
							<input id="add_service_date" type="text" placeholder="Date *" title="Date *" style="height:28px;width:16%" readonly />
							&nbsp;<strong>-</strong>&nbsp;
							<input id="add_service_st" type="time" style="width:18%;height:28px;" placeholder="Start *" title="Start *" />
							<strong>~</strong>
							<input id="add_service_et" type="time" style="width:18%;height:28px;" placeholder="End *" title="End *" />
						</div>
						<div class="popup-container">
							<select id="add_service_tutor" title="Tutor *" style="height:28px;width:42%;"></select>
							&nbsp;&nbsp;
							<input id="add_service_capacity" type="number" min="1" placeholder="Capacity *" title="Capacity *" style="height:28px;width:42%;" />
						</div>
						<div class="popup-container">
							<textarea id="add_service_description" type="text" placeholder="Service Description" rows="3" title="Service Description" style="resize:none;"></textarea>
						</div>
						<div class="popup-container">
							<textarea id="add_service_address" type="text" placeholder="Address *" rows="2" title="Address *" style="resize:none;"></textarea>
						</div>
						<hr />
						<!-- Buttons -->
						<div class="popup-container">
							<button id="popup_add_confirm" type="button" class="popup_buttons" value="Confirm" style="width:43%;">Confirm</button>
							<button id="popup_add_cancel" type="button" class="popup_buttons" value="Cancel" style="width:43%;">Cancel</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	
		<!-- Tutor Tab -->
		<div role="tabpanel" class="tab-pane fade" id="tutor_config">
			<br />
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
						<h3><i class="fas fa-chalkboard-teacher"></i>&nbsp;&nbsp;<?= lang('tutor') ?></h3>
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
								<button id="tutor-new-tutor" class="btn btn-info" title="New Tutor">
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
						<h3><i class="fas fa-info"></i>&nbsp;&nbsp;<?= lang('details') ?></h3>
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
			<div class="popup">
				<div class="curtain"></div>
				<div id="tutor_new_tutor_popup">
					<form>
						<div class="popup-title"><h2>New Tutor</h2></div>
						<hr />
						<div class="popup-container">
							<textarea id="pp" type="text" placeholder="Service Description" rows="3" title="Service Description" style="resize:none;"></textarea>
						</div>
						<hr />
						<!-- Buttons -->
						<div class="popup-container">
							<button id="popup_new_tutor_save" type="button" class="popup_buttons" value="Confirm" style="width:43%;">Save</button>
							<button id="popup_new_tutor_cancel" type="button" class="popup_buttons" value="Cancel" style="width:43%;">Cancel</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		
		<!-- Service Type Tab -->
		<div role="tabpanel" class="tab-pane fade" id="service_type_config">
			<br />
			<div class="container" style="width:90%;">
				<div class="wrapper row">
					<!-- filter service types -->
					<div class="col-xs-12 col-md-12 col-lg-4">
						<div class="form-group filter-box">
							<label class="control-label" for="service_type-service_type">Search for a service type</label>
							<input type="text" class="form-control" id="service_type-service_type" placeholder="Search for a service type" title="Search for a service type" autocomplete="off" />
							<span class="help-block">
								Type in the input box to find some service types you wish.
							</span>
						</div>
						<!-- results -->
						<h3><i class="fas fa-school"></i>&nbsp;&nbsp;<?= lang('service_type') ?></h3>
						<div class="results"></div>
					</div>
					
					<div class="col-xs-12 col-md-12 col-lg-1"><hr class="split-column-content"></div>
					
					<!-- Check and Edit service types -->
					<div class="col-xs-12 col-md-12 col-lg-7 service_type-details-form">
						<!-- Left Column -->
						<div class="col-xs-12 col-md-12 col-lg-6">
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
									<button id="service_type-new-service_type" class="btn btn-info" title="New Service Type">
										<i class="fas fa-plus"></i>
										&nbsp;
										New Service Type
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
							<h3><i class="fas fa-info"></i>&nbsp;&nbsp;<?= lang('details') ?></h3>
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
						<div class="col-xs-12 col-md-12 col-lg-6">
							<h3><i class="fas fa-chalkboard-teacher"></i>&nbsp;&nbsp;<?= lang('current_tutors_in_this_service_type') ?></h3>
							<hr />
							<div class="current_tutors_in_this_service_type"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="popup">
				<div class="curtain"></div>
				<div id="service_type_new_service_type_popup">
					<form>
						<div class="popup-title"><h2>New Service Type</h2></div>
						<hr />
						<div class="popup-container">
							<input id="new_service_type_name" type="text" placeholder="Name" title="Name" />
						</div>
						<div class="popup-container">
							<textarea id="new_service_type_description" placeholder="Description" rows="3" title="Description" style="resize:none;"></textarea>
						</div>
						<hr />
						<!-- Buttons -->
						<div class="popup-container">
							<button id="popup_new_service_type_save" type="button" class="popup_buttons" value="Confirm" style="width:43%;">Save</button>
							<button id="popup_new_service_type_cancel" type="button" class="popup_buttons" value="Cancel" style="width:43%;">Cancel</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
	
</div>
