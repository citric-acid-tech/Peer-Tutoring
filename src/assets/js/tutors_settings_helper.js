window.TutorsSettingsHelper = window.TutorsSettingsHelper || {};

/**
 * TutorsSettingsHelper
 *
 * This module contains functions that are used in the students section of the application.
 *
 * @module TutorsSettingsHelper
 */
(function (exports) {

    'use strict';
	
	var cropper;

	//	Retrieve info about the page
	exports.scan = function() {
        var postUrl = GlobalVariables.baseUrl + '/index.php/tutors_api/ajax_get_settings';
        var postData = {
            csrfToken: GlobalVariables.csrfToken
        };
		
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			$.each(response, function(index, user) {
				//	Get values
				$('#given-name').val(user.given_name);
				$('#surname').val(user.surname);
				$('#personal-page').val(user.personal_page);
				
				$('#email').val(user.email);
				$('#address').val(user.address);
				$('#phone_number').val(user.phone_number);				
				
				$('#intro').val(user.introduction);
				$('#flexible_column').val(user.flexible_column);
			});
			
			$('#tutor-settings-page .form-group input, #tutor-settings-page .form-group textarea').attr('readonly', true);
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
		
		//	Handle Avatar Image
		var avatar = $('#avatar')[0];
		cropper = new Cropper(avatar, {
			viewMode: 3,
			autoCrop: false,
			dragMode: 'none',
			ready() {
				cropper.disable();
			}
		});
		
		$('#edit').click(function() {
			$('#tutor-settings-page .form-group input, #tutor-settings-page .form-group textarea').attr('readonly', false);
			$('#edit, #go_to_personal_page').hide();
			$('#save, #cancel').fadeIn(360);
		});
		
		$('#save').click(function() {
			var gn = GeneralFunctions.superEscapeHTML($('#given-name').val());
			var sn = GeneralFunctions.superEscapeHTML($('#surname').val());
			
			//	Validate Email
			var email = $('#email').val();
			if (!GeneralFunctions.validateEmail(email)) {
				Tutors.displayNotification(EALang.tut_set_save_invalid_email_error, undefined, "failure");
				$('#email').addClass('gg');
				setTimeout(function() {
					$('#email').removeClass('gg');
				}, 300);
				return false;
			}
			//	Validate Personal Page
			var pp = $('#personal-page').val();
			if (validate({website: pp}, {website: {url: true}}) !== undefined) {
				Tutors.displayNotification(EALang.invalid_url, undefined, "failure");
				$('#personal-page').addClass('gg');
				setTimeout(function() {
					$('#personal-page').removeClass('gg');
				}, 300);
				return false;
			}
			
			var address = GeneralFunctions.superEscapeHTML($('#address').val());
			var phone_number = $('#phone_number').val();
			
			var intro = GeneralFunctions.superEscapeHTML($('#intro').val());
			var fc = GeneralFunctions.superEscapeHTML($('#flexible_column').val());
			TutorsSettingsHelper.saveSettings(gn, sn, pp, email, address, phone_number, intro, fc);
			$('#save, #cancel').hide();
			$('#edit, #go_to_personal_page').fadeIn(360);
			$('#tutor-settings-page .form-group input, #tutor-settings-page .form-group textarea').attr('readonly', true);
		});
		
		$('#cancel').click(function() {
			TutorsSettingsHelper.scan();
			$('#save, #cancel').hide();
			$('#edit, #go_to_personal_page').fadeIn(360);
			$('#tutor-settings-page .form-group input, #tutor-settings-page .form-group textarea').attr('readonly', true);
		});
	});
	
	exports.saveSettings = function(gn, sn, pp, email, address, phone_number, intro, fc) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/tutors_api/ajax_save_settings';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			given_name: JSON.stringify(gn),
			surname: JSON.stringify(sn),
			introduction: JSON.stringify(intro),
			personal_page: JSON.stringify(pp),
			email: JSON.stringify(email),
			address: JSON.stringify(address),
			phone_number: JSON.stringify(phone_number),
			flexible_column: JSON.stringify(fc)
        };
		
//		console.log(postData);
		
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			if (response === 'SUCCESS') {
				Tutors.displayNotification(EALang.tut_set_save_success, undefined, "success");
			} else {
				Tutors.displayNotification(EALang.tut_set_save_unknown_error);
			}
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
		
		setTimeout(function() {
			//	re-scan
			TutorsSettingsHelper.scan();
		}, 200);
	};

})(window.TutorsSettingsHelper);