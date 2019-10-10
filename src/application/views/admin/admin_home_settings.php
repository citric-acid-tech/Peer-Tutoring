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
        timeFormat         : <?= json_encode($time_format) ?>,
		semester_json      : <?= $semester_json ?>,
		curLanguage        : <?= json_encode($language) ?>
    };

    $(document).ready(function() {
		//	Scan settings to initialize
		AdminSettings.initialize(true);
    });
</script>

<div id="admin-settings-page" class="container-fluid admin-page">

	<ul id="settings_main_navtab" class="nav nav-tabs" role="tablist">
		<li role="presentation" class="active">
			<a href="#common_settings" aria-controls="common_settings" role="tab" data-toggle="tab">
				<?= lang('common_settings') ?>
			</a>
		</li>
		<li role="presentation">
			<a href="#semester_information" aria-controls="semester_information" role="tab" data-toggle="tab">
				<?= lang('semester_information') ?>
			</a>
		</li>
		<li role="presentation">
			<a href="#email_configurations" aria-controls="email_configurations" role="tab" data-toggle="tab">
				<?= lang('email_configurations') ?>
			</a>
		</li>
		<li role="presentation" class="currently-not-needed">
			<a href="#survey_configurations" aria-controls="survey_configurations" role="tab" data-toggle="tab">
				<?= lang('survey_configurations') ?>
			</a>
		</li>
	</ul>

	<div class="tab-content">
		<!-- Common Settings -->
		<div role="tabpanel" class="tab-pane active" id="common_settings">
			<div class="container" style="width:90%;">
				<div class="wrapper row">
					<div class="col-xs-12">
						<h3 style="margin-bottom:0;"><?= lang('common_settings') ?></h3>
					</div>
				</div>
				<hr />
				
				<div class="wrapper row">
					<div class="col-xs-12 col-lg-3">
						<div class="form-group">
							<label class="control-label" for="date_format"><?= lang('date_format') ?></label>
							<input id="date_format" data-field="date_format" class="form-control text-field no-edit" title="<?= lang('date_format') ?>" readonly />
							<span class="help-block">
								<?= lang('ad_set_df_hint') ?>
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<label class="control-label" for="time_format"><?= lang('time_format') ?></label>
							<input id="time_format" data-field="time_format" class="form-control text-field no-edit" title="<?= lang('time_format') ?>" readonly />
							<span class="help-block">
								<?= lang('ad_set_tf_hint') ?>
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<label class="control-label" for="flexible_column" style="color:rgba(41,109,151,1.0);font-size:16px;"><?= lang('flexible_column') ?></label>
							<input id="flexible_column" type="text" data-field="flexible_column" class="form-control text-field" title="<?= lang('flexible_column') ?>" />
							<span class="help-block">
								<?= lang('ad_set_fcol_hint') ?>
							</span>
						</div>
					</div>
					
					<div class="col-xs-12 col-lg-1"></div>
					
					<div class="col-xs-12 col-lg-3">
						<div class="form-group">
							<label class="control-label" for="school_name"><?= lang('school_name') ?></label>
							<input id="school_name" type="text" data-field="school_name" class="form-control text-field" title="<?= lang('school_name') ?>" />
							<span class="help-block">
								<?= lang('ad_set_sname_hint') ?>
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<label class="control-label" for="school_email"><?= lang('school_email') ?></label>
							<input id="school_email" type="email" data-field="school_email" class="form-control text-field" title="<?= lang('school_email') ?>" />
							<span class="help-block">
								<?= lang('ad_set_semail_hint') ?>
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<label class="control-label" for="school_link"><?= lang('school_link') ?></label>
							<input id="school_link" type="url" data-field="school_link" class="form-control text-field" title="<?= lang('school_link') ?>" />
							<span class="help-block">
								<?= lang('ad_set_slink_hint') ?>
							</span>
						</div>
					</div>
					
					<div class="col-xs-12 col-lg-1"></div>
					
					<div class="col-xs-12 col-lg-4">
						<div class="form-group">
							<label class="control-label" for="max_services_checking_ahead_day"><?= lang('max_services_checking_ahead_value_day') ?></label>
							<input id="max_services_checking_ahead_day" type="number" data-field="max_services_checking_ahead_day" class="form-control text-field" title="<?= lang('max_services_checking_ahead_value_day') ?>" />
							<span class="help-block">
								<?= lang('ad_set_mscavd_hint') ?>
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<label class="control-label" for="max_appointment_cancel_ahead_day"><?= lang('max_appointment_cancel_ahead_value_day') ?></label>
							<input id="max_appointment_cancel_ahead_day" type="number" data-field="max_appointment_cancel_ahead_day" class="form-control text-field" title="<?= lang('max_appointment_cancel_ahead_value_day') ?>" />
							<span class="help-block">
								<?= lang('ad_set_macad_hint') ?>
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<label class="control-label" for="upload_file_max_size"><?= lang('upload_file_max_size_kb') ?></label>
							<input id="upload_file_max_size" type="number" data-field="upload_file_max_size" class="form-control text-field" title="<?= lang('upload_file_max_size_kb') ?>" />
							<span class="help-block">
								<?= lang('ad_set_ufmskb_hint') ?>
							</span>
						</div>
						<br />
						
						<div class="form-group">
							<input id="enable_email_notification" type="checkbox" data-field="enable_email_notification" title="<?= lang('enable_email_notification') ?>" />
							<label class="control-label" for="enable_email_notification" style="cursor:pointer;"><?= lang('enable_email_notification') ?><span></span></label>
							<span class="help-block">
								<?= lang('ad_set_een_hint') ?>
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
								<button id="go_to_school_page" class="btn btn-default" title="<?= lang('go_to_school_page') ?>">
									<i class="fas fa-home"></i>
									&nbsp;
									<?= lang('go_to_school_page') ?>
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
			<br />
		</div>
		
		<!-- Semester Information -->
		<div role="tabpanel" class="tab-pane fade" id="semester_information">
			<div class="container" style="width:90%;">			
				<div class="wrapper row">
					<div class="col-xs-12">
						<h3 style="margin-bottom:0;"><?= lang('semester_information') ?></h3>
					</div>
				</div>
				<hr />
			
				<div class="wrapper row">
					<ul id="sem_info" class="col-xs-12"></ul>
				</div>
				<hr />
				
				<div class="wrapper row">
					<div class="col-xs-12">
						<div class="btn-toolbar">
							<div class="btn-group">
								<button id="sem_upload" class="btn btn-primary" title="<?= lang('update') ?>">
									<i class="fas fa-upload"></i>
									&nbsp;
									<?= lang('update') ?>
								</button>
							</div>
							<div class="btn-group">
								<button id="sem_new_row" class="btn btn-info" title="<?= lang('new_row') ?>">
									<i class="fas fa-plus"></i>
									&nbsp;
									<?= lang('new_row') ?>
								</button>
							</div>
							<div class="btn-group">
								<button id="sem_reset" class="btn btn-default" title="<?= lang('reset') ?>">
									<i class="fas fa-redo"></i>
									&nbsp;
									<?= lang('reset') ?>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<br />
		</div>
		
		<!-- Email Configurations -->
		<div role="tabpanel" class="tab-pane fade" id="email_configurations">
			<div class="container" style="width:90%;">			
				<div class="wrapper row">
					<div class="col-xs-12">
						<h3 style="margin-bottom:0;"><?= lang('email_configurations') ?></h3>
					</div>
				</div>
				<hr />
					
				<div class="wrapper row">
					<div id="email_title_group" class="col-xs-12">
						<div class="col-xs-12 col-sm-3">
							<select id="email_end" class="niceselect wide">
								<option value="stu" selected><?= lang('student_end') ?></option>
								<option value="tut"><?= lang('tutor_end') ?></option>
								<option value="adm"><?= lang('admin_end') ?></option>
							</select>
						</div>
						<div class="col-xs-12 col-sm-3">
							<select id="email_event" class="niceselect wide">
								<!-- Student End -->
								<option class="email_student" value="ma" selected><?= lang('make_an_appointment') ?></option>
								<option class="email_student" value="ca"><?= lang('cancel_an_appointment') ?></option>
								<option class="email_student" value="rc"><?= lang('rate_and_comment_finished') ?></option>
								<!-- Tutor End -->
								<option class="email_tutor" value="fs" disabled><?= lang('feedback_and_suggestion_finished') ?></option>
								<!-- Admin End -->
								<option class="email_admin" value="at" disabled><?= lang('add_a_tutor') ?></option>
								<option class="email_admin" value="es" disabled><?= lang('edit_a_service') ?></option>
								<option class="email_admin" value="ds" disabled><?= lang('delete_a_service') ?></option>
							</select>
						</div>
						<div class="col-xs-12 col-sm-3">
							<select id="email_receiver" class="niceselect wide">
								<option value="t" selected><?= lang('send_to_tutor') ?></option>
								<option value="s"><?= lang('send_to_student') ?></option>
							</select>
						</div>
						<div class="col-xs-12 col-sm-3">
							<div class="btn-toolbar">
								<!-- Edit -->
								<div class="btn-group">
									<button id="edit_email" class="btn btn-primary" title="<?= lang('edit') ?>"><i class="fas fa-edit"></i>&nbsp;&nbsp;<?= lang('edit') ?></button>
								</div>
								<!-- Save + Cancel -->
								<div class="btn-group">
									<button id="save_email" class="btn btn-primary" title="<?= lang('save') ?>"><i class="fas fa-save"></i>&nbsp;&nbsp;<?= lang('save') ?></button>
									<button id="cancel_email" class="btn btn-default" title="<?= lang('cancel') ?>"><i class="fas fa-times"></i>&nbsp;&nbsp;<?= lang('cancel') ?></button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<br />
				
				<div class="wrapper row">
					<div class="col-xs-12">
						<input id="email_title" type="text" class="form-control" placeholder="<?= lang('title') ?>" title="<?= lang('title') ?>" readonly />
						<div id="email_content" class="trumbowyg" placeholder="<?= lang('content') ?>" title="<?= lang('content') ?>"></div>
						<div class="help-block"><?= lang('ad_set_email_edit_hint') ?></div>
					</div>
				</div>
			</div>
			<br />
		</div>
		
		<!-- Survey Configurations -->
		<div role="tabpanel" class="tab-pane fade" id="survey_configurations">
			<div class="container" style="width:90%;">			
				<div class="wrapper row">
					<div class="col-xs-12">
						<h3 style="margin-bottom:0;"><?= lang('survey_configurations') ?></h3>
					</div>
				</div>
				<hr />
				
				<div class="wrapper row">
					<iframe src="https://www.wjx.cn/jq/36404176.aspx" width="100%" height="450px" allowfullscreen></iframe>
				</div>
			</div>
			<br />
		</div>	
	</div>
</div>