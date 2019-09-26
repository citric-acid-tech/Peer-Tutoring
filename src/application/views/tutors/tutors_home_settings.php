<script src="<?= asset_url('assets/js/tutors_settings_helper.js') ?>"></script>
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
		tutor_id           : <?= $user_id ?>,
		avatarPrefix       : "<?= Config::BASE_URL ?>/assets/img/"
    };
	
	$(document).ready(function() {
		//	Scan to initialize
		TutorsSettingsHelper.scan();
	});
</script>

<div id="tutor-settings-page" class="container-fluid tutors-page">
	<div class="container" style="width:90%;">
		
		<h3><?= lang('details') ?></h3>
		
		<hr />
		
		<div class="wrapper row">
			<div class="col-xs-12 col-md-3">			
				<div class="form-group">
					<label class="control-label" for="given-name"><?= lang('given_name') ?></label>
					<input id="given-name"data-field="given-name" class="form-control text-field" title="<?= lang('given_name') ?>" />
					<span class="help-block">
						<?= lang('tut_set_given_name_hint') ?>
					</span>
				</div>
				<br />
				
				<div class="form-group">
					<label class="control-label" for="surname"><?= lang('surname') ?></label>
					<input id="surname"data-field="surname" class="form-control text-field" title="<?= lang('surname') ?>" />
					<span class="help-block">
						<?= lang('tut_set_surname_hint') ?>
					</span>
				</div>
				<br />
				
				<div class="form-group">
					<label class="control-label" for="personal-page"><?= lang('personal_page') ?></label>
					<input id="personal-page"data-field="personal-page" class="form-control text-field" title="<?= lang('personal_page') ?>" />
					<span class="help-block">
						<?= lang('tut_set_personal_page_hint') ?>
					</span>
				</div>
			</div>

			<div class="col-xs-12 col-md-3">
				<div class="form-group">
					<label class="control-label" for="email"><?= lang('email') ?></label>
					<input id="email" data-field="email" class="form-control text-field" title="<?= lang('email') ?>" />
					<span class="help-block">
						<?= lang('tut_set_email_hint') ?>
					</span>
				</div>
				<br />
				
				<div class="form-group">
					<label class="control-label" for="address"><?= lang('address') ?></label>
					<input id="address" data-field="address" class="form-control text-field" title="<?= lang('address') ?>" />
					<span class="help-block">
						<?= lang('tut_set_address_hint') ?>
					</span>
				</div>
				<br />
				
				<div class="form-group">
					<label class="control-label" for="phone_number"><?= lang('phone_number') ?></label>
					<input id="phone_number" type="number" data-field="phone_number" class="form-control text-field" title="<?= lang('phone_number') ?>" />
					<span class="help-block">
						<?= lang('tut_set_phone_number_hint') ?>
					</span>
				</div>
			</div>
			
			<div class="col-xs-12 col-md-3">
				<div class="form-group">
					<label class="control-label" for="intro"><?= lang('introduction') ?></label>
					<textarea id="intro" data-field="intro" class="form-control text-field" rows="3" title="<?= lang('introduction') ?>" style="resize: none;"></textarea>
					<span class="help-block">
						<?= lang('tut_set_intro_hint') ?>
					</span>
				</div>
				<br />
				<div class="form-group">
				    <label class="control-label" for="flexible_column" style="color:rgba(41,109,151,1.0);font-size:16px;"><?= $flexible_column_label ?></label>
				    <input id="flexible_column" class="form-control" readonly>
					<span class="help-block">
						<?= lang('tut_set_fc_hint') ?>
					</span>
				</div>
			</div>	
			
			<!-- Avatar -->
			<div class="col-xs-12 col-md-3">
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
		
		<hr />
	
		<div class="wrapper row btn-toolbar">
			<!-- Initial Group -->
			<div class="btn-group">
				<button id="edit" class="btn btn-primary" title="<?= lang('edit') ?>">
					<i class="fas fa-edit"></i>
					&nbsp;
					<?= lang('edit') ?>
				</button>
			</div>
			<div class="btn-group">
				<button id="go_to_personal_page" class="btn btn-default" title="<?= lang('go_to_personal_page') ?>">
					<i class="fas fa-home"></i>
					&nbsp;
					<?= lang('go_to_personal_page') ?>
				</button>
			</div>
			
			<!-- Editing Group -->
			<div class="btn-group">
				<button id="save" class="btn btn-primary" title="<?= lang('save') ?>">
					<i class="fas fa-save"></i>
					&nbsp;
					<?= lang('save') ?>
				</button>
			</div>
			<div class="btn-group">
				<button id="cancel" class="btn btn-default" title="<?= lang('cancel') ?>">
					<i class="fas fa-times"></i>
					&nbsp;
					<?= lang('cancel') ?>
				</button>
			</div>
		</div>
		
		<br />
		
	</div>
</div>
