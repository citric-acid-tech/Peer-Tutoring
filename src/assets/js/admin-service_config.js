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
		//	height: 500	// If 'auto', natural height and no scroll bar
		//	contentHeight: 500
		//	aspectRatio: 2
		//	allDaySlot: false
		var calendarEl = document.getElementById('admin-full-calendar');
		var calendar = new FullCalendar.Calendar(calendarEl, {
			//	plugins to import
			plugins: [ 'dayGrid', 'timeGrid', 'list' ],
			//	Default View
			defaultView: 'timeGridWeek',
			//	Some Customized Buttons
			customButtons: {
				custBut: {
					text: 'A Custom Button',
					click: function() {
						alert("Hi, I'm a custom button by Peter S!");
					}
				}	
			},
			//	views customizations
			views: {
				timeGridWeek: {
					buttonText: "week - time"
				},
				timeGridDay: {
					buttonText: "day - time"
				},
				dayGridWeek: {
					buttonText: "week - grid"
				},
				dayGridDay: {
					buttonText: "day - grid"
				},
				listWeek: {
					buttonText: "week - list"
				},
				listDay: {
					buttonText: "day - list"
				}
			},
			//	Date & Time Options
//			slotDuration: '01:00',	//	Slot Time Duration: 2 hours
//			slotLabelInterval: "02:00",
			slotLabelFormat: {
				hour: 'numeric',
				minute: '2-digit',
				omitZeroMinute: false,	//	Do not omit zeros
				meridiem: 'short'
			},
			minTime: "00:00:00",
			maxTime: "24:00:00",
			dayRender: function() {
				Admin.placeFooterToBottom();	//	Fix the footer gg problem
			},
			validRange: {	//	Please use function to compute the range later, referring to the docs
  			  start: '2019-08-24',
  			  end: '2020-01-01'
  			},
			//	Locale
			firstDay: 1,
			//	Define the placement of the header
			header: {
				left: 'timeGridWeek,timeGridDay dayGridWeek,dayGridDay listWeek,listDay',	// buttons for switching between views
				center: 'title',	// put title in the center
				right: 'custBut prev,today,next'	// buttons for locating a date
			},
			//	View Rendering Callbacks
			viewSkeletonRender: function() {
				Admin.placeFooterToBottom();	//	Fix the footer gg problem
			},
			datesRender: function() {
				Admin.placeFooterToBottom();	//	Fix the footer gg problem
			},
			//	Size options
			height: 'auto',
			windowResizeDelay: 200,
  			windowResize: function() {
				Admin.placeFooterToBottom();	//	Fix the footer gg problem
  			},
			//	Show week numbers
			weekNumbers: true,
//			weekNumberCalculation: function(date) {	//	Calculate the week number according to the semester
//				
//			},
//			weekLabel: "周",	//	Specify this in language pack later, or maybe use the locale
			//	Super Cool Nav-Links options
			navLinks: true,
			navLinkDayClick: function(date, jsEvent) {
				switch(calendar.view.type) {	// If in week, go to corresponding day; If in day, go to timeGrid
					case "timeGridWeek": calendar.changeView("timeGridDay", date); break;
					case "dayGridWeek": calendar.changeView("dayGridDay", date); break;
					case "listWeek": calendar.changeView("listDay", date); break;
					case "timeGridDay": calendar.changeView("timeGridDay", date); break;
					case "dayGridDay": calendar.changeView("timeGridDay", date); break;
					case "listDay": calendar.changeView("timeGridDay", date); break;
					default: alert("navLinkDayClick: sth wrong with the implementation");
				}
  			},
			navLinkWeekClick: function(weekStart, jsEvent) {
				switch(calendar.view.type) {	// If in day, go to corresponding week; If in week, go to timeGrid
					case "timeGridDay": calendar.changeView("timeGridWeek", weekStart); break;
					case "dayGridDay": calendar.changeView("dayGridWeek", weekStart); break;
					case "listDay": calendar.changeView("listWeek", weekStart); break;
					case "timeGridWeek": calendar.changeView("timeGridWeek", weekStart); break;
					case "dayGridWeek": calendar.changeView("timeGridWeek", weekStart); break;
					case "listWeek": calendar.changeView("timeGridWeek", weekStart); break;
					default: alert("navLinkWeekClick: sth wrong with the implementation");
				}
  			},
			//	TimeGrid-only options
			nowIndicator: true,	//	Go to current time position
			//	List-only options
			listDayFormat: true,
			listDayAltFormat: true
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
