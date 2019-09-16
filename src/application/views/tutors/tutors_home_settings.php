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
        timeFormat         : <?= json_encode($time_format) ?>
    };
	
	$(document).ready(function() {
		//	Scan to initialize
		TutorsSettingsHelper.scan();
	});
</script>

<div id="tutor-settings-page" class="container-fluid tutors-page">
	<div class="container" style="width:90%;">
		
		<h3><?= $user_display_name ?></h3>
		
		<hr />
		
		<div class="wrapper row">
			<div class="col-xs-12 col-sm-3">			
				<div class="form-group">
					<label class="control-label" for="given-name"><?= lang('given_name') ?></label>
					<input id="given-name"data-field="given-name" class="form-control text-field" title="<?= lang('given_name') ?>" />
					<span class="help-block">
						Enter your given name here.
					</span>
				</div>
				<br />
				
				<div class="form-group">
					<label class="control-label" for="surname"><?= lang('surname') ?></label>
					<input id="surname"data-field="surname" class="form-control text-field" title="<?= lang('surname') ?>" />
					<span class="help-block">
						Enter your surname here.
					</span>
				</div>
				<br />
				
				<div class="form-group">
					<label class="control-label" for="personal-page"><?= lang('personal_page') ?></label>
					<input id="personal-page"data-field="personal-page" class="form-control text-field" title="<?= lang('personal_page') ?>" />
					<span class="help-block">
						Provide your personal page to let others know you better.
					</span>
				</div>
			</div>
			
			<div class="col-xs-12 col-sm-1"></div>

			<div class="col-xs-12 col-sm-3">
				<div class="form-group">
					<label class="control-label" for="email">Email</label>
					<input id="email" data-field="email" class="form-control text-field" title="Email" />
					<span class="help-block">
						Put your email here.
					</span>
				</div>
				<br />
				
				<div class="form-group">
					<label class="control-label" for="address">Address</label>
					<input id="address" data-field="address" class="form-control text-field" title="Address" />
					<span class="help-block">
						Put your address here.
					</span>
				</div>
				<br />
				
				<div class="form-group">
					<label class="control-label" for="phone_number">Phone Number</label>
					<input id="phone_number" data-field="phone_number" class="form-control text-field" title="Phone Number" />
					<span class="help-block">
						Provide your phone number for easier communication.
					</span>
				</div>
			</div>
			
			<div class="col-xs-12 col-sm-1"></div>
			
			<div class="col-xs-12 col-sm-4">
				<div class="form-group">
					<label class="control-label" for="intro"><?= lang('introduction') ?></label>
					<textarea id="intro" data-field="intro" class="form-control text-field" rows="3" title="<?= lang('introduction') ?>" style="resize: none;"></textarea>
					<span class="help-block">
						A short self-introduction of what you do will be nice :&rsaquo;
					</span>
				</div>
				<br />
				<div class="form-group">
				    <label class="control-label" for="flexible_column" style="color:rgba(41,109,151,1.0);font-size:16px;"><?= lang('flexible_column') ?></label>
				    <input id="flexible_column" class="form-control" readonly>
					<span class="help-block">
						Flexible Column specified by admin.
					</span>
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
				<button id="go_to_personal_page" class="btn btn-default" title="Go to personal page">
					<i class="fas fa-home"></i>
					&nbsp;
					Go to personal page
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
