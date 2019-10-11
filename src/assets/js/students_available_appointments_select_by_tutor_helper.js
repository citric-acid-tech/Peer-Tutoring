(function () {

    'use strict';

    /**
     * StudentsAvailableAppointmentsTutorHelper Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class StudentsAvailableAppointmentsTutorHelper
     */
    function StudentsAvailableAppointmentsTutorHelper() {
        this.filterResults = {};
		this.selected_tutor_id = undefined;
		this.selected_tutor = undefined;
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    StudentsAvailableAppointmentsTutorHelper.prototype.bindEventHandlers = function () {
        var instance = this;

        /**
         * Event: Filter Available Appointments Select by Tutor Form "Submit"
         */
        $('#filter-aa_tutors form').submit(function () {
			//	remove selected entries and reset the form
            $('#filter-aa_tutors .selected').removeClass('selected');
            instance.resetForm();
			//	get values from two serach boxes
			var sc = $('#filter-aa_tutors #available_appointments_service_category').val();
			var tn = $('#filter-aa_tutors #available_appointments_tutor').val();
			//	filter results with given values
            instance.filter(sc, tn);
            return false;	//	why?
        });

        /**
         * Event: Filter Available Appointments Select by Tutor Button "Click"
         */
        $('#filter-aa_tutors .clear').click(function () {
			$('#filter-aa_tutors #available_appointments_service_category').val('');
            $('#filter-aa_tutors #available_appointments_tutor').val('');
            instance.filter();
            instance.resetForm();
			//	re-filter filter items
			instance.filterList('.students-page #filter-service-category span li', '');
			instance.filterList('.students-page #filter-tutor-name span li', '');
        });

        /**
         * Event: Filter Entry "Click"
         *
         * Display the Available Appointments Select by Tutor data of the selected row.
         */
        $(document).on('click', '.students-page .filter-records .results .entry', function () {
			//	Get clicked id
            var tutorID = $(this).attr('data-id');
			
			//	Find the tutor according to id and get its data
            var tutor = {};
            $.each(instance.filterResults, function (index, item) {
                if (item.tutor_id === tutorID) {
                    tutor = item;
                    return false;
                }
            });
			
			//	Display the data
            instance.display(tutor);
			
			//	Change selected display
            $('#filter-aa_tutors .selected').removeClass('selected');
            $(this).addClass('selected');
			
			//	Enable check_available_time button
			$('#check-available-time-tutor').prop('disabled', false);
			$('#go-to-tutor-personal-page').prop('disabled', false);
			//	wrap an html element
			if ($('#go-to-tutor-personal-page').parent().is("a")) {
				$('#go-to-tutor-personal-page').unwrap();
			}
			$('#go-to-tutor-personal-page').wrap("<a target='_blank' href='" + $('#tutor_page').val() + "'></a>");
        });
		
        /**
         * Event: Check Available Time Button "Click"
         */
		$('.students-page #check-available-time-tutor').click(function() {
			//	Jump to 'calendar' tab
			instance.selected_tutor_id = $('#tutor-id').val();
			instance.selected_tutor = $('#tutor_name').val();
			$("a[data-toggle='tab'][href='#check-available-time-in-calendar']").tab('show');
		});
		
        /**
         * Event: Typing categoies
         */
		$('.students-page #available_appointments_service_category').on("keyup", function() {
			var val = $(this).val().toLowerCase();
			instance.filterList('.students-page #filter-service-category span li', val);
		});
		
        /**
         * Event: click the input bar, show filter details of service categories
         */
		$('.students-page #available_appointments_service_category').focus(function() {
			$('#filter-aa_tutors #aa_sc_display').slideDown(360);
			//	disable two buttons
			$('#filter-aa_tutors #search-filter').prop('disabled', true);
			$('#filter-aa_tutors #clear-filter').prop('disabled', true);
			//	Place footer one more time
			setTimeout(function() {
				Students.placeFooterToBottom();
			}, 500);
		});	
        /**
         * Event: click the input bar, show filter details of tutor name
         */
		$('.students-page #available_appointments_tutor').focus(function() {
			$('#filter-aa_tutors #aa_tn_display').slideDown(360);
			//	disable two buttons
			$('#filter-aa_tutors #search-filter').prop('disabled', true);
			$('#filter-aa_tutors #clear-filter').prop('disabled', true);
			//	Place footer one more time
			setTimeout(function() {
				Students.placeFooterToBottom();
			}, 500);
		});
		
        /**
         * Event: Typing tutor
         */
		$('.students-page #available_appointments_tutor').on("keyup", function() {
			var val = $(this).val().toLowerCase();
			instance.filterList('.students-page #filter-tutor-name span li', val);
		});
		
		/**
         * Event: Press list items for service categories
         */
		$(document).on('click', '.students-page #aa_sc_display .filter-item--close, .students-page #aa_sc_display .filter-item--find', function() {
			$('.students-page #available_appointments_service_category').val($(this).attr("title"));
			$('#filter-aa_tutors #aa_sc_display').slideUp(360);
			instance.filterList('.students-page #filter-service-category span li', $('.students-page #available_appointments_service_category').val().toLowerCase());
			//	enable two buttons
			$('#filter-aa_tutors #search-filter').prop('disabled', false);
			$('#filter-aa_tutors #clear-filter').prop('disabled', false);
			//	Place footer one more time
			setTimeout(function() {
				Students.placeFooterToBottom();
			}, 500);
		});
		/**
         * Event: Press list items for tutor name
         */
		$(document).on('click', '.students-page #aa_tn_display .filter-item--close, .students-page #aa_tn_display .filter-item--find', function() {
			$('.students-page #available_appointments_tutor').val($(this).attr("data-tut_name"));
//			alert($(this).attr("data-tut_name"));
			$('#filter-aa_tutors #aa_tn_display').slideUp(360);
			instance.filterList('.students-page #filter-tutor-name span li', $('.students-page #available_appointments_tutor').val().toLowerCase());
			//	enable two buttons
			$('#filter-aa_tutors #search-filter').prop('disabled', false);
			$('#filter-aa_tutors #clear-filter').prop('disabled', false);
			//	Place footer one more time
			setTimeout(function() {
				Students.placeFooterToBottom();
			}, 500);
		});
		
	};

    /**
     * Bring the tutor form back to its initial state.
     */
    StudentsAvailableAppointmentsTutorHelper.prototype.resetForm = function () {
		//	Clear all inputs
        $('.record-details').find('input, textarea').val('');

        //	Disable all operation buttons when the form is reset
		$('#go-to-tutor-personal-page, #check-available-time-tutor').prop('disabled', true);
		//	Show the button group
        $('#go-to-tutor-personal-page, #check-available-time-group-tutor').show();
		if ($('#go-to-tutor-personal-page').parent().is("a")) {
			$('#go-to-tutor-personal-page').unwrap();
		}
		
		$('#avatar').prop('src', GlobalVariables.avatarPrefix + 'default.png');
		
		//	Enable search input buttons
        $('#filter-aa_tutors button').prop('disabled', false);
		
		//	Erase all selected effects on search results part
        $('#filter-aa_tutors .selected').removeClass('selected');
		
		//	When editing, background color will be added to indicate that
		//	selections are disabled. Writing as below removes the color when
		//	resetting the form
        $('#filter-aa_tutors .results').css('color', '');
    };

    /**
     * Display a tutor record into the form.
     *
     * @param {Object} tutor Contains the tutor record data.
     */
    StudentsAvailableAppointmentsTutorHelper.prototype.display = function (tutor) {
        $('#tutor-id').val(tutor.tutor_id);
		
		//	Fix admin account bug
		var cas_sid = tutor.tutor_sid;
		var tutor_display;
		if (cas_sid === null) {
			tutor_display = tutor.tutor_name; 
		} else {
			tutor_display = /*cas_sid + " " + */tutor.tutor_name;
		}
		$('#tutor_name').val(tutor_display);
		$('#tutor_page').val(tutor.personal_page);
		$('#introduction').val(tutor.introduction);
		$('#earliest_start_datetime').val(GeneralFunctions.formatDate(Date.parse(tutor.earliest_start_datetime), GlobalVariables.dateFormat, true));
		
		$('#avatar').prop('src', GlobalVariables.avatarPrefix + tutor.avatar_url);
    };

    /**
     * Filter turtor records.
     *
     * @param {String} key This key string is used to filter the appointment records.
     * @param {Number} selectId Optional, if set then after the filter operation the record with the given
     * ID will be selected (but not displayed).
     * @param {Boolean} display Optional (false), if true then the selected record will be displayed on the form.
     */
    StudentsAvailableAppointmentsTutorHelper.prototype.filter = function (st, tn, selectId, display, first_load) {
        display = display || false;

        var postUrl = GlobalVariables.baseUrl + '/index.php/students_api/ajax_get_available_tutors';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			service_type: JSON.stringify((st === undefined || st === '' || st === '- ' + EALang.search_all_service_categories + ' -') ? 'ALL' : st),
			tutor_name: JSON.stringify((tn === undefined || tn === '' || tn === '- ' + EALang.search_all_tutors + ' -') ? 'ALL' : tn)
        };

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			//	Store results
            this.filterResults = response;
			
			//	If this is the first time, load tutors and service categories
			if (first_load !== undefined && first_load === 'true') {
				this.getAllTutors();
				this.getAllServiceCategories();
			}
			
			//	Clear former results
            $('#filter-aa_tutors .results').html('');
				
			//	Iterate through all appointments, generate htmls for them and
			//	add them to the results
            $.each(response, function (index, tutor) {
                var html = this.getFilterHtml(index, tutor);
                $('#filter-aa_tutors .results').append(html);
            }.bind(this));
			
			//	If there are no match, print a message in the result block
            if (response.length === 0) {
                $('#filter-aa_tutors .results').html('<em>' + EALang.no_records_found + '</em>');
            }
			
			//	If selectId is provided, show it
            if (selectId !== undefined) {
                this.select(selectId, display);
            }
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };

    /**
     * Get the filter results row HTML code.
     *
     * @param {Object} tutor Contains the tutor data.
     *
     * @return {String} Returns the record HTML code.
     */
    StudentsAvailableAppointmentsTutorHelper.prototype.getFilterHtml = function (index, tutor) {
		
		//	The tutor's name will be used in the second line
        var tutor_name = tutor.tutor_name;
		
		//	The earliest_start_datetime will be used in the second line
		var earliest_start_datetime = GeneralFunctions.formatDate(Date.parse(tutor.earliest_start_datetime), GlobalVariables.dateFormat, true);

		var line1 = "<strong>" + tutor_name + "</strong>";
		var line2 = EALang.earliest_service + ": " + earliest_start_datetime;
			
        var html =
            '<div class="entry" data-id="' + tutor.tutor_id + '">' +	//	Starting <div> block
            line1 + "<br />" +	//	line1
            line2 +	//	line2
            '</div>	<hr />';		//	Ending </div> and a horizontal line
		
        return html;
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
    StudentsAvailableAppointmentsTutorHelper.prototype.select = function (id, display) {
        display = display || false;
		
		//	Remove all selected classes in advance
        $('#filter-aa_tutors .selected').removeClass('selected');
		
		//	Find the given Id and add "selected" class to it
        $('#filter-aa_tutors .entry').each(function () {
            if ($(this).attr('data-id') === id) {
                $(this).addClass('selected');
                return false;
            }
        });
		
		//	If display === true, display the tutor
        if (display) {
            $.each(this.filterResults, function (index, tutor) {
                if (tutor.tutor_id === id) {
                    this.display(tutor);
                    return false;
                }
            }.bind(this));
        }
    };	
	
    /**
     * Get all tutors and wrap them in an html
     */
    StudentsAvailableAppointmentsTutorHelper.prototype.getAllTutors = function() {
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
			$('#filter-aa_tutors #filter-tutor-name span').html('');
			
			//	Iterate through all tutors, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, tutor) {
				//	Fix an admin account bug
				var cas_sid = tutor.cas_sid;
				var space_or_not = ' ';
				if (cas_sid === null) {
					cas_sid = '';
					space_or_not = '';
				} else {
					space_or_not = ' ';
				}
				var display_tutor = (tutor.name !== null && tutor.name.length >= 25) ? (/*cas_sid + space_or_not + */tutor.name.substring(0,20) + "...") : (/*cas_sid + space_or_not + */tutor.name);
				var html = "<li class='filter-item filter-item--find' data-tut_name='" + tutor.name + "' title='" + cas_sid + space_or_not + tutor.name + "'>" + display_tutor + "</li>";
				$('#filter-aa_tutors #filter-tutor-name span').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
    StudentsAvailableAppointmentsTutorHelper.prototype.getAllServiceCategories = function() {
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
			$('#filter-aa_tutors #filter-service-category span').html('');
			
			//	Iterate through all tutors, generate htmls for them and
			//	add them to the list
			$.each(response, function (index, service) {
				var display_service = (service.name.length >= 35) ? "Too Long" : service.name;
				var html = "<li class='filter-item filter-item--find' title='" + service.name + "'>" + display_service + "</li>";
				$('#filter-aa_tutors #filter-service-category span').append(html);
			}.bind(this));
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
    StudentsAvailableAppointmentsTutorHelper.prototype.filterList = function(filterItem, filterValue) {
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
	
    window.StudentsAvailableAppointmentsTutorHelper = StudentsAvailableAppointmentsTutorHelper;
})();
