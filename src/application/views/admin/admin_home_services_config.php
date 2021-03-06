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
		curLanguage        : <?= json_encode($language) ?>,
		avatarPrefix       : "<?= Config::BASE_URL ?>/assets/img/"
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
						<select id="calendar_semester" title="<?= lang('semester') ?>" style="min-width:150px;"></select>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<select id="calendar_week_number" title="<?= lang('week_number') ?>" style="min-width:180px;"></select>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<select id="calendar_tutor" title="<?= lang('tutor') ?>" style="min-width:150px;"></select>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<input type="button" id="calendar_gotodate" class="btn btn-primary" value="<?= lang('go_to_date') ?>" title="<?= lang('go_to_date') ?>" style="font-weight: bolder;" />
					</h4>
				</div>
			</div>
			<!-- Guess what, a large calendar! -->
			<div id="admin-full-calendar"></div>
			<!-- modal for batch scheduling -->
			<div class="modal fade" id="scheduleToSome" tabindex="-1" role="dialog" aria-labelledby="scheduleToSomeModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="scheduleToSomeModalLabel" style="display: inline-block;"><?= lang('schedule_to_selected_weeks') ?></h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close" style="display: inline-block;padding:8px 0 0 0;">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body" style="padding:0 15px;">
							<form>
								<div class="form-group">
									<div class="container">
										<div class="container">
											<div class="btn-group" style="margin: 0 10px 0 0;">
												<button type="button" class="btn btn-info" id="stsw_all"><?= lang('all') ?></button>
												<button type="button" class="btn btn-default" id="stsw_none"><?= lang('none') ?></button>
											</div>
											<div class="btn-group" style="margin: 0 10px 0 0;">
												<button type="button" class="btn btn-info" id="stsw_odd" title="Odd Weeks">Odd Weeks</button>
												<button type="button" class="btn btn-info" id="stsw_even" title="Even Weeks">Even Weeks</button>
											</div>
										</div>
									</div>
								</div>
								<div class="form-group">
									<div class="container-fluid" id="stsw_cb_field"></div>
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal"><?= lang('close') ?></button>
							<button type="button" class="btn btn-primary" id="stsw_schedule"><strong><?= lang('schedule') ?></strong></button>
						</div>
					</div>
				</div>
			</div>
			<div class="popup">
				<div class="curtain"></div>
				<div id="cal_edit_popup">
					<form>
						<a href="#popup_edit_cancel" style="text-decoration:none;"><div class="popup-title"><h2><?= lang('edit_service') ?></h2></div></a>
						<hr />
						<input id="edit_service_id" type="hidden" />
						<div class="popup-container">
							<select id="edit_service_service_type" title="<?= lang('service_type') ?> *" style="height:28px;width:27%;"></select>
							&nbsp;&nbsp;
							<input id="edit_service_date" type="text" placeholder="<?= lang('date') ?> *" title="<?= lang('date') ?> *" style="height:28px;width:16%" readonly />
							&nbsp;<strong>-</strong>&nbsp;
							<input id="edit_service_st" type="time" style="width:18%;height:28px;" />
							<strong>~</strong>
							<input id="edit_service_et" type="time" style="width:18%;height:28px;" />
						</div>
						<div class="popup-container">
							<select id="edit_service_tutor" title="<?= lang('tutor') ?> *" style="height:28px;width:42%;"></select>
							&nbsp;&nbsp;
							<input id="edit_service_appointed" type="text" title="<?= lang('applied') ?>" style="height:28px;width:18%;text-align:right;" readonly />
							&nbsp;
							<strong>/</strong>
							&nbsp;
							<input id="edit_service_capacity" type="number" min="1" placeholder="<?= lang('capacity') ?> *" title="<?= lang('capacity') ?> *" style="height:28px;width:20%;" />
						</div>
						<div class="popup-container">
							<textarea id="edit_service_description" type="text" placeholder="<?= lang('service_description') ?>" rows="3" title="<?= lang('service_description') ?>" style="resize:none;"></textarea>
						</div>
						<div class="popup-container">
							<textarea id="edit_service_address" type="text" placeholder="<?= lang('address') ?> *" rows="2" title="<?= lang('address') ?> *" style="resize:none;"></textarea>
						</div>
						<hr />
						<!-- Buttons -->
						<div class="popup-container">
							<button id="popup_edit_delete" type="button" class="popup_buttons" value="<?= lang('delete_this_service_hint') ?>"><i class="fas fa-trash-alt" style="width:90%"></i></button>
							<button id="popup_edit_confirm" type="button" class="popup_buttons" value="<?= lang('confirm') ?>" style="width:40%;"><?= lang('confirm') ?></button>
							<button id="popup_edit_cancel" type="button" class="popup_buttons" value="<?= lang('cancel') ?>" style="width:40%;"><?= lang('cancel') ?></button>
						</div>
					</form>
				</div>
				<div id="cal_add_popup">
					<form>
						<a href="#popup_add_cancel" style="text-decoration:none;"><div class="popup-title"><h2><?= lang('add_service') ?></h2></div></a>
						<hr />
						<div class="popup-container">
							<select id="add_service_service_type" title="<?= lang('service_type') ?> *" style="height:28px;width:27%;"></select>
							&nbsp;&nbsp;
							<input id="add_service_date" type="text" placeholder="<?= lang('date') ?> *" title="<?= lang('date') ?> *" style="height:28px;width:16%" readonly />
							&nbsp;<strong>-</strong>&nbsp;
							<input id="add_service_st" type="time" style="width:18%;height:28px;" placeholder="<?= lang('start') ?> *" title="<?= lang('start') ?> *" />
							<strong>~</strong>
							<input id="add_service_et" type="time" style="width:18%;height:28px;" placeholder="<?= lang('end') ?> *" title="<?= lang('end') ?> *" />
						</div>
						<div class="popup-container">
							<select id="add_service_tutor" title="<?= lang('tutor') ?> *" style="height:28px;width:42%;"></select>
							&nbsp;&nbsp;
							<input id="add_service_capacity" type="number" min="1" placeholder="<?= lang('capacity') ?> *" title="<?= lang('capacity') ?> *" style="height:28px;width:42%;" />
						</div>
						<div class="popup-container">
							<textarea id="add_service_description" type="text" placeholder="<?= lang('service_description') ?>" rows="3" title="<?= lang('service_description') ?>" style="resize:none;"></textarea>
						</div>
						<div class="popup-container">
							<textarea id="add_service_address" type="text" placeholder="<?= lang('address') ?> *" rows="2" title="<?= lang('address') ?> *" style="resize:none;"></textarea>
						</div>
						<hr />
						<!-- Buttons -->
						<div class="popup-container">
							<button id="popup_add_confirm" type="button" class="popup_buttons" value="<?= lang('confirm') ?>" style="width:43%;"><?= lang('confirm') ?></button>
							<button id="popup_add_cancel" type="button" class="popup_buttons" value="<?= lang('cancel') ?>" style="width:43%;"><?= lang('cancel') ?></button>
						</div>
					</form>
				</div>
			</div>
			<br />
		</div>
	
		<!-- Tutor Tab -->
		<div role="tabpanel" class="tab-pane fade" id="tutor_config">
			<div class="container" style="width: 90%;margin-top: 30px;">
				<div class="wrapper row">
					<!-- filter tutors -->
					<div class="col-xs-12 col-md-3">
						<div class="form-group filter-box">
							<label class="control-label" for="tutor-name"><?= lang('type_for_a_tutor') ?></label>
							<input type="text" class="form-control" id="tutor-name" placeholder="<?= lang('type_for_a_tutor') ?>" title="<?= lang('type_for_a_tutor') ?>" autocomplete="off" />
							<span class="help-block">
								<?= lang('ad_sc_tut_search_hint') ?>
							</span>
						</div>
						<!-- results -->
						<h3><?= lang('tutor') ?></h3>
						<div class="results"></div>
					</div>
					
					<div class="col-xs-12 col-md-1"><hr class="split-column-content"></div>
					
					<!-- Check and Edit tutors -->
					<div class="col-xs-12 col-md-8 tutor-details-form">
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
								<button id="tutor-new-tutor" class="btn btn-info" title="<?= lang('new_tutor') ?>">
									<i class="fas fa-user-plus"></i>
									&nbsp;
									<?= lang('new_tutor') ?>
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
								<button id="tutor-dismiss" class="btn btn-warning" title="<?= lang('dismiss') ?>">
									<i class="fas fa-user-minus"></i>
									&nbsp;
									<?= lang('dismiss') ?>
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
						<div class="col-xs-12 col-sm-12 col-lg-4">
							<div class="form-group">
							    <label class="control-label" for="tutor-id"><?= lang('tutor_id') ?></label>
							    <input id="tutor-id" class="form-control no-edit" readonly>
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
						<div class="col-xs-12 col-sm-12 col-lg-4">
							<div class="form-group">
							    <label class="control-label" for="tutor-sid"><?= lang('tutor_sid') ?></label>
							    <input id="tutor-sid" class="form-control no-edit" readonly>
							</div>
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
							    <textarea id="introduction" class="form-control" rows="2" style="resize:none;" readonly></textarea>
							</div>
							<div class="form-group">
							    <label class="control-label" for="flexible-column" style="color:rgba(41,109,151,1.0);font-size:16px;"><?= $flexible_column_label ?></label>
							    <input id="flexible-column" class="form-control" readonly>
							</div>
						</div>
						<!-- Extra Column: Avatar...  -->
						<div class="col-xs-12 col-sm-12 col-lg-4">
							<div id="avatar_setting">
								<!-- Visible Set -->
								<label class="avatar_label" data-toggle="tooltip" title="" data-original-title="Change your avatar" style="cursor:pointer;transition:all 0.2s;">
									<img class="rounded" id="avatar" src="<?= base_url('assets/img/default.png') ?>" alt="avatar" style="width:100%;" />
									<input type="file" class="sr-only" id="avatar_file_input" name="image" accept="image/*" />
								</label>
								
								<!-- Help Block -->
								<div class="help-block"><?= lang('update_avatar_help') ?></div>
								
								<!-- Progress Bar -->
								<div class="progress" style="display:none;margin-bottom:1rem;">
									<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%;">100%</div>
								</div>
								
								<!-- Alert box -->
								<div class="alert alert-warning" role="alert" style="display:none;"><?= lang('upload_error') ?></div>
								
								<!-- A cropping modal -->
								<div class="modal fade" id="avatar_modal" tabindex="-1" role="dialog" aria-labelledby="avatar_modalLabel" aria-hidden="true" style="display:none;">
									<div class="modal-dialog" role="document">
										<div class="modal-content">
											<div class="modal-header">
												<h5 class="modal-title" id="avatar_modalLabel" style="display:inline-block;"><?= lang('crop_the_image') ?></h5>
												<button type="button" class="close" data-dismiss="modal" aria-label="Close" style="display:inline-block;padding:8px 0 0 0;">
													<span aria-hidden="true">&times;</span>
												</button>
											</div>
											<div class="modal-body" style="padding:0 15px;">
												<div class="avatar-container">
													<img id="avatar_modal_image" src="<?= base_url('assets/img/default.png') ?>" style="max-width:100%;" />
												</div>
											</div>
											<div class="modal-footer">
												<button type="button" class="btn btn-secondary" data-dismiss="modal"><?= lang('cancel') ?></button>
												<button type="button" class="btn btn-primary" id="crop-avatar"><?= lang('crop') ?></button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="popup">
				<div class="curtain"></div>
				<div id="tutor_new_tutor_popup">
					<form>
						<a href="#popup_new_tutor_cancel" style="text-decoration:none;"><div class="popup-title"><h2><?= lang('add_new_tutors') ?></h2></div></a>
						<hr />
						<div class="popup-container">
							<h4 style="margin:25px auto;"><?= lang('input_ids') ?></h4>
							<textarea id="new_tutor_ids" type="text" placeholder="<?= lang('input_ids') ?>" rows="6" title="<?= lang('input_ids') ?>" style="resize:none;width:42%;"></textarea>
							<textarea id="new_tutor_ids_response" type="text" placeholder="<?= lang('response_output') ?>" rows="6" title="<?= lang('response_output') ?>" style="resize:none;width:42%;" readonly></textarea>
							<div id="new_tutor_help" class="help-block" style="width:85%;margin:10px auto;"><?= lang('ad_sc_tut_new_hint') ?></div>
						</div>
						<hr />
						<!-- Buttons -->
						<div class="popup-container">
							<button id="popup_new_tutor_save" type="button" class="popup_buttons" value="<?= lang('save') ?>" style="width:43%;"><?= lang('save') ?></button>
							<button id="popup_new_tutor_cancel" type="button" class="popup_buttons" value="<?= lang('cancel') ?>" style="width:43%;"><?= lang('cancel') ?></button>
							<button id="popup_new_tutor_confirm" type="button" class="popup_buttons" value="<?= lang('confirm') ?>" style="width:86%;"><?= lang('confirm') ?></button>
						</div>
					</form>
				</div>
			</div>
			<br />
		</div>
		
		<!-- Service Type Tab -->
		<div role="tabpanel" class="tab-pane fade" id="service_type_config">
			<br />
			<div class="container" style="width:95%;">
				<div class="wrapper row">
					<!-- filter service types -->
					<div class="col-xs-12 col-md-12 col-lg-4">
						<div class="form-group filter-box">
							<label class="control-label" for="service_type-service_type"><?= lang('type_for_a_service_category') ?></label>
							<input type="text" class="form-control" id="service_type-service_type" placeholder="<?= lang('type_for_a_service_category') ?>" title="<?= lang('type_for_a_service_category') ?>" autocomplete="off" />
							<span class="help-block">
								<?= lang('ad_sc_st_search_hint') ?>
							</span>
						</div>
						<!-- results -->
						<h3><?= lang('service_type') ?></h3>
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
									<button id="service_type-new-service_type" class="btn btn-info" title="<?= lang('new_service_type') ?>">
										<i class="fas fa-plus"></i>
										&nbsp;
										<?= lang('new_service_type') ?>
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
							    <label class="control-label" for="service_type-id"><?= lang('service_id') ?></label>
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
							<h3><?= lang('current_tutors_in_this_service_type') ?></h3>
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
						<a href="#popup_new_service_type_cancel" style="text-decoration:none;"><div class="popup-title"><h2><?= lang('new_service_type') ?></h2></div></a>
						<hr />
						<div class="popup-container">
							<input id="new_service_type_name" type="text" placeholder="<?= lang('name') ?>" title="<?= lang('name') ?>" />
						</div>
						<div class="popup-container">
							<textarea id="new_service_type_description" placeholder="<?= lang('description') ?>" rows="3" title="<?= lang('description') ?>" style="resize:none;"></textarea>
						</div>
						<hr />
						<!-- Buttons -->
						<div class="popup-container">
							<button id="popup_new_service_type_save" type="button" class="popup_buttons" value="<?= lang('confirm') ?>" style="width:43%;"><?= lang('save') ?></button>
							<button id="popup_new_service_type_cancel" type="button" class="popup_buttons" value="<?= lang('cancel') ?>" style="width:43%;"><?= lang('cancel') ?></button>
						</div>
					</form>
				</div>
			</div>
			<br />
		</div>
	</div>
</div>
