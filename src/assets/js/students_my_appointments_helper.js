(function () {

    'use strict';

    /**
     * StudentsMyAppointmentHelper Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class StudentsMyAppointmentHelper
     */
    function StudentsMyAppointmentHelper() {
        this.filterResults = {};
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    StudentsMyAppointmentHelper.prototype.bindEventHandlers = function () {
        var instance = this;

        /**
         * Event: Filter My Appointments Form "Submit"
         */
        $('#filter-my_appointments form').submit(function () {
			
            $('#filter-my_appointments .selected').removeClass('selected');
            instance.resetForm();
            instance.filter($("#my_appointments_booking_status option:selected").val(),
						   $('#filter-my_appointments #my_appointments_service_category').val(),
						   $('#filter-my_appointments #my_appointments_tutor').val());
            return false;	//	why?
        });

        /**
         * Event: Filter My Appointments Button "Click"
         */
        $('#filter-my_appointments .clear').click(function () {
			$("#my_appointments_booking_status option:selected")[0].selected = false;
			$('#my_appointments_booking_status .default_bs').prop('selected', true);
			$('#filter-my_appointments #my_appointments_service_category').val('');
            $('#filter-my_appointments #my_appointments_tutor').val('');
            instance.filter();
            instance.resetForm();
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
            $('#filter-my_appointments .selected').removeClass('selected');
            $(this).addClass('selected');
			
			//	Enable cancel appointment button
			$('#cancel-appointment').prop('disabled', false);
			
			//	If finished and not cancelled, enable assess appointment button
			if (appointment.booking_status === '1' || appointment.booking_status === '2') {
				$('#assess-appointment').prop('disabled', false);
			} else {
				$('#assess-appointment').prop('disabled', true);
			}
        });

		
        /**
         * Event: Cancel Appointment Button "Click"
         */
        $('#cancel-appointment').click(function () {
			//	Get current appointment id
            var appointmentId = $('#appointment-id').val();
            var buttons = [
                {
                    text: EALang.cancel_appointment,
                    click: function () {
                        instance.cancelAppointment(appointmentId);
                        $('#message_box').dialog('close');
                    }
                },
                {
                    text: EALang.cancel,
                    click: function () {
                        $('#message_box').dialog('close');
                    }
                }
            ];

            GeneralFunctions.displayMessageBox(EALang.cancel_appointment_title,
                EALang.cancel_appointment_hint, buttons);
        });
    
		
        /**
         * Event: Assess Service Button "Click"
         */
		$('.students-page #assess-appointment').click(function() {
			$('#popup_assess .curtain').fadeIn();
			$('#assess_popup').fadeIn();
		});
		
		
        /**
         * Event: Save Assessment Button "Click"
         */
		$('.students-page #assess_save').click(function() {
			//	Save first
			
			//	Get current appointment id
            var appointmentId = $('#appointment-id').val();
        	var postUrl = GlobalVariables.baseUrl + '/index.php/students_api/ajax_rate_and_comment';
        	var postData = {
        	    csrfToken: GlobalVariables.csrfToken,
        	    appointment_id: appointmentId,
				stars: $("#popup_assess input[name='rating']:checked").val(),
				comment_or_suggestion: JSON.stringify($('#assess_feedback').val())
        	};
			
        	$.post(postUrl, postData, function (response) {
				//	Test whether response is an exception or a warning
        	    if (!GeneralFunctions.handleAjaxExceptions(response)) {
        	        return;
        	    }
				
				if (response === 'SUCCESS') {
					Students.displayNotification("Assessment Completed!", undefined, "success");
				}
        	}.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
			
			$('#assess_save, #assess_cancel').prop('disabled', true);
			
			//	Hide
			setTimeout(function() {
				$('#popup_assess .curtain').fadeOut();
				$('#assess_popup').fadeOut();
				
				//	Clear Assessment form
				instance.clearAssess();
				$('#assess_save, #assess_cancel').prop('disabled', false);
				
				//	Re-display
				instance.filter(undefined, undefined, undefined, appointmentId, true);
			}, 3000);
		});
		
		
        /**
         * Event: Cancel Assessment Button "Click"
         */
		$('.students-page #assess_cancel').click(function() {
			$('#popup_assess .curtain').fadeOut();
			$('#assess_popup').fadeOut();
			instance.clearAssess();
		});
	};

    /**
     * Cancel an appointment record from database.
     *
     * @param {Number} id Record id to be cancelled.
     */
    StudentsMyAppointmentHelper.prototype.cancelAppointment = function (id) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/students_api/ajax_cancel_appointment';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
            appointment_id: id
        };
        $.post(postUrl, postData, function (response) {
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }

			if (response.cancellation_result === 'cancellation_accepted') {
				Students.displayNotification(EALang.appointment_cancelled, undefined, "success");
			} else if (response.cancellation_result === 'cancellation_refused') {
				Students.displayNotification(EALang.hint_fail_to_cancel_timesake, undefined, "failure");
			} else {
				Students.displayNotification("Something went wrong on the output of the cancellation");
			}
            
            this.resetForm();
            this.filter();
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };

    /**
     * Bring the appointment form back to its initial state.
     */
    StudentsMyAppointmentHelper.prototype.resetForm = function () {
		
		//	Clear all textareas
        $('.record-details').find('input, textarea').val('');

        //	Disable all operation buttons when the form is reset
		$('#cancel-appointment, #assess-appointment').prop('disabled', true);
		//	Show the button group
        $('#cancel-assess-group').show();
		
		//	Enable search input buttons
        $('#filter-my_appointments button').prop('disabled', false);
		//	Erase all selected effects on search results part
        $('#filter-my_appointments .selected').removeClass('selected');
		//	When editing, background color will be added to indicate that
		//	selections are disabled. Writing as below removes the color when
		//	resetting the form
        $('#filter-my_appointments .results').css('color', '');
    };

    /**
     * Display an appointment record into the form.
     *
     * @param {Object} appointment Contains the appointment record data.
     */
    StudentsMyAppointmentHelper.prototype.display = function (appointment) {
		
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
    StudentsMyAppointmentHelper.prototype.filter = function (bs, st, tn, selectId, display) {
        display = display || false;

        var postUrl = GlobalVariables.baseUrl + '/index.php/students_api/ajax_filter_my_appointments';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
            booking_status: JSON.stringify((bs === undefined || bs === '') ? 'ALL' : bs),
			service_type: JSON.stringify((st === undefined || st === '') ? 'ALL' : st),
			tutor_name: JSON.stringify((tn === undefined || tn === '') ? 'ALL' : tn)
        };

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			//	Store results
            this.filterResults = response;
			
			//	Clear former results
            $('#filter-my_appointments .results').html('');
			
			//	Iterate through all appointments, generate htmls for them and
			//	add them to the results
            $.each(response, function (index, appointment) {
                var html = this.getFilterHtml(index, appointment);
                $('#filter-my_appointments .results').append(html);
            }.bind(this));
			
			//	If there are no match, print a message in the result block
            if (response.length === 0) {
                $('#filter-my_appointments .results').html('<em>' + EALang.no_records_found + '</em>');
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
    StudentsMyAppointmentHelper.prototype.getFilterHtml = function (index, appointment) {
		
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
     * Translate booking_status from numbers into language pack supported strings
     *
     * @param {Object} a number
     *
     * @return {String} Returns the string so it can be used as lang(str) or EALang.str
     */
    StudentsMyAppointmentHelper.prototype.decodeBookingStatus = function (booking_status) {
		
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
    StudentsMyAppointmentHelper.prototype.select = function (id, display) {
        display = display || false;
		
		//	Remove all selected classes in advance
        $('#filter-my_appointments .selected').removeClass('selected');
		
		//	Find the given Id and add "selected" class to it
        $('#filter-my_appointments .entry').each(function () {
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
     * Clear assessment
     */
    StudentsMyAppointmentHelper.prototype.clearAssess = function() {
		$('#assess_feedback').val('');
		$("#popup_assess input[name='rating']:checked")[0].checked = false;
		$('.rating__input#rating-3').prop('checked', true);
    };	
	
    /**
     * Get all tutors and wrap them in an html
     */
    StudentsMyAppointmentHelper.prototype.getAllTutors = function() {
        var postUrl = GlobalVariables.baseUrl + '/index.php/general_api/ajax_get_all_tutor';
		
        $.post(postUrl, function (response) {
//			//	Test whether response is an exception or a warning
//            if (!GeneralFunctions.handleAjaxExceptions(response)) {
//                return;
//            }
//			
//			//	Clear all data
//			$('#filter-my_appointments #filter-service-category span').html('');
//			
//			//	Iterate through all tutors, generate htmls for them and
//			//	add them to the list
//            $.each(response, function (index, tutor) {
//				var display_tutor = (tutor.first_name.length + tutor.last_name.length >= 34) ? "Too Long" : (tutor.first_name + " " + tutor.last_name);
//                var html = "<li class='filter-item filter-item--find' title='" + tutor.first_name + " " + tutor.last_name + "'>" + display_tutor + "</li>";
//                $('#filter-my_appointments #filter-service-category span').append(html);
//            }.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };	
	
    window.StudentsMyAppointmentHelper = StudentsMyAppointmentHelper;
})();
