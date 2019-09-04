(function () {

    'use strict';

    /**
     * StudentsAvailableAppointmentsTimeHelper Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class StudentsAvailableAppointmentsTimeHelper
     */
    function StudentsAvailableAppointmentsTimeHelper() {
        this.filterResults = {};
		this.selected_tutor_id = undefined;
		this.selected_tutor = undefined;
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    StudentsAvailableAppointmentsTimeHelper.prototype.bindEventHandlers = function () {
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
			instance.selected_tutor_id = $('.available-tutors-at-time .entry.selected').attr('data-id');
			instance.selected_tutor = $('.available-tutors-at-time .entry.selected strong').html();
			$("a[data-toggle='tab'][href='#check-available-time-in-calendar']").tab('show');
		});
	};

    /**
     * Filter tutor records.
     *
     * @param {String} key This key string is used to filter the tutor records.
     * @param {Number} selectId Optional, if set then after the filter operation the record with the given
     * ID will be selected (but not displayed).
     * @param {Boolean} display Optional (false), if true then the selected record will be displayed on the form.
     */
    StudentsAvailableAppointmentsTimeHelper.prototype.filter = function (date) {
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
    StudentsAvailableAppointmentsTimeHelper.prototype.getFilterHtml = function (index, tutor) {
		
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
            '<div class="entry" data-id="' + tutor.tutor_id + '">' +	//	Starting <div> block
            line1 + "<br />" +	//	line1
            line2 + "<br />" +	//	line2
            line3 +	//	line2
            '</div>	<hr />';		//	Ending </div> and a horizontal line
		
        return html;
    };
	
    window.StudentsAvailableAppointmentsTimeHelper = StudentsAvailableAppointmentsTimeHelper;
})();
