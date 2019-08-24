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

        /**
         * Event: Filter Entry "Click"
         *
         * Display the Available Appointments Select by Tutor data of the selected row.
         */
        $(document).on('click', '.admin-page #tutor_config .results .entry', function () {
			//	Get clicked id
            var tutorID = $(this).attr('data-id');
			
			//	Find the tutor according to id and get its data
            var tutor = {};
            $.each(instance.filterResults, function (index, item) {
                if (item.id === tutorID) {
                    tutor = item;
                    return false;
                }
            });
			
			//	Display the data
            instance.display(tutor);
			
			//	Change selected display
            $('.admin-page #tutor_config .results .selected').removeClass('selected');
            $(this).addClass('selected');
        });
		
        /**
         * Event: Edit Button "Click"
         */
		$('.admin-page #tutor-edit').click(function() {
			$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').hide();
			$('.admin-page #tutor-save, .admin-page #tutor-cancel').fadeIn(360);
		});		
        /**
         * Event: New Tutor Button "Click"
         */
		$('.admin-page #tutor-new-tutor').click(function() {
			alert("New Tutor");
		});		
        /**
         * Event: Save Tutor Button "Click"
         */
		$('.admin-page #tutor-save').click(function() {
			$('.admin-page #tutor-save, .admin-page #tutor-cancel').hide();
			$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').fadeIn(360);
		});		
        /**
         * Event: Cancel Button "Click"
         */
		$('.admin-page #tutor-cancel').click(function() {
			$('.admin-page #tutor-save, .admin-page #tutor-cancel').hide();
			$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').fadeIn(360);
		});
			
        /**
         * Event: Typing tutor
         */
		$('.admin-page #tutor_config #tutor-name').on("keyup", function() {
			var val = $(this).val().toLowerCase();
			instance.filterList('.admin-page #tutor_config .results div', val);
		});		
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
    AdminServiceConfigTutorHelper.prototype.filter = function (id, selectId, display) {
        display = display || false;

        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_filter_tutors';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			id : (id === undefined || id === '') ? JSON.stringify('ALL') : id
        };

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			//	Store results
            this.filterResults = response;
			
			//	If selectId is provided, show it
            if (selectId !== undefined) {
                this.select(selectId, display);
            }
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };

    /**
     * Select a specific record from the current filter results.
     *
     * If the appointment id does not exist in the list then no record will be selected.
     *
     * @param {Number} id The record id to be selected from the filter results.
     * @param {Boolean} display Optional (false), if true then the method will display the record
     * on the form.
     */
    AdminServiceConfigTutorHelper.prototype.select = function (id, display) {
        display = display || false;
		
		//	If display === true, display the tutor
        if (display) {
            $.each(this.filterResults, function (index, tutor) {
                if (tutor.id === id) {
                    this.display(tutor);
                    return false;
                }
            }.bind(this));
        }
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
				var html = "<div class='entry' data-id='" + tutor.id + "' title='" + tutor.name + "'><strong style='font-size:20px; color:rgba(41,109,151,0.75);'>" + tutor.id + "</strong>" + " " + "-" + " " + "<strong>" + tutor.name + "</strong></div><hr />";
				$('.admin-page #tutor_config .results').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
    AdminServiceConfigTutorHelper.prototype.filterList = function(filterItem, filterValue) {
		$(filterItem).filter(function() {
			$(this).toggle($(this)[0].innerHTML.toLowerCase().indexOf(filterValue) > -1);
		});
    };
	
    window.AdminServiceConfigTutorHelper = AdminServiceConfigTutorHelper;
})();
