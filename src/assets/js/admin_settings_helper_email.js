(function () {

    'use strict';

    /**
     * AdminSettingsHelperEmail Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class AdminSettingsHelperEmail
     */
    function AdminSettingsHelperEmail() {
        this.filterResults = {};
		this.trumbowyg = undefined;
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    AdminSettingsHelperEmail.prototype.bindEventHandlers = function () {
        var instance = this;
		
        /**
         * Event: Edit Button "Click"
         */
		$('#edit_email').click(function() {
			//	Disable Nav Tabs
			$('ul.nav-tabs li').not('.active').addClass('disabled');
			//	Disable select
			$('#email_title_group select').prop('disabled', true);
			$('#email_end, #email_event, #email_receiver').niceSelect('update');
			//	Enable Editing
			$('#email_title').prop('readonly', false);
			$('#email_content').trumbowyg('enable');
			//	Toggle button group
			$(this).hide();
			$('#save_email, #cancel_email').fadeIn(360);
		});
		
        /**
         * Event: Save Button "Click"
         */
		$('#save_email').click(function() {
			//	Enable Nav Tabs
			$('ul.nav-tabs li').removeClass('disabled');
			//	Disable Editing
			$('#email_title').prop('readonly', true);
			$('#email_content').trumbowyg('disable');
			//	Retrieve Setting Object Strings
        	var email_end = $('select#email_end option:selected').val();
			var email_event = $('select#email_event option:selected').val();
			var email_receiver = $('select#email_receiver option:selected').val();
			//	Parse for a Setting Object
			var key = instance.parseEmailSettings(email_end, email_event, email_receiver);
			var title = $('#email_title').val();
			var content = instance.trumbowyg.html();
			//	Save settings
			instance.saveEmailSettings(key, title, content);
			//	Below will be done in saving
			//	Toggle button group
			//	Enable select
		});
		
        /**
         * Event: Cancel Button "Click"
         */
		$('#cancel_email').click(function() {
			//	Enable Nav Tabs
			$('ul.nav-tabs li').removeClass('disabled');
			//	Disable Editing
			$('#email_title').prop('readonly', true);
			$('#email_content').trumbowyg('disable');
			//	Retrieve settings
			instance.getEmailSettings();
			//	Toggle button group
			$('#save_email, #cancel_email').hide();
			$('#edit_email').fadeIn(360);
			//	Enable select
			$('#email_title_group select').prop('disabled', false);
			$('#email_end, #email_event, #email_receiver').niceSelect('update');
		});
		
        /**
         * Event: End selected
         */
		$('select#email_end').change(function() {
			//	Different States should be considered
			var cur = $(this).find('option:selected').val();
			if (cur === 'stu') {
				//	Student End
				//	Handle Selectable Options
				$('.email_student').prop('disabled', false);
				$('.email_tutor, .email_admin').prop('disabled', true);
				$("#email_receiver option").prop('disabled', false);
				//	Default option
				$('#email_event option').prop('selected', false);
				$("#email_event option.email_student[value='ma']").prop('selected', true);
				$('#email_receiver option').prop('selected', false);
				$("#email_receiver option[value='t']").prop('selected', true);
				//	Update Select list
				$('#email_event, #email_receiver').niceSelect('update');
			} else if (cur === 'tut') {
				//	Tutor End
				//	Handle Selectable Options
				$('.email_tutor').prop('disabled', false);
				$('.email_student, .email_admin').prop('disabled', true);
				$("#email_receiver option").prop('disabled', false);
				$("#email_receiver option[value='t']").prop('disabled', true);
				//	Default option
				$('#email_event option').prop('selected', false);
				$("#email_event option.email_student[value='fs']").prop('selected', true);
				$('#email_receiver option').prop('selected', false);
				$("#email_receiver option[value='s']").prop('selected', true);
				//	Update Select list
				$('#email_event, #email_receiver').niceSelect('update');
			} else if (cur === 'adm') {
				//	Admin End
				//	Handle Selectable Options
				$('.email_admin').prop('disabled', false);
				$('.email_tutor, .email_student').prop('disabled', true);
				$("#email_receiver option").prop('disabled', false);
				$("#email_receiver option[value='s']").prop('disabled', true);
				//	Default option
				$('#email_event option').prop('selected', false);
				$("#email_event option.email_student[value='at']").prop('selected', true);
				$('#email_receiver option').prop('selected', false);
				$("#email_receiver option[value='t']").prop('selected', true);
				//	Update Select list
				$('#email_event, #email_receiver').niceSelect('update');
			} else {
				alert('Unexpected Behavior: select box in email settings');
			}
			//	And then retrieve
			instance.getEmailSettings();
		});
		
        /**
         * Event: Event selected
         */
		$('select#email_event').change(function() {
			//	Different states will be considered
			var end = $('select#email_end option:selected').val();
			var cur = $(this).find('option:selected').val();
			if (end === 'stu') {
				//	Student End
				if (cur === 'ma') {
					//	Handle Selectable Options - both
					$("#email_receiver option").prop('disabled', false);
					//	Default option
					$('#email_receiver option').prop('selected', false);
					$("#email_receiver option[value='t']").prop('selected', true);
					//	Update Select list
					$('#email_receiver').niceSelect('update');
				} else if (cur === 'ca') {
					//	Handle Selectable Options - both
					$("#email_receiver option").prop('disabled', false);
					//	Default option
					$('#email_receiver option').prop('selected', false);
					$("#email_receiver option[value='t']").prop('selected', true);
					//	Update Select list
					$('#email_receiver').niceSelect('update');
				} else if (cur === 'rc') {
					//	Handle Selectable Options
					$("#email_receiver option").prop('disabled', false);
					$("#email_receiver option[value='s']").prop('disabled', true);
					//	Default option
					$('#email_receiver option').prop('selected', false);
					$("#email_receiver option[value='t']").prop('selected', true);
					//	Update Select list
					$('#email_receiver').niceSelect('update');
				} else {
					alert('Unexpected Behavior: select box in email settings');
				}
			} else if (end === 'tut') {
				//	Tutor End
				if (cur === 'fs') {
					//	Handle Selectable Options
					$("#email_receiver option").prop('disabled', false);
					$("#email_receiver option[value='t']").prop('disabled', true);
					//	Default option
					$('#email_receiver option').prop('selected', false);
					$("#email_receiver option[value='s']").prop('selected', true);
					//	Update Select list
					$('#email_receiver').niceSelect('update');
				} else {
					alert('Unexpected Behavior: select box in email settings');
				}
			} else if (end === 'adm') {
				//	Admin End
				if (cur === 'at') {
					//	Handle Selectable Options
					$("#email_receiver option").prop('disabled', false);
					$("#email_receiver option[value='s']").prop('disabled', true);
					//	Default option
					$('#email_receiver option').prop('selected', false);
					$("#email_receiver option[value='t']").prop('selected', true);
					//	Update Select list
					$('#email_receiver').niceSelect('update');
				} else if (cur === 'es') {
					//	Handle Selectable Options
					$("#email_receiver option").prop('disabled', false);
					$("#email_receiver option[value='s']").prop('disabled', true);
					//	Default option
					$('#email_receiver option').prop('selected', false);
					$("#email_receiver option[value='t']").prop('selected', true);
					//	Update Select list
					$('#email_receiver').niceSelect('update');
				} else if (cur === 'ds') {
					//	Handle Selectable Options
					$("#email_receiver option").prop('disabled', false);
					$("#email_receiver option[value='t']").prop('disabled', true);
					//	Default option
					$('#email_receiver option').prop('selected', false);
					$("#email_receiver option[value='s']").prop('selected', true);
					//	Update Select list
					$('#email_receiver').niceSelect('update');
				} else {
					alert('Unexpected Behavior: select box in email settings');
				}
			} else {
				alert('Unexpected Behavior: select box in email settings');
			}
			//	And then retrieve
			instance.getEmailSettings();
		});
		
        /**
         * Event: Receiver selected
         */
		$('select#email_receiver').change(function() {
			//	The only thing it has to do is retrieve
			instance.getEmailSettings();
		});
		
	};

    /**
     * Getting Email Settings
     */
    AdminSettingsHelperEmail.prototype.getEmailSettings = function () {
		//	Retrieve Setting Object Strings
        var email_end = $('select#email_end option:selected').val();
		var email_event = $('select#email_event option:selected').val();
		var email_receiver = $('select#email_receiver option:selected').val();
		
		//	Parse for a Setting Object
		var key = this.parseEmailSettings(email_end, email_event, email_receiver);
		
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_get_settings_email_content';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			key: JSON.stringify(key)
        };
		
		var trumbowyg = this.trumbowyg;
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
//			console.log(response);
			
			//	Clear pre
			trumbowyg.empty();
			//	Load Values
			$('#email_title').val(response.subject);
			trumbowyg.html(response.body);
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Save Email Settings
     */
    AdminSettingsHelperEmail.prototype.saveEmailSettings = function (key, title, content) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_save_settings_email_content';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			key: JSON.stringify(key),
			title: JSON.stringify(title),
			content: JSON.stringify(content)
        };
		
//		console.log(postData);
		
		var obj = this;
        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
//			console.log(response);
			
			if (response === 'success') {
				Admin.displayNotification(EALang.save_email_settings_success, undefined, "success");
			} else if (response === 'failed') {
				Admin.displayNotification(EALang.save_email_settings_failed);
			} else {
				Admin.displayNotification(EALang.save_email_settings_unknown_error);
				return false;
			}
			
			//	Toggle button group
			$('#save_email, #cancel_email').hide();
			$('#edit_email').fadeIn(360);
			//	Enable select
			$('#email_title_group select').prop('disabled', false);
			$('#email_end, #email_event, #email_receiver').niceSelect('update');
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Parse for a setting state
     */
    AdminSettingsHelperEmail.prototype.parseEmailSettings = function (email_end, email_event, email_receiver) {
		var header = 'ec';
		var event = 'new_appoint';
		var tut = 'tut', stu = 'stu';
		var receiver = tut;
		
		//	switch for an end
		switch(email_end) {
			case 'stu': switch(email_event) {
				case 'ma': event = 'new_appoint'; switch(email_receiver) {
					case 't': receiver = tut; break;
					case 's': receiver = stu; break;
					default: alert('Strange Behavior: Email Settings');
				} break;
				case 'ca': event = 'cancel_appoint'; switch(email_receiver) {
					case 't': receiver = tut; break;
					case 's': receiver = stu; break;
					default: alert('Strange Behavior: Email Settings');
				} break;
				case 'rc': event = 'survey_comple'; receiver = tut; break;
				default: alert('Strange Behavior: Email Settings');
			} break;
			case 'tut': switch(email_event) {
				case 'fs': event = 'comsug_comple'; receiver = stu; break;
				default: alert('Strange Behavior: Email Settings');
			} break;
			case 'adm': switch(email_event) {
				case 'at': event = 'add_tutor'; receiver = tut; break;
				case 'es': event = 'edit_service'; receiver = tut; break;
				case 'ds': event = 'del_service'; receiver = stu; break;
				default: alert('Strange Behavior: Email Settings');
			} break;
			default: alert('Strange Behavior: Email Settings');
		}
		
		var setting = header + '_' + event + '_' + receiver;
		return setting;
    };
	
    window.AdminSettingsHelperEmail = AdminSettingsHelperEmail;
})();