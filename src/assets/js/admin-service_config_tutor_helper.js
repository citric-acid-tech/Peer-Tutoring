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
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    AdminServiceConfigTutorHelper.prototype.bindEventHandlers = function () {
        var instance = this;
		var editing = false;

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
			$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').prop('disabled', false);
			
			//	Change selected display
            $('.admin-page #tutor_config .results .selected').removeClass('selected');
            $(this).addClass('selected');
        });
		
        /**
         * Event: Edit Button "Click"
         */
		$('.admin-page #tutor-edit').click(function() {
			editing = true;
			$('.admin-page #tutor_config #tutor-name').attr('readonly', true);
			$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').hide();
			$('.admin-page #tutor-save, .admin-page #tutor-cancel').fadeIn(360);
			$('.tutor-details-form').find('input, textarea').attr('readonly', false);
			$('.admin-page #tutor-id').attr('readonly', true);
		});
        /**
         * Event: New Tutor Button "Click"
         */
		$('.admin-page #tutor-new-tutor').click(function() {
			//	TBC
			alert("New Tutor");
		});		
        /**
         * Event: Save Tutor Button "Click"
         */
		$('.admin-page #tutor-save').click(function() {
			instance.saveEdition();
			$('.tutor-details-form').find('input, textarea').attr('readonly', true);
			$('.admin-page #tutor-save, .admin-page #tutor-cancel').hide();
			$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').fadeIn(360);
			editing = false;
			$('.admin-page #tutor_config #tutor-name').attr('readonly', false);
		});		
        /**
         * Event: Cancel Button "Click"
         */
		$('.admin-page #tutor-cancel').click(function() {
			instance.filter($('.admin-page #tutor-id').val());
			$('.tutor-details-form').find('input, textarea').attr('readonly', true);
			$('.admin-page #tutor-save, .admin-page #tutor-cancel').hide();
			$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').fadeIn(360);
			editing = false;
			$('.admin-page #tutor_config #tutor-name').attr('readonly', false);
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
				$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').prop('disabled', true);
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
		var first_name = $('#first-name').val();
		var last_name = $('#last-name').val();
		var phone_number = $('#phone-number').val();
		var address = $('#address').val();
		var email = $('#email').val();
		var personal_page = $('#personal-page').val();
		var introduction = $('#introduction').val();
		var flexible_column = $('#flexible-column').val();
		
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
				Admin.displayNotification("Uploaded successfully.", undefined, "success");
			} else if (response === 'fail') {
				Admin.displayNotification("ajax_edit_tutor: nonono", undefined, "failure");
			}
			
			var newName = $('#first-name').val() + " " + $('#last-name').val();;
			$('.admin-page #tutor_config .results .entry.selected')[0].title = newName;
			$('.admin-page #tutor_config .results .entry.selected strong.nameTags')[0].innerHTML = newName;
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
	
    /**
     * Bring the tutor form back to its initial state.
     */
    AdminServiceConfigTutorHelper.prototype.resetForm = function () {
		//	Clear all inputs
        $('.tutor-details-form').find('input, textarea').val('');

		//	Handle the button group
        $('#tutor-save, #tutor-cancel').hide();
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
		$('#first-name').val(tutor.first_name);
		$('#last-name').val(tutor.last_name);
		$('#phone-number').val(tutor.phone_number);
		$('#address').val(tutor.address);
		$('#email').val(tutor.email);
		$('#personal-page').val(tutor.personal_page);
		$('#introduction').val(tutor.introduction);
		$('#flexible-column').val(tutor.flexible_coulmn);
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
				var html = "<div class='entry' data-id='" + tutor.id + "' title='" + tutor.name + "'><strong style='font-size:20px; color:rgba(41,109,151,0.75);'>" + tutor.id + "</strong>" + " " + "-" + " " + "<strong class='nameTags'>" + tutor.name + "</strong></div>";
				$('.admin-page #tutor_config .results').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
    AdminServiceConfigTutorHelper.prototype.filterList = function(filterItem, filterValue) {
		$(filterItem).filter(function() {
			$(this).toggle($(this)[0].title.toLowerCase().indexOf(filterValue) > -1);
		});
    };
	
    window.AdminServiceConfigTutorHelper = AdminServiceConfigTutorHelper;
})();