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
        this.filterResults = {};
		this.calendar = undefined;
		this.pond = undefined;
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
		
		$('#attach_upload').click(function() {
			var path = GlobalVariables.baseUrl + '/index.php/students_api/ajax_new_appointment';
			var file = $('#appointment_service_attach').prop('files')[0];
			var formData = new FormData();
			formData.append('file', file, file.name);
			formData.append('csrfToken', GlobalVariables.csrfToken);
			
			for (var key of formData.entries()) {
				console.log(key[0] + ', ' + key[1]);
			}
			
			$.ajax({
				url: path,
				type: 'POST',
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
				success: function(data) {
					console.log("success: " + JSON.stringify(data));
				},
				error: function(data) {
					console.log("error: " + JSON.stringify(data));
				}
			});
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
		$("label[for='appointment_service_attach']").html('<strong>Attach a File</strong>');
		$('.inputfile + label').css({
			"background-color": "#296d97",
			"color": "snow"
		});
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
		$('#appointment_service_appointed').html(event.extendedProps.appointed);
		$('#appointment_service_capacity').html(event.extendedProps.capacity);
		//	Date
		var start = moment(event.start);
		var end = moment(event.end);
		$('#appointment_service_st').html(start.format('YYYY-MM-DD HH:mm'));
		$('#appointment_service_et').html(end.format('YYYY-MM-DD HH:mm'));
		//	Rest
		$('#appointment_service_address').html(event.extendedProps.address);
    };
	
    /**
     * Validate inputs of appointment popup
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.validateAppointmentPopup = function() {
		return true;
    };
	
    /**
     * Save inputs of appointment popup
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.saveAppointmentPopup = function() {
		//	fetch data
		var id = $('#appointment_service_id').val();
		var remark = $('#appointment_service_remark').val();
		var note = $('#appointment_service_note').val();
		var file = $('#appointment_service_attach').prop('files')[0];
		if (file === undefined) {
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
		
		for (var key of formData.entries()) {
			console.log(key[0] + ', ' + key[1]);
		}
		
		$.ajax({
			url: path,
			type: 'POST',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: function(response) {
				console.log("success: " + JSON.stringify(response));
				if (response === 'success') {
					Admin.displayNotification("Appointment Submitted.", undefined, "success");
				} else if (response === 'fail') {
					Admin.displayNotification("Failure: Appointment failed.", undefined, "failure");
				} else {
					Admin.displayNotification("Something went wrong on applying appointments");
				}
			},
			error: function(e) {
				console.log("error: " + JSON.stringify(e));
				Admin.displayNotification("Error: Something went wrong on applying appointments");
			}
		});
		
//        var postUrl = GlobalVariables.baseUrl + '/index.php/students_api/ajax_new_appointment';
//        var postData = {
//            csrfToken:				GlobalVariables.csrfToken,
//			service_id:				id,
//			remark:					JSON.stringify(remark === '' ? 'ALL' : remark),
//			note:					JSON.stringify(note === '' ? 'ALL' : note),
//			file:					formData
//        };
////			file:					(file === undefined) ? JSON.stringify('ALL') : file
//		var obj = this;
//		
//        $.post(postUrl, postData, function (response) {
//			//	Test whether response is an exception or a warning
//            if (!GeneralFunctions.handleAjaxExceptions(response)) {
//                return;
//            }
//			
//			if (response === 'success') {
//				Admin.displayNotification("Appointment Submitted.", undefined, "success");
//			} else if (response === 'fail') {
//				Admin.displayNotification("Failure: Appointment failed.", undefined, "failure");
//			} else {
//				Admin.displayNotification("Something went wrong on applying appointments");
//			}
//			
//			//	Hide with TimeOut - See Tutor Appointments Management
//			$('.admin-page .popup .curtain').fadeOut();
//			$('.admin-page .popup #cal_appointment_popup').fadeOut();
//			
//			//	sync the modified event
//			obj.syncAppointment(id);
//			
//			//	Clear inputs!
//			setTimeout(function() {
//				obj.resetAppointmentPopup();
//			}, 200);
//
//        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Sync Appointmented Service
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.syncAppointment = function(id) {
		var service = cal.getEventById(id);		
		//	sync extended props
		service.setExtendedProp('appointed', (parseInt($('#appointment_service_appointed').html())+1).toString());
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
