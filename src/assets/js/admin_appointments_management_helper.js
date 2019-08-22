(function () {

    'use strict';

    /**
     * AdminAppointmentsManagementHelper Class
     *
     * This class contains the methods that are used in the AdminAppointmentsManagementHelper page.
     *
     * @class AdminAppointmentsManagementHelper
     */
    function AdminAppointmentsManagementHelper() {
        this.filterResults = {};
    }

    /**
     * Binds the default event handlers of the AdminAppointmentsManagementHelper page.
     */
    AdminAppointmentsManagementHelper.prototype.bindEventHandlers = function () {
        var instance = this;

        /**
         * Event: Filter My Appointments Form "Submit"
         */
        $('#filter-appointments_management form').submit(function () {
            $('#filter-appointments_management .selected').removeClass('selected');
            instance.resetForm();
			var sc = $('#filter-appointments_management #appointments_management_service_type').val();
			var tn = $('#filter-appointments_management #appointments_management_tutor').val();
//            instance.filter($("#my_appointments_booking_status option:selected").val(),
//						   sc,
//						   tn);
            return false;	//	why?
        });

        /**
         * Event: Filter My Appointments Button "Click"
         */
        $('#filter-appointments_management .clear').click(function () {
			$('#filter-appointments_management #appointments_management_service_type').val('');
            $('#filter-appointments_management #appointments_management_tutor').val('');
            instance.filter();
            instance.resetForm();
			//	re-filter
			instance.filterList('.admin-page #filter-service-type span li', '');
			instance.filterList('.admin-page #filter-tutor-name span li', '');
        });

        /**
         * Event: Filter Entry "Click"
         *
         * Display the My Appointments data of the selected row.
         */
        $(document).on('click', '.entry', function () {
			//	Get clicked id
            var appointmentId = $(this).attr('data-id');
			
			//	Find the appointment according to id and get its data
            var appointment = {};
            $.each(instance.filterResults, function (index, item) {
                if (item.appointment_id === appointmentId) {
                    appointment = item;
                    return false;
                }
            });
			
			//	Display the data
            instance.display(appointment);
			
			//	Change selected display
            $('#filter-appointments_management .selected').removeClass('selected');
            $(this).addClass('selected');
        });    	
		
        /**
         * Event: Typing categoies
         */
		$('.admin-page #appointments_management_service_type').on("keyup", function() {
			var val = $(this).val().toLowerCase();
			instance.filterList('.admin-page #filter-service-type span li', val);
		});
		
        /**
         * Event: click the input bar, show filter details of service categories
         */
		$('.admin-page #appointments_management_service_type').focus(function() {
			$('#filter-appointments_management #aa_st_display').fadeIn();
			//	disable two buttons
			$('#filter-appointments_management #search-filter').prop('disabled', true);
			$('#filter-appointments_management #clear-filter').prop('disabled', true);
			//	Place footer one more time
			Admin.placeFooterToBottom();
		});	
        /**
         * Event: click the input bar, show filter details of tutor name
         */
		$('.admin-page #appointments_management_tutor').focus(function() {
//			$('#filter-appointments_management .curtain').fadeIn();
			$('#filter-appointments_management #aa_tn_display').fadeIn();
			//	disable two buttons
			$('#filter-appointments_management #search-filter').prop('disabled', true);
			$('#filter-appointments_management #clear-filter').prop('disabled', true);
			//	Place footer one more time
			Admin.placeFooterToBottom();
		});
		
        /**
         * Event: Typing tutor
         */
		$('.admin-page #appointments_management_tutor').on("keyup", function() {
			var val = $(this).val().toLowerCase();
			instance.filterList('.admin-page #filter-tutor-name span li', val);
		});
		
		/**
         * Event: Press list items for service categories
         */
		$(document).on('click', '.admin-page #aa_st_display .filter-item--close, .admin-page #aa_st_display .filter-item--find', function() {
			$('.admin-page #appointments_management_service_type').val($(this).attr("title"));
			$('#filter-appointments_management #aa_st_display').fadeOut();
			instance.filterList('.admin-page #filter-service-type span li', $('.admin-page #appointments_management_service_type').val().toLowerCase());
			//	enable two buttons
			$('#filter-appointments_management #search-filter').prop('disabled', false);
			$('#filter-appointments_management #clear-filter').prop('disabled', false);
			//	Place footer one more time
			Admin.placeFooterToBottom();
		});
		/**
         * Event: Press list items for tutor name
         */
		$(document).on('click', '.admin-page #aa_tn_display .filter-item--close, .admin-page #aa_tn_display .filter-item--find', function() {
			$('.admin-page #appointments_management_tutor').val($(this).attr("title"));
			$('#filter-appointments_management #aa_tn_display').fadeOut();
			instance.filterList('.admin-page #filter-tutor-name span li', $('.admin-page #appointments_management_tutor').val().toLowerCase());
			//	enable two buttons
			$('#filter-appointments_management #search-filter').prop('disabled', false);
			$('#filter-appointments_management #clear-filter').prop('disabled', false);
			//	Place footer one more time
			Admin.placeFooterToBottom();
		});
		
	};

    /**
     * Bring the appointment form back to its initial state.
     */
    AdminAppointmentsManagementHelper.prototype.resetForm = function () {
		
		//	Clear all textareas
        $('.record-details').find('input, textarea').val('');
		
		//	Enable search input buttons
        $('#filter-appointments_management button').prop('disabled', false);
		//	Erase all selected effects on search results part
        $('#filter-appointments_management .selected').removeClass('selected');
		//	When editing, background color will be added to indicate that
		//	selections are disabled. Writing as below removes the color when
		//	resetting the form
        $('#filter-appointments_management .results').css('color', '');
    };

    /**
     * Display an appointment record into the form.
     *
     * @param {Object} appointment Contains the appointment record data.
     */
    AdminAppointmentsManagementHelper.prototype.display = function (appointment) {
		
        $('#appointment-id').val(appointment.appointment_id);		
		
		$('#remark').val((appointment.remark !== null && appointment.remark !== "") ? appointment.remark : "None");
		$('#booking_status').val(this.decodeBookingStatus(appointment.booking_status));
		$('#stars').val(appointment.stars);
		$('#com_or_sug').val(appointment.com_or_sug);
		
		$('#description').val(appointment.appointment_description);
		$('#service_type').val(appointment.service_type);
		
		$('#tutor').val(appointment.first_name + " " + appointment.last_name);
		$('#notes').val(appointment.notes);
		
		$('#book_datetime').val(GeneralFunctions.formatDate(Date.parse(appointment.book_datetime), GlobalVariables.dateFormat, true));
		$('#start_datetime').val(GeneralFunctions.formatDate(Date.parse(appointment.start_datetime), GlobalVariables.dateFormat, true));
		$('#end_datetime').val(GeneralFunctions.formatDate(Date.parse(appointment.end_datetime), GlobalVariables.dateFormat, true));
		
		$('#feedback').val(appointment.feedback);
		$('#suggestion').val(appointment.suggestion);
		
    };

    /**
     * Filter appointment records.
     *
     * @param {String} key This key string is used to filter the appointment records.
     * @param {Number} selectId Optional, if set then after the filter operation the record with the given
     * ID will be selected (but not displayed).
     * @param {Boolean} display Optional (false), if true then the selected record will be displayed on the form.
     */
    AdminAppointmentsManagementHelper.prototype.filter = function (bs, st, tn, selectId, display, first_load) {
        display = display || false;

        var postUrl = GlobalVariables.baseUrl + '/index.php/students_api/ajax_filter_my_appointments';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
            booking_status: JSON.stringify((bs === undefined || bs === '') ? 'ALL' : bs),
			service_type: JSON.stringify((st === undefined || st === '' || st === '- Search all Service Categories -') ? 'ALL' : st),
			tutor_name: JSON.stringify((tn === undefined || tn === '' || tn === '- Search all Tutors -') ? 'ALL' : tn)
        };

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			//	Store results
            this.filterResults = response;
			
			//	If this is the first time, load tutors and service categories
			if (first_load !== undefined && first_load === 'true') {
				this.getAllTutors();
				this.getAllServiceCategories();
			}
			
			//	Clear former results
            $('#filter-appointments_management .results').html('');
			
			//	Iterate through all appointments, generate htmls for them and
			//	add them to the results
            $.each(response, function (index, appointment) {
                var html = this.getFilterHtml(index, appointment);
                $('#filter-appointments_management .results').append(html);
            }.bind(this));
			
			//	If there are no match, print a message in the result block
            if (response.length === 0) {
                $('#filter-appointments_management .results').html('<em>' + EALang.no_records_found + '</em>');
            }
			
			//	If selectId is provided, show it
            if (selectId !== undefined) {
                this.select(selectId, display);
            }
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };

    /**
     * Get the filter results row HTML code.
     *
     * @param {Object} appointment Contains the appointment data.
     *
     * @return {String} Returns the record HTML code.
     */
    AdminAppointmentsManagementHelper.prototype.getFilterHtml = function (index, appointment) {
		
		//	The remark will be used in the first line
		var remark = (appointment.remark !== '' && appointment.remark !== null) ?
			appointment.remark : ("Appointment " + (index+1));
		//	The booking_status will shown as a label in the first line
		var booking_status = this.decodeBookingStatus(appointment.booking_status);
		
		//	The tutor's name will be used in the second line
        var tutor = appointment.first_name + ' ' + appointment.last_name;
		
		//	The starting time will be used in the third line
		var start_time = GeneralFunctions.formatDate(Date.parse(appointment.start_datetime), GlobalVariables.dateFormat, true);

		var line1 = "<strong>" + remark + "</strong>" + " " + "-" + " " + booking_status;
		var line2 = tutor;
		var line3 = start_time;
			
        var html =
            '<div class="entry" data-id="' + appointment.appointment_id + '">' +	//	Starting <div> block
            line1 + "<br />" +	//	line1
            line2 + "<br />" +	//	line2
            line3 +	//	line2
            '</div>	<hr />';		//	Ending </div> and a horizontal line
		
        return html;
    };

    /**
     * Select a specific record from the current filter results.
     *
     * If the appointment id does not exist in the list then no record will be selected.
     *
     * @param {Number} id The record id to be selected from the filter results.
     * @param {Boolean} display Optional (false), if true then the method will display the record
     * on the form.
     */
    AdminAppointmentsManagementHelper.prototype.select = function (id, display) {
        display = display || false;
		
		//	Remove all selected classes in advance
        $('#filter-appointments_management .selected').removeClass('selected');
		
		//	Find the given Id and add "selected" class to it
        $('#filter-appointments_management .entry').each(function () {
            if ($(this).attr('data-id') === id) {
                $(this).addClass('selected');
                return false;
            }
        });
		
		//	If display === true, display the appointment
        if (display) {
            $.each(this.filterResults, function (index, appointment) {
                if (appointment.appointment_id === id) {
                    this.display(appointment);
//                    $('#edit-appointment, #delete-appointment').prop('disabled', false);
                    return false;
                }
            }.bind(this));
        }
    };
	
    /**
     * Get all tutors and wrap them in an html
     */
    AdminAppointmentsManagementHelper.prototype.getAllTutors = function() {
        var postUrl = GlobalVariables.baseUrl + '/index.php/general_api/ajax_get_all_tutor';
        var postData = {
            csrfToken: GlobalVariables.csrfToken
        };
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			//	Clear all data
			$('#filter-appointments_management #filter-tutor-name span').html('');
			
			//	Iterate through all tutors, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, tutor) {
				var display_tutor = (tutor.name.length >= 35) ? "Too Long!!!!!!!!!" : tutor.name;
				var html = "<li class='filter-item filter-item--find' title='" + tutor.name + "'>" + display_tutor + "</li>";
				$('#filter-appointments_management #filter-tutor-name span').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
    AdminAppointmentsManagementHelper.prototype.getAllServiceCategories = function() {
        var postUrl = GlobalVariables.baseUrl + '/index.php/general_api/ajax_get_all_service_types';
        var postData = {
            csrfToken: GlobalVariables.csrfToken
        };
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			//	Clear all data
			$('#filter-appointments_management #filter-service-type span').html('');
			
			//	Iterate through all tutors, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, service) {
				var display_service = (service.name.length >= 35) ? "Too Long" : service.name;
				var html = "<li class='filter-item filter-item--find' title='" + service.name + "'>" + display_service + "</li>";
				$('#filter-appointments_management #filter-service-type span').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
    AdminAppointmentsManagementHelper.prototype.filterList = function(filterItem, filterValue) {
		$(filterItem).filter(function() {
			$(this).toggle($(this)[0].title.toLowerCase().indexOf(filterValue) > -1);
		});
    };
	
    window.AdminAppointmentsManagementHelper = AdminAppointmentsManagementHelper;
})();
