<script src="<?= asset_url('assets/js/tutors_appointment_management_helper.js') ?>"></script>
<script src="<?= asset_url('assets/js/tutors_appointment_management.js') ?>"></script>
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
		downloadPrefix     : "<?= Config::BASE_URL ?>/index.php/download/index/",
		tutor_sid          : <?= json_encode($user_sid) ?>
    };

    $(document).ready(function() {
		TutorsAppointmentManagement.initialize(true);
    });
</script>

<div id="tutor-appointment-management-page" class="container-fluid tutors-page">
    <div class="row">
    	<div id="filter-my_appointments" class="filter-records column col-xs-12 col-sm-6 col-md-5 col-lg-4 col-xl-2">
    		<form>
                <div class="input-group">
                   <div class="input-group-selection">
                  		<!-- Select Booking Status -->
                  		<select id="tutor-appointment_management_booking_status" class="form-control" title="<?= lang('select_a_booking_status') ?>">
                  			<option class="default_bs" value="ALL" selected>- <?= lang('select_a_booking_status') ?> -</option>
                  			<option value="0" class='bs0'><?= lang("bs0") ?></option>
                  			<option value="1" class='bs1'><?= lang("bs1") ?></option>
                  			<option value="2" class='bs2'><?= lang("bs2") ?></option>
                  			<option value="3" class='bs3'><?= lang("bs3") ?></option>
                  		</select>
                  		<!-- Select Service Type -->
                  		<input type="text" class="form-control" id="tutor-appointment_management_service_category" placeholder="<?= lang('type_for_a_service_category') ?>" title="<?= lang('type_for_a_service_category') ?>" autocomplete="off" />
                  		<div id="am_sc_display">
                  			<!-- Notice: If category is longer than 35 characters, scale it -->
                  			<ul id="filter-service-category" class="filter-list">
                 				<li class="filter-item filter-item--close" title="- <?= lang('search_all_service_categories') ?> -"><strong><?= lang('search_all_service_categories') ?></strong></li>
                  				<span></span>
                  			</ul>
                  		</div>
 						<!-- Select Student Name -->
                   		<input type="text" class="key form-control" id="tutor-appointment_management_students" placeholder="<?= lang('type_for_a_student') ?>" title="<?= lang('type_for_a_student') ?>" autocomplete="off" />
                  		<div id="am_tn_display">
                  			<ul id="filter-student-name" class="filter-list">
                  				<li class="filter-item filter-item--close" title="- <?= lang('search_all_students') ?> -"><strong><?= lang('search_all_students') ?></strong></li>
                  				<span></span>
                  			</ul>
                  		</div>
                  		<!-- Select Date -->
                  		<input type="text" class="form-control" id="tutor-appointment_management_start_date" placeholder="<?= lang('select_a_minimum_starting_date') ?>" title="<?= lang('select_a_minimum_starting_date') ?>" autocomplete="off" readonly />
                  		<input type="text" class="form-control" id="tutor-appointment_management_end_date" placeholder="<?= lang('select_a_maximum_ending_date') ?>" title="<?= lang('select_a_maximum_ending_date') ?>" autocomplete="off" readonly />
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
                            	    <i class="fas fa-times"></i>
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
            <div class="btn-toolbar">
                <div id="modify-feedback-group" class="btn-group">
                    <button id="modify_service_status" class="btn btn-default">
                        <i class="glyphicon glyphicon-pencil"></i>&nbsp;
                        <?= lang('modify_service_status') ?>
                    </button>
                    <button id="provide_feedback_and_suggestions" class="btn btn-primary">
                        <i class="glyphicon glyphicon-pencil"></i>&nbsp;
                        <?= lang('provide_feedback_and_suggestions') ?>
                    </button>
                </div>
           </div>
			
           <!-- hide appointment id for data transfer -->
           <input id="appointment-id" type="hidden">

           <h3><?= lang('details') ?></h3>
          
           <div class="row">
               <div class="col-xs-12 col-sm-6" style="margin-left: 0;">
                   <!-- Service -->
                   <div class="form-group">
                       <label class="control-label" for="booking_status"><?= lang('booking_status') ?></label>
                       <input id="booking_status" class="form-control" readonly>
                   </div>
                   <div class="form-group">
                       <label class="control-label" for="service_type"><?= lang('service_type') ?></label>
                       <input id="service_type" class="form-control" readonly>
                   </div>
                   <div class="form-group">
                       <label class="control-label" for="service_description"><?= lang('service_description') ?></label>
                       <input id="service_description" class="form-control" readonly>
                   </div>
                   
                   <!-- Student Booking -->
                   <div class="form-group">
                       <label class="control-label" for="student_name"><?= lang('student_name') ?></label>
                       <input id="student_name" class="form-control" readonly>
                   </div>
                   <div class="form-group">
                       <label class="control-label" for="notes"><?= lang('notes') ?></label>
                       <input id="notes" class="form-control" readonly>
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
                   <!-- Feedback from Students -->
                   <div class="form-group">
                       <label class="control-label" for="stars"><?= lang('stars') ?></label>
                       <input id="stars" class="form-control" readonly>
                   </div>
                   <div class="form-group">
                       <label class="control-label" for="com_or_sug"><?= lang('comment_or_suggestion') ?></label>
                       <textarea id="com_or_sug" rows="5" class="form-control" style="resize: none;" readonly></textarea>
                   </div>
                   
                   <!-- Feedback from Tutor -->
                   <div class="form-group">
                       <label class="control-label" for="feedback"><?= lang('feedback') ?></label>
                       <textarea id="feedback" rows="3" class="form-control" style="resize: none;" readonly></textarea>
                   </div>
                   <div class="form-group">
                       <label class="control-label" for="suggestion"><?= lang('suggestion') ?></label>
                       <textarea id="suggestion" rows="5" class="form-control" style="resize: none;" readonly></textarea>
                   </div>
			        <!-- Download -->
			        <div class="form-group" style="padding:10px;text-align:center;">
		            	<button id="download" class="btn btn-primary">
		            		<a href="javascript:void(0);" target="_blank" style="text-decoration:none;color:snow;">
		            			<i class="fas fa-download"></i>
		            			&nbsp;
		            			<strong><?= lang('download_attachment') ?></strong>
		            		</a>
		            	</button>			            
			        </div>
               </div>
           </div>
    	</div>
    </div>
    <div id="popup_tutor_feedback" class="popup">
    	<div class="curtain"></div>
    	<div id="tutor_feedback_popup_window">
    		<form>
    			<div class="feedback-title popup-title"><h2><?= lang('provide_students_with_feedback_and_suggestions') ?></h2></div>
    			<hr />
				<div class="feedback-container popup-container feedback">
					<textarea id="popup_feedback_input" placeholder="<?= lang('feedback') ?> *: <?= lang('tut_appm_popup_feedback_hint') ?>" rows="6" style="resize: none;" title="<?= lang('feedback') ?> *"></textarea>
					<textarea id="popup_suggestion_input" placeholder="<?= lang('suggestion') ?>: <?= lang('tut_appm_popup_suggestion_hint') ?>" rows="6" style="resize: none;" title="<?= lang('suggestion') ?>"></textarea>
				</div>
				<hr />
				<div class="feedback-container popup-container">
					<input id="feedback_save" class="feedback_popup_buttons popup_buttons" type="button" value="<?= lang('submit') ?>">
					<input id="feedback_cancel" class="feedback_popup_buttons popup_buttons" type="button" value="<?= lang('cancel') ?>">
				</div>
    		</form>
    	</div>
    </div>
</div>
