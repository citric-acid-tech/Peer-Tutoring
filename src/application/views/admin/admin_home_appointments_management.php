<script src="<?= asset_url('assets/js/admin_appointments_management_helper.js') ?>"></script>
<script src="<?= asset_url('assets/js/admin_appointments_management.js') ?>"></script>
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
		AdminAppointmentsManagement.initialize(true);
    });
</script>

<div id="appointments_management-page" class="container-fluid admin-page">
    <div class="row">
    	<div id="filter-appointments_management" class="filter-records column col-xs-12 col-sm-6 col-md-5 col-lg-4 col-xl-2">
    		<form>
                <div class="input-group">
                   <div class="input-group-selection">
                   		<!-- Filter Booking Status -->
                  		<select id="appointments_management_booking_status" class="form-control" title="Select a booking status">
                  			<option class="default_bs" value="ALL" selected>- Select a booking status -</option>
                  			<option value="0"><?= lang("bs0") ?></option>
                  			<option value="1"><?= lang("bs1") ?></option>
                  			<option value="2"><?= lang("bs2") ?></option>
                  			<option value="3"><?= lang("bs3") ?></option>
                  		</select>
                  		<!-- Filter Service Type -->
                  		<input type="text" class="form-control" id="appointments_management_service_type" placeholder="Type for a service category" title="Select a service category" autocomplete="off" />
                  		<div id="am_st_display">
                  			<!-- Notice: If category is longer than 35 characters, scale it -->
                  			<ul id="filter-service-type" class="filter-list">
                 				<li class="filter-item filter-item--close" title="- Search all Service Categories -"><strong>Search all Service Categories</strong></li>
                  				<span></span>
                  			</ul>
                  		</div>
 						<!-- Filter Tutor Name -->
                   		<input type="text" class="key form-control" id="appointments_management_tutor" placeholder="Type for a Tutor" title="Select a Tutor" autocomplete="off" />
                  		<div id="am_tn_display">
                  			<ul id="filter-tutor-name" class="filter-list">
                  				<li class="filter-item filter-item--close" title="- Search all Tutors -"><strong>Search all Tutors</strong></li>
                  				<span></span>
                  			</ul>
                  		</div>
 						<!-- Filter Student Name -->
                   		<input type="text" class="form-control" id="appointments_management_students" placeholder="Type for a Student" title="Select a Student" autocomplete="off" />
                  		<div id="am_sn_display">
                  			<ul id="filter-student-name" class="filter-list">
                  				<li class="filter-item filter-item--close" title="- Search all Students -"><strong>Search all Students</strong></li>
                  				<span></span>
                  			</ul>
                  		</div>
                  		<!-- Select Date -->
                  		<input type="text" class="form-control" id="appointments_management_start_date" placeholder="Select a Minimum Starting Date" title="Select a Minimum Starting Date" autocomplete="off" readonly />
                  		<input type="text" class="form-control" id="appointments_management_end_date" placeholder="Select a Maximum Ending Date" title="Select a Maximum Ending Date" autocomplete="off" readonly />
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

            <h3><?= lang('appointments') ?></h3>
            
            <!-- Here are the results on the left -->
            <div class="results"></div>
    	</div>

    	<div class="record-details col-xs-12 col-sm-6 col-md-7 col-lg-8 col-xl-10">
			<h3><?= lang('details') ?></h3>
          
			<div class="row">
			    <div class="col-xs-12 col-sm-6" style="margin-left: 0;">
		        	<!-- Service Basic -->
			        <div class="form-group">
			            <label class="control-label" for="appointment-id">Appointment ID</label>
			            <input id="appointment-id" class="form-control" readonly>
			        </div>
			        <div class="form-group">
			            <label class="control-label" for="booking_status"><?= lang('booking_status') ?></label>
			            <input id="booking_status" class="form-control" readonly>
			        </div>
			        <div class="form-group">
			            <label class="control-label" for="service_type"><?= lang('service_type') ?></label>
			            <input id="service_type" class="form-control" readonly>
			        </div>
			        <div class="form-group">
			            <label class="control-label" for="tutor"><?= lang('tutor') ?></label>
			            <input id="tutor" class="form-control" readonly>
			        </div>
			        <div class="form-group">
			            <label class="control-label" for="student"><?= lang('student') ?></label>
			            <input id="student" class="form-control" readonly>
			        </div>
			        <!-- Date Time -->
			        <div class="form-group">
			            <label class="control-label" for="book_datetime"><?= lang('book_datetime') ?></label>
			            <input id="book_datetime" class="form-control" readonly>
			        </div>
			        <div class="form-group">
			            <label class="control-label" for="start_datetime"><?= lang('start_datetime') ?></label>
			            <input id="start_datetime" class="form-control" readonly>
			        </div>
			        <div class="form-group">
			            <label class="control-label" for="end_datetime"><?= lang('end_datetime') ?></label>
			            <input id="end_datetime" class="form-control" readonly>
			        </div>
			    </div>
			    <!-- Another column -->
			    <div class="col-xs-12 col-sm-6" style="margin-left: 0;">
		        	<!-- Communications -->
			        <div class="form-group">
			            <label class="control-label" for="stars"><?= lang('stars') ?></label>
			            <input id="stars" class="form-control" readonly>
			        </div>
			        <div class="form-group">
			            <label class="control-label" for="com_or_sug"><?= lang('comment_or_suggestion') ?></label>
			            <textarea id="com_or_sug" rows="3" class="form-control" style="resize: none;" readonly></textarea>
			        </div>
			        <div class="form-group">
			            <label class="control-label" for="feedback"><?= lang('feedback') ?></label>
			            <textarea id="feedback" rows="5" class="form-control" style="resize: none;" readonly></textarea>
			        </div>
			        <div class="form-group">
			            <label class="control-label" for="suggestion"><?= lang('suggestion') ?></label>
			            <textarea id="suggestion" rows="5" class="form-control" style="resize: none;" readonly></textarea>
			        </div>
			    </div>
			</div>
    	</div>
    </div>
</div>