(function () {

    'use strict';

    /**
     * AdminServiceConfigServiceTypeHelper Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class AdminServiceConfigServiceTypeHelper
     */
    function AdminServiceConfigServiceTypeHelper() {
        this.filterResults = {};
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    AdminServiceConfigServiceTypeHelper.prototype.bindEventHandlers = function () {
        var instance = this;
		var editing = false;

        /**
         * Event: Filter Entry "Click"
         *
         * Display the Available Appointments Select by Tutor data of the selected row.
         */
        $(document).on('click', '.admin-page #service_type_config .results .entry', function () {
			if (editing) {
				return false;
			}
			
			//	Get clicked id
            var serviceTypeID = $(this).attr('data-id');
			
			instance.filter(serviceTypeID);
			
			//	Enable buttons
			$('.admin-page #service_type-edit, .admin-page #service_type-new-service_type').prop('disabled', false);
			
			//	Change selected display
            $('.admin-page #service_type_config .results .selected').removeClass('selected');
            $(this).addClass('selected');
        });
		
        /**
         * Event: Edit Button "Click"
         */
		$('.admin-page #service_type-edit').click(function() {
			editing = true;
			$('.admin-page #service_type_config #service_type-service_type').attr('readonly', true);
			$('.admin-page #service_type-edit, .admin-page #service_type-new-service_type').hide();
			$('.admin-page #service_type-save, .admin-page #service_type-cancel').fadeIn(360);
			$('.service_type-details-form').find('input, textarea').attr('readonly', false);
			$('.admin-page #service_type-id').attr('readonly', true);
		});
        /**
         * Event: New Tutor Button "Click"
         */
		$('.admin-page #service_type-new-service_type').click(function() {
			//	TBC
			alert("New Service Type");
		});		
        /**
         * Event: Save Tutor Button "Click"
         */
		$('.admin-page #service_type-save').click(function() {
			instance.saveEdition();
			$('.service_type-details-form').find('input, textarea').attr('readonly', true);
			$('.admin-page #service_type-save, .admin-page #service_type-cancel').hide();
			$('.admin-page #service_type-edit, .admin-page #service_type-new-service_type').fadeIn(360);
			editing = false;
			$('.admin-page #service_type_config #service_type-id').attr('readonly', false);
		});		
        /**
         * Event: Cancel Button "Click"
         */
		$('.admin-page #service_type-cancel').click(function() {
			instance.filter($('.admin-page #service_type-id').val());
			$('.service_type-details-form').find('input, textarea').attr('readonly', true);
			$('.admin-page #service_type-save, .admin-page #service_type-cancel').hide();
			$('.admin-page #service_type-edit, .admin-page #service_type-new-service_type').fadeIn(360);
			editing = false;
			$('.admin-page #service_type_config #service_type-id').attr('readonly', false);
		});
			
		var t = null;
        /**
         * Event: Typing tutor
         */
		$('.admin-page #service_type_config #service_type-service_type').on("keyup", function() {
			if (editing) {
				return false;
			}
			if (t) {
				clearTimeout(t);
			}
			var obj = this;
			t = setTimeout(function() {
				instance.resetForm();
				$('.admin-page #service_type-edit, .admin-page #service_type-new-service_type').prop('disabled', true);
				var val = $(obj).val().toLowerCase();
				instance.filterList('.admin-page #service_type_config .results .entry', val);
			}, 200);
		});
	};

    /**
     * Upload
     */
    AdminServiceConfigServiceTypeHelper.prototype.saveEdition = function () {
        var service_type_id = $('#service_type-id').val();
		var service_type_name = $('#service_type-name').val();
		var service_type_description = $('#service_type-description').val();
		
		//	AJAX
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_edit_service_type';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			service_type_id : service_type_id,
			name : JSON.stringify(service_type_name),
			description : JSON.stringify(service_type_description)
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
				Admin.displayNotification("ajax_edit_service_type: nonono", undefined, "failure");
			}
			
			var newName = $('#service_type-name').val();
			$('.admin-page #service_type_config .results .entry.selected')[0].title = newName;
			$('.admin-page #service_type_config .results .entry.selected strong.nameTags')[0].innerHTML = newName;
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Bring the tutor form back to its initial state.
     */
    AdminServiceConfigServiceTypeHelper.prototype.resetForm = function () {
		//	Clear all inputs
        $('.service_type-details-form').find('input, textarea').val('');
		
		//	Clear Demonstration Box
		$('.current_tutors_in_this_service_type').html('');

		//	Handle the button group
        $('#service_type-save, #service_type-cancel').hide();
        $('#service_type-edit, #service_type-new-service_type').show();
		
		//	Erase all selected effects on search results part
        $('.admin-page #service_type_config .results .selected').removeClass('selected');
		
		//	When editing, background color will be added to indicate that
		//	selections are disabled. Writing as below removes the color when
		//	resetting the form
        $('.admin-page #service_type_config .results').css('color', '');
    };

    /**
     * Display a tutor record into the form.
     *
     * @param {Object} tutor Contains the tutor record data.
     */
    AdminServiceConfigServiceTypeHelper.prototype.display = function (service_type) {
        $('#service_type-id').val(service_type.info.id);
		$('#service_type-name').val(service_type.info.name);
		$('#service_type-description').val(service_type.info.description);
		//	MORE ON THE RIGHT
		$('.current_tutors_in_this_service_type').html('');
		$.each(service_type.tutors, function(index, tutor) {
			var html = "<div title='" + tutor + "' style='text-align:center;'><strong>" + tutor + "</strong></div><hr />";
			$('.current_tutors_in_this_service_type').append(html);
		}.bind(this));
    };
	
    /**
     * Filter turtor records.
     *
     * @param {String} key This key string is used to filter the appointment records.
     * @param {Number} selectId Optional, if set then after the filter operation the record with the given
     * ID will be selected (but not displayed).
     * @param {Boolean} display Optional (false), if true then the selected record will be displayed on the form.
     */
    AdminServiceConfigServiceTypeHelper.prototype.filter = function (id, display) {
        display = display || false;

        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_filter_service_types';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			service_type_id : (id === undefined || id === '') ? JSON.stringify('ALL') : id
        };

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			var obj = this;
			$.each(response, function(index, service_type) {
				obj.display(service_type);
			});
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };	

    /**
     * Get all service categories and wrap them in an html
     */
   	AdminServiceConfigServiceTypeHelper.prototype.getAllServiceTypes = function() {
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
			$('.admin-page #service_type_config .results').html('');
			
			//	Iterate through all service_types, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, service_type) {
				var html = "<div class='entry' data-id='" + service_type.id + "' title='" + service_type.name + "'><strong style='font-size:20px; color:rgba(41,109,151,0.75);'>" + service_type.id + "</strong>" + " " + "-" + " " + "<strong class='nameTags'>" + service_type.name + "</strong></div>";
				$('.admin-page #service_type_config .results').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
    AdminServiceConfigServiceTypeHelper.prototype.filterList = function(filterItem, filterValue) {
		$(filterItem).filter(function() {
			$(this).toggle($(this)[0].title.toLowerCase().indexOf(filterValue) > -1);
		});
    };
	
    window.AdminServiceConfigServiceTypeHelper = AdminServiceConfigServiceTypeHelper;
})();
