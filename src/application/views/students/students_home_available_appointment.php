<script src="<?= asset_url('assets/js/students_available_appointments_select_by_tutor_helper.js') ?>"></script>
<script src="<?= asset_url('assets/js/students_available_appointments_select_by_time_helper.js') ?>"></script>
<script src="<?= asset_url('assets/js/students_available_appointments_calendar_helper.js') ?>"></script>
<script src="<?= asset_url('assets/js/students_available_appointments.js') ?>"></script>
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
		curLanguage        : <?= json_encode($language) ?>,
		semester_json      : <?= $semester_json ?>,
		max_check_ahead_day: <?= json_encode($max_services_checking_ahead_day) ?>,
		avatarPrefix       : "<?= Config::BASE_URL ?>/assets/img/"
    };

    $(document).ready(function() {
		StudentsAvailableAppointments.initialize(true);
    });
</script>

<div id="available_appointments-page" class="container-fluid students-page">

	<ul class="nav nav-tabs" role="tablist">
		<li role="presentation" class="active no-longer-disabled">
			<a id="check-calendar-tabnav" href="#check-available-time-in-calendar" aria-controls="check-available-time-in-calendar" role="tab" data-toggle="tab">
				<?= lang('calendar') ?>
			</a>
		</li>
		<li role="presentation" class="no-longer-active">
			<a href="#select-by-tutor-tab" aria-controls="select-by-tutor-tab" role="tab" data-toggle="tab">
				<?= lang('select_by_tutor_tab') ?>
			</a>
		</li>
		<li role="presentation" style="display: none;">
			<a href="#select-by-time-tab" aria-controls="select-by-time-tab" role="tab" data-toggle="tab">
				<?= lang('select_by_time_tab') ?>
			</a>
		</li>
	</ul>   

	<div class="tab-content">
		<!-- Check Available Time in Calendar Tab -->
		<div role="tabpanel" class="active tab-pane no-longer-fade" id="check-available-time-in-calendar" style="width:90%;margin:0 auto">
			<!-- toolbar -->
			<div class="container calendar_upper_header" style="text-align:center;">
				<div class="col-xs-12">
					<h4 style="font-weight: bolder; font-family: Gill Sans, Gill Sans MT, Myriad Pro, DejaVu Sans Condensed, Helvetica, Arial,' sans-serif';color: rgb(41, 109, 151);">
						<!--
						<span id="calendar_semester" style="min-width:150px;"></span>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<span id="calendar_week_number" style="min-width:150px;"></span>
						&nbsp;&nbsp;&nbsp;&nbsp;
						-->
						<span id="calendar_tutor" style="min-width:150px;"></span>
<!--						&nbsp;&nbsp;&nbsp;&nbsp;-->
						<button id="sel_tutor_by_name" class="btn btn-primary" style="display:none">
						    <i class="fas fa-chalkboard-teacher"></i>&nbsp;
						    <?= lang('select_by_tutor_tab') ?>
						</button>
<!--						&nbsp;&nbsp;&nbsp;&nbsp;-->
						<button id="sel_tutor_by_time" class="btn btn-primary" style="display:none">
						    <i class="fas fa-chalkboard-teacher"></i>&nbsp;
						    <?= lang('select_by_time_tab') ?>
						</button>
					</h4>
				</div>
			</div>
			<!-- Guess what, a large calendar! -->
			<div id="student-full-calendar"></div>
			<div class="popup">
				<div class="curtain"></div>
				<div id="cal_appointment_popup">
					<a href="#popup_apply_title_change" style="text-decoration:none;"><div class="popup-title"><h2><?= lang('make_an_appointment') ?></h2></div></a>
					<hr />
					<ul class="appoint_list">
						<li>
							<strong><?= lang('service') ?></strong>: <span id="appointment_service_service_type"></span>
						</li>
						<li class="currently-not-needed">
							<strong><?= lang('service_type_description') ?></strong>: <span id="appointment_service_type_description"></span>
						</li>
						<li class="currently-not-needed">
							<strong><?= lang('service_description') ?></strong>: <span id="appointment_service_description"></span>
						</li>
						<li>
							<a id="appointment_service_tutor_page" href="javascript:void(0);" target="_blank"><strong><?= lang('tutor') ?></strong>: <span id="appointment_service_tutor"></span></a>
						</li>
						<li id="capacity_check">
							<strong><?= lang('capacity') ?></strong>: <span id="appointment_service_appointed"></span> / <span id="appointment_service_capacity"></span>
						</li>
						<li>
							<strong><?= lang('time') ?></strong>: <span id="appointment_service_date"></span> <span id="appointment_service_st"></span> ~ <span id="appointment_service_et"></span>
						</li>
						<li>
							<strong><?= lang('address') ?></strong>: <span id="appointment_service_address"></span>
						</li>
					</ul>
					
					<input id="appointment_service_id" type="hidden" />
					
					<hr />
					<!-- Remark & Note -->
					<div class="popup-container">
						<a href="#popup_appointment_cancel" style="text-decoration:none;"><h4 id="popup_apply_title_change" style="color:#296d97;letter-spacing:3px;"><strong><?= lang('apply_now') ?></strong></h4></a>
						<hr style="width:60%;margin: 20px auto;" />
						<div style="width:43%;display:inline-block;" class="currently-not-needed">
							<textarea id="appointment_service_remark" type="text" placeholder="<?= lang('stu_aa_cal_remark_hint') ?>" rows="2" title="<?= lang('stu_aa_cal_remark_hint') ?>" style="resize:none;width:100%;"></textarea>
						</div>
						<div style="width:86%;display:inline-block;">
							<textarea id="appointment_service_note" type="text" placeholder="<?= lang('stu_aa_cal_note_hint') ?>" rows="2" title="<?= lang('stu_aa_cal_note_hint') ?>" style="resize:none;width:100%;"></textarea>
						</div>
						<div style="width:90%;margin:5px auto;" class="help-block"><?= lang('stu_aa_cal_gen_hint') ?></div>
					</div>
					<div class="popup-container">
						<!-- size: KB -->
						<!-- i class="fas fa-upload"></i -->
						<input id="appointment_service_attach" type="file" name="attach" class="inputfile" accept=".doc,.docx,.md,.pdf,.png,.zip,.jar,.7z" />
						<label for="appointment_service_attach"><strong><?= lang('attach_a_file') ?></strong></label>
						<div style="width:90%;margin:5px auto;" class="help-block">
							<?= lang('restricted_formats') ?>: <?php echo str_replace('|', ', ', DOCUMENT_FORMAT); ?>
						</div>
					</div>
					
					<hr />
					<!-- Buttons -->
					<div class="popup-container">
						<button id="popup_appointment_confirm" type="button" class="popup_buttons" title="<?= lang('confirm') ?>"><?= lang('confirm') ?></button>
						<button id="popup_appointment_cancel" type="button" class="popup_buttons" title="<?= lang('cancel') ?>"><?= lang('cancel') ?></button>
					</div>
				</div>
			</div>
			<br />
		</div>
		
		<!-- Select by Tutor Tab -->
		<div role="tabpanel" class="tab-pane no-longer-active fade" id="select-by-tutor-tab">
			<div class="container" style="width:90%;margin-top:25px;">
				<div id="filter-aa_tutors" class="filter-records column col-xs-12 col-sm-6 col-md-5 col-lg-4 col-xl-2">
					<form>
			            <div class="input-group">
			               <div class="input-group-selection">
			              		<input type="text" class="form-control currently-not-needed" id="available_appointments_service_category" placeholder="<?= lang('type_for_a_service_category') ?>" title="<?= lang('type_for_a_service_category') ?>" autocomplete="off" />
			              		<div id="aa_sc_display">
			              			<!-- Notice: If category is longer than 35 characters, scale it -->
			              			<ul id="filter-service-category" class="filter-list">
			             				<li class="filter-item filter-item--close" title="- <?= lang('search_all_service_categories') ?> -"><strong><?= lang('search_all_service_categories') ?></strong></li>
			              				<span></span>
			              			</ul>
			              		</div>
			
			               		<input type="text" class="key form-control" id="available_appointments_tutor" placeholder="<?= lang('type_for_a_tutor') ?>" title="<?= lang('type_for_a_tutor') ?>" autocomplete="off" />
			              		<div id="aa_tn_display">
			              			<ul id="filter-tutor-name" class="filter-list">
			              				<li class="filter-item filter-item--close" data-tut_name="- <?= lang('search_all_tutors') ?> -" title="- <?= lang('search_all_tutors') ?> -"><strong>- <?= lang('search_all_tutors') ?> -</strong></li>
			              				<span></span>
			              			</ul>
			              		</div>
			               </div>
			               
			               <div class="input-group-addon">
			                   <div>
			                   		<div>
			                   			<button id="search-filter" class="filter btn btn-default" type="submit" title="<?= lang('filter') ?>">
			                   			    <span class="glyphicon glyphicon-search"></span>
			                   			</button>
		                        		&nbsp;
			                        	<button id="clear-filter" class="clear btn btn-default" type="button" title="<?= lang('clear') ?>">
			                        	    <i class="fas fa-times"></i>
			                        	</button>
									</div>
			                   </div>
			               </div>
			            </div>
					</form>

			        <h3><?= lang('tutor') ?></h3>
			        
			        <!-- Here are the results on the left -->
			        <div class="results"></div>
				</div>

				<div class="col-xs-12 col-sm-1 col-md-1 col-lg-1 col-xl-1"></div>
			
				<div class="record-details col-xs-12 col-sm-5 col-md-6 col-lg-7 col-xl-9">
					<!-- hide appointment id for data transfer -->
					<input id="tutor-id" type="hidden">

					<div class="row">
				    	<h3 style="margin-top:5px;"><?= lang('details') ?></h3>
				    
					    <div class="col-xs-12 col-md-12 col-lg-6" style="margin-left: 0;">
					        <div class="form-group">
					            <label class="control-label" for="tutor_name"><?= lang('tutor_name') ?></label>
					            <input id="tutor_name" class="form-control" readonly>
					        </div>
					        
					        <div class="form-group currently-not-needed">
				            	<button id="go-to-tutor-personal-page" class="btn btn-info" style="font-size:12px;">
				            		<i class="fas fa-home"></i>
				            	</button>
				            	&nbsp;
					            <label class="control-label" for="tutor_page"><?= lang('tutor_page') ?></label>
					            <input id="tutor_page" class="form-control" readonly>
					        </div>
					        <br class="currently-not-needed" />
					        
					        <div class="form-group">
					            <label class="control-label" for="earliest_start_datetime"><?= lang('earliest_start_datetime') ?></label>
					            <input id="earliest_start_datetime" class="form-control" readonly>
					        </div>
					    </div>
					    
					    <div class="col-xs-12 col-md-12 col-lg-1"></div>
					    
					    <div class="col-xs-12 col-md-12 col-lg-5" style="margin-left: 0;text-align:center;">
							<div id="avatar_setting">
								<img id="avatar" src="<?= base_url('assets/img/default.png') ?>" style="width:60%;" />
							</div>
					    </div>
					</div>
					
					<div class="row">
						<br />
						<div class="col-xs-12">
							<div class="form-group">
							    <label class="control-label" for="introduction"><?= lang('introduction') ?></label>
							    <textarea id="introduction" class="form-control" readonly rows="4" style="resize:none;text-align:justify;" title="<?= lang('introduction') ?>"></textarea>
							</div>
							
							<div class="btn-toolbar">
							     <div id="check-available-time-group-tutor" class="btn-group">
							         <button id="check-available-time-tutor" class="btn btn-primary">
							             <i class="fas fa-calendar-alt"></i>&nbsp;
							             <?= lang('check_available_time') ?>
							         </button>
							     </div>
							</div>
						</div>
					</div>
				</div>	
			</div>
			<br />
		</div>
		
		<!-- Select by Time Tab -->
		<div role="tabpanel" class="tab-pane fade" id="select-by-time-tab">
			<div class="container">
				<div class="wrapper row">
					<div class="col-xs-12 col-sm-12 col-md-4 center-text calendar-block">
						<h4>
							<input type="text" id="show_calendar_date" readonly />
						</h4>
						<div id="sel_calendar"></div>
						<div class="row hints">
							<div class="col-xs-6">
								<span class="hints-today">15</span> - <?= lang('today') ?>
							</div>
							<div class="col-xs-6">
								<span class="hints-selected">25</span> - <?= lang('selected') ?>
							</div>
						</div>
						<hr />
						<span class="help-block">
							<?= lang('stu_aa_sbtime_hint') ?>
						</span>
					</div>
					
					<div class="col-xs-12 col-sm-12 col-md-1"><hr id="split-stutime" /></div>
					
					<div class="col-xs-12 col-sm-12 col-md-7 sel-tutor-by-time">
						<!-- Button Toolbar -->
						<div class="btn-toolbar">
						     <div id="check-available-time-group-time" class="btn-group">
						         <button id="check-available-time-time" class="btn btn-primary">
						             <i class="fas fa-calendar-alt"></i>&nbsp;
						             <?= lang('check_available_time') ?>
						         </button>
						     </div>
						</div>
						<h4>
							<?= lang('available_tutors_on') ?> &nbsp;<input id="date-title" readonly />
						</h4>
						<hr />
						<div class="available-tutors-at-time"></div>
					</div>
				</div>
			</div>
			<br />
		</div>
	</div>
	
</div>
