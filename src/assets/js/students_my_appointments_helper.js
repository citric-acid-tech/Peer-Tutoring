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
			var sc = $('#filter-my_appointments #my_appointments_service_category').val();
			var tn = $('#filter-my_appointments #my_appointments_tutor').val();
            instance.filter($("#my_appointments_booking_status option:selected").val(),
						   sc,
						   tn);
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
			//	re-filter
			instance.filterList('.students-page #filter-service-category span li', '');
			instance.filterList('.students-page #filter-tutor-name span li', '');
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
			
			//	If cancelled, disable cancel appointment button
			if (appointment.booking_status === '0') {
				$('#cancel-appointment').prop('disabled', false);
			} else {
				$('#cancel-appointment').prop('disabled', true);
			}
			
			//	If finished and not cancelled, enable assess appointment button
			if (appointment.booking_status === '1') {
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
                    text: EALang.confirm,
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
					Students.displayNotification(EALang.stu_ma_assess_success, undefined, "success");
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
		
		
        /**
         * Event: Typing categoies
         */
		$('.students-page #my_appointments_service_category').on("keyup", function() {
			var val = $(this).val().toLowerCase();
			instance.filterList('.students-page #filter-service-category span li', val);
		});
		
        /**
         * Event: click the input bar, show filter details of service categories
         */
		$('.students-page #my_appointments_service_category').focus(function() {
			$('#filter-my_appointments #ma_sc_display').slideDown(360);
			//	disable two buttons
			$('#filter-my_appointments #search-filter').prop('disabled', true);
			$('#filter-my_appointments #clear-filter').prop('disabled', true);
			//	Place footer one more time
			setTimeout(function() {
				Students.placeFooterToBottom();
			}, 500);
		});	
        /**
         * Event: click the input bar, show filter details of tutor name
         */
		$('.students-page #my_appointments_tutor').focus(function() {
			$('#filter-my_appointments #ma_tn_display').slideDown(360);
			//	disable two buttons
			$('#filter-my_appointments #search-filter').prop('disabled', true);
			$('#filter-my_appointments #clear-filter').prop('disabled', true);
			//	Place footer one more time
			setTimeout(function() {
				Students.placeFooterToBottom();
			}, 500);
		});
		
        /**
         * Event: Typing tutor
         */
		$('.students-page #my_appointments_tutor').on("keyup", function() {
			var val = $(this).val().toLowerCase();
			instance.filterList('.students-page #filter-tutor-name span li', val);
		});
		
		/**
         * Event: Press list items for service categories
         */
		$(document).on('click', '.students-page #ma_sc_display .filter-item--close, .students-page #ma_sc_display .filter-item--find', function() {
			$('.students-page #my_appointments_service_category').val($(this).attr("title"));
			$('#filter-my_appointments #ma_sc_display').slideUp(360);
			instance.filterList('.students-page #filter-service-category span li', $('.students-page #my_appointments_service_category').val().toLowerCase());
			//	enable two buttons
			$('#filter-my_appointments #search-filter').prop('disabled', false);
			$('#filter-my_appointments #clear-filter').prop('disabled', false);
			//	Place footer one more time
			setTimeout(function() {
				Students.placeFooterToBottom();
			}, 500);
		});
		/**
         * Event: Press list items for tutor name
         */
		$(document).on('click', '.students-page #ma_tn_display .filter-item--close, .students-page #ma_tn_display .filter-item--find', function() {
			$('.students-page #my_appointments_tutor').val($(this).attr("title"));
			$('#filter-my_appointments #ma_tn_display').slideUp(360);
			instance.filterList('.students-page #filter-tutor-name span li', $('.students-page #my_appointments_tutor').val().toLowerCase());
			//	enable two buttons
			$('#filter-my_appointments #search-filter').prop('disabled', false);
			$('#filter-my_appointments #clear-filter').prop('disabled', false);
			//	Place footer one more time
			setTimeout(function() {
				Students.placeFooterToBottom();
			}, 500);
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
				Students.displayNotification(EALang.stu_ma_cancel_appointment_unknown_error);
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
		
		$('#booking_status').removeClass('bs0');
		$('#booking_status').removeClass('bs1');
		$('#booking_status').removeClass('bs2');
		$('#booking_status').removeClass('bs3');

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
		//	Download
		$('#download a').prop('href', 'javascript:void(0);');
		$('#download a').addClass('disableEvents');
		$('#download').prop('disabled', true);
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
		$('#booking_status').removeClass('bs0');
		$('#booking_status').removeClass('bs1');
		$('#booking_status').removeClass('bs2');
		$('#booking_status').removeClass('bs3');
		$('#booking_status').addClass("bs" + appointment.booking_status);
		
		$('#stars').val(appointment.stars);
		$('#com_or_sug').val(appointment.com_or_sug);
		
		$('#description').val(appointment.appointment_description);
		$('#service_type').val(appointment.service_type);
		
		$('#tutor').val(appointment.tutor_sid + " " + appointment.first_name + " " + appointment.last_name);
		$('#notes').val(appointment.notes);
		
		$('#book_datetime').val(GeneralFunctions.formatDate(Date.parse(appointment.book_datetime), GlobalVariables.dateFormat, true));
		$('#start_datetime').val(GeneralFunctions.formatDate(Date.parse(appointment.start_datetime), GlobalVariables.dateFormat, true));
		$('#end_datetime').val(GeneralFunctions.formatDate(Date.parse(appointment.end_datetime), GlobalVariables.dateFormat, true));
		
		$('#feedback').val(appointment.feedback);
		$('#suggestion').val(appointment.suggestion);		
		
		//	Download
		var date = moment(appointment.start_datetime).format('YYYY-MM-DD');
		$('#download a').prop('href', GlobalVariables.downloadPrefix + appointment.attachment_url + "/" + appointment.service_type.replace(' ', '') + "/" + (GlobalVariables.student_sid === null ? "0" : GlobalVariables.student_sid) + "/" + (appointment.tutor_sid === null ? "0" : appointment.tutor_sid) + "/" + date);
		$('#download a').removeClass('disableEvents');
		$('#download').prop('disabled', false);
		
    };

    /**
     * Filter appointment records.
     *
     * @param {String} key This key string is used to filter the appointment records.
     * @param {Number} selectId Optional, if set then after the filter operation the record with the given
     * ID will be selected (but not displayed).
     * @param {Boolean} display Optional (false), if true then the selected record will be displayed on the form.
     */
    StudentsMyAppointmentHelper.prototype.filter = function (bs, st, tn, selectId, display, first_load) {
        display = display || false;

        var postUrl = GlobalVariables.baseUrl + '/index.php/students_api/ajax_filter_my_appointments';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
            booking_status: JSON.stringify((bs === undefined || bs === '') ? 'ALL' : bs),
			service_type: JSON.stringify((st === undefined || st === '' || st === '- ' + EALang.search_all_service_categories + ' -') ? 'ALL' : st),
			tutor_name: JSON.stringify((tn === undefined || tn === '' || tn === '- ' + EALang.search_all_tutors + ' -') ? 'ALL' : tn)
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
			appointment.remark : (EALang.appointment + " " + (index+1));
		//	The booking_status will shown as a label in the first line
		var booking_status = this.decodeBookingStatus(appointment.booking_status);
		
		//	The tutor's name will be used in the second line
        var tutor = appointment.first_name + ' ' + appointment.last_name;
		
		//	The starting time will be used in the third line
		var start_time = GeneralFunctions.formatDate(Date.parse(appointment.start_datetime), GlobalVariables.dateFormat, true);

		var line1 = "<strong>" + remark + "</strong>" + " " + "-" + " <span class='bs" + appointment.booking_status + "'>" + booking_status + "</span>";
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
			default: translation_mark = EALang.bs_404;
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
        var postData = {
            csrfToken: GlobalVariables.csrfToken
        };
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			//	Clear all data
			$('#filter-my_appointments #filter-tutor-name span').html('');
			
			//	Iterate through all tutors, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, tutor) {
				//	Fix an admin account bug
				var cas_sid = tutor.cas_sid;
				if (cas_sid === null) {
					cas_sid = '';
				}
				var display_tutor = (tutor.name !== null && tutor.name.length >= 25) ? (cas_sid + " " + tutor.name.substring(0,20) + "...") : cas_sid + " " + tutor.name;
				var html = "<li class='filter-item filter-item--find' title='" + cas_sid + " " + tutor.name + "'>" + display_tutor + "</li>";
				$('#filter-my_appointments #filter-tutor-name span').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
    StudentsMyAppointmentHelper.prototype.getAllServiceCategories = function() {
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
			$('#filter-my_appointments #filter-service-category span').html('');
			
			//	Iterate through all tutors, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, service) {
				var display_service = (service.name.length >= 35) ? "Too Long" : service.name;
				var html = "<li class='filter-item filter-item--find' title='" + service.name + "'>" + display_service + "</li>";
				$('#filter-my_appointments #filter-service-category span').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
    StudentsMyAppointmentHelper.prototype.filterList = function(filterItem, filterValue) {
		$(filterItem).filter(function() {
			if ($(this)[0].title.toLowerCase().indexOf(filterValue) > -1) {
				//	If match, show
				if ($(this).css('display') === 'none') {
					//	If hide before, show it
					$(this).slideDown(300);
				}
				//	If shown already, do nothing
			} else {
				//	If not match, hide
				if ($(this).css('display') !== 'none') {
					//	If shown, then we hide it
					$(this).slideUp(300);
				}
				//	If hided already, do nothing
			}
		});
    };
	
    window.StudentsMyAppointmentHelper = StudentsMyAppointmentHelper;
})();
