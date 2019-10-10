(function () {

    'use strict';

    /**
     * StudentsAvailableAppointmentsCalendarHelper Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class StudentsAvailableAppointmentsCalendarHelper
     */
    function StudentsAvailableAppointmentsCalendarHelper() {
		this.calendar = undefined;
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    StudentsAvailableAppointmentsCalendarHelper.prototype.bindEventHandlers = function () {
        var instance = this;
	
   		/**
   		 * Event: Appointment Service Confirm button pressed
   		 */
		$('.students-page .popup .popup_buttons#popup_appointment_confirm').click(function() {
			//	Validate
			if (!instance.validateAppointmentPopup()) {
				return false;
			}
			//	Save
			instance.saveAppointmentPopup();
			//	Below will be done in saveAppointmentPopup()
			//	Hide with TimeOut - See Tutor Appointments Management
			//	Clear inputs!
		});
		
   		/**
   		 * Event: Appointment Service Cancel button pressed
   		 */
		$('.students-page .popup .popup_buttons#popup_appointment_cancel').click(function() {
			$('.students-page .popup .curtain').fadeOut();
			$('.students-page .popup #cal_appointment_popup').fadeOut();
			//	Clear inputs!
			setTimeout(function() {
				instance.resetAppointmentPopup();
			}, 200);
		});
		
		$('.curtain').click(function() {
			$('.popup').find('#cal_appointment_popup').fadeOut();
			$(this).fadeOut();
			//	Clear inputs!
			setTimeout(function() {
				instance.resetAppointmentPopup();
			}, 200);
		});
		
   		/**
   		 * Event: Check by tutor clicked
   		 */
		$('.students-page #sel_tutor_by_name').click(function() {
			$("a[data-toggle='tab'][href='#select-by-tutor-tab']").tab('show');
		});
		
   		/**
   		 * Event: Check by tutor clicked
   		 */
		$('.students-page #sel_tutor_by_time').click(function() {
			$("a[data-toggle='tab'][href='#select-by-time-tab']").tab('show');
		});
		
	};
	
    /**
     * Reset inputs of appointment popup
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.resetAppointmentPopup = function() {
		$(".appoint_list span").html('-');
		$('#appointment_service_id').val('');
		$('#appointment_service_remark, #appointment_service_note').val('');
		//	Clearing a file input
		$('#appointment_service_attach').wrap('<form>').closest('form').get(0).reset();
		$('#appointment_service_attach').unwrap();
		$("label[for='appointment_service_attach']").html('<strong>' + EALang.attach_a_file + '</strong>');
		$('.inputfile + label').css({
			"background-color": "#296d97",
			"color": "snow"
		});
		//	Any behaviors cancelled on full capacity
		$('#popup_apply_title_change strong').html(EALang.apply_now);
		$('#popup_apply_title_change + hr').removeClass('stretch');
		$('#capacity_check, #popup_apply_title_change').css('color', '#296d97');
		$('#appointment_service_remark, #appointment_service_note').prop('readonly', false);
		$('#appointment_service_remark, #appointment_service_note').css('background-color', 'white');
		$('#appointment_service_attach + label').attr('for', 'appointment_service_attach');
		$('#appointment_service_attach + label').removeClass('disabled');
		$('#popup_appointment_confirm').show();
		$('#popup_appointment_cancel').css('width', '42%');
		$('#popup_appointment_cancel').html(EALang.cancel);
    };
	
    /**
     * Load inputs of appointment popup
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.loadAppointmentPopup = function(event) {
		//	Load ID
		$('#appointment_service_id').val(event.id);
		//	Others from appoint-list
		$("#appointment_service_service_type").html(event.title);
		$('#appointment_service_type_description').html(event.extendedProps.service_type_description);
		$('#appointment_service_description').html(event.extendedProps.service_description);
		$("#appointment_service_tutor").html(event.extendedProps.tutor);
		$('#appointment_service_tutor_page').prop('href', event.extendedProps.tutor_page);
		//	Capacity
		var appointed = event.extendedProps.appointed;
		var capacity = event.extendedProps.capacity;
		if (parseInt(appointed) > parseInt(capacity)) {
			alert("BUG! Contact us to fix it, thank you!");
			$('#appointment_service_appointed').html('123999');
			$('#appointment_service_capacity').html('123999');
		} else if (parseInt(appointed) < parseInt(capacity)) {
			$('#appointment_service_appointed').html(appointed);
			$('#appointment_service_capacity').html(capacity);
		} else if (parseInt(appointed) === parseInt(capacity)) {
			//	Styles
			$('#popup_apply_title_change strong').html(EALang.ma_full_capacity_warning);
			$('#popup_apply_title_change + hr').addClass('stretch');
			$('#capacity_check, #popup_apply_title_change').css('color', 'red');
			$('#appointment_service_remark, #appointment_service_note').prop('readonly', true);
			$('#appointment_service_remark, #appointment_service_note').css('background-color', 'lightgray');
			$('#appointment_service_attach + label').attr('for', 'none');
			$('#appointment_service_attach + label').addClass('disabled');
			$('#popup_appointment_confirm').hide();
			$('#popup_appointment_cancel').css('width', '90%');
			$('#popup_appointment_cancel').html(EALang.alright);
			//	Load
			$('#appointment_service_appointed').html(appointed);
			$('#appointment_service_capacity').html(capacity);
		} else {
			alert("BUG! Contact us to fix it, thank you!");
			$('#appointment_service_appointed').html('321999');
			$('#appointment_service_capacity').html('321999');
		}
		//	Booked?
		if (event.extendedProps.is_booked === '1') {
			//	Styles
			$('#popup_apply_title_change strong').html(EALang.ma_success);
			$('#capacity_check, #popup_apply_title_change').css('color', 'green');
			$('#appointment_service_remark, #appointment_service_note').prop('readonly', true);
			$('#appointment_service_remark, #appointment_service_note').css('background-color', 'lightgray');
			$('#appointment_service_attach + label').attr('for', 'none');
			$('#appointment_service_attach + label').addClass('disabled');
			$('#popup_appointment_confirm').hide();
			$('#popup_appointment_cancel').css('width', '90%');
			$('#popup_appointment_cancel').html(EALang.close);
		}
		//	Date
		var start = moment(event.start);
		var end = moment(event.end);
//		$('#appointment_service_st').html(start.format('YYYY-MM-DD HH:mm'));
//		$('#appointment_service_et').html(end.format('YYYY-MM-DD HH:mm'));
		$('#appointment_service_date').html(start.format('YYYY-MM-DD'));
		$('#appointment_service_st').html(start.format('HH:mm'));
		$('#appointment_service_et').html(end.format('HH:mm'));
		//	Rest
		$('#appointment_service_address').html(event.extendedProps.address);
    };
	
    /**
     * Validate inputs of appointment popup
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.validateAppointmentPopup = function() {
		var file = $('#appointment_service_attach').prop('files')[0];
		var allowedExtensions = /(\.doc|\.docx|\.md|\.pdf|\.png|\.zip|\.jar|\.7z)$/i;
//		alert(allowedExtensions.exec(file.name));
		
//		//	Check if a file is uploaded
//		if (file === undefined) {
//			Students.displayNotification(EALang.empty_file_warning, undefined, "failure");
//			$('#appointment_service_attach + label').addClass('gg');
//			setTimeout(function() {
//				$('#appointment_service_attach + label').removeClass('gg');
//			}, 300);
//			return false;
//			file = new File([""], "filename");
//		}
		
		//	Check file extension
		if (file !== undefined && allowedExtensions.exec(file.name) === null) {
			Students.displayNotification(EALang.file_format_warning, undefined, "failure");
			$('#appointment_service_attach + label').addClass('gg');
			setTimeout(function() {
				$('#appointment_service_attach + label').removeClass('gg');
			}, 300);
			return false;
		}
//		console.log(file);
		return true;
    };
	
    /**
     * Save inputs of appointment popup
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.saveAppointmentPopup = function() {
		//	fetch data
		var id = $('#appointment_service_id').val();
		var remark = GeneralFunctions.superEscapeHTML($('#appointment_service_remark').val());
		var note = GeneralFunctions.superEscapeHTML($('#appointment_service_note').val());
		var file = $('#appointment_service_attach').prop('files')[0];
		var file_attached = 1;
		//	Check if a file is uploaded
		if (file === undefined) {
			file_attached = 0;
			file = new File([""], "filename");
		}

		var path = GlobalVariables.baseUrl + '/index.php/students_api/ajax_new_appointment';
		//	Create a new FormData object
		var formData = new FormData();
		formData.append('file', file, file.name);
		formData.append('csrfToken', GlobalVariables.csrfToken);
		formData.append('service_id', JSON.stringify(id));
		formData.append('remark', JSON.stringify(remark === '' ? 'ALL' : remark));
		formData.append('note', JSON.stringify(note === '' ? 'ALL' : note));
		formData.append('file_attached', JSON.stringify(file_attached));
		
		var obj = this;
		
		$.ajax({
			url: path,
			type: 'POST',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: function(response) {
				//	Test whether response is an exception or a warning
				if (!GeneralFunctions.handleAjaxExceptions(response)) {
					return;
				}
				
				if (response === 'success') {
					Students.displayNotification(EALang.ap_resp_success, undefined, "success");
				} else if (response === 'booked') {
					Students.displayNotification(EALang.ap_resp_booked, undefined, "failure");
				} else if (response === 'cap_full') {
					Students.displayNotification(EALang.ap_resp_cap_full, undefined, "failure");
				} else if (response === 'denied') {
					Students.displayNotification(EALang.ap_resp_denied);
				} else if (response === 'invalid_type') {
					Students.displayNotification(EALang.ap_resp_invalid_type);
				} else if (response === 'no_file') {
					Students.displayNotification(EALang.ap_resp_no_file);
				} else {
					console.log(response);
					Students.displayNotification(EALang.ap_resp_unknown_error);
				}
				
				//	Hide with TimeOut - See Tutor Appointments Management
				$('.students-page .popup .curtain').fadeOut();
				$('.students-page .popup #cal_appointment_popup').fadeOut();
				
				if (response === 'success') {
					//	sync the modified event
					obj.syncAppointment(id);
				}
				
				//	Clear inputs!
				setTimeout(function() {
					obj.resetAppointmentPopup();
				}, 200);
			},
			error: function(e) {
				console.log("error: " + JSON.stringify(e));
				Students.displayNotification(EALang.ap_resp_fatal_error);
			}
		});
    };
	
    /**
     * Sync Appointmented Service
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.syncAppointment = function(id) {
		var cal = this.calendar;
		var service = cal.getEventById(id);		
		//	sync extended props
		service.setExtendedProp('appointed', (parseInt($('#appointment_service_appointed').html())+1).toString());
		service.setExtendedProp('is_booked', "1");
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.getAllServiceTypes = function() {
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
			$('.students-page select#appointment_service_service_type').html('');
			
			//	Iterate through all service_types, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, service_type) {
				var html = "<option value='" + service_type.id + "' title='" + service_type.name + "'>" + service_type.name + "</option>";
				$('.students-page select#appointment_service_service_type').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    window.StudentsAvailableAppointmentsCalendarHelper = StudentsAvailableAppointmentsCalendarHelper;
})();
