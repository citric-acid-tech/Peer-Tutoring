(function () {

    'use strict';

    /**
     * AdminSettingsHelperCommon Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class AdminSettingsHelperCommon
     */
    function AdminSettingsHelperCommon() {
        this.filterResults = {};
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    AdminSettingsHelperCommon.prototype.bindEventHandlers = function () {
        var instance = this;
		
		$('#common_edit').click(function() {
			//	Disable Nav Tabs
			$('ul.nav-tabs li').not('.active').addClass('disabled');
			//	Everything is editable -- But not date format and time format, for now...
			$('#admin-settings-page .form-group').find('input, textarea').not('#date_format, #time_format').attr('readonly', false);
			//	Checkbox is editable
			$('#enable_email_notification').prop('disabled', false);
			//	Change form groups
			$('#common_edit, #go_to_school_page').hide();
			$('#common_save, #common_cancel').fadeIn(360);
		});
		
		$('#common_save').click(function() {
			//	Enable Nav Tabs
			$('ul.nav-tabs li').removeClass('disabled');
			//	Close editable inputs
			$('#admin-settings-page .form-group').find('input, textarea').attr('readonly', true);
			//	Disable checkbox
			$('#enable_email_notification').prop('disabled', true);
			//	Retrieve values
			var df = $('#date_format').val();
			var tf = $('#time_format').val();
			var fc = $('#flexible_column').val();
			var sn = $('#school_name').val();
			var se = $('#school_email').val();
			var sl = $('#school_link').val();
			var mscad = $('#max_services_checking_ahead_day').val();
			var macad = $('#max_appointment_cancel_ahead_day').val();
			var ufms = $('#upload_file_max_size').val();
			var een = $('#enable_email_notification').prop('checked');
			//	Save Settings
			instance.saveCommonSettings(df,tf,fc,
											 sn,se,sl,
											 mscad,macad,ufms, een);
			//	switch button groups - will be done in ajax
		});
		
		$('#common_cancel').click(function() {
			//	Enable Nav Tabs
			$('ul.nav-tabs li').removeClass('disabled');
			//	Close editable inputs
			$('#admin-settings-page .form-group').find('input, textarea').attr('readonly', true);
			//	Disable checkbox
			$('#enable_email_notification').prop('disabled', true);
			//	switch button groups
			$('#common_save, #common_cancel').hide();
			$('#common_edit, #go_to_school_page').fadeIn(360);
			//	Reload Settings data
			instance.getCommonSettings();
		});
	};

    /**
     * Get all common settings
     */
   	AdminSettingsHelperCommon.prototype.getCommonSettings = function() {
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_get_settings_common';
        var postData = {
            csrfToken: GlobalVariables.csrfToken
        };
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
//			console.log(response);
			
			/* Get values */
			//	Line 1
			$('#date_format').val(response.date_format);
			$('#time_format').val(response.time_format);
			$('#flexible_column').val(response.flexible_column_label);
			//	Line 2
			$('#school_name').val(response.company_name);
			$('#school_email').val(response.company_email);
			$('#school_link').val(response.company_link);
			//	Line 3
			$('#max_services_checking_ahead_day').val(response.max_services_checking_ahead_day);
			$('#max_appointment_cancel_ahead_day').val(response.max_appointment_cancel_ahead_day);
			$('#upload_file_max_size').val(response.upload_file_max_size);
			$('#enable_email_notification').prop('checked', (response.enable_email_notification === '1') ? true : false);
			
			//	Set all to readonly
			$('#admin-settings-page .form-group').find('input, textarea').attr('readonly', true);
			//	Set checkbox
			$('#enable_email_notification').prop('disabled', true);
			
			//	Handle School Page Link Navigation
			if ($('#school_link').val() === '') {
				$('#go_to_school_page').prop('disabled', true);
			} else {
				$('#go_to_school_page').prop('disabled', false);
				//	wrap an html element
				$('#go_to_school_page').wrap("<a target='_blank' href='" + $('#school_link').val() + "'></a>");
			}
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * save all common settings
     */
	AdminSettingsHelperCommon.prototype.saveCommonSettings = function(df,tf,fc,sn,se,sl,mscad,macad,ufms,een) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_save_settings_common';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			date_format: JSON.stringify(df),
			time_format: JSON.stringify(tf),
			flexible_column_label: JSON.stringify(fc),
			school_name: JSON.stringify(sn),
			school_email: JSON.stringify(se),
			school_link: JSON.stringify(sl),
			max_services_checking_ahead_day: JSON.stringify(mscad),
			max_appointment_cancel_ahead_day: JSON.stringify(macad),
			upload_file_max_size: JSON.stringify(ufms),
			enable_email_notification: JSON.stringify(een)
        };
		
//		console.log(postData);
		
		var obj = this;
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
//			console.log(response);
			
			if (response) {
				Admin.displayNotification("Admin Settings Saved.", undefined, "success");
			} else {
				Admin.displayNotification("Something went wrong on saving admin settings.");
				return false;
			}
			
			$('#common_save, #common_cancel').hide();
			$('#common_edit, #go_to_school_page').fadeIn(360);
			
			setTimeout(function() {
				//	re-scan
				obj.getCommonSettings();
			}, 200);
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
	};
	
    window.AdminSettingsHelperCommon = AdminSettingsHelperCommon;
})();