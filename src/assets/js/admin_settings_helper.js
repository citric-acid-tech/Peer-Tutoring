window.AdminSettingsHelper = window.AdminSettingsHelper || {};

/**
 * AdminSettingsHelper
 *
 * This module contains functions that are used in the students section of the application.
 *
 * @module AdminSettingsHelper
 */
(function (exports) {

    'use strict';

	//	Retrieve info about the page
	exports.scan = function() {
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_get_settings';
        var postData = {
            csrfToken: GlobalVariables.csrfToken
        };
		
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			/* Get values */
			//	Line 1
			$('#date_format').val(response.date_format);
			$('#time_format').val(response.time_format);
			$('#flexible_column').val(response.flexible_column_label);
			//	Line 2
			$('#school_name').val("SUSTech");
			$('#school_email').val(response.company_email);
			$('#school_link').val(response.company_link);
			//	Line 3
			$('#max_services_checking_ahead_day').val(response.max_services_checking_ahead_day);
			$('#max_appointment_cancel_ahead_day').val(response.max_appointment_cancel_ahead_day);
			$('#upload_file_max_size').val(response.upload_file_max_size);
			
			//	Set all to readonly
			$('#admin-settings-page .form-group').find('input, textarea').attr('readonly', true);
			
			//	Handle School Page Link Navigation
			if ($('#personal-page').val() === '') {
				$('#go_to_personal_page').prop('disabled', true);
			} else {
				$('#go_to_personal_page').prop('disabled', false);
				//	wrap an html element
				$('#go_to_personal_page').wrap("<a target='_blank' href='" + $('#personal-page').val() + "'></a>");
			}
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
	};
	
	$(document).ready(function() {
		$('#edit').click(function() {
			$('#tutor-settings-page .form-group input, #tutor-settings-page .form-group textarea').attr('readonly', false);
			$('#edit, #go_to_personal_page').hide();
			$('#save, #cancel').fadeIn(360);
		});
		
		$('#save').click(function() {
			var gn = $('#given-name').val();
			var sn = $('#surname').val();
			var pp = $('#personal-page').val();
			var intro = $('#intro').val();
			AdminSettingsHelper.saveSettings(gn, sn, pp, intro);
			$('#save, #cancel').hide();
			$('#edit, #go_to_personal_page').fadeIn(360);
			$('#tutor-settings-page .form-group input, #tutor-settings-page .form-group textarea').attr('readonly', true);
		});
		
		$('#cancel').click(function() {
			AdminSettingsHelper.scan();
			$('#save, #cancel').hide();
			$('#edit, #go_to_personal_page').fadeIn(360);
			$('#tutor-settings-page .form-group input, #tutor-settings-page .form-group textarea').attr('readonly', true);
		});
	});
	
	exports.saveSettings = function(gn, sn, pp, intro) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/tutors_api/ajax_save_settings';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			given_name: JSON.stringify(gn),
			surname: JSON.stringify(sn),
			introduction: JSON.stringify(intro),
			personal_page: JSON.stringify(pp)
        };
		
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			if (response === 'SUCCESS') {
				Tutors.displayNotification("Tutor Settings Saved.", undefined, "success");
			} else {
				Tutors.displayNotification("Something went wrong on saving tutor settings.");
			}
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
		
		setTimeout(function() {
			//	re-scan
			AdminSettingsHelper.scan();
		}, 200);
	};

})(window.AdminSettingsHelper);