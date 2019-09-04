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
//				instance.resetAppointmentPopup();
			}, 200);
		});
		
	};
	
    /**
     * Reset inputs of appointment popup
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.resetAppointmentPopup = function() {
		//	Service Type <select>
		$("select#appointment_service_service_type option:selected").prop('selected', false);
		//	Tutor <select>
		$("select#appointment_service_tutor option:selected").prop('selected', false);
		//	All other input boxes
		$('#cal_appointment_popup .popup-container').find('input, textarea').not('.popup_buttons').val('');
		//	Reset ID
		$('#appointment_service_id').val('');
    };
	
    /**
     * Load inputs of appointment popup
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.loadAppointmentPopup = function(event) {
		//	Load ID
		$('#appointment_service_id').val(event.id);
		//	Manage selecting service type
		$("select#appointment_service_service_type option[value='" + event.extendedProps.service_type_id + "']").prop('selected', true);
		//	Manage selecting tutor
		$("select#appointment_service_tutor option[value='" + event.extendedProps.tutor_id + "']").prop('selected', true);
		//	Others
		$('#appointment_service_address').val(event.extendedProps.address);
		$('#appointment_service_capacity').val(event.extendedProps.capacity);
		$('#appointment_service_description').val(event.extendedProps.description);
		//	Date
		var start = moment(event.start);
		var end = moment(event.end);
		//	If in different day, maintain in later versions
		var dateWithoutTime = start.format('YYYY-MM-DD');
		var tmpComp = end.format('YYYY-MM-DD');
		if (dateWithoutTime !== tmpComp) {alert('Endurances over one single day will be handled in the next version.');}
		$('#appointment_service_date').val(dateWithoutTime);
		$('#appointment_service_st').val(start.format('HH:mm'));
		$('#appointment_service_et').val(end.format('HH:mm'));
    };
	
    /**
     * Validate inputs of appointment popup
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.validateAppointmentPopup = function() {
		//	Validate Date
		var date = $('#appointment_service_date').val();
		if (date === '') {	//	empty, gg
			Admin.displayNotification("Please Choose a date!", undefined, "failure");
			$('#appointment_service_date').toggleClass('gg');
			setTimeout(function() {
				$('#appointment_service_date').toggleClass('gg');
			}, 500);
			return false;
		}
		
		//	Validate Capacity
		var cap = $('#appointment_service_capacity').val();
		if(!(/^\+?[1-9]\d*$/.test(cap))) {	//	If not a positive integer, gg
			Admin.displayNotification("Capacity should be a positive integer...", undefined, "failure");
			$('#appointment_service_capacity').toggleClass('gg');
			setTimeout(function() {
				$('#appointment_service_capacity').toggleClass('gg');
			}, 500);
			return false;
		}
		
		//	Validate address
		var address = $('#appointment_service_address').val();
		if (address === '') {	//	empty, gg
			Admin.displayNotification("Please offer the address for the service!", undefined, "failure");
			$('#appointment_service_address').toggleClass('gg');
			setTimeout(function() {
				$('#appointment_service_address').toggleClass('gg');
			}, 500);
			return false;
		} 
		
		//	Validate time range
		var start = moment($('#appointment_service_st').val(), 'HH:mm');
		var end = moment($('#appointment_service_et').val(), 'HH:mm');
		if (!start.isValid()) {
			Admin.displayNotification("Please finish Start Time", undefined, "failure");
			$('#appointment_service_st').toggleClass('gg');
			setTimeout(function() {
				$('#appointment_service_st').toggleClass('gg');
			}, 500);
			return false;
		}
		if (!end.isValid()) {
			Admin.displayNotification("Please finish End Time", undefined, "failure");
			$('#appointment_service_et').toggleClass('gg');
			setTimeout(function() {
				$('#appointment_service_et').toggleClass('gg');
			}, 500);
			return false;
		}
		if (start.isSameOrAfter(end)) {	//	If start >= end, gg
			Admin.displayNotification("Supposed: Start time < End time", undefined, "failure");
			$('#appointment_service_st, #appointment_service_et').toggleClass('gg');
			setTimeout(function() {
				$('#appointment_service_st, #appointment_service_et').toggleClass('gg');
			}, 500);
			return false;
		}
		
		return true;
    };
	
    /**
     * Save inputs of appointment popup
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.saveAppointmentPopup = function() {
		//	fetch data
		var id = $('#appointment_service_id').val();
		var date = $('#appointment_service_date').val();
		var start_time = $('#appointment_service_st').val();
		var end_time = $('#appointment_service_et').val();
		var service_type_id = $('select#appointment_service_service_type option:selected').val();
		var tutor_id = $('select#appointment_service_tutor option:selected').val();
		var address = $('#appointment_service_address').val();
		var capacity = $('#appointment_service_capacity').val();
		var description = $('#appointment_service_description').val();
		
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_appointment_service';
        var postData = {
            csrfToken:				GlobalVariables.csrfToken,
			service_id:				id,
			date:					JSON.stringify(date),
			start_time:				JSON.stringify(start_time),
			end_time:				JSON.stringify(end_time),
			service_type_id:		JSON.stringify(service_type_id),
			address:				JSON.stringify(address),
			capacity:				JSON.stringify(capacity),
			service_description:	JSON.stringify(description),
			tutor_id:				JSON.stringify(tutor_id)
        };
		var obj = this;
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			if (response === 'success') {
				Admin.displayNotification("Service Saved.", undefined, "success");
			} else if (response === 'fail') {
				Admin.displayNotification("Failure: Service could not be saved.", undefined, "failure");
			} else {
				Admin.displayNotification("Something went wrong on appointmenting services");
			}
			
			//	Hide with TimeOut - See Tutor Appointments Management
			$('.admin-page .popup .curtain').fadeOut();
			$('.admin-page .popup #cal_appointment_popup').fadeOut();
			
			//	sync the modified event
			obj.syncAppointment(id, {
				service_id:				id,
				date:					date,
				start_time:				start_time,
				end_time:				end_time,
				service_type_id:		service_type_id,
				address:				address,
				capacity:				capacity,
				service_description:	description,
				tutor_id:				tutor_id
        	});
			
			//	Clear inputs!
			setTimeout(function() {
				obj.resetAppointmentPopup();
			}, 200);

        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Sync Appointmented Service
     */
   	StudentsAvailableAppointmentsCalendarHelper.prototype.syncAppointment = function(id, newData) {
		var cal = this.calendar;
		var service = cal.getEventById(id);
		
		//	sync service_type
		service.setProp('title', 
						$("select#appointment_service_service_type option[value='" + newData.service_type_id + "']").html());
		//	sync start time, end time
		//	start
		var start_datetime = moment(newData.date, 'YYYY-MM-DD');
		var time = moment(newData.start_time, 'HH:mm');
		start_datetime.hour(time.hour());
		start_datetime.minute(time.minute());
		service.setProp('start', start_datetime.toDate());
		//	end
		var end_datetime = moment(newData.date, 'YYYY-MM-DD');
		time = moment(newData.end_time, 'HH:mm');
		end_datetime.hour(time.hour());
		end_datetime.minute(time.minute());
		service.setProp('end', end_datetime.toDate());
		//	Modify calendar - IMPORTANT, or the event on the calendar will not move
		service.setDates(start_datetime.toDate(), end_datetime.toDate());
		
		//	sync extended props
		service.setExtendedProp('capacity', newData.capacity);
		service.setExtendedProp('address', newData.address);
		service.setExtendedProp('description', newData.service_description);
		service.setExtendedProp('service_type_id', newData.service_type_id);
		service.setExtendedProp('tutor_id', newData.tutor_id);
		service.setExtendedProp('tutor', 
							   $("select#appointment_service_tutor option[value='" + newData.tutor_id + "']").html());
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
