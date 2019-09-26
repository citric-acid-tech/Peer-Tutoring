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
		
        postUrl = GlobalVariables.baseUrl + '/index.php/general_api/ajax_get_tutor_avatar_url';
        postData = {
            csrfToken: GlobalVariables.csrfToken,
			tutor_id:  GlobalVariables.tutor_id
        };
		
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			//	avoid auto-caching by adding parameters
			$('#avatar, #avatar_modal_image').prop('src', GlobalVariables.avatarPrefix + response + "?" + moment().format("YYYYMMDDHHmmss"));
			
			$('#avatar_file_input').prop('disabled', true);
			$('#avatar_setting .avatar_label').css({
				'cursor': 'not-allowed',
				'opacity': '1'
			});
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
		
	};
	
	$(document).ready(function() {
		
		var avatar = $('#avatar')[0];
		var image = $('#avatar_modal_image')[0];
		var file_input = $('#avatar_file_input')[0];
		
		var $progress = $('.progress');
		var $progressBar = $('.progress-bar');
		
		var $alert = $('.alert');
		var $modal = $('#avatar_modal');
		
		var cropper;
		$('[data-toggle="tooltip"]').tooltip();
		
		file_input.addEventListener('change', function(e) {
			var files = e.target.files;
			var done = function(url) {
				file_input.value = '';
				image.src = url;
				$alert.fadeOut();
				$modal.modal('show');
			}
			
			var reader;
			var file;
			var url;
			
			if (files && files.length > 0) {
				file = files[0];
				
				if (URL) {
					done(URL.createObjectURL(file));
				} else if (FileReader) {
					reader = new FileReader();
					reader.onload = function(e) {
						done(reader.result);
					};
					reader.readAsDataURL(file);
				}
			}
		});
		
		$modal.on('shown.bs.modal', function() {
			cropper = new Cropper(image, {
				aspectRatio: 1,
				viewMode: 2
			});
		}).on('hidden.bs.modal', function() {
			cropper.destroy();
			cropper = null;
		});
		
		$('#crop-avatar')[0].addEventListener('click', function() {
			var initialAvatarURL;
			var canvas;
			
			$modal.modal('hide');
			
			if (cropper) {
				canvas = cropper.getCroppedCanvas({
					width: 300,
					height: 300,
					aspectRatio: 1 / 1
				});
				initialAvatarURL = avatar.src;
				avatar.src = canvas.toDataURL();
				$progress.fadeIn();
				$alert.removeClass('alert-success alert-warning');
				canvas.toBlob(function(blob) {
					var formData = new FormData();
					var postUrl = GlobalVariables.baseUrl + '/index.php/general_api/ajax_update_tutor_avatar';
					formData.append('csrfToken', GlobalVariables.csrfToken);
					formData.append('avatar', blob);
					formData.append('tutor_id', JSON.stringify(GlobalVariables.tutor_id));
					$.ajax(postUrl, {
						method: 'POST',
						data: formData,
						processData: false,
						contentType: false,
						
						xhr: function() {
							var xhr = new XMLHttpRequest();
							
							xhr.upload.onprogress = function(e) {
								var percent = '0';
								var percentage = '0%';
								
								if (e.lengthComputable) {
									percent = Math.round((e.loaded / e.total) * 100);
									percentage = percent + '%';
									$progressBar.width(percentage).attr('aria-valuenow', percent).text(percentage);
								}
							};
							
							return xhr;
						},
						
						success: function(response) {
							if (!GeneralFunctions.handleAjaxExceptions(response)) {
								return;
							}
							
							if (response.result == true) {
								//	avoid auto-caching
								avatar.src = GlobalVariables.avatarPrefix + response.msg + "?" + moment().format("YYYYMMDDHHmmss");
							} else {
								avatar.src = initialAvatarURL;
								$alert.fadeIn().addClass('alert-warning').text(response.msg);
							}
							
							$alert.fadeIn().addClass('alert-success').text('Upload success');
						},
						
						error: function() {
							avatar.src = initialAvatarURL;
							$alert.fadeIn().addClass('alert-warning').text('Upload error');
						},
						
						complete: function() {
							$progress.fadeOut();
						}
					});
				});
			}
		});
		
		$('#edit').click(function() {
			$('#tutor-settings-page .form-group input, #tutor-settings-page .form-group textarea').attr('readonly', false);
			$('#edit, #go_to_personal_page').hide();
			$('#save, #cancel').fadeIn(360);
			$('#avatar_file_input').prop('disabled', false);
			$('#avatar_setting .avatar_label').css({
				'cursor': 'pointer',
				'opacity': '0.6'
			});
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
			//	If personal page is empty, just pass; Else check validity
			if (pp !== '' && validate({website: pp}, {website: {url: true}}) !== undefined) {
				if (validate({website: "https://" + pp}, {website: {url: true}}) == undefined) {	//	Try adding "https://" before
					//	If okay now, automatically prepend "https://"
					pp = "https://" + pp;
					$('#personal-page').val(pp);
				} else if (validate({website: "http://" + pp}, {website: {url: true}}) == undefined) {	//	Try adding "http://" before
					//	If okay now, automatically prepend "http://"
					pp = "http://" + pp;
					$('#personal-page').val(pp);
				} else {
					//	Nothing works, gg
					Admin.displayNotification(EALang.invalid_url, undefined, "failure");
					$('#personal-page').addClass('gg');
					setTimeout(function() {
						$('#personal-page').removeClass('gg');
					}, 300);
					return false;
				}
			}
			
			var address = GeneralFunctions.superEscapeHTML($('#address').val());
			var phone_number = $('#phone_number').val();
			
			var intro = GeneralFunctions.superEscapeHTML($('#intro').val());
			var fc = GeneralFunctions.superEscapeHTML($('#flexible_column').val());
			TutorsSettingsHelper.saveSettings(gn, sn, pp, email, address, phone_number, intro, fc);
			$('#save, #cancel').hide();
			$('#edit, #go_to_personal_page').fadeIn(360);
			$('#tutor-settings-page .form-group input, #tutor-settings-page .form-group textarea').attr('readonly', true);
			$('#avatar_file_input').prop('disabled', true);
			$('#avatar_setting .avatar_label').css({
				'cursor': 'not-allowed',
				'opacity': '1'
			});
		});
		
		$('#cancel').click(function() {
			TutorsSettingsHelper.scan();
			$('#save, #cancel').hide();
			$('#edit, #go_to_personal_page').fadeIn(360);
			$('#tutor-settings-page .form-group input, #tutor-settings-page .form-group textarea').attr('readonly', true);
			$('#avatar_file_input').prop('disabled', true);
			$('#avatar_setting .avatar_label').css({
				'cursor': 'not-allowed',
				'opacity': '1'
			});
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