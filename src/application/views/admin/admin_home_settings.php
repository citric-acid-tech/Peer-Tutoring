<script src="<?= asset_url('assets/js/admin_settings_helper_common.js') ?>"></script>
<script src="<?= asset_url('assets/js/admin_settings_helper_semester.js') ?>"></script>
<script src="<?= asset_url('assets/js/admin_settings_helper_email.js') ?>"></script>
<script src="<?= asset_url('assets/js/admin_settings_helper_survey.js') ?>"></script>
<script src="<?= asset_url('assets/js/admin_settings.js') ?>"></script>
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
		//	Scan settings to initialize
		AdminSettings.initialize(true);
    });
</script>

<div id="admin-settings-page" class="container-fluid admin-page">

	<ul class="nav nav-tabs" role="tablist">
		<li role="presentation" class="active">
			<a href="#common_settings" aria-controls="common_settings" role="tab" data-toggle="tab">
				Common Settings
			</a>
		</li>
		<li role="presentation">
			<a href="#semester_information" aria-controls="semester_information" role="tab" data-toggle="tab">
				Semester Information
			</a>
		</li>
		<li role="presentation">
			<a href="#email_configurations" aria-controls="email_configurations" role="tab" data-toggle="tab">
				Email Configurations
			</a>
		</li>
		<li role="presentation">
			<a href="#survey_configurations" aria-controls="survey_configurations" role="tab" data-toggle="tab">
				Survey Configurations
			</a>
		</li>
	</ul>

	<div class="tab-content">
		<!-- Common Settings -->
		<div role="tabpanel" class="tab-pane active" id="common_settings">
			<div class="container" style="width:90%;">
				<div class="wrapper row">
					<div class="col-xs-12">
						<h3 style="margin-bottom:0;">Common Settings</h3>
					</div>
				</div>
				<hr />
				
				<div class="wrapper row">
					<div class="col-xs-12 col-lg-3">
						<div class="form-group">
							<label class="control-label" for="date_format">Date Format</label>
							<input id="date_format" data-field="date_format" class="form-control text-field" title="Date Format" readonly />
							<span class="help-block">
								You can see which date format the system is currently using.
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<label class="control-label" for="time_format">Time Format</label>
							<input id="time_format" data-field="time_format" class="form-control text-field" title="Time Format" readonly />
							<span class="help-block">
								You can see which time format the system is currently using.
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<label class="control-label" for="flexible_column" style="color:rgba(41,109,151,1.0);font-size:16px;"><?= lang('flexible_column') ?></label>
							<input id="flexible_column" type="text" data-field="flexible_column" class="form-control text-field" title="<?= lang('flexible_column') ?>" />
							<span class="help-block">
								You can specify a column data for the tutors.
							</span>
						</div>
					</div>
					
					<div class="col-xs-12 col-lg-1"></div>
					
					<div class="col-xs-12 col-lg-3">
						<div class="form-group">
							<label class="control-label" for="school_name">School Name</label>
							<input id="school_name" type="text" data-field="school_name" class="form-control text-field" title="School Name" />
							<span class="help-block">
								Provide the name of the school.
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<label class="control-label" for="school_email">School Email</label>
							<input id="school_email" type="email" data-field="school_email" class="form-control text-field" title="School Email" />
							<span class="help-block">
								Provide an official email of the school.
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<label class="control-label" for="school_link">School Link</label>
							<input id="school_link" type="url" data-field="school_link" class="form-control text-field" title="School Link" />
							<span class="help-block">
								Provide a link to the main page of the school.
							</span>
						</div>
					</div>
					
					<div class="col-xs-12 col-lg-1"></div>
					
					<div class="col-xs-12 col-lg-4">
						<div class="form-group">
							<label class="control-label" for="max_services_checking_ahead_day">Max Services Checking Ahead Value (day)</label>
							<input id="max_services_checking_ahead_day" type="number" data-field="max_services_checking_ahead_day" class="form-control text-field" title="Max Services Checking Ahead Value(day)" />
							<span class="help-block">
								Define at most how many days in advance the students can check the services.
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<label class="control-label" for="max_appointment_cancel_ahead_day">Max Appointment Cancel Ahead Value (day)</label>
							<input id="max_appointment_cancel_ahead_day" type="number" data-field="max_appointment_cancel_ahead_day" class="form-control text-field" title="Max Appointment Cancel Ahead Value(day)" />
							<span class="help-block">
								Define at most how many days in advance the students can cancel their pre-applied appointments.
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<label class="control-label" for="upload_file_max_size">Upload File Max Size (KB)</label>
							<input id="upload_file_max_size" type="number" data-field="upload_file_max_size" class="form-control text-field" title="Upload File Max Size(KB)" />
							<span class="help-block">
								Define a maximal size value for an uploaded file.
							</span>
						</div>
					</div>
				</div>
				<hr />
				
				<div class="wrapper row">
					<div class="col-xs-12">
						<div class="btn-toolbar">
							<!-- Initial Group -->
							<div class="btn-group">
								<button id="common_edit" class="btn btn-primary" title="<?= lang('edit') ?>">
									<i class="fas fa-edit"></i>
									&nbsp;
									<?= lang('edit') ?>
								</button>
							</div>
							<div class="btn-group">
								<button id="go_to_school_page" class="btn btn-default" title="Go to personal page">
									<i class="fas fa-home"></i>
									&nbsp;
									Go to personal page
								</button>
							</div>
							
							<!-- Editing Group -->
							<div class="btn-group">
								<button id="common_save" class="btn btn-primary" title="<?= lang('save') ?>">
									<i class="fas fa-save"></i>
									&nbsp;
									<?= lang('save') ?>
								</button>
							</div>
							<div class="btn-group">
								<button id="common_cancel" class="btn btn-default" title="<?= lang('cancel') ?>">
									<i class="fas fa-times"></i>
									&nbsp;
									<?= lang('cancel') ?>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Semester Information -->
		<div role="tabpanel" class="tab-pane fade" id="semester_information">
			<div class="container" style="width:90%;">			
				<div class="wrapper row">
					<div class="col-xs-12 col-sm-5">
						<h3 style="margin-bottom:0;">Semester Information</h3>
					</div>
					<div class="col-xs-12 col-lg-7">
						<div class="btn-toolbar" style="margin-top:23px;">
							<!-- Initial Group -->
							<div class="btn-group">
								<button id="add_row" class="btn btn-primary" title="Add">
									<i class="fas fa-plus"></i>
								</button>
							</div>
							<div class="btn-group">
								<button id="delete_row" class="btn btn-default" title="Delete">
									<i class="fas fa-minus"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
				<br />
			</div>
		</div>
		
		<!-- Email Configurations -->
		<div role="tabpanel" class="tab-pane fade" id="email_configurations">
			<div class="container" style="width:90%;">			
				<div class="wrapper row">
					<div class="col-xs-12 col-sm-5">
						<h3 style="margin-bottom:0;">Email Configurations</h3>
					</div>
					<div class="col-xs-12 col-lg-7">
						<div class="btn-toolbar" style="margin-top:23px;">
							<!-- Initial Group -->
							<div class="btn-group">
								<button id="add_row" class="btn btn-primary" title="Add">
									<i class="fas fa-plus"></i>
								</button>
							</div>
							<div class="btn-group">
								<button id="delete_row" class="btn btn-default" title="Delete">
									<i class="fas fa-minus"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
				<br />
			</div>
		</div>
		
		<!-- Survey Configurations -->
		<div role="tabpanel" class="tab-pane fade" id="survey_configurations">
			<div class="container" style="width:90%;">			
				<div class="wrapper row">
					<div class="col-xs-12 col-sm-5">
						<h3 style="margin-bottom:0;">Survey Configurations</h3>
					</div>
					<div class="col-xs-12 col-lg-7">
						<div class="btn-toolbar" style="margin-top:23px;">
							<!-- Initial Group -->
							<div class="btn-group">
								<button id="add_row" class="btn btn-primary" title="Add">
									<i class="fas fa-plus"></i>
								</button>
							</div>
							<div class="btn-group">
								<button id="delete_row" class="btn btn-default" title="Delete">
									<i class="fas fa-minus"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
				<br />
			</div>
		</div>	
	</div>
</div>