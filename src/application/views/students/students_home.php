<script src="<?= asset_url('assets/js/students_my_appointments_helper.js') ?>"></script>
<script src="<?= asset_url('assets/js/students_my_appointments.js') ?>"></script>
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
		student_sid        : <?= json_encode($user_sid) ?>
    };

    $(document).ready(function() {
		StudentsMyAppointment.initialize(true);
    });
</script>

<div id="my_appointments-page" class="container-fluid students-page">
    <div class="row" style="margin-left:10px;margin-right:10px;">
    	<div id="filter-my_appointments" class="filter-records column col-xs-12 col-sm-5 col-md-4 col-lg-3 col-xl-1">
    		<form>
                <div class="input-group">
                   <div class="input-group-selection">
                  		<select id="my_appointments_booking_status" class="form-control" title="<?= lang('select_a_booking_status') ?>">
                  			<option class="default_bs" value="ALL" selected>- <?= lang('select_a_booking_status') ?> -</option>
                  			<option value="0" class='bs0'><?= lang("bs0") ?></option>
                  			<option value="1" class='bs1'><?= lang("bs1") ?></option>
                  			<option value="2" class='bs2 currently-not-needed'><?= lang("bs2") ?></option>
                  			<option value="3" class='bs3'><?= lang("bs3") ?></option>
                  		</select>
                  		<input type="text" class="form-control currently-not-needed" id="my_appointments_service_category" placeholder="<?= lang('type_for_a_service_category') ?>" title="<?= lang('type_for_a_service_category') ?>" autocomplete="off" />
                  		<div id="ma_sc_display">
                  			<!-- Notice: If category is longer than 35 characters, scale it -->
                  			<ul id="filter-service-category" class="filter-list">
                 				<li class="filter-item filter-item--close" title="- <?= lang('search_all_service_categories') ?> -"><strong><?= lang('search_all_service_categories') ?></strong></li>
                  				<span></span>
                  			</ul>
                  		</div>
 
                   		<input type="text" class="key form-control" id="my_appointments_tutor" placeholder="<?= lang('type_for_a_tutor') ?>" title="<?= lang('type_for_a_tutor') ?>" autocomplete="off" />
                  		<div id="ma_tn_display">
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

   		<div class="col-xs-12 col-sm-1 col-md-1 col-lg-1 col-xl-1"></div>
   	
    	<div class="record-details col-xs-12 col-sm-6 col-md-7 col-lg-8 col-xl-10">
           
            <div class="btn-toolbar">
                <div id="cancel-assess-group" class="btn-group">
                    <button id="cancel-appointment" class="btn btn-danger">
                        <i class="glyphicon glyphicon-remove"></i>&nbsp;
                        <?= lang('cancel_appointment') ?>
                    </button>
                    
                    <button id="assess-appointment" class="btn btn-primary currently-not-needed">
                        <i class="glyphicon glyphicon-pencil"></i>&nbsp;
                        <?= lang('assess') ?>
                    </button>
                </div>
			    <!-- Download -->
			    <div class="btn-group">
		        	<button id="download" class="btn btn-primary">
		        		<a href="javascript:void(0);" target="_blank" style="text-decoration:none;color:snow;">
		        			<i class="fas fa-download"></i>
		        			&nbsp;
		        			<strong><?= lang('download_attachment') ?></strong>
		        		</a>
		        	</button>			            
			    </div>
           </div>
			
           <h3><?= lang('details') ?></h3>
          	
          	<hr style="margin-top:5px;margin-bottom:5px;" />
          	
           <!-- hide appointment id for data transfer -->
           <input id="appointment-id" type="hidden">       

           <div class="row">
               <div class="col-xs-12 col-sm-6" style="margin-left: 0;">
                   <div class="form-group currently-not-needed">
                       <label class="control-label" for="remark"><?= lang('remark') ?></label>
                       <input id="remark" class="form-control" readonly>
                   </div>
                   <div class="form-group">
                       <label class="control-label" for="booking_status"><?= lang('booking_status') ?></label>
                       <input id="booking_status" class="form-control" readonly>
                   </div>
                   <br />
                   <div class="form-group currently-not-needed">
                       <label class="control-label" for="stars"><?= lang('stars') ?></label>
                       <input id="stars" class="form-control" readonly>
						<span class="stars" id="stars-displays">
							<!-- No Star -->
							<input class="rating_input rating_input--none" id="rating--0" type="radio" />
							<label aria-label="No rating" class="rating_label">
								<i class="rating_icon rating_icon--none fas fa-heart-broken"></i>
							</label>
							<!-- 1 Star -->
							<label aria-label="1 star" class="rating_label">
								<i class="rating_icon rating_icon--star fas fa-star"></i>
							</label>
							<input class="rating_input" id="rating--1" type="radio" />
							<!-- 2 Stars -->
							<label aria-label="2 stars" class="rating_label">
								<i class="rating_icon rating_icon--star fas fa-star"></i>
							</label>
							<input class="rating_input" id="rating--2" type="radio" />
							<!-- Default: 3 Stars -->
							<label aria-label="3 stars" class="rating_label">
								<i class="rating_icon rating_icon--star fas fa-star"></i>
							</label>
							<input class="rating_input" id="rating--3" type="radio" />
							<!-- 4 Stars -->
							<label aria-label="4 stars" class="rating_label">
								<i class="rating_icon rating_icon--star fas fa-star"></i>
							</label>
							<input class="rating_input" id="rating--4" type="radio" />
							<!-- 5 Stars -->
							<label aria-label="5 stars" class="rating_label">
								<i class="rating_icon rating_icon--star fas fa-star"></i>
							</label>
							<input class="rating_input" id="rating--5" type="radio" />
						</span>
                   </div>
                   <div class="form-group currently-not-needed">
                       <label class="control-label" for="com_or_sug"><?= lang('comment_or_suggestion') ?></label>
                       <textarea id="com_or_sug" rows="2" class="form-control" style="resize: none;" readonly></textarea>
                   </div>
                   
                   <div class="form-group currently-not-needed">
                       <label class="control-label" for="description"><?= lang('description') ?></label>
                       <input id="description" class="form-control" readonly>
                   </div>
                   <div class="form-group">
                       <label class="control-label" for="service_type"><?= lang('service_type') ?></label>
                       <input id="service_type" class="form-control" readonly>
                   </div>
                   <br />
                   <div class="form-group">
                       <label class="control-label" for="tutor"><?= lang('tutor') ?></label>
                       <input id="tutor" class="form-control" readonly>
                   </div>
               </div>
               <!-- Another column -->
               <div class="col-xs-12 col-sm-6" style="margin-left: 0;">

                   <div class="form-group">
                       <label class="control-label" for="book_datetime"><?= lang('book_datetime') ?></label>
                       <input id="book_datetime" class="form-control" readonly>
                   </div>
                   <br />
                   <div class="form-group">
                       <label class="control-label" for="start_datetime"><?= lang('start_datetime') ?></label>
                       <input id="start_datetime" class="form-control" readonly>
                   </div>
                   <br />
                   <div class="form-group">
                       <label class="control-label" for="end_datetime"><?= lang('end_datetime') ?></label>
                       <input id="end_datetime" class="form-control" readonly>
                   </div>

                   <div class="form-group currently-not-needed">
                       <label class="control-label" for="feedback"><?= lang('feedback') ?></label>
                       <textarea id="feedback" rows="2" class="form-control" style="resize: none;" readonly></textarea>
                   </div>
                   <div class="form-group currently-not-needed">
                       <label class="control-label" for="suggestion"><?= lang('suggestion') ?></label>
                       <textarea id="suggestion" rows="2" class="form-control" style="resize: none;" readonly></textarea>
                   </div>
               </div>
           </div>
           
           <div class="row" style="margin-top:5px;">
           	<div class="col-xs-12">
           		<div class="form-group">
           		    <label class="control-label" for="notes"><?= lang('notes') ?></label>
           		    <textarea id="notes" class="form-control" rows="3" style="resize:none;" readonly></textarea>
           		</div>
           	</div>
           </div>
    	</div>
    </div>
    <div id="popup_assess" class="popup">
    	<div class="curtain"></div>
    	<div id="assess_popup">
    		<form>
    			<a href="#assess_feedback" style="text-decoration:none;"><div class="assess-title popup-title"><h2><?= lang('assess_the_service') ?></h2></div></a>
    			<hr />
				<div class="assess-container popup-container rate">
					<label class="control-label" style="user-select:none;"><?= lang('rate') ?>: </label>
					<span class="stars">
						<!-- No Star -->
						<input class="rating__input rating__input--none" name="rating" id="rating-none" value="0" type="radio" />
						<label aria-label="No rating" class="rating__label" for="rating-none">
							<i class="rating__icon rating__icon--none fas fa-heart-broken"></i>
						</label>
						<!-- 1 Star -->
						<label aria-label="1 star" class="rating__label" for="rating-1">
							<i class="rating__icon rating__icon--star fas fa-star"></i>
						</label>
						<input class="rating__input" name="rating" id="rating-1" value="1" type="radio" />
						<!-- 2 Stars -->
						<label aria-label="2 stars" class="rating__label" for="rating-2">
							<i class="rating__icon rating__icon--star fas fa-star"></i>
						</label>
						<input class="rating__input" name="rating" id="rating-2" value="2" type="radio" />
						<!-- Default: 3 Stars -->
						<label aria-label="3 stars" class="rating__label" for="rating-3">
							<i class="rating__icon rating__icon--star fas fa-star"></i>
						</label>
						<input class="rating__input" name="rating" id="rating-3" value="3" type="radio" checked />
						<!-- 4 Stars -->
						<label aria-label="4 stars" class="rating__label" for="rating-4">
							<i class="rating__icon rating__icon--star fas fa-star"></i>
						</label>
						<input class="rating__input" name="rating" id="rating-4" value="4" type="radio" />
						<!-- 5 Stars -->
						<label aria-label="5 stars" class="rating__label" for="rating-5">
							<i class="rating__icon rating__icon--star fas fa-star"></i>
						</label>
						<input class="rating__input" name="rating" id="rating-5" value="5" type="radio" />
					</span>
				</div>
				<div class="assess-container popup-container feedback">
					<textarea id="assess_feedback" placeholder="<?= lang('stu_ma_popup_assess_hint') ?>" rows="6" style="resize: none;width:90%;border: 1px solid rgb(41, 109, 151, 0.7);"></textarea>
				</div>
				<hr />
				<div class="assess-container popup-container">
					<input id="assess_save" class="assess_buttons popup_buttons" type="button" value="<?= lang('submit') ?>">
					<input id="assess_cancel" class="assess_buttons popup_buttons" type="button" value="<?= lang('cancel') ?>">
				</div>
    		</form>
    	</div>
    </div>
</div>
