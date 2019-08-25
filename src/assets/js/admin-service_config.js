window.AdminServiceConfig = window.AdminServiceConfig || {};

/**
 * Students My Appointment
 *
 * Students My Appointment javascript namespace. Contains the main functionality of the Students My Appointment
 * page.
 *
 * @module AdminServiceConfig
 */
(function (exports) {

    'use strict';

    /**
     * The page helper contains methods that implement each record type functionality
     * AdminServiceConfigTutorHelper
     *
     * @type {Object}
     */
    var helper = {};
	
	var adminServiceConfigServiceCalendarHelper = new AdminServiceConfigServiceCalendarHelper();
	var adminServiceConfigTutorHelper = new AdminServiceConfigTutorHelper();
	var adminServiceConfigServiceTypeHelper = new AdminServiceConfigServiceTypeHelper();

    /**
     * This method initializes the Students My Appointment page.
     *
     * @param {Boolean} defaultEventHandlers Optional (false), whether to bind the default
     * event handlers or not.
     */
    exports.initialize = function (defaultEventHandlers) {
        defaultEventHandlers = defaultEventHandlers || false;
		
		//	Select by Tutor by default
        helper = adminServiceConfigServiceCalendarHelper;
		//	Other default initializations
		//	Guess what, a large calendar!!!
		//	defaultView: 'dayGridMonth', 'dayGridWeek', 'timeGridDay', 'listWeek'
		//	height: 500
		//	contentHeight: 500
		//	aspectRatio: 2
		//	windowResizeDelay: 200	// to prevent overly frequent size adjustments
		var calendarEl = document.getElementById('admin-full-calendar');
		var calendar = new FullCalendar.Calendar(calendarEl, {
			plugins: [ 'dayGrid', 'timeGrid', 'list' ],
			defaultView: 'timeGridWeek',
			customButtons: {
				custBut: {
					text: 'A Custom Button',
					click: function() {
						alert("Hi, I'm a custom button by Peter S!");
					}
				}	
			},
			header: {
				left: 'timeGridWeek,timeGridDay,listWeek',	// buttons for switching between views
				center: 'title',	// put title in the center
				right: 'custBut prev,today,next'	// buttons for locating a date
			},
			windowResizeDelay: 200,
  			windowResize: function() {
				//	Fix the footer gg problem
				Admin.placeFooterToBottom();
  			}
		});
		calendar.render();
//		alert(calendar.getOption('header').right);
		
        if (defaultEventHandlers) {
            _bindEventHandlers();
        }
    };

    /**
     * Default event handlers declaration for Students My Appointment page.
     */
    function _bindEventHandlers() {
		
        /**
         * Event: Page Tab Button "Click"
		 *
		 * Changes the displayed tab
         */
		$("a[data-toggle='tab']").on('shown.bs.tab', function() {
			if ($(this).attr('href') === '#service-calendar') {
				helper = adminServiceConfigServiceCalendarHelper;
			} else if ($(this).attr('href') === '#tutor_config') {
				helper = adminServiceConfigTutorHelper;
				helper.getAllTutors();
				$('.admin-page #tutor-edit, .admin-page #tutor-new-tutor').prop('disabled', true);
			} else if ($(this).attr('href') === '#service_type_config') {
				helper = adminServiceConfigServiceTypeHelper;
				helper.getAllServiceTypes();
				$('.admin-page #service_type-edit, .admin-page #service_type-new-service_type').prop('disabled', true);
			} else {
				alert("What have you pressed, my friend??");
			}
			
			//	Place footer one more time
			Admin.placeFooterToBottom();
		});
		
        adminServiceConfigServiceCalendarHelper.bindEventHandlers();
        adminServiceConfigTutorHelper.bindEventHandlers();
        adminServiceConfigServiceTypeHelper.bindEventHandlers();
    }

})(window.AdminServiceConfig);
