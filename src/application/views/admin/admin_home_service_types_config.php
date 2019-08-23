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
                  		<input type="text" class="form-control" id="appointments_management_service_type" placeholder="Type for a service category" title="Select a service category" autocomplete="off" />
                  		<div id="aa_st_display">
                  			<!-- Notice: If category is longer than 35 characters, scale it -->
                  			<ul id="filter-service-type" class="filter-list">
                 				<li class="filter-item filter-item--close" title="- Search all Service Categories -"><strong>Search all Service Categories</strong></li>
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
    	</div>

    	<div class="record-details col-xs-12 col-sm-6 col-md-7 col-lg-8 col-xl-10">			
           <!-- hide appointment id for data transfer -->
			<input id="appointment-id" type="hidden">
          
          	<h3><?= lang('details') ?></h3>
          
			<div class="row">
			    <div class="col-xs-12 col-sm-6" style="margin-left: 0;">
			        <div class="form-group">
			            <label class="control-label" for="service_name">Service Name</label>
			            <input id="service_name" class="form-control" readonly>
			        </div>
			        <div class="form-group">
			            <label class="control-label" for="service_description"><?= lang('name') ?></label>
			            <input id="service_description" class="form-control" readonly>
			        </div>
			    </div>
			</div>
			
			<h4><?= lang('current_tutors_in_this_service_type') ?></h4>
   	
    	</div>
    </div>
</div>