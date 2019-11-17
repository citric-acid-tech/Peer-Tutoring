(function () {

    'use strict';

    /**
     * AdminSettingsHelperBlacklist Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class AdminSettingsHelperBlacklist
     */
    function AdminSettingsHelperBlacklist() {
        this.filterResults = {};
		this.blacklist_none = '<tr><td colspan="2">' + EALang.blacklist_none + '</td></tr>';
		this.blacklist_remove_button = '<td><button type="button" class="blacklist_remove btn btn-danger"><i class="fas fa-times"></i></button></td></tr>';
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    AdminSettingsHelperBlacklist.prototype.bindEventHandlers = function () {
        var instance = this;
		
		//	Add a user into the blacklist
		$('#blacklist_add').click(function() {
			var sid = $('#blacklist_add_sid').val();
			if (sid === '') {
				Admin.displayNotification(EALang.blacklist_input_sid, undefined, "failure");
				$('#blacklist_add_sid').focus();
				$('#blacklist_add_sid').addClass('gg');
				setTimeout(function() {
					$('#blacklist_add_sid').removeClass('gg');
				}, 1000);
				return false;
			}
			var buttons = [
				{
					text: EALang.confirm,
					click: function () {
						instance.addBlacklist(sid);
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

			GeneralFunctions.displayMessageBox(EALang.blacklist_add_title, EALang.blacklist_add_hint, buttons);
			return true;
		});
		
		//	Remove a user from the blacklist
		$(document).on('click', '.blacklist_remove', function() {
			var sid = $(this).parent().prev().html();
			var buttons = [
				{
					text: EALang.confirm,
					click: function () {
						instance.removeBlacklist(sid);
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

			GeneralFunctions.displayMessageBox(EALang.blacklist_remove_title, EALang.blacklist_remove_hint, buttons);
			return true;
		});
		
	};
	
    /**
     * Retrieve blacklist and render
     */
    AdminSettingsHelperBlacklist.prototype.getBlacklist = function () {
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_get_blacklist';
        var postData = {
            csrfToken: GlobalVariables.csrfToken
        };
		var blacklist_none = this.blacklist_none;
		var blacklist_remove_button = this.blacklist_remove_button;

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
//			console.log(response);	// Debug
			
			$('#blacklist_tab tbody').html('');
			if (response.length === 0) {
				$('#blacklist_tab tbody').append(blacklist_none);
			} else {
				for (var i = 0; i < response.length; ++i) {
					$('#blacklist_tab tbody').append('<tr><td class="sids">' + response[i].sid + '</td>' + blacklist_remove_button);
				}
			}
			
			//	re-render footer
			Admin.placeFooterToBottom();
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
	};
	
    /**
     * Add a user into the blacklist
     */
    AdminSettingsHelperBlacklist.prototype.addBlacklist = function (sid) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_append_to_blacklist';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			sid: JSON.stringify(sid)
        };
		var obj = this;

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			if (response === 'success') {
				Admin.displayNotification(EALang.blacklist_add_success, undefined, "success");
			} else if (response === 'failed') {
				Admin.displayNotification(EALang.blacklist_operation_failed, undefined, "failure");
			} else if (response === 'already_added') {
				Admin.displayNotification(EALang.blacklist_already_added, undefined, "failure");
			} else {
				Admin.displayNotification("sth's wrong", undefined, "warning");
			}
			
			//	re-render blacklist
			obj.getBlacklist();
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
	};
	
    /**
     * Remove a user from the blacklist
     */
    AdminSettingsHelperBlacklist.prototype.removeBlacklist = function (sid) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_remove_from_blacklist';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			sid: JSON.stringify(sid)
        };
		var obj = this;

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			if (response === 'success') {
				Admin.displayNotification(EALang.blacklist_remove_success, undefined, "success");
			} else if (response === 'failed') {
				Admin.displayNotification(EALang.blacklist_operation_failed, undefined, "failure");
			} else if (response === 'already_removed') {
				Admin.displayNotification(EALang.blacklist_already_removed, undefined, "failure");
			} else {
				Admin.displayNotification("sth's wrong", undefined, "warning");
			}
			
			//	re-render blacklist
			obj.getBlacklist();
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
	};
	
    window.AdminSettingsHelperBlacklist = AdminSettingsHelperBlacklist;
})();