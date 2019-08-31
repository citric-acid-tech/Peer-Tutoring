(function () {

    'use strict';

    /**
     * AdminServiceConfigServiceCalendarHelper Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class AdminServiceConfigServiceCalendarHelper
     */
    function AdminServiceConfigServiceCalendarHelper() {
        this.filterResults = {};
		this.calendar = undefined;
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    AdminServiceConfigServiceCalendarHelper.prototype.bindEventHandlers = function () {
        var instance = this;
		
   		/**
   		 * Event: Edit Service Confirm button pressed
   		 */
		$('.admin-page .popup .popup_buttons#popup_edit_confirm').click(function() {
			//	Validate
			if (!instance.validateEditPopup()) {
				return false;
			}
			//	Save
			instance.saveEditPopup();
			//	Below will be done in saveEditPopup()
			//	Hide with TimeOut - See Tutor Appointments Management
			//	Clear inputs!
		});
		
   		/**
   		 * Event: Edit Service Cancel button pressed
   		 */
		$('.admin-page .popup .popup_buttons#popup_edit_cancel').click(function() {
			$('.admin-page .popup .curtain').fadeOut();
			$('.admin-page .popup #cal_edit_popup').fadeOut();
			//	Clear inputs!
			setTimeout(function() {
				instance.resetEditPopup();
			}, 200);
		});
		
   		/**
   		 * Event: Edit Service Delete button pressed
   		 */
		$('.admin-page .popup .popup_buttons#popup_edit_delete').click(function() {
			//	Prompt: you really want to delete???
            var buttons = [
                {
                    text: EALang.confirm,
                    click: function () {
						var id = $('#edit_service_id').val();
                        instance.deleteService(id);
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
			
            GeneralFunctions.displayMessageBox("Deleting a Service",
											   "Are you sure you want to delete this service?", buttons);
			
			//	Below will be implemented in deleteService(id)
			//	Delete: Successful in DB
			//	Hide
			//	Remove event from calendar
			//	Clear inputs!
		});
		
   		/**
   		 * Event: Add Service Confirm button pressed
   		 */
		$('.admin-page .popup .popup_buttons#popup_add_confirm').click(function() {
			//	Validate
			if (!instance.validateAddPopup()) {
				return false;
			}
			//	Save
			instance.saveAddPopup();
			//	Below will be done in saveEditPopup()
			//	Hide with TimeOut - See Tutor Appointments Management
			//	Clear inputs!
		});
		
   		/**
   		 * Event: Add Service Cancel button pressed
   		 */
		$('.admin-page .popup .popup_buttons#popup_add_cancel').click(function() {
			$('.admin-page .popup .curtain').fadeOut();
			$('.admin-page .popup #cal_add_popup').fadeOut();
			//	Clear inputs!
			setTimeout(function() {
				instance.resetAddPopup();
			}, 200);
		});
		
   		/**
   		 * Event: Header tutor selected
   		 */
		$(document).on('change', '.admin-page select#calendar_tutor', function() {
			instance.calendar.refetchEvents();
		});
		
	};
	
    /**
     * Get all service categories and wrap them in an html
     */
   	AdminServiceConfigServiceCalendarHelper.prototype.getAllServiceTypes = function() {
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
			$('.admin-page select#edit_service_service_type').html('');
			$('.admin-page select#add_service_service_type').html('');
			
			//	Iterate through all service_types, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, service_type) {
				var html = "<option value='" + service_type.id + "' title='" + service_type.name + "'>" + service_type.name + "</option>";
				$('.admin-page select#edit_service_service_type').append(html);
				$('.admin-page select#add_service_service_type').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all tutors and wrap them in an html
     */
    AdminServiceConfigServiceCalendarHelper.prototype.getAllTutors = function() {
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
			$('.admin-page select#edit_service_tutor').html('');
			$('.admin-page select#add_service_tutor').html('');
			$('.admin-page select#calendar_tutor').html("<option value='-1' title='- ALL -'>- ALL -</option>");
			
			//	Iterate through all tutors, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, tutor) {
				var html = "<option value='" + tutor.id + "' title='" + tutor.name + "'>" + tutor.name + "</option>";
				$('.admin-page select#edit_service_tutor').append(html);
				$('.admin-page select#add_service_tutor').append(html);
				$('.admin-page select#calendar_tutor').append(html);
			}.bind(this));
			
//			//	no tutor originally
//			if (response.length === 0) {
//				var html = "<option value='-6' title='- No Tutor -'>- No Tutor -</option>";
//				$('.admin-page select#edit_service_tutor').append(html);
//				$('.admin-page select#add_service_tutor').append(html);
//				$('.admin-page select#calendar_tutor').append(html);
//			}
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Reset inputs of edit popup
     */
   	AdminServiceConfigServiceCalendarHelper.prototype.resetEditPopup = function() {
		//	Service Type <select>
		$("select#edit_service_service_type option:selected").prop('selected', false);
		//	Tutor <select>
		$("select#edit_service_tutor option:selected").prop('selected', false);
		//	All other input boxes
		$('#cal_edit_popup .popup-container').find('input, textarea').not('.popup_buttons').val('');
		//	Reset ID
		$('#edit_service_id').val('');
    };
	
    /**
     * Load inputs of edit popup
     */
   	AdminServiceConfigServiceCalendarHelper.prototype.loadEditPopup = function(event) {
		//	Load ID
		$('#edit_service_id').val(event.id);
		//	Manage selecting service type
		$("select#edit_service_service_type option[value='" + event.extendedProps.service_type_id + "']").prop('selected', true);
		//	Manage selecting tutor
		$("select#edit_service_tutor option[value='" + event.extendedProps.tutor_id + "']").prop('selected', true);
		//	Others
		$('#edit_service_address').val(event.extendedProps.address);
		$('#edit_service_capacity').val(event.extendedProps.capacity);
		$('#edit_service_description').val(event.extendedProps.description);
		//	Date
		var start = moment(event.start);
		var end = moment(event.end);
		//	If in different day, maintain in later versions
		var dateWithoutTime = start.format('YYYY-MM-DD');
		var tmpComp = end.format('YYYY-MM-DD');
		if (dateWithoutTime !== tmpComp) {alert('Endurances over one single day will be handled in the next version.');}
		$('#edit_service_date').val(dateWithoutTime);
		$('#edit_service_st').val(start.format('HH:mm'));
		$('#edit_service_et').val(end.format('HH:mm'));
    };
	
    /**
     * Validate inputs of edit popup
     */
   	AdminServiceConfigServiceCalendarHelper.prototype.validateEditPopup = function() {
		//	Validate Capacity
		var cap = $('#edit_service_capacity').val();
		if(!(/^\+?[1-9]\d*$/.test(cap))) {	//	If not a positive integer, gg
			Admin.displayNotification("Capacity should be a positive integer...", undefined, "failure");
			$('#edit_service_capacity').toggleClass('gg');
			setTimeout(function() {
				$('#edit_service_capacity').toggleClass('gg');
			}, 500);
			return false;
		}
		
		//	Validate time range
		var start = moment($('#edit_service_st').val(), 'HH:mm');
		var end = moment($('#edit_service_et').val(), 'HH:mm');
		if (start.isSameOrAfter(end)) {	//	If start >= end, gg
			Admin.displayNotification("Supposed: Start time < End time", undefined, "failure");
			$('#edit_service_st, #edit_service_et').toggleClass('gg');
			setTimeout(function() {
				$('#edit_service_st, #edit_service_et').toggleClass('gg');
			}, 500);
			return false;
		}
		
		return true;
    };
	
    /**
     * Save inputs of edit popup
     */
   	AdminServiceConfigServiceCalendarHelper.prototype.saveEditPopup = function() {
		//	fetch data
		var id = $('#edit_service_id').val();
		var date = $('#edit_service_date').val();
		var start_time = $('#edit_service_st').val();
		var end_time = $('#edit_service_et').val();
		var service_type_id = $('select#edit_service_service_type option:selected').val();
		var tutor_id = $('select#edit_service_tutor option:selected').val();
		var address = $('#edit_service_address').val();
		var capacity = $('#edit_service_capacity').val();
		var description = $('#edit_service_description').val();
		
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_edit_service';
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
				Admin.displayNotification("Something went wrong on editing services");
			}
			
			//	Hide with TimeOut - See Tutor Appointments Management
			$('.admin-page .popup .curtain').fadeOut();
			$('.admin-page .popup #cal_edit_popup').fadeOut();
			
			//	sync the modified event
			obj.syncEdited(id, {
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
				obj.resetEditPopup();
			}, 200);

        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Sync Edited Service
     */
   	AdminServiceConfigServiceCalendarHelper.prototype.syncEdited = function(id, newData) {
		var cal = this.calendar;
		var service = cal.getEventById(id);
		
		//	sync service_type
		service.setProp('title', 
						$("select#edit_service_service_type option[value='" + newData.service_type_id + "']").html());
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
							   $("select#edit_service_tutor option[value='" + newData.tutor_id + "']").html());
    };
	
    /**
     * Sync Edited Service
     */
   	AdminServiceConfigServiceCalendarHelper.prototype.deleteService = function(id) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_remove_service';
        var postData = {
            csrfToken:	GlobalVariables.csrfToken,
			service_id:	id
        };
		var cal = this.calendar;
		var obj = this;
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			//	Delete: Successful in DB
			if (response === 'success') {
				Admin.displayNotification("Service Deleted.", undefined, "success");
			} else if (response === 'fail') {
				Admin.displayNotification("Failure: Service could not be deleted.", undefined, "failure");
			} else {
				Admin.displayNotification("Something went wrong on deleting services");
			}
			
			//	Fade
			$('.admin-page .popup .curtain').fadeOut();
			$('.admin-page .popup #cal_edit_popup').fadeOut();
			
			//	Remove event from calendar
			cal.getEventById(id).remove();
			
			//	Clear inputs!
			setTimeout(function() {
				obj.resetEditPopup();
			}, 200);

        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Reset inputs of add popup
     */
   	AdminServiceConfigServiceCalendarHelper.prototype.resetAddPopup = function() {
		//	Service Type <select>
		$("select#add_service_service_type option:selected").prop('selected', false);
		//	Tutor <select>
		$("select#add_service_tutor option:selected").prop('selected', false);
		//	All other input boxes
		$('#cal_add_popup .popup-container').find('input, textarea').not('.popup_buttons').val('');
    };
	
    /**
     * Validate inputs of add popup
     */
   	AdminServiceConfigServiceCalendarHelper.prototype.validateAddPopup = function() {
		//	Validate Capacity
		var cap = $('#add_service_capacity').val();
		if(!(/^\+?[1-9]\d*$/.test(cap))) {	//	If not a positive integer, gg
			Admin.displayNotification("Capacity should be a positive integer...", undefined, "failure");
			$('#add_service_capacity').toggleClass('gg');
			setTimeout(function() {
				$('#add_service_capacity').toggleClass('gg');
			}, 500);
			return false;
		}
		
		//	Validate time range
		var start = moment($('#add_service_st').val(), 'HH:mm');
		var end = moment($('#add_service_et').val(), 'HH:mm');
		if (start.isSameOrAfter(end)) {	//	If start >= end, gg
			Admin.displayNotification("Supposed: Start time < End time", undefined, "failure");
			$('#add_service_st, #add_service_et').toggleClass('gg');
			setTimeout(function() {
				$('#add_service_st, #add_service_et').toggleClass('gg');
			}, 500);
			return false;
		}
		
		return true;
    };
	
    /**
     * Save inputs of add popup
     */
   	AdminServiceConfigServiceCalendarHelper.prototype.saveAddPopup = function() {
		//	fetch data
		var date = $('#add_service_date').val();
		var start_time = $('#add_service_st').val();
		var end_time = $('#add_service_et').val();
		var service_type_id = $('select#add_service_service_type option:selected').val();
		var address = $('#add_service_address').val();
		var capacity = $('#add_service_capacity').val();
		var description = $('#add_service_description').val();
		var tutor_id = $('select#add_service_tutor option:selected').val();
		
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_new_service';
        var postData = {
            csrfToken:				GlobalVariables.csrfToken,
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
			
			if (response === '-1') {
				Admin.displayNotification("Failure: Service could not be saved.", undefined, "failure");
				return false;
			} else {
				Admin.displayNotification("Service Saved.", undefined, "success");
			}
			
			//	Hide with TimeOut - See Tutor Appointments Management
			$('.admin-page .popup .curtain').fadeOut();
			$('.admin-page .popup #cal_add_popup').fadeOut();
			
			//	sync the modified event
			obj.syncAdded(response, {
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
				obj.resetAddPopup();
			}, 200);

        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Sync Added Service
     */
   	AdminServiceConfigServiceCalendarHelper.prototype.syncAdded = function(id, newData) {
		var cal = this.calendar;
		
		var title = $("select#add_service_service_type option[value='" + newData.service_type_id + "']").html();
		//	start
		var start_datetime = moment(newData.date, 'YYYY-MM-DD');
		var time = moment(newData.start_time, 'HH:mm');
		start_datetime.hour(time.hour());
		start_datetime.minute(time.minute());
		//	end
		var end_datetime = moment(newData.date, 'YYYY-MM-DD');
		time = moment(newData.end_time, 'HH:mm');
		end_datetime.hour(time.hour());
		end_datetime.minute(time.minute());
		var tutor = $("select#add_service_tutor option[value='" + newData.tutor_id + "']").html();
		
		var event = {
			id: id,
			title: title,
			start: start_datetime.toDate(),
			end: end_datetime.toDate(),
			extendedProps: {
				tutor_id: newData.tutor_id,
				tutor: tutor,
				capacity: newData.capacity,
				address: newData.address,
				description: newData.service_description,
				service_type_id: newData.service_type_id
			}
		};
		
		cal.addEvent(event);
    };
	
    window.AdminServiceConfigServiceCalendarHelper = AdminServiceConfigServiceCalendarHelper;
})();
