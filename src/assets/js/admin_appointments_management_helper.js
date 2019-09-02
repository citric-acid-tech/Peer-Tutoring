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
			var id = $('#appointment-id').val();
			var bs = $("#my_appointments_booking_status option:selected").val();
			var st = $('#filter-appointments_management #appointments_management_service_type').val();
			var tn = $('#filter-appointments_management #appointments_management_tutor').val();
			var sn = $('#filter-appointments_management #appointments_management_students').val();
			var start_dt = $('#filter-appointments_management #appointments_management_start_date').val();
			var end_dt = $('#filter-appointments_management #appointments_management_end_date').val();
			//	Validate date time
			if (!instance.validateDateTime(start_dt, end_dt)) {
				return false;
			}
            $('#filter-appointments_management .selected').removeClass('selected');
            instance.resetForm();
            instance.filter(id, bs, st, tn, sn, start_dt, end_dt);
            return false;	//	why?
        });

        /**
         * Event: Filter My Appointments Button "Click"
         */
        $('#filter-appointments_management .clear').click(function () {
			//	Reset booking status input
			$("#appointments_management_booking_status option:selected")[0].selected = false;
			$('#appointments_management_booking_status .default_bs').prop('selected', true);
			//	Reset service type input
			$('#filter-appointments_management #appointments_management_service_type').val('');
			//	Reset tutor and student filter input
            $('#filter-appointments_management #appointments_management_tutor').val('');
            $('#filter-appointments_management #appointments_management_students').val('');
			//	Reset date inputs
			$('#appointments_management_start_date, #appointments_management_end_date').val('');
            instance.filter();
            instance.resetForm();
			//	re-filter
			instance.filterList('.admin-page #filter-service-type span li', '');
			instance.filterList('.admin-page #filter-tutor-name span li', '');
			instance.filterList('.admin-page #filter-student-name span li', '');
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
                if (item.id === appointmentId) {
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
         * Event: Typing Service Types
         */
		$('.admin-page #appointments_management_service_type').on("keyup", function() {
			var val = $(this).val().toLowerCase();
			instance.filterList('.admin-page #filter-service-type span li', val);
		});
        /**
         * Event: Typing tutor
         */
		$('.admin-page #appointments_management_tutor').on("keyup", function() {
			var val = $(this).val().toLowerCase();
			instance.filterList('.admin-page #filter-tutor-name span li', val);
		});
        /**
         * Event: Typing student
         */
		$('.admin-page #appointments_management_students').on("keyup", function() {
			var val = $(this).val().toLowerCase();
			instance.filterList('.admin-page #filter-student-name span li', val);
		});
		
        /**
         * Event: click the input bar, show filter details of service types
         */
		$('.admin-page #appointments_management_service_type').focus(function() {
			$('#filter-appointments_management #am_st_display').fadeIn();
			//	disable two buttons
			$('#filter-appointments_management #search-filter').prop('disabled', true);
			$('#filter-appointments_management #clear-filter').prop('disabled', true);
			//	Place footer one more time
			setTimeout(function() {
				Admin.placeFooterToBottom();
			}, 500);
		});	
        /**
         * Event: click the input bar, show filter details of tutor name
         */
		$('.admin-page #appointments_management_tutor').focus(function() {
//			$('#filter-appointments_management .curtain').fadeIn();
			$('#filter-appointments_management #am_tn_display').fadeIn();
			//	disable two buttons
			$('#filter-appointments_management #search-filter').prop('disabled', true);
			$('#filter-appointments_management #clear-filter').prop('disabled', true);
			//	Place footer one more time
			setTimeout(function() {
				Admin.placeFooterToBottom();
			}, 500);
		});
        /**
         * Event: click the input bar, show filter details of student name
         */
		$('.admin-page #appointments_management_students').focus(function() {
//			$('#filter-appointments_management .curtain').slideDown(360);
			$('#filter-appointments_management #am_sn_display').slideDown(360);
			//	disable two buttons
			$('#filter-appointments_management #search-filter').prop('disabled', true);
			$('#filter-appointments_management #clear-filter').prop('disabled', true);
			//	Place footer one more time
			setTimeout(function() {
				Admin.placeFooterToBottom();
			}, 500);
		});
		
		/**
         * Event: Press list items for service categories
         */
		$(document).on('click', '.admin-page #am_st_display .filter-item--close, .admin-page #am_st_display .filter-item--find', function() {
			$('.admin-page #appointments_management_service_type').val($(this).attr("title"));
			$('#filter-appointments_management #am_st_display').fadeOut();
			instance.filterList('.admin-page #filter-service-type span li', $('.admin-page #appointments_management_service_type').val().toLowerCase());
			//	enable two buttons
			$('#filter-appointments_management #search-filter').prop('disabled', false);
			$('#filter-appointments_management #clear-filter').prop('disabled', false);
			//	Place footer one more time
			setTimeout(function() {
				Admin.placeFooterToBottom();
			}, 500);
		});
		/**
         * Event: Press list items for tutor name
         */
		$(document).on('click', '.admin-page #am_tn_display .filter-item--close, .admin-page #am_tn_display .filter-item--find', function() {
			$('.admin-page #appointments_management_tutor').val($(this).attr("title"));
			$('#filter-appointments_management #am_tn_display').fadeOut();
			instance.filterList('.admin-page #filter-tutor-name span li', $('.admin-page #appointments_management_tutor').val().toLowerCase());
			//	enable two buttons
			$('#filter-appointments_management #search-filter').prop('disabled', false);
			$('#filter-appointments_management #clear-filter').prop('disabled', false);
			//	Place footer one more time
			setTimeout(function() {
				Admin.placeFooterToBottom();
			}, 500);
		});
		/**
         * Event: Press list items for student name
         */
		$(document).on('click', '.admin-page #am_sn_display .filter-item--close, .admin-page #am_sn_display .filter-item--find', function() {
			$('.admin-page #appointments_management_students').val($(this).attr("title"));
			$('#filter-appointments_management #am_sn_display').slideUp(360);
			instance.filterList('.admin-page #filter-student-name span li', $('.admin-page #appointments_management_students').val().toLowerCase());
			//	enable two buttons
			$('#filter-appointments_management #search-filter').prop('disabled', false);
			$('#filter-appointments_management #clear-filter').prop('disabled', false);
			//	Place footer one more time
			setTimeout(function() {
				Admin.placeFooterToBottom();
			}, 500);
		});
		
		/**
         * Event: When selecting date, other date pickers should not occur at the same time
         */
		$('#appointments_management_start_date').focus(function() {
			$('#appointments_management_end_date').prop('disabled', true);
		});
		$('#appointments_management_end_date').focus(function() {
			$('#appointments_management_start_date').prop('disabled', true);
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
		
        $('#appointment-id').val(appointment.id);
		$('#booking_status').val(this.decodeBookingStatus(appointment.booking_status));
		$('#service_type').val(appointment.service_type);
		$('#tutor').val(appointment.tutor_name);
		$('#student').val(appointment.student_name);
		
		$('#book_datetime').val(GeneralFunctions.formatDate(Date.parse(appointment.book_datetime), GlobalVariables.dateFormat, true));
		$('#start_datetime').val(GeneralFunctions.formatDate(Date.parse(appointment.start_datetime), GlobalVariables.dateFormat, true));
		$('#end_datetime').val(GeneralFunctions.formatDate(Date.parse(appointment.end_datetime), GlobalVariables.dateFormat, true));
		
		$('#stars').val(appointment.stars);
		$('#com_or_sug').val(appointment.comment_or_suggestion_from_student);
		$('#feedback').val(appointment.feedback_from_tutor);
		$('#suggestion').val(appointment.suggestion_from_tutor);
		
    };

    /**
     * Filter appointment records.
     *
     * @param {String} key This key string is used to filter the appointment records.
     * @param {Number} selectId Optional, if set then after the filter operation the record with the given
     * ID will be selected (but not displayed).
     * @param {Boolean} display Optional (false), if true then the selected record will be displayed on the form.
     */
    AdminAppointmentsManagementHelper.prototype.filter = function (id, bs, st, tn, sn, sd, ed, selectId, display, first_load) {
        display = display || false;

        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_filter_appointments';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			appointment_id: (id === undefined || id === '') ? JSON.stringify('ALL') : id,
			booking_status: JSON.stringify((bs === undefined || bs === '') ? 'ALL' : bs),
			service_type: JSON.stringify((st === undefined || st === '' || st === '- Search all Service Categories -') ? 'ALL' : st),
			tutor_name: JSON.stringify((tn === undefined || tn === '' || tn === '- Search all Tutors -') ? 'ALL' : tn),
			student_name: JSON.stringify((sn === undefined || sn === '' || sn === '- Search all Students -') ? 'ALL' : sn),
			start_date: JSON.stringify((sd === undefined || sd === '') ? 'ALL' : sd),
			end_date: JSON.stringify((ed === undefined || ed === '') ? 'ALL' : ed)
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
				this.getAllStudents();
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
		
		//	The appointment_id and Service type will be used in the first line
		var appointment_id = appointment.id;
		var service_type = appointment.service_type;
		//	The booking_status will shown as a label in the first line
		var booking_status = this.decodeBookingStatus(appointment.booking_status);
		
		//	The tutor's name will be used in the second line
        var tutor = appointment.tutor_name;	
		
		//	The student's name will be used in the third line
        var student = appointment.student_name;
		
		//	The starting and ending time will be used in the fourth line
		var start_time = GeneralFunctions.formatDate(Date.parse(appointment.start_datetime), GlobalVariables.dateFormat, true);
		var end_time = GeneralFunctions.formatDate(Date.parse(appointment.end_datetime), GlobalVariables.dateFormat, true);

		var line1 = "<strong style='font-size:20px; color:rgba(41,109,151,0.75);'>" + appointment_id + " " + "</strong>" + "<strong>" + service_type + "</strong>" + " " + "-" + " " + booking_status;
		var line2 = "Tutor: " + tutor;
		var line3 = "Student: " + student;
		var line4 = start_time + " " + "~" + " " + end_time;
			
        var html =
            '<div class="entry" data-id="' + appointment.id + '">' +	//	Starting <div> block
            line1 + "<br />" +	//	line1
            line2 + "<br />" +	//	line2
            line3 + "<br />" +	//	line3
            line4 +	//	line4
            '</div>	<hr />';		//	Ending </div> and a horizontal line
		
        return html;
    };

    /**
     * Translate booking_status from numbers into language pack supported strings
     *
     * @param {Object} a number
     *
     * @return {String} Returns the string so it can be used as lang(str) or EALang.str
     */
    AdminAppointmentsManagementHelper.prototype.decodeBookingStatus = function (booking_status) {
		
		var translation_mark = "";
		switch(booking_status) {
			case "0": translation_mark = EALang.bs0;	break;
			case "1": translation_mark = EALang.bs1;	break;
			case "2": translation_mark = EALang.bs2;	break;
			case "3": translation_mark = EALang.bs3;	break;
			default: translation_mark = "no match booking status";
		}
		
        return translation_mark;
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
                if (appointment.id === id) {
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
				var display_tutor = (tutor.name !== null && tutor.name.length >= 35) ? "Too Long!!!!!!!!!" : tutor.name;
				var html = "<li class='filter-item filter-item--find' title='" + tutor.name + "'>" + display_tutor + "</li>";
				$('#filter-appointments_management #filter-tutor-name span').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all students and wrap them in an html
     */
    AdminAppointmentsManagementHelper.prototype.getAllStudents = function() {
        var postUrl = GlobalVariables.baseUrl + '/index.php/general_api/ajax_get_all_students';
        var postData = {
            csrfToken: GlobalVariables.csrfToken
        };
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			//	Clear all data
			$('#filter-appointments_management #filter-student-name span').html('');
			
			//	Iterate through all students, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, student) {
				var display_student = (student.name.length >= 35) ? "Too Long!!!!!!!!!" : student.name;
				var html = "<li class='filter-item filter-item--find' title='" + student.name + "'>" + display_student + "</li>";
				$('#filter-appointments_management #filter-student-name span').append(html);
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
	
    /**
     * Get all service categories and wrap them in an html
     */
    AdminAppointmentsManagementHelper.prototype.validateDateTime = function(sd, ed) {
		//	Use moment.js to parse the date
		var start_date = moment(sd);
		var end_date = moment(ed);
		//	Check if dates separately are valid
		var start_valid = (sd === '') || start_date.isValid();
		var end_valid = (ed === '') || end_date.isValid();
		//	Check Validity
		if (start_valid && end_valid) {
			//	If end_date is before start_date, gg
			if (start_date > end_date) {
				Admin.displayNotification("Ending Date is before Starting Date!", undefined, "failure");
				return false;
			} else {
				return true;
			}
		} else {
			//	If Any of them is invalid, gg
			Admin.displayNotification("Invalid Date Input!", undefined, "failure");
			return false;
		}
    };
	
    window.AdminAppointmentsManagementHelper = AdminAppointmentsManagementHelper;
})();
