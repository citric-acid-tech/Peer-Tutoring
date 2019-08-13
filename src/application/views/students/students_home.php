<script src="<?= asset_url('assets/ext/jquery-ui/jquery-ui-timepicker-addon.js') ?>"></script>

<script src="<?= asset_url('assets/js/students_my_appointments_helper.js') ?>"></script>
<script src="<?= asset_url('assets/js/students_my_appointments.js') ?>"></script>
<script>
    var GlobalVariables = {
        csrfToken          : <?= json_encode($this->security->get_csrf_hash()) ?>,
        availableProviders : <?= json_encode($available_providers) ?>,
        availableServices  : <?= json_encode($available_services) ?>,
        secretaryProviders : <?= json_encode($secretary_providers) ?>,
        dateFormat         : <?= json_encode($date_format) ?>,
        timeFormat         : <?= json_encode($time_format) ?>,
        baseUrl            : <?= json_encode($base_url) ?>,
        customers          : <?= json_encode($customers) ?>,
        user               : {
            id         : <?= $user_id ?>,
            email      : <?= json_encode($user_email) ?>,
            role_slug  : <?= json_encode($role_slug) ?>,
            privileges : <?= json_encode($privileges) ?>
        }
    };

    $(document).ready(function() {
        StudentsMyAppointment.initialize(true);
    });
</script>

<div id="customers-page" class="container-fluid backend-page">
    <div class="row">
    	<div id="filter-my_appointments" class="filter-records column col-xs-12 col-sm-5">
    		<form>
                <div class="input-group">
                    <input type="text" class="key form-control">

                    <div class="input-group-addon">
                        <div>
                            <button class="filter btn btn-default" type="submit" title="<?= lang('filter') ?>">
                                <span class="glyphicon glyphicon-search"></span>
                            </button>
                            <button class="clear btn btn-default" type="button" title="<?= lang('clear') ?>">
                                <span class="glyphicon glyphicon-repeat"></span>
                            </button>
                        </div>
                    </div>
                </div>
    		</form>

            <h3><?= lang('customers') ?></h3>
            
            <!-- Here are the results on the left -->
            <div class="results"></div>
    	</div>

    	<div class="record-details col-xs-12 col-sm-7">
            <div class="btn-toolbar">
                <div id="cancel-assess-group" class="btn-group">
                    <button id="cancel-appointment" class="btn btn-default">
                        <i class="glyphicon glyphicon-remove"></i>&nbsp;
                        <?= lang('cancel_appointment') ?>
                    </button>
                    
                    <button id="add-appointment" class="btn btn-primary">
                        <i class="glyphicon glyphicon-pencil"></i>&nbsp;
                        <?= lang('assess') ?>
                    </button>
                </div>
           </div>
			
           <!-- hide appointment id for data transfer -->
           <input id="appointment-id" type="hidden">

           <div class="row">
               <div class="col-xs-12 col-sm-6" style="margin-left: 0;">
                   <h3><?= lang('details') ?></h3>
                   
                   <div class="form-group">
                       <label class="control-label" for="service_type"><?= lang('service_type') ?></label>
                       <input id="service_type" class="form-control" readonly>
                   </div>
                   <div class="form-group">
                       <label class="control-label" for="tutor"><?= lang('tutor') ?></label>
                       <input id="tutor" class="form-control" readonly>
                   </div>
                   <div class="form-group">
                       <label class="control-label" for="description"><?= lang('description') ?></label>
                       <input id="description" class="form-control" readonly>
                   </div>
                   <div class="form-group">
                       <label class="control-label" for="time"><?= lang('time') ?></label>
                       <input id="time" class="form-control" readonly>
                   </div>
                   <div class="form-group">
                       <label class="control-label" for="booking_status"><?= lang('booking_status') ?></label>
                       <input id="booking_status" class="form-control" readonly>
                   </div>

                   <div class="form-group">
                       <label class="control-label" for="feedback"><?= lang('feedback') ?></label>
                       <textarea id="feedback" rows="4" class="form-control" style="resize: none;" readonly></textarea>
                   </div>
                   <div class="form-group">
                       <label class="control-label" for="suggestion"><?= lang('suggestion') ?></label>
                       <textarea id="suggestion" rows="4" class="form-control" style="resize: none;" readonly></textarea>
                   </div>

               </div>
           </div>
    	</div>
    </div>
</div>
