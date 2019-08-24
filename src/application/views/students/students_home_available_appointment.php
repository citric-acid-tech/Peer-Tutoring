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
        timeFormat         : <?= json_encode($time_format) ?>
    };

    $(document).ready(function() {
		StudentsAvailableAppointments.initialize(true);
    });
	
	document.addEventListener('DOMContentLoaded', function() {
		var calendarEl = document.getElementById('student-full-calendar');
		var calendar = new FullCalendar.Calendar(calendarEl, {
			plugins: [ 'dayGrid' ]
		});
		calendar.render();
	});
</script>

<div id="available_appointments-page" class="container-fluid students-page">

	<ul class="nav nav-tabs" role="tablist">
		<li role="presentation" class="active">
			<a href="#select-by-tutor-tab" aria-controls="select-by-tutor-tab" role="tab" data-toggle="tab">
				<?= lang('select_by_tutor_tab') ?>
			</a>
		</li>
		<li role="presentation">
			<a href="#select-by-time-tab" aria-controls="select-by-time-tab" role="tab" data-toggle="tab">
				<?= lang('select_by_time_tab') ?>
			</a>
		</li>
		<li role="presentation">
			<a id="check-calendar-tabnav" href="#check-available-time-in-calendar" aria-controls="check-available-time-in-calendar" role="tab" data-toggle="tab">
				<?= lang('calendar') ?>
			</a>
		</li>
	</ul>   

	<div class="tab-content">
		<!-- Select by Tutor Tab -->
		<div role="tabpanel" class="tab-pane active" id="select-by-tutor-tab">
			<div class="row">
				<div id="filter-aa_tutors" class="filter-records column col-xs-12 col-sm-6 col-md-5 col-lg-4 col-xl-2">
					<form>
			            <div class="input-group">
			               <div class="input-group-selection">
			              		<input type="text" class="form-control" id="available_appointments_service_category" placeholder="Type for a service category" title="Select a service category" autocomplete="off" />
			              		<div id="aa_sc_display">
			              			<!-- Notice: If category is longer than 35 characters, scale it -->
			              			<ul id="filter-service-category" class="filter-list">
			             				<li class="filter-item filter-item--close" title="- Search all Service Categories -"><strong>Search all Service Categories</strong></li>
			              				<span></span>
			              			</ul>
			              		</div>
			
			               		<input type="text" class="key form-control" id="available_appointments_tutor" placeholder="Type for a Tutor" title="Select a Tutor" autocomplete="off" />
			              		<div id="aa_tn_display">
			              			<ul id="filter-tutor-name" class="filter-list">
			              				<li class="filter-item filter-item--close" title="- Search all Tutors -"><strong>Search all Tutors</strong></li>
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
			                   		</div>
			                   		<br />
									<div>
			                        	<button id="clear-filter" class="clear btn btn-default" type="button" title="<?= lang('clear') ?>">
			                        	    <span class="glyphicon glyphicon-repeat"></span>
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

				<div class="record-details col-xs-12 col-sm-6 col-md-7 col-lg-8 col-xl-10">
					<!-- hide appointment id for data transfer -->
					<input id="tutor-id" type="hidden">

					<div class="row">
					    <div class="col-xs-12 col-sm-6" style="margin-left: 0;">
					        <h3><?= lang('details') ?></h3>
					        
					        <div class="form-group">
					            <label class="control-label" for="tutor_name"><?= lang('tutor_name') ?></label>
					            <input id="tutor_name" class="form-control" readonly>
					        </div>
					        <div class="form-group">
					            <label class="control-label" for="tutor_page"><?= lang('tutor_page') ?></label>
					            <input id="tutor_page" class="form-control" readonly>
					        </div>
					        <div class="form-group">
					            <label class="control-label" for="earliest_start_datetime"><?= lang('earliest_start_datetime') ?></label>
					            <input id="earliest_start_datetime" class="form-control" readonly>
					        </div>
					    </div>
					</div>

					<br />
				
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
		
		<!-- Select by Time Tab -->
		<div role="tabpanel" class="tab-pane" id="select-by-time-tab">
			<div class="container">
				<div class="wrapper row">
					<div class="col-xs-12 col-sm-12 col-md-4 center-text calendar-block">
						<h4>
							<input type="text" id="show_calendar_date" readonly />
						</h4>
						<div id="sel_calendar"></div>
						<div class="row hints">
							<div class="col-xs-6">
								<span class="hints-today">15</span> - Today
							</div>
							<div class="col-xs-6">
								<span class="hints-selected">25</span> - Selected
							</div>
						</div>
						<hr />
						<span class="help-block">
							Select a date to check on the tutors available for some services.
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
							Available Tutors on &nbsp;<input id="date-title" readonly />
						</h4>
						<hr />
						<div class="available-tutors-at-time"></div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Check Available Time in Calendar Tab -->
		<div role="tabpanel" class="tab-pane" id="check-available-time-in-calendar">
			<p>Check Available Time in the Calendar!</p>
			<div id="student-full-calendar"></div>
		</div>
	</div>
	
</div>
