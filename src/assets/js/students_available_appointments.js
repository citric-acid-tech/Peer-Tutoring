window.StudentsAvailableAppointments = window.StudentsAvailableAppointments || {};

/**
 * Students My Appointment
 *
 * Students My Appointment javascript namespace. Contains the main functionality of the Students My Appointment
 * page.
 *
 * @module StudentsAvailableAppointments
 */
(function (exports) {

    'use strict';

    /**
     * The page helper contains methods that implement each record type functionality
     * StudentsAvailableAppointmentsTutorHelper
     *
     * @type {Object}
     */
    var helper = {};
	
	var studentsAvailableAppointmentsTutorHelper = new StudentsAvailableAppointmentsTutorHelper();
	var studentsAvailableAppointmentsTimeHelper = new StudentsAvailableAppointmentsTimeHelper();
	var studentsAvailableAppointmentsCalendarHelper = new StudentsAvailableAppointmentsCalendarHelper();
	
	var calendar;
	//	Rendered First?
	var calendarIsRendered = false;

    /**
     * This method initializes the Students My Appointment page.
     *
     * @param {Boolean} defaultEventHandlers Optional (false), whether to bind the default
     * event handlers or not.
     */
    exports.initialize = function (defaultEventHandlers) {
        defaultEventHandlers = defaultEventHandlers || false;
		
		//	Select by Tutor by default
        helper = studentsAvailableAppointmentsTutorHelper;
        helper.resetForm();
        helper.filter(undefined, undefined, undefined, undefined, 'true');

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
			if ($(this).attr('href') === '#select-by-tutor-tab') {
				helper = studentsAvailableAppointmentsTutorHelper;
				helper.resetForm();
				helper.filter(undefined, undefined, undefined, undefined, 'true');
			} else if ($(this).attr('href') === '#select-by-time-tab') {
				helper = studentsAvailableAppointmentsTimeHelper;
				//	Guess what, a date picker!
				//	beforeShowDay: $.datepicker.noWeekends
				$('#sel_calendar').datepicker({
					dateFormat: "yy-mm-dd",
					altField: "#show_calendar_date, #date-title",
					autoSize: true,
					firstDay: 1,
					showOtherMonths: true,
					hideIfNoPrevNext: true,
					minDate: "0",
					maxDate: "1w",
//					showWeek: true,
					onSelect: function() {
						helper.filter($('#date-title').val());
					}
				});
				helper.filter($('#date-title').val());
			} else if ($(this).attr('href') === '#check-available-time-in-calendar') {
				//	This may not happens, cause it cannot be changed directly
				//	This may still happen if privileges are added
				helper = studentsAvailableAppointmentsCalendarHelper;
				//	Guess what, a large calendar!!!
				//	defaultView: 'dayGridMonth', 'dayGridWeek', 'timeGridDay', 'listWeek'
				if (!calendarIsRendered) {
					//	Guess what, a large calendar!!!
					var calendarEl = document.getElementById('student-full-calendar');
					calendar = StudentsAvailableAppointments.initCalendar(calendarEl);
					switch(GlobalVariables.curLanguage) {
						case "english": calendar.setOption('locale', Students.CALENDAR_LOCALES_ENGLISH); break;
						case "简体中文": calendar.setOption('locale', Students.CALENDAR_LOCALES_ZH_CN); break;
						default: calendar.setOption('locale', Students.CALENDAR_LOCALES_ENGLISH);
					}
					//	Media Queries
					var mql = window.matchMedia("screen and (max-width: 1100px)");
					mediaQueryResponse(mql);
					mql.addListener(mediaQueryResponse);
					helper.calendar = calendar;
					calendar.render();
					calendarIsRendered = true;
				}
			} else {
				alert("What have you pressed, my friend??");
			}
			
			//	Place footer one more time
			Students.placeFooterToBottom();
		});
		
        studentsAvailableAppointmentsTutorHelper.bindEventHandlers();
        studentsAvailableAppointmentsTimeHelper.bindEventHandlers();
        studentsAvailableAppointmentsCalendarHelper.bindEventHandlers();
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
			//	Locales
			locale: 'zh-cn',	//	Default 简体中文
			//	Some Customized Buttons
//			customButtons: {
//			},
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
				},
				dayGrid: {
					//	Advanced: Event Popup
					eventLimit: 20	//	A lot of places to show
				},
				timeGrid: {
					eventLimit: 2	// only for all-day slots
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
			minTime: "07:00:00",
			maxTime: "23:00:00",
			dayRender: function() {
				Students.placeFooterToBottom();	//	Fix the footer gg problem
			},
			validRange: function(nowDate) {
				return {
					start:	nowDate,
					end:	moment(nowDate).add(7, 'days').toDate()
				};
			},
			//	Locale
			firstDay: 1,
			//	Define the placement of the header
			header: {
				left: 'timeGridWeek,timeGridDay dayGridWeek,dayGridDay listWeek,listDay',	// buttons for switching between views
				center: 'title',	// put title in the center
				right: 'prev,today,next'	// buttons for locating a date
			},
			//	View Rendering Callbacks
			viewSkeletonRender: function() {
				Students.placeFooterToBottom();	//	Fix the footer gg problem
			},
			datesRender: function() {
				Students.placeFooterToBottom();	//	Fix the footer gg problem
			},
			//	Size options
			height: 'auto',
			windowResizeDelay: 200,
  			windowResize: function() {
				Students.placeFooterToBottom();	//	Fix the footer gg problem
  			},
			//	Show week numbers: show on external position
//			weekNumbers: true,
//			weekNumberCalculation: function(date) {	//	Calculate the week number according to the semester
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
//			selectable: true,
//			selectMirror: true,
//			unselectAuto: false,	//	By setting it as false, selected will not disappear when the user clicks outer positions
//			unselectCancel: "#create_event",	//	Selected will not disappear if specified element is clicked
//			selectOverlap: function(event) {	//	Defines whether the user can select overlapped regions
//				
//			},
//			selectConstraint: {	// Limiting regions the user can select
//				start: "2019-08-27",
//				end: "2019-08-28"
//			},
//			selectAllow: function(selectInfo) {
//			},
//			selectMinDistance: 1,	//	Non-zero value helps differentiate dragging and clicking
//			dateClick: function(dateClickInfo) {
//				alert("Date Clicked but not necessarily Selected:\n" + dateClickInfo.date);
//			},
//			select: function(selectionInfo) {
//			},
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
			events: function(fetchInfo, successCallback, failureCallback) {
//				var weekNumAndSem = GeneralFunctions.getSemAndWeeks(fetchInfo.start);
//				var tutor_id = $('.admin-page select#calendar_tutor option:selected').val();
//				if (weekNumAndSem === false) {successCallback([]);}
//				else if (weekNumAndSem.weekNumber === '-1') {
//					$("select#calendar_semester option[value='Out of Semester']").prop('selected', true);
//					$('#calendar_week_number').css('display', 'none');
//					$('#calendar_tutor').css('display', 'none');
//					successCallback([]);
//				} else {
//					//	From "Out of Semester"
//					if ($('#calendar_week_number').css('display') === 'none' && $('#calendar_tutor').css('display') === 'none') {
//						//	Re-calculate
//						var sem_info = GlobalVariables.semester_json;
//						var year = weekNumAndSem.year;
//						var season = weekNumAndSem.season;
//						var last_weeks = parseInt(sem_info[year][season].last_weeks);
//						$('#calendar_week_number').html('');
//						for (var i = 1; i <= last_weeks; ++i) {
//							var html = "<option value='" + i + "'>Week " + i + "</option>";
//							$('#calendar_week_number').append(html);
//						}
//						$('#calendar_week_number').css('display', 'inline-block');
//						$('#calendar_tutor').css('display', 'inline-block');
//					}
//					$("select#calendar_semester option[value='" + weekNumAndSem.semester + "']").prop('selected', true);
//					$("select#calendar_week_number option[value='" + weekNumAndSem.weekNumber + "']").prop('selected', true);
//					var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_filter_services';
//        			var postData = {
//        			    csrfToken: 	GlobalVariables.csrfToken,
//						tutor_id:	JSON.stringify((tutor_id === undefined || tutor_id === '-1') ? 'ALL' : tutor_id),
//						semester: 	JSON.stringify(weekNumAndSem.semester),
//						week: 		JSON.stringify(weekNumAndSem.weekNumber)
//        			};
//        			$.post(postUrl, postData, function (response) {
//        			    if (!GeneralFunctions.handleAjaxExceptions(response)) {
//        			        return;
//        			    }
//						
//						var results = [];
//						$.each(response, function(index, service) {
//							var eve  = {
//								id: service.id,
//								title: service.service_type,
//								start: service.start_datetime,
//								end: service.end_datetime,
//								extendedProps: {
//									tutor_id: service.tutor_id,
//									tutor: service.tutor_name,
//									capacity: service.capacity,
//									address: service.address,
//									description: service.service_description,
//									service_type_id: service.service_type_id
//								}
//							};
//							results.push(eve);
//						});
//						successCallback(results);
//        			}.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
//				}
			},
			eventRender: function(info) {
//				var hover_message = info.event.title + " - " + info.event.extendedProps.tutor;
//				var el = $(info.el);
//				el.prop('title', hover_message);
//				el.qtip({
//					position: {
//						my: 'bottom center',
//						at: 'top center'
//					},
//					style: {
//						classes: 'qtip-green qtip-shadow custom-qtip'
//					}
//				});
//				//	CSS
//				el.css({
//
//					'cursor': 'pointer',
//					'transition': 'all 0.2s'
//				});
//				if (!info.isMirror) {
//					el.hover(function() {
//						el.toggleClass('service_hover');
//					});
//				} else {
//					el.css('background-color', '#35b66f');
//				}
			},
			eventClick: function(info) {
//				helper.loadEditPopup(info.event);
//				$('.admin-page .popup .curtain').fadeIn();
//				$('.admin-page .popup #cal_edit_popup').fadeIn();
			},
			//	Advance: Draggables
//			editable: true,
//			eventResizableFromStart: true,
//			droppable: true,	// External event can be dropped on the calendar			
			//	Advance: Touch Support
//			longPressDelay: 1000	// Defult is 1000
		});
		return calendar;
	};
	
    /**
     * Media Queries
     */
	function mediaQueryResponse(mql) {
		if (mql.matches) {
			calendar.setOption('header', {
				left: 'title',	// put title in the first line
				center: 'timeGridWeek,timeGridDay dayGridWeek,dayGridDay listWeek,listDay',	// buttons for switching between views
				right: 'scheduleToAllWeeks addService prev,today,next'	// buttons for locating a date
			});
			return true;
		} else {
			calendar.setOption('header', {
				left: 'timeGridWeek,timeGridDay dayGridWeek,dayGridDay listWeek,listDay',	// buttons for switching between views
				center: 'title',	// put title in the center
				right: 'scheduleToAllWeeks addService prev,today,next'	// buttons for locating a date
			});
			return false;
		}
	}

})(window.StudentsAvailableAppointments);
