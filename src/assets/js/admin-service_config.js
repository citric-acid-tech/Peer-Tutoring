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
		var calendarEl = document.getElementById('admin-full-calendar');
		var calendar = AdminServiceConfig.initCalendar(calendarEl);
		helper.calendar = calendar;
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

    /**
     * 	Guess what, a large calendar!!!
     */
	exports.initCalendar = function(calendarEl) {
		//	height: 500	// If 'auto', natural height and no scroll bar
		//	contentHeight: 500
		//	aspectRatio: 2
		//	allDaySlot: false
		var calendar = new FullCalendar.Calendar(calendarEl, {
			//	plugins to import
			plugins: [ 'dayGrid', 'timeGrid', 'list', 'interaction', 'rrule' ],
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
				},
				list: {
					//	These two do not seem to be mixable
					listDayAltFormat: true
//					listDayFormat: true
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
			//	Date Clicking & Selecting Options
			selectable: true,
			selectMirror: true,
//			unselectAuto: false,	//	By setting it as false, selected will not disappear when the user clicks outer positions
			unselectCancel: "#create_event",	//	Selected will not disappear if specified element is clicked
//			selectOverlap: function(event) {	//	Defines whether the user can select overlapped regions
//				
//			},
//			selectConstraint: {	// Limiting regions the user can select
//				start: "2019-08-27",
//				end: "2019-08-28"
//			},
//			selectAllow: function(selectInfo) {	//	This is an upgrade of `selectConstraint`, live-scan the block the user is attempting to click and check if it is valid
//				alert(selectInfo.start);
//				alert(selectInfo.end);
//				alert(typeof selectInfo.end);
//			},
			selectMinDistance: 1,	//	Non-zero value helps differentiate dragging and clicking
			dateClick: function(dateClickInfo) {
				alert("Date Clicked but not necessarily Selected:\n" + dateClickInfo.date);
			},
			select: function(selectionInfo) {
				helper.currentSelect = selectionInfo;
				alert("Date Region Selected:\n" + selectionInfo.start + "\n~\n" + selectionInfo.end);	
			},
//			unselect: function(jsEvent, view) {	//	callback when a region is unselected
//					
//			},
			//	Business Hours
			businessHours: [
				{
					daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday, Tuesday, Wednesday, Thursday, Friday
					startTime: '06:00', // 6am
					endTime: '24:00' // 12pm
				},
				{
					daysOfWeek: [ 0, 6 ], // Saturday, Sunday
					startTime: '07:00', // 7am
					endTime: '19:00' // 7pm
				}
			],
			//	nowIndicator
			nowIndicator: true,	//	Go to current time position
			//	Add some test events
			events: [
				{
					id: 'testEvent0',
					title: 'Test Event 0',
					start: '2019-09-01 10:00',
					end: '2019-09-01 12:00'
				},
				{
					id: 'testEvent1',
					title: 'Test Event 1',
					start: '2019-08-27 08:00',
					end: '2019-08-27 10:00'
				},
				{
					id: 'testEvent2',
					title: 'Test Event 2',
					//	Below is a way to use basics for recurring events
					daysOfWeek: [ 1, 3, 5 ],
					startTime: '07:00',
					endTime: '09:00',
					startRecur: '2019-08-25',
					//	Below is a way to use RRule plugin for recurring events, but it's not working...
				},
				{
					id: 'testEvent3',
					title: 'Test Event 3',
					start: '2019-08-29 13:00',
					end: '2019-08-29 14:30'
				},
				{
					id: 'testEvent4',
					title: 'Test Event 4',
					start: '2019-08-29 16:00',
					end: '2019-08-29 18:30'
				}
			],
			//	Advance: Draggables
			editable: true,
//			eventResizableFromStart: true,
			droppable: true,	// External event can be dropped on the calendar
			//	Advance: Touch Support
//			longPressDelay: 1000	// Defult is 1000
		});
		return calendar;
	};
	
})(window.AdminServiceConfig);
