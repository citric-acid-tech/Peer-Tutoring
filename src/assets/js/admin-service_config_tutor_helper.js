(function () {

    'use strict';

    /**
     * AdminServiceConfigTutorHelper Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class AdminServiceConfigTutorHelper
     */
    function AdminServiceConfigTutorHelper() {
        this.filterResults = {};
		this.calendar_needs_retrieval = false;
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    AdminServiceConfigTutorHelper.prototype.bindEventHandlers = function () {
        var instance = this;
		var editing = false;

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
					formData.append('tutor_id', JSON.stringify($('#tutor-id').val()));
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
								//	Do nothing is okay
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
		
        /**
         * Event: Filter Entry "Click"
         *
         * Display the Available Appointments Select by Tutor data of the selected row.
         */
        $(document).on('click', '.admin-page #tutor_config .results .entry', function () {
			if (editing) {
				return false;
			}
			
			//	Get clicked id
            var tutorID = $(this).attr('data-id');
			
			instance.filter(tutorID);
			
			//	Enable buttons
			$('.admin-page #tutor-edit').prop('disabled', false);
			
			//	Change selected display
            $('.admin-page #tutor_config .results .selected').removeClass('selected');
            $(this).addClass('selected');
        });
		
        /**
         * Event: Edit Button "Click"
         */
		$('.admin-page #tutor-edit').click(function() {
			editing = true;
			//	Disable Nav Tabs
			$('ul.nav-tabs li').not('.active').addClass('disabled');
			$('.admin-page #tutor_config #tutor-name').attr('readonly', true);
			$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').hide();
			$('.admin-page #tutor-save, .admin-page #tutor-cancel, .admin-page #tutor-dismiss').fadeIn(360);
			$('.tutor-details-form').find('input, textarea').attr('readonly', false);
			$('.admin-page .no-edit').attr('readonly', true);
			$('#avatar_file_input').prop('disabled', false);
			$('#avatar_setting .avatar_label').css({
				'cursor': 'pointer',
				'opacity': '0.6'
			});
		});
        /**
         * Event: New Tutor Button "Click"
         */
		$('.admin-page #tutor-new-tutor').click(function() {
			$('.admin-page #tutor_config .popup .curtain').fadeIn();
			$('.admin-page #tutor_new_tutor_popup').fadeIn();
		});		
        /**
         * Event: New Tutor Popup Save Button "Click"
         */
		$('.admin-page #popup_new_tutor_save').click(function() {
			//	Grab data
			var sid_text = $('#new_tutor_ids').val();
			//	Ajax Opeation
			instance.saveNewPopup(sid_text);
		});		
        /**
         * Event: New Tutor Popup Cancel Button "Click"
         */
		$('.admin-page #popup_new_tutor_cancel').click(function() {
			$('.admin-page #tutor_config .popup .curtain').fadeOut();
			$('.admin-page #tutor_new_tutor_popup').fadeOut();
			//	Clear popup with some Timeout
			setTimeout(function() {
				instance.clearNewPopup();
			}, 300);
		});		
        /**
         * Event: New Tutor Popup Confirm Button "Click"
         */
		$('.admin-page #popup_new_tutor_confirm').click(function() {
			//	Re-filter everything
			instance.resetForm();
			instance.getAllTutors();
			//	If back to calendar, refetch
			instance.calendar_needs_retrieval = true;
			//	Hide
			$('.admin-page #tutor_config .popup .curtain').fadeOut();
			$('.admin-page #tutor_new_tutor_popup').fadeOut();
			//	Clear popup with some Timeout
			setTimeout(function() {
				instance.clearNewPopup();
			}, 300);
		});
        /**
         * Event: Dismiss Tutor Button "Click"
         */
		$('.admin-page #tutor-dismiss').click(function() {
            var buttons = [
                {
                    text: EALang.confirm,
                    click: function () {
						var id = $('#tutor-id').val();
						instance.dismissTutor(id);
						$('.tutor-details-form').find('input, textarea').attr('readonly', true);
						$('.admin-page #tutor-save, .admin-page #tutor-cancel, .admin-page #tutor-dismiss').hide();
						$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').fadeIn(360);
						editing = false;
						//	Enable Nav Tabs
						$('ul.nav-tabs li').removeClass('disabled');
						$('.admin-page #tutor_config #tutor-name').attr('readonly', false);
						//	If back to calendar, refetch
						instance.calendar_needs_retrieval = true;
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

            GeneralFunctions.displayMessageBox(EALang.dismiss_tutor_title,
                EALang.dismiss_tutor_prompt, buttons);
		});
        /**
         * Event: Save Tutor Button "Click"
         */
		$('.admin-page #tutor-save').click(function() {
			//	Validate Email
			var email = $('#email').val();
			if (!GeneralFunctions.validateEmail(email)) {
				Admin.displayNotification(EALang.invalid_email, undefined, "failure");
				$('#email').addClass('gg');
				setTimeout(function() {
					$('#email').removeClass('gg');
				}, 300);
				return false;
			}
			
			//	Validate Personal Page
			var personal_page = $('#personal-page').val();
			//	If personal page is empty, just pass; Else check validity
			if (personal_page !== '' && validate({website: personal_page}, {website: {url: true}}) !== undefined) {
				if (validate({website: "https://" + personal_page}, {website: {url: true}}) == undefined) {	//	Try adding "https://" before
					//	If okay now, automatically prepend "https://"
					personal_page = "https://" + personal_page;
					$('#personal-page').val(personal_page);
				} else if (validate({website: "http://" + personal_page}, {website: {url: true}}) == undefined) {	//	Try adding "http://" before
					//	If okay now, automatically prepend "http://"
					personal_page = "http://" + personal_page;
					$('#personal-page').val(personal_page);
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
			
			instance.saveEdition();
			$('.tutor-details-form').find('input, textarea').attr('readonly', true);
			$('.admin-page #tutor-save, .admin-page #tutor-cancel, .admin-page #tutor-dismiss').hide();
			$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').fadeIn(360);
			editing = false;
			//	Enable Nav Tabs
			$('ul.nav-tabs li').removeClass('disabled');
			$('.admin-page #tutor_config #tutor-name').attr('readonly', false);
			$('#avatar_file_input').prop('disabled', true);
			$('#avatar_setting .avatar_label').css({
				'cursor': 'not-allowed',
				'opacity': '1'
			});
		});
        /**
         * Event: Cancel Button "Click"
         */
		$('.admin-page #tutor-cancel').click(function() {
			instance.filter($('.admin-page #tutor-id').val());
			$('.tutor-details-form').find('input, textarea').attr('readonly', true);
			$('.admin-page #tutor-save, .admin-page #tutor-cancel, .admin-page #tutor-dismiss').hide();
			$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').fadeIn(360);
			editing = false;
			//	Enable Nav Tabs
			$('ul.nav-tabs li').removeClass('disabled');
			$('.admin-page #tutor_config #tutor-name').attr('readonly', false);
			$('#avatar_file_input').prop('disabled', true);
			$('#avatar_setting .avatar_label').css({
				'cursor': 'not-allowed',
				'opacity': '1'
			});
		});		
			
		var t = null;
        /**
         * Event: Typing tutor
         */
		$('.admin-page #tutor_config #tutor-name').on("keyup", function() {
			if (editing) {
				return false;
			}
			if (t) {
				clearTimeout(t);
			}
			var obj = this;
			t = setTimeout(function() {
				instance.resetForm();
				$('.admin-page #tutor-edit').prop('disabled', true);
				var val = $(obj).val().toLowerCase();
				instance.filterList('.admin-page #tutor_config .results .entry', val);
			}, 200);
		});

	};

    /**
     * Upload
     */
    AdminServiceConfigTutorHelper.prototype.saveEdition = function () {
        var tutor_id = $('#tutor-id').val();
		var first_name = GeneralFunctions.superEscapeHTML($('#first-name').val());
		var last_name = GeneralFunctions.superEscapeHTML($('#last-name').val());
		var phone_number = GeneralFunctions.superEscapeHTML($('#phone-number').val());
		var address = GeneralFunctions.superEscapeHTML($('#address').val());
		var email = GeneralFunctions.superEscapeHTML($('#email').val());
		var personal_page = $('#personal-page').val();
		var introduction = GeneralFunctions.superEscapeHTML($('#introduction').val());
		var flexible_column = GeneralFunctions.superEscapeHTML($('#flexible-column').val());
		
		//	AJAX
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_edit_tutor';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			tutor_id : tutor_id,
			first_name : JSON.stringify(first_name),
			last_name : JSON.stringify(last_name),
			personal_page : JSON.stringify(personal_page),
			introduction : JSON.stringify(introduction),
			address : JSON.stringify(address),
			flexible_column : JSON.stringify(flexible_column),
			email : JSON.stringify(email),
			phone_number : JSON.stringify(phone_number)
        };
		
		var obj = this;

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			if (response === 'success') {
				Admin.displayNotification(EALang.edit_tutor_success, undefined, "success");
			} else if (response === 'fail') {
				Admin.displayNotification(EALang.edit_tutor_fail, undefined, "failure");
			}
			
			var newName = first_name + " " + last_name;
			$('.admin-page #tutor_config .results .entry.selected')[0].title = newName;
			$('.admin-page #tutor_config .results .entry.selected strong.nameTags')[0].innerHTML = newName;
			
			//	Save, calendar needs refetching
			this.calendar_needs_retrieval = true;
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
	
    /**
     * Bring the tutor form back to its initial state.
     */
    AdminServiceConfigTutorHelper.prototype.resetForm = function () {
		//	Clear all inputs
        $('.tutor-details-form').find('input, textarea').val('');

		$('#avatar, #avatar_modal_image').prop('src', GlobalVariables.avatarPrefix + "default.png");
		$('.alert').fadeOut();
		$('#avatar_file_input').prop('disabled', true);
		$('#avatar_setting .avatar_label').css({
			'cursor': 'not-allowed',
			'opacity': '1'
		});
		
		//	Handle the button group
        $('#tutor-save, #tutor-cancel, #tutor-dismiss').hide();
        $('#tutor-edit, #tutor-new-tutor').show();
		
		//	Erase all selected effects on search results part
        $('.admin-page #tutor_config .results .selected').removeClass('selected');
		
		//	When editing, background color will be added to indicate that
		//	selections are disabled. Writing as below removes the color when
		//	resetting the form
        $('.admin-page #tutor_config .results').css('color', '');
    };

    /**
     * Display a tutor record into the form.
     *
     * @param {Object} tutor Contains the tutor record data.
     */
    AdminServiceConfigTutorHelper.prototype.display = function (tutor) {
        $('#tutor-id').val(tutor.id);
        $('#tutor-sid').val(tutor.sid);
		$('#first-name').val(tutor.first_name);
		$('#last-name').val(tutor.last_name);
		$('#phone-number').val(tutor.phone_number);
		$('#address').val(tutor.address);
		$('#email').val(tutor.email);
		$('#personal-page').val(tutor.personal_page);
		$('#introduction').val(tutor.introduction);
		$('#flexible-column').val(tutor.flexible_column);
		$('#avatar, #avatar_modal_image').prop('src', GlobalVariables.avatarPrefix + tutor.avatar_url);
		$('#avatar_file_input').prop('disabled', true);
		$('#avatar_setting .avatar_label').css({
			'cursor': 'not-allowed',
			'opacity': '1'
		});
		$('.alert').fadeOut();
    };

    /**
     * Filter turtor records.
     *
     * @param {String} key This key string is used to filter the appointment records.
     * @param {Number} selectId Optional, if set then after the filter operation the record with the given
     * ID will be selected (but not displayed).
     * @param {Boolean} display Optional (false), if true then the selected record will be displayed on the form.
     */
    AdminServiceConfigTutorHelper.prototype.filter = function (id, display) {
        display = display || false;

        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_filter_tutors';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			tutor_id : (id === undefined || id === '') ? JSON.stringify('ALL') : id
        };

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			var obj = this;
			$.each(response, function(index, tutor) {
				obj.display(tutor);
			});
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };	
	
    /**
     * Get all tutors and wrap them in an html
     */
    AdminServiceConfigTutorHelper.prototype.getAllTutors = function() {
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
			$('.admin-page #tutor_config .results').html('');
			
			//	Iterate through all tutors, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, tutor) {
				//	Fix an admin account bug
				var cas_sid = tutor.cas_sid;
				var space_or_not = '';
				if (cas_sid === null) {
					cas_sid = '';
					space_or_not = '';
				} else {
					space_or_not = ' ';
				}
				var html = "<div class='entry' data-id='" + tutor.id + "' title='" + tutor.id + " " + cas_sid + space_or_not + tutor.name + "'><strong style='font-size:20px; color:rgba(41,109,151,0.75);'>" + tutor.id + "</strong>" + " " + "-" + " <strong>" + cas_sid + "</strong>" + space_or_not + "<strong class='nameTags'>" + tutor.name + "</strong></div>";
				$('.admin-page #tutor_config .results').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
    AdminServiceConfigTutorHelper.prototype.filterList = function(filterItem, filterValue) {
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
     * Clear new tutor ids popup
     */
    AdminServiceConfigTutorHelper.prototype.clearNewPopup = function() {
		//	Clear values
		$('#new_tutor_ids, #new_tutor_ids_response').val('');
		//	Recover background-colors and border for response
		$('#new_tutor_ids_response').css({
			'background-color': 'darkgray',
			'border': '0.5px solid #296d97'
		});
		//	Recover contents and color of help block
		$('#new_tutor_help').html(EALang.ad_sc_tut_new_hint);
		$('#new_tutor_help').css('color', '#a6a6a6');
		//	hide confirm button and show save cancel buttons
		$('#popup_new_tutor_confirm').hide();
		$('#popup_new_tutor_save, #popup_new_tutor_cancel').show();
    };
	
    /**
     * Save new tutor ids popup
     */
    AdminServiceConfigTutorHelper.prototype.saveNewPopup = function(sid_text) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_new_tutor_batch';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			sid_text: JSON.stringify(sid_text)
        };
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
//			console.log(response);
			
			if (response.length === 0) {	// If all inserted sucessfully
				//	change help-text to green
				$('#new_tutor_help').css('color', 'green');
				$('#new_tutor_help').html(EALang.new_tutors_ak);
			} else {	// If some failed
				//	change help-text to red
				$('#new_tutor_help').css('color', 'red');
				$('#new_tutor_help').html(EALang.new_tutors_some_fail);
				//	change response block bg-color into white and border color
				$('#new_tutor_ids_response').css({
					'background-color': 'white',
					'border': '0.5px solid red'
				});
				//	put fail ids into response block
				var output = '';
				for (var i = 0; i < response.length; ++i) {
					output = output + response[i];
					if (i !== response.length) {
						output = output + '\r\n';
					}
				}
				$('#new_tutor_ids_response').val(output);
			}
			
			//	hide save cancel buttons and show confirm button
			$('#popup_new_tutor_save, #popup_new_tutor_cancel').hide();
			$('#popup_new_tutor_confirm').show();
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Dismiss a tutor
     */
    AdminServiceConfigTutorHelper.prototype.dismissTutor = function(id) {
		//	AJAX
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_dismiss_tutor';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			tutor_id : id
        };
		
		var obj = this;

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			if (response === 'success') {
				Admin.displayNotification(EALang.dismiss_tutor_success, undefined, "success");
			} else if (response === 'failed') {
				Admin.displayNotification(EALang.dismiss_tutor_fail, undefined, "failure");
			} else {
				Admin.displayNotification(EALang.dismiss_tutor_unknown_error, undefined, "failure");
			}
			
			//	Re-filter
			obj.resetForm();
			obj.getAllTutors();
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    window.AdminServiceConfigTutorHelper = AdminServiceConfigTutorHelper;
})();
