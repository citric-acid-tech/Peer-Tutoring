(function () {

    'use strict';

    /**
     * TutorsAppointmentManagementHelper Class
     *
     * This class contains the methods that are used in the Tutors My Appointment page.
     *
     * @class TutorsAppointmentManagementHelper
     */
    function TutorsAppointmentManagementHelper() {
        this.filterResults = {};
		this.nostarHTML = '<i class="fas fa-heart-broken" style="color:red;"></i>';
		this.starHTML = '<i class="fas fa-star" style="color:orange;"></i>';
    }

    /**
     * Binds the default event handlers of the Tutors My Appointment page.
     */
    TutorsAppointmentManagementHelper.prototype.bindEventHandlers = function () {
        var instance = this;

        /**
         * Event: Filter My Appointments Form "Submit"
         */
        $('#filter-my_appointments form').submit(function () {
			var st = $('#filter-my_appointments #tutor-appointment_management_service_category').val();
			var sn = $('#filter-my_appointments #tutor-appointment_management_students').val();
			var start_dt = $('#tutor-appointment_management_start_date').val();
			var end_dt = $('#tutor-appointment_management_end_date').val();
			//	Validate date time
			if (!instance.validateDateTime(start_dt, end_dt)) {
				return false;
			}
            $('#filter-my_appointments .selected').removeClass('selected');
            instance.resetForm();
            instance.filter($("#tutor-appointment_management_booking_status option:selected").val(),
						   st, sn, start_dt, end_dt);
            return false;	//	why?
        });

        /**
         * Event: Filter My Appointments Button "Click"
         */
        $('#filter-my_appointments .clear').click(function () {
			//	Reset booking status input
			$("#tutor-appointment_management_booking_status option:selected")[0].selected = false;
			$('#tutor-appointment_management_booking_status .default_bs').prop('selected', true);
			//	Reset service type input
			$('#filter-my_appointments #tutor-appointment_management_service_category').val('');
			//	Reset student filter input
            $('#filter-my_appointments #tutor-appointment_management_students').val('');
			//	Reset date inputs
			$('#tutor-appointment_management_start_date, #tutor-appointment_management_end_date').val('');
            instance.filter();
            instance.resetForm();
			//	re-filter
			instance.filterList('.tutors-page #filter-service-category span li', '');
			instance.filterList('.tutors-page #filter-student-name span li', '');
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
            $('#filter-my_appointments .selected').removeClass('selected');
            $(this).addClass('selected');
			
			//	If Finished or Cancelled, disable two buttons
			if (appointment.booking_status === '1' || appointment.booking_status === '2' || appointment.booking_status === '3') {
				$('#modify_service_status').prop('disabled', true);
				$('#provide_feedback_and_suggestions').prop('disabled', true);
			} else {
				$('#modify_service_status').prop('disabled', false);
				$('#provide_feedback_and_suggestions').prop('disabled', false);
			}
        });

		
        /**
         * Event: Modify Service Status Button "Click"
         */
        $('#modify_service_status').click(function () {
			//	Get current appointment id
            var appointmentId = $('#appointment-id').val();
			var buttons;
			
			var service_status_data = $('#booking_status').val();
			var service_status_to, service_status_lang;
			if (service_status_data === EALang.bs0) {
				service_status_to = '1';
				service_status_lang = EALang.bs1;
			} 
//			else if (service_status_data === EALang.bs1) {
//				service_status_to = '2';
//				service_status_lang = EALang.bs2;
//			} 
			else {
				Tutors.displayNotification(EALang.tut_aa_modstatus_404, undefined, "failure");
				return false;
			}

            buttons = [
                {
                    text: EALang.confirm,
                    click: function () {
                        instance.modifyServiceStatus(appointmentId, service_status_to);
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
			
            GeneralFunctions.displayMessageBox(EALang.next_service_status + ": " + service_status_lang,
											   EALang.tut_aa_modstatus_prompt, buttons);
        });
    
		
        /**
         * Event: Tutor Feedback Button "Click"
         */
		$('.tutors-page #provide_feedback_and_suggestions').click(function() {
			//	Load first
			$('#popup_feedback_input').val($('#feedback').val());
			$('#popup_suggestion_input').val($('#suggestion').val());
			$('#popup_tutor_feedback .curtain').fadeIn(360);
			$('#tutor_feedback_popup_window').fadeIn(360);
		});
		
		
        /**
         * Event: Save Feedback Button "Click"
         */
		$('.tutors-page #feedback_save').click(function() {
			//	Feedback is required, check
			var feedback = GeneralFunctions.superEscapeHTML($('#popup_feedback_input').val());
			if (feedback === '') {
				Tutors.displayNotification(EALang.tut_aa_save_empty_feedback, undefined, "failure");
				$('#popup_feedback_input').addClass('gg');
				setTimeout(function() {
					$('#popup_feedback_input').removeClass('gg');
				}, 300);
				return false;
			}
			
			//	Save first
			//	Get current appointment id
            var appointmentId = $('#appointment-id').val();
        	var postUrl = GlobalVariables.baseUrl + '/index.php/tutors_api/ajax_save_feedback_and_suggestion';
			
        	var postData = {
        	    csrfToken: GlobalVariables.csrfToken,
        	    appointment_id: appointmentId,
				feedback: JSON.stringify(feedback),
				suggestion: JSON.stringify(GeneralFunctions.superEscapeHTML($('#popup_suggestion_input').val()))
        	};
			
        	$.post(postUrl, postData, function (response) {
				//	Test whether response is an exception or a warning
        	    if (!GeneralFunctions.handleAjaxExceptions(response)) {
        	        return;
        	    }
				
				if (response === 'SUCCESS') {
					Tutors.displayNotification(EALang.tut_aa_save_feedback_success, undefined, "success");
				}
        	}.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
			
			$('#feedback_save, #feedback_cancel').prop('disabled', true);
			$('#feedback_save, #feedback_cancel').fadeOut(360);
			$('#tutor_feedback_popup_window').css('width', '1080px');
			$('#tutor_feedback_popup_window').css('height', '521px');
			
			//	Hide
			setTimeout(function() {
				$('#popup_tutor_feedback .curtain').fadeOut(360);
				$('#tutor_feedback_popup_window').fadeOut(360);
				
				//	Clear Assessment form
				instance.clearFeedback();
				$('#feedback_save, #feedback_cancel').prop('disabled', false);
				$('#feedback_save, #feedback_cancel').fadeIn(360);
				$('#tutor_feedback_popup_window').css('width', '1150px');
				$('#tutor_feedback_popup_window').css('height', '630px');
				
				//	Re-display
				instance.filter(undefined, undefined, undefined, undefined, undefined, appointmentId, true);
			}, 3000);
		});
		
		
        /**
         * Event: Cancel Feedback Button "Click"
         */
		$('.tutors-page #feedback_cancel').click(function() {
			$('#popup_tutor_feedback .curtain').fadeOut(360);
			$('#tutor_feedback_popup_window').fadeOut(360);
			instance.clearFeedback();
		});
		
		
        /**
         * Event: Typing categoies
         */
		$('.tutors-page #tutor-appointment_management_service_category').on("keyup", function() {
			var val = $(this).val().toLowerCase();
			instance.filterList('.tutors-page #filter-service-category span li', val);
		});
		
        /**
         * Event: click the input bar, show filter details of service categories
         */
		$('.tutors-page #tutor-appointment_management_service_category').focus(function() {
			$('#filter-my_appointments #am_sc_display').slideDown(360);
			//	disable two buttons
			$('#filter-my_appointments #search-filter').prop('disabled', true);
			$('#filter-my_appointments #clear-filter').prop('disabled', true);
			//	Place footer one more time
			Tutors.placeFooterToBottom();
		});	
        /**
         * Event: click the input bar, show filter details of student name
         */
		$('.tutors-page #tutor-appointment_management_students').focus(function() {
//			$('#filter-my_appointments .curtain').slideDown(360);
			$('#filter-my_appointments #am_tn_display').slideDown(360);
			//	disable two buttons
			$('#filter-my_appointments #search-filter').prop('disabled', true);
			$('#filter-my_appointments #clear-filter').prop('disabled', true);
			//	Place footer one more time
			Tutors.placeFooterToBottom();
		});
		
        /**
         * Event: Typing student
         */
		$('.tutors-page #tutor-appointment_management_students').on("keyup", function() {
			var val = $(this).val().toLowerCase();
			instance.filterList('.tutors-page #filter-student-name span li', val);
		});
		
		/**
         * Event: Press list items for service categories
         */
		$(document).on('click', '.tutors-page #am_sc_display .filter-item--close, .tutors-page #am_sc_display .filter-item--find', function() {
			$('.tutors-page #tutor-appointment_management_service_category').val($(this).attr("title"));
			$('#filter-my_appointments #am_sc_display').slideUp(360);
			instance.filterList('.tutors-page #filter-service-category span li', $('.tutors-page #tutor-appointment_management_service_category').val().toLowerCase());
			//	enable two buttons
			$('#filter-my_appointments #search-filter').prop('disabled', false);
			$('#filter-my_appointments #clear-filter').prop('disabled', false);
			//	Place footer one more time
			Tutors.placeFooterToBottom();
		});
		/**
         * Event: Press list items for student name
         */
		$(document).on('click', '.tutors-page #am_tn_display .filter-item--close, .tutors-page #am_tn_display .filter-item--find', function() {
			$('.tutors-page #tutor-appointment_management_students').val($(this).attr("data-stu_name"));
			$('#filter-my_appointments #am_tn_display').slideUp(360);
			instance.filterList('.tutors-page #filter-student-name span li', $('.tutors-page #tutor-appointment_management_students').val().toLowerCase());
			//	enable two buttons
			$('#filter-my_appointments #search-filter').prop('disabled', false);
			$('#filter-my_appointments #clear-filter').prop('disabled', false);
			//	Place footer one more time
			Tutors.placeFooterToBottom();
		});
		
		/**
         * Event: When selecting date, other date pickers should not occur at the same time
         */
		$('#tutor-appointment_management_start_date').focus(function() {
			$('#tutor-appointment_management_end_date').prop('disabled', true);
		});
		$('#tutor-appointment_management_end_date').focus(function() {
			$('#tutor-appointment_management_start_date').prop('disabled', true);
		});
	};

    /**
     * Modify Service Status from database.
     *
     * @param {Number} id Record id to be modified.
     */
    TutorsAppointmentManagementHelper.prototype.modifyServiceStatus = function (id, status) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/tutors_api/ajax_modify_status';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
            appointment_id: id,
			service_status: status
        };
        $.post(postUrl, postData, function (response) {
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			if (response === 'SUCCESS') {
				Tutors.displayNotification(EALang.tut_aa_modstatus_success, undefined, "success");
			} else {
				Tutors.displayNotification(EALang.tut_aa_modstatus_unknown_error);
			}
            
			var ins = this;
			setTimeout(function() {
            	ins.resetForm();
            	ins.filter(undefined, undefined, undefined, undefined, undefined, id, true);
			}, 500);
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };

    /**
     * Bring the appointment form back to its initial state.
     */
    TutorsAppointmentManagementHelper.prototype.resetForm = function () {
		
		//	Clear all textareas
        $('.record-details').find('input, textarea').val('');
		
		$('#booking_status').removeClass('bs0');
		$('#booking_status').removeClass('bs1');
		$('#booking_status').removeClass('bs2');
		$('#booking_status').removeClass('bs3');
		
		$(".stars input[type='radio']:checked").prop('checked', false);
		$(".stars .rating__icon--star").addClass('reset');

        //	Disable all operation buttons when the form is reset
		$('#modify_service_status, #provide_feedback_and_suggestions').prop('disabled', true);
		//	Show the button group
        $('#modify-feedback-group').show();
		
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
    TutorsAppointmentManagementHelper.prototype.display = function (appointment) {
		
        $('#appointment-id').val(appointment.id);		

		$('#booking_status').val(this.decodeBookingStatus(appointment.booking_status));
		$('#booking_status').removeClass('bs0');
		$('#booking_status').removeClass('bs1');
		$('#booking_status').removeClass('bs2');
		$('#booking_status').removeClass('bs3');
		$('#booking_status').addClass("bs" + appointment.booking_status);
		
		$('#service_type').val(appointment.service_type);
//		$('#service_description').val(appointment.service_description);
		
		var cas_sid = appointment.student_sid;
		var student_display;
		if (cas_sid === null) {
			student_display = appointment.student_name;
		} else {
			student_display = cas_sid + ' ' + appointment.student_name;
		}
		$('#student_name').val(student_display);
		$('#notes').val(appointment.notes);
		
		$('#book_datetime').val(GeneralFunctions.formatDate(Date.parse(appointment.book_datetime), GlobalVariables.dateFormat, true));
		$('#start_datetime').val(GeneralFunctions.formatDate(Date.parse(appointment.start_datetime), GlobalVariables.dateFormat, true));
		$('#end_datetime').val(GeneralFunctions.formatDate(Date.parse(appointment.end_datetime), GlobalVariables.dateFormat, true));
		
		$('#stars').val(appointment.stars);
		$(".stars .rating__icon--star").removeClass('reset');
		$(".stars input[type='radio']:checked").prop('checked', false);
		$(".stars #rating--" + appointment.stars).prop('checked', true);
		
		$('#com_or_sug').val(appointment.comment_or_suggestion_from_student);
		
		$('#feedback').val(appointment.feedback_from_tutor);
		$('#suggestion').val(appointment.suggestion_from_tutor);		
		
		//	Download
		var date = moment(appointment.start_datetime).format('YYYY-MM-DD');
		if (appointment.attachment_url !== 'no_file') {
			$('#download a').prop('href', GlobalVariables.downloadPrefix + appointment.attachment_url + "/" + appointment.service_type.replace(' ', '') + "/" + (appointment.student_sid === null ? "0" : appointment.student_sid) + "/" + (GlobalVariables.tutor_sid === null ? "0" : GlobalVariables.tutor_sid) + "/" + date);
			$('#download a').removeClass('disableEvents');
			$('#download').prop('disabled', false);
		} else {
			$('#download a').prop('href', 'no-file');
			$('#download a').addClass('disableEvents');
			$('#download').prop('disabled', true);
		}
    };

    /**
     * Filter appointment records.
     *
     * @param {String} key This key string is used to filter the appointment records.
     * @param {Number} selectId Optional, if set then after the filter operation the record with the given
     * ID will be selected (but not displayed).
     * @param {Boolean} display Optional (false), if true then the selected record will be displayed on the form.
     */
    TutorsAppointmentManagementHelper.prototype.filter = function (bs, st, sn, sd, ed, selectId, display, first_load) {
        display = display || false;

        var postUrl = GlobalVariables.baseUrl + '/index.php/tutors_api/ajax_filter_appointments';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
            service_status: JSON.stringify((bs === undefined || bs === '') ? 'ALL' : bs),
			service_type: JSON.stringify((st === undefined || st === '' || st === '- ' + EALang.search_all_service_categories + ' -') ? 'ALL' : st),
			student_name: JSON.stringify((sn === undefined || sn === '' || sn === '- ' + EALang.search_all_students + ' -') ? 'ALL' : sn),
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
				this.getAllStudents();
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
    TutorsAppointmentManagementHelper.prototype.getFilterHtml = function (index, appointment) {
		
		//	The service_type will be used in the first line
		var service_type = (appointment.service_type !== '' && appointment.service_type !== null) ?
			appointment.service_type : (EALang.appointment + " " + (index+1));
		//	Stars in first line
		var stars = appointment.stars;
		if (appointment.stars === "0") {
			stars = this.nostarHTML;
		} else {
			stars = '';
			for (var i = 0; i < appointment.stars; ++i) {
				stars += this.starHTML;
			}
		}
		
		//	The student's name will be used in the second line
        var student = appointment.student_name;
		//	The booking_status will shown as a label in the second line
		var booking_status = this.decodeBookingStatus(appointment.booking_status);
		
		//	The starting and ending time will be used in the third line
		var start_time = GeneralFunctions.formatDate(Date.parse(appointment.start_datetime), GlobalVariables.dateFormat, true);
		var end_time = GeneralFunctions.formatDate(Date.parse(appointment.end_datetime), GlobalVariables.dateFormat, true);
		
		var line1 = "<strong>" + service_type + "</strong>"/* + " " + "<sup>" + stars + "</sup>"*/;
		var line2 = student + " " + "-" + " <span class='bs" + appointment.booking_status + "'>" + booking_status + "</span>";
		var line3 = start_time + " " + "~" + " " + end_time;
			
        var html =
            '<div class="entry" data-id="' + appointment.id + '">' +	//	Starting <div> block
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
    TutorsAppointmentManagementHelper.prototype.decodeBookingStatus = function (booking_status) {
		
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
    TutorsAppointmentManagementHelper.prototype.select = function (id, display) {
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
                if (appointment.id === id) {
                    this.display(appointment);
//                    $('#edit-appointment, #delete-appointment').prop('disabled', false);
                    return false;
                }
            }.bind(this));
        }
    };

    /**
     * Clear Feedback
     */
    TutorsAppointmentManagementHelper.prototype.clearFeedback = function() {
		$('#popup_feedback_input').val('');
		$('#popup_suggestion_input').val('');
    };	
	
    /**
     * Get all students and wrap them in an html
     */
    TutorsAppointmentManagementHelper.prototype.getAllStudents = function() {
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
			$('#filter-my_appointments #filter-student-name span').html('');
			
			//	Iterate through all students, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, student) {
				//	Fix an admin account bug
				var cas_sid = student.cas_sid;
				var space_or_not = '';
				if (cas_sid === null) {
					cas_sid = '';
					space_or_not = '';
				} else {
					space_or_not = ' ';
				}
				var display_student = (student.name !== null && student.name.length >= 25) ? (cas_sid + space_or_not + student.name.substring(0,20) + "...") : cas_sid + space_or_not + student.name;
				var html = "<li class='filter-item filter-item--find' data-stu_name='" + student.name + "' title='" + cas_sid + space_or_not + student.name + "'>" + display_student + "</li>";
				$('#filter-my_appointments #filter-student-name span').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
    TutorsAppointmentManagementHelper.prototype.getAllServiceCategories = function() {
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
    TutorsAppointmentManagementHelper.prototype.filterList = function(filterItem, filterValue) {
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
	
    /**
     * Get all service categories and wrap them in an html
     */
    TutorsAppointmentManagementHelper.prototype.validateDateTime = function(sd, ed) {
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
				Tutors.displayNotification(EALang.date_reverse_error, undefined, "failure");
				return false;
			} else {
				return true;
			}
		} else {
			//	If Any of them is invalid, gg
			Tutors.displayNotification(EALang.invalid_date_input, undefined, "failure");
			return false;
		}
    };
	
    window.TutorsAppointmentManagementHelper = TutorsAppointmentManagementHelper;
})();
