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

        /**
         * Event: Filter Entry "Click"
         *
         * Display the My Appointments data of the selected row.
         */
        $(document).on('click', '.students-page .sel-tutor-by-time .available-tutors-at-time .entry', function() {
			//	Change selected display
            $('.students-page .sel-tutor-by-time .available-tutors-at-time .entry.selected').removeClass('selected');
            $(this).addClass('selected');
			
			$('#check-available-time-time').prop('disabled', false);
        });

        /**
         * Event: Check Available Time Button "Click"
         */
		$('.students-page #check-available-time-time').click(function() {
			//	Jump to 'calendar' tab
			alert("Jump to 'calendar' tab");
		});
	};

    /**
     * Bring the tutor form back to its initial state.
     */
    AdminServiceConfigServiceTypeHelper.prototype.resetForm = function () {
		//	Clear all inputs
        $('.service_type-details-form').find('input, textarea').val('');

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
		$('#service_type-description').val(service_type.info.personal_page);
		//	MORE
    };
	
    /**
     * Filter tutor records.
     *
     * @param {String} key This key string is used to filter the tutor records.
     * @param {Number} selectId Optional, if set then after the filter operation the record with the given
     * ID will be selected (but not displayed).
     * @param {Boolean} display Optional (false), if true then the selected record will be displayed on the form.
     */
    AdminServiceConfigServiceTypeHelper.prototype.filter = function (date) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/students_api/ajax_get_available_tutors_date_selection';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
            date: JSON.stringify(date)
        };

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			//	Store results
            this.filterResults = response;
			
			//	Clear former results
            $('.students-page .sel-tutor-by-time .available-tutors-at-time').html('');
			
			//	Iterate through all tutors, generate htmls for them and
			//	add them to the results
            $.each(response, function (index, tutor) {
                var html = this.getFilterHtml(index, tutor);
                $('.students-page .sel-tutor-by-time .available-tutors-at-time').append(html);
            }.bind(this));
			
			//	If there are no match, print a message in the result block
            if (response.length === 0) {
                $('.students-page .sel-tutor-by-time .available-tutors-at-time').html('<em>' + EALang.no_records_found + '</em>');
            }
			
			$('#check-available-time-time').prop('disabled', true);
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };

    /**
     * Get the filter results row HTML code.
     *
     * @param {Object} tutor Contains the tutor data.
     *
     * @return {String} Returns the record HTML code.
     */
    AdminServiceConfigServiceTypeHelper.prototype.getFilterHtml = function (index, tutor) {
		
		//	The tutor's name will be used in the first line
        var tutor_name = tutor.tutor_name;
		
		//	The personal page will be used in the second line
		var personal_page = tutor.personal_page;
		
		//	The earliest starting time will be used in the third line
		var earliest_start_datetime = GeneralFunctions.formatDate(Date.parse(tutor.earliest_start_datetime), GlobalVariables.dateFormat, true);

		var line1 = "<strong>" + tutor_name + "</strong>";
		var line2 = "Personal Page - " + personal_page;
		var line3 = "Earliest service starts on " + earliest_start_datetime;
			
        var html =
            '<div class="entry" data-id="' + "666" + '">' +	//	Starting <div> block
            line1 + "<br />" +	//	line1
            line2 + "<br />" +	//	line2
            line3 +	//	line2
            '</div>	<hr />';		//	Ending </div> and a horizontal line
		
        return html;
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
			
			//	Iterate through all services, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, service) {
				var html = "<div class='entry' data-id='" + service.id + "' title='" + service.name + "'><strong style='font-size:20px; color:rgba(41,109,151,0.75);'>" + service.id + "</strong>" + " " + "-" + " " + "<strong>" + service.name + "</strong></div><hr />";
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
