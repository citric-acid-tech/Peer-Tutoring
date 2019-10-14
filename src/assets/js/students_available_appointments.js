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
	var selected_tutor_id = 'ALL';
	var selected_tutor = 'All Tutors';
	
	var cal_first = true;
	
    /**
     * This method initializes the Students My Appointment page.
     *
     * @param {Boolean} defaultEventHandlers Optional (false), whether to bind the default
     * event handlers or not.
     */
    exports.initialize = function (defaultEventHandlers) {
        defaultEventHandlers = defaultEventHandlers || false;
		
		if (!cal_first) {
			//	Select by Tutor by default
        	helper = studentsAvailableAppointmentsTutorHelper;
        	helper.resetForm();
        	helper.filter(undefined, undefined, undefined, undefined, 'true');
		} else {
			//	Select in Large Calendar by default
			//	This may not happens, cause it cannot be changed directly
			//	This may still happen if privileges are added
			helper = studentsAvailableAppointmentsCalendarHelper;
			//	Guess what, a large calendar!!!
			//	defaultView: 'dayGridMonth', 'dayGridWeek', 'timeGridDay', 'listWeek'
//			helper.pond = pond;
			helper.getAllServiceTypes();
			//	Guess what, a large calendar!!!
			var calendarEl = document.getElementById('student-full-calendar');
			calendar = StudentsAvailableAppointments.initCalendar(calendarEl);
			switch(GlobalVariables.curLanguage) {
				case "english": calendar.setOption('locale', Students.CALENDAR_LOCALES_ENGLISH); break;
				case "简体中文": calendar.setOption('locale', Students.CALENDAR_LOCALES_ZH_CN); break;
				default: calendar.setOption('locale', Students.CALENDAR_LOCALES_ENGLISH);
			}
			helper.calendar = calendar;
			calendar.render();
			var mql = window.matchMedia("screen and (max-width: 1100px)");
			if (mql.matches) {
				setTimeout(function() {
					calendar.changeView('listWeek');
				}, 50);
			}
			$('#calendar_tutor').hide();
		}
		
		//	File Input Settings
		var inputs = $('.inputfile');
		Array.prototype.forEach.call(inputs, function(input) {
			var label = input.nextElementSibling;
			var labelVal = label.innerHTML;
			input.addEventListener('change', function(e) {
				var fileName = e.target.value.split('\\').pop();
				if (fileName) {
					label.innerHTML = "<strong>" + fileName + "</strong>";
					$('.inputfile + label').css({
						"background-color": "snow",
						"color": "#296d97"
					});
				} else {
					label.innerHTML = labelVal;
					$('.inputfile + label').css({
						"background-color": "#296d97",
						"color": "snow"
					});
				}
			});
			//	Firefox Bug
			input.addEventListener('focus', function() {
				input.classList.add('has-focus');
			});
			input.addEventListener('blur', function() {
				input.classList.remove('has-focus');
			});
		});
		
		//	Prevent Calendar from being clicked in the main page
		$('.students-page .disabled').click(function(e) {
			//	Now the logic has changed, this one is no longer needed
			if (cal_first) {
				return true;
			}
			Students.displayNotification(EALang.stu_aa_changeTab_prior_warning, undefined, "failure");
			e.preventDefault();
			return false;
		});
		
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
				helper.selected_tutor = selected_tutor;
				helper.selected_tutor_id = selected_tutor_id;
				helper.resetForm();
				helper.filter(undefined, undefined, undefined, undefined, 'true');
			} else if ($(this).attr('href') === '#select-by-time-tab') {
				helper = studentsAvailableAppointmentsTimeHelper;
				helper.selected_tutor = selected_tutor;
				helper.selected_tutor_id = selected_tutor_id;
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
					maxDate: GlobalVariables.max_check_ahead_day + "d",
//					showWeek: true,
					onSelect: function() {
						helper.filter($('#date-title').val());
					}
				});
				helper.filter($('#date-title').val());
			} else if ($(this).attr('href') === '#check-available-time-in-calendar') {
				//	This may not happens, cause it cannot be changed directly
				//	This may still happen if privileges are added
				selected_tutor = helper.selected_tutor;
				selected_tutor_id = helper.selected_tutor_id;
				
				if (selected_tutor === 'All Tutors') {
					$('#calendar_tutor').hide();
				} else {
					$('#calendar_tutor').show();
				}
				
				helper = studentsAvailableAppointmentsCalendarHelper;
				//	Guess what, a large calendar!!!
				//	defaultView: 'dayGridMonth', 'dayGridWeek', 'timeGridDay', 'listWeek'
				calendar.refetchEvents();
			} else {
				alert(EALang.genius_unknown_op);
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
			//	no weekends plz
			weekends: false,
			//	views customizations
			views: {
				timeGridWeek: {
					// buttonText: "time"
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
					// buttonText: "list"
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
			slotDuration: '00:20',	//	Slot Time Duration: 2 hours. Impact the height of the events.
//			slotLabelInterval: "02:00",
			slotLabelFormat: {
				hour12: false,
				hour: 'numeric',
				minute: '2-digit',
				omitZeroMinute: false,	//	Do not omit zeros
				meridiem: 'short'
			},
			minTime: "09:00:00",
			maxTime: "17:00:00",
			dayRender: function() {
				Students.placeFooterToBottom();	//	Fix the footer gg problem
			},
			validRange: function(nowDate) {
				return {
					start:	nowDate,
					end:	moment(nowDate).add(parseInt(GlobalVariables.max_check_ahead_day), 'days').toDate()
				};
			},
			//	Locale
			firstDay: 1,
			//	Define the placement of the header
			header: {
				left: 'title',	// put title
//				center: 'timeGridWeek,timeGridDay dayGridWeek,dayGridDay listWeek,listDay',	// buttons for switching between views
				center: '',	// buttons for switching between views
				right: 'timeGridWeek,listWeek prev,today,next'	// buttons for locating a date
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
				var weekNumAndSem = GeneralFunctions.getSemAndWeeks(fetchInfo.start);
				var tutor_id = selected_tutor_id;
				var tutor = selected_tutor;
				if (weekNumAndSem === false) {successCallback([]);}
				else if (weekNumAndSem.weekNumber === '-1') {
					$("span#calendar_semester").html("Out of Semester");
					$('#calendar_week_number').css('display', 'none');
					$('#calendar_tutor').css('display', 'none');
					successCallback([]);
				} else {
					//	From "Out of Semester"
					if ($('#calendar_week_number').css('display') === 'none' && $('#calendar_tutor').css('display') === 'none') {
						$('#calendar_week_number').css('display', 'inline-block');
						$('#calendar_tutor').css('display', 'inline-block');
					}
					$("span#calendar_semester").html(weekNumAndSem.semester);
					var sem_info = GlobalVariables.semester_json;
					var year = weekNumAndSem.year;
					var season = weekNumAndSem.season;
					var national_holiday_week = parseInt(sem_info[year][season].national_holiday_week);
					if( national_holiday_week !== 0){
						if(weekNumAndSem.weekNumber < national_holiday_week){
							$('span#calendar_week_number').html("Week " + weekNumAndSem.weekNumber);
						} else if (weekNumAndSem.weekNumber === national_holiday_week){
							$('span#calendar_week_number').html("National Holiday Week");
						} else{
							$('span#calendar_week_number').html("Week " + (weekNumAndSem.weekNumber - 1));
						}
					} else{
						$('span#calendar_week_number').html("Week " + weekNumAndSem.weekNumber);
					}
					
					$('.students-page span#calendar_tutor').html(tutor);
					var postUrl = GlobalVariables.baseUrl + '/index.php/students_api/ajax_available_appointments';
        			var postData = {
        			    csrfToken: 	GlobalVariables.csrfToken,
						tutor_id:	JSON.stringify(tutor_id)
        			};
        			$.post(postUrl, postData, function (response) {
        			    if (!GeneralFunctions.handleAjaxExceptions(response)) {
        			        return;
        			    }
						
						var results = [];
						$.each(response, function(index, service) {
							var eve  = {
								id: service.service_id,
								title: service.tutor_name,
								start: service.start_datetime,
								end: service.end_datetime,
								extendedProps: {
									service_description: service.description,
									address: service.address,
									service_type_description: service.service_type_description,
									tutor: service.tutor_name,
									tutor_page: service.personal_page,
									capacity: service.capacity,
									appointed: service.appointments_number,
									is_booked: service.is_booked,
									service_type: service.service_type
								}
							};
							results.push(eve);
						});
						successCallback(results);
        			}.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
				}
			},
			eventRender: function(info) {
				var hover_message = info.event.extendedProps.service_type + " - " + info.event.extendedProps.tutor;
				var el = $(info.el);
				el.prop('title', hover_message);
				el.qtip({
					position: {
						my: 'bottom center',
						at: 'top center'
					},
					style: {
						classes: 'qtip-green qtip-shadow custom-qtip'
					}
				});
				//	CSS
				el.css({
					'cursor': 'pointer',
					'transition': 'all 0.2s'
				});
				if (info.event.extendedProps.capacity === info.event.extendedProps.appointed) {
					//	equal value, as strings and as numbers, change to red
//					console.log(info.event);
					el.css('background-color', 'red');
				}
				if (info.event.extendedProps.is_booked === '1') {
					//	Booked, change to green #35B66F
					el.css('background-color', '#35B66F');
				}
				el.hover(function() {
					el.toggleClass('service_hover');
				});
			},
			eventClick: function(info) {
				helper.resetAppointmentPopup();
				helper.loadAppointmentPopup(info.event);
				$('.students-page .popup .curtain').fadeIn();
				$('.students-page .popup #cal_appointment_popup').fadeIn();
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

})(window.StudentsAvailableAppointments);
