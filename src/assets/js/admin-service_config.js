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
		
//		alert(JSON.stringify(GlobalVariables.semester_list));
		
		//	Select by Tutor by default
        helper = adminServiceConfigServiceCalendarHelper;
		//	Other default initializations
		helper.getAllServiceTypes();
		helper.getAllTutors();
		helper.getAllSemesters();
		//	Guess what, a large calendar!!!
		var calendarEl = document.getElementById('admin-full-calendar');
		var calendar = AdminServiceConfig.initCalendar(calendarEl);
		switch(GlobalVariables.curLanguage) {
			case "english": calendar.setOption('locale', Admin.CALENDAR_LOCALES_ENGLISH); break;
			case "简体中文": calendar.setOption('locale', Admin.CALENDAR_LOCALES_ZH_CN); break;
			default: calendar.setOption('locale', Admin.CALENDAR_LOCALES_ENGLISH);
		}
		helper.calendar = calendar;
		calendar.render();
		//	remedy week number
		var weekNumAndSem = GeneralFunctions.getSemAndWeeks(moment().toDate());		
		if (weekNumAndSem.weekNumber === '-1') {
			$("select#calendar_semester option[value='Out of Semester']").prop('selected', true);
			$('#calendar_week_number').html('');
		} else {
			var sem_info = GlobalVariables.semester_json;
			var year = weekNumAndSem.year;
			var season = weekNumAndSem.season;
			var last_weeks = parseInt(sem_info[year][season].last_weeks);
			$('#calendar_week_number').html('');
			for (var i = 1; i <= last_weeks; ++i) {
				var html = "<option value='" + i + "'>Week " + i + "</option>";
				$('#calendar_week_number').append(html);
			}
			$("select#calendar_semester option[value='" + weekNumAndSem.semester + "']").prop('selected', true);
			$("select#calendar_week_number option[value='" + weekNumAndSem.weekNumber + "']").prop('selected', true);
		}
		//	Guess what, a date picker!!
		$('#edit_service_date, #add_service_date').datepicker({
			dateFormat: "yy-mm-dd",
			constrainInput: true,
			autoSize: true,
			navigationAsDateFormat: true,
			firstDay: 1,
			showOtherMonths: true,
			showAnim: "fold"
		});
		$('#calendar_gotodate').datepicker({
			dateFormat: "yy-mm-dd",
			constrainInput: true,
			autoSize: true,
			navigationAsDateFormat: true,
			firstDay: 1,
			showOtherMonths: true,
			showAnim: "fold",
			onSelect: function() {
				var val = $(this).val();
				calendar.gotoDate(new Date(val));
				$(this).attr('value', 'Go to Date');
			}
		});
		
		//	Demo of Fuse.js
//		var items = [
//  {
//      title: "Old Man's War",
//      author: {
//        firstName: "John",
//        lastName: "Scalzi"
//      }
//  },
//  {
//      title: "The Lock Artist",
//      author: {
//        firstName: "Steve",
//        lastName: "Hamilton"
//      }
//  },
//  {
//      title: "HTML5",
//      author: {
//        firstName: "Remy",
//        lastName: "Sharp"
//      }
//  },
//  {
//      title: "Right Ho Jeeves",
//      author: {
//        firstName: "P.D",
//        lastName: "Woodhouse"
//      }
//  },
//  {
//      title: "The Code of the Wooster",
//      author: {
//        firstName: "P.D",
//        lastName: "Woodhouse"
//      }
//  },
//  {
//      title: "Thank You Jeeves",
//      author: {
//        firstName: "P.D",
//        lastName: "Woodhouse"
//      }
//  },
//  {
//      title: "The DaVinci Code",
//      author: {
//        firstName: "Dan",
//        lastName: "Brown"
//      }
//  },
//  {
//      title: "Angels & Demons",
//      author: {
//        firstName: "Dan",
//        lastName: "Brown"
//      }
//  },
//  {
//      title: "The Silmarillion",
//      author: {
//        firstName: "J.R.R",
//        lastName: "Tolkien"
//      }
//  },
//  {
//      title: "Syrup",
//      author: {
//        firstName: "Max",
//        lastName: "Barry"
//      }
//  },
//  {
//      title: "The Lost Symbol",
//      author: {
//        firstName: "Dan",
//        lastName: "Brown"
//      }
//  },
//  {
//      title: "The Book of Lies",
//      author: {
//        firstName: "Brad",
//        lastName: "Meltzer"
//      }
//  },
//  {
//      title: "Lamb",
//      author: {
//        firstName: "Christopher",
//        lastName: "Moore"
//      }
//  },
//  {
//      title: "Fool",
//      author: {
//        firstName: "Christopher",
//        lastName: "Moore"
//      }
//  },
//  {
//      title: "Incompetence",
//      author: {
//        firstName: "Rob",
//        lastName: "Grant"
//      }
//  },
//  {
//      title: "Fat",
//      author: {
//        firstName: "Rob",
//        lastName: "Grant"
//      }
//  },
//  {
//      title: "Colony",
//      author: {
//        firstName: "Rob",
//        lastName: "Grant"
//      }
//  },
//  {
//      title: "Backwards, Red Dwarf",
//      author: {
//        firstName: "Rob",
//        lastName: "Grant"
//      }
//  },
//  {
//      title: "The Grand Design",
//      author: {
//        firstName: "Stephen",
//        lastName: "Hawking"
//      }
//  },
//  {
//      title: "The Book of Samson",
//      author: {
//        firstName: "David",
//        lastName: "Maine"
//      }
//  },
//  {
//      title: "The Preservationist",
//      author: {
//        firstName: "David",
//        lastName: "Maine"
//      }
//  },
//  {
//      title: "Fallen",
//      author: {
//        firstName: "David",
//        lastName: "Maine"
//      }
//  },
//  {
//      title: "Monster 1959",
//      author: {
//        firstName: "David",
//        lastName: "Maine"
//      }
//  }
//];
//		var options = {
//			shouldSort: true,
//			threshold: 0.6,
//			location: 0,
//			distance: 100,
//			maxPatternLength: 32,
//			minMatchCharLength:  1,
//			keys: [
//				'title',
//				'author.firstName'
//			]
//		};
//		var fuse = new Fuse(items, options);
//		var result = fuse.search('');
//		alert(JSON.stringify(result));
                            
		
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
			//	Locales
			locale: 'zh-cn',	//	Default 简体中文
			//	Some Customized Buttons
			customButtons: {
				addService: {
					text: 'Add a Service',
					click: function() {
						//	Before showing, grab the date and time for loading
						//	Load Tutor
						var tutor_id = $("select#calendar_tutor option:selected").val();
						if (tutor_id !== '-1') {
							$("select#add_service_tutor option[value='" + tutor_id + "']").prop('selected', true);
						}
						//	Show
						$('.admin-page .popup .curtain').fadeIn();
						$('.admin-page .popup #cal_add_popup').fadeIn();
					}
				},
				scheduleToAllWeeks: {
					text: 'Schedule to All Weeks',
					click: function() {
						//	Prompt: you really want to do this???
            			var buttons = [
            			    {
            			        text: EALang.confirm,
            			        click: function () {
									var services = calendar.getEvents();
									var services_id = [];
									$.each(services, function(index, service) {
										services_id.push(service.id);
									});
									var tutor_id = $('select#calendar_tutor option:selected').val();
									var week = $('select#calendar_week_number option:selected').val();
									var semester = $('select#calendar_semester option:selected').val();
            			            helper.scheduleToAllWeeks(services_id, tutor_id, week, semester);
            			            $('#message_box').dialog('close');
            			        }
            			    },
            			    {
            			        text: EALang.cancel,
            			        click: function () {
            			            $('#message_box').dialog('close');
            			        }
            			    }
            			];
            			GeneralFunctions.displayMessageBox("Schedule Current Schema to All Weeks",
														   "Are you sure you want to do this?", buttons);
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
				Admin.placeFooterToBottom();	//	Fix the footer gg problem
			},
//			validRange: {	//	Please use function to compute the range later, referring to the docs
//  			  start: '2019-08-24',
//  			  end: '2020-01-01'
//  			},
			//	Locale
			firstDay: 1,
			//	Define the placement of the header
			header: {
				left: 'timeGridWeek,timeGridDay dayGridWeek,dayGridDay listWeek,listDay',	// buttons for switching between views
				center: 'title',	// put title in the center
				right: 'scheduleToAllWeeks addService prev,today,next'	// buttons for locating a date
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
			selectable: true,
			selectMirror: true,
//			unselectAuto: false,	//	By setting it as false, selected will not disappear when the user clicks outer positions
//			unselectCancel: "#create_event",	//	Selected will not disappear if specified element is clicked
//			selectOverlap: function(event) {	//	Defines whether the user can select overlapped regions
//				
//			},
//			selectConstraint: {	// Limiting regions the user can select
//				start: "2019-08-27",
//				end: "2019-08-28"
//			},
			selectAllow: function(selectInfo) {
				//	This is an upgrade of `selectConstraint`, live-scan the block the user is attempting to click and check if it is valid
				var start = moment(selectInfo.start);
				var end = moment(selectInfo.end);
				// End date is exclusive, which could be the earliest of tomorrow
				var threshold = moment(start.format('YYYY-MM-DD')).add(1, 'days');
				
				if (start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) {	//	Same day
					return true;
				} 
				else if (threshold.isSame(end)) {	// different days, but the end is the earliest of the start time's next day
					return true;
				}
				else {
					return false;
				}
			},
			selectMinDistance: 1,	//	Non-zero value helps differentiate dragging and clicking
//			dateClick: function(dateClickInfo) {
//				alert("Date Clicked but not necessarily Selected:\n" + dateClickInfo.date);
//			},
			select: function(selectionInfo) {
				//	Before showing, grab the date and time for loading
				//	Load selected date
				var start = moment(selectionInfo.start);
				var end = moment(selectionInfo.end);
				$('#add_service_date').val(start.format('YYYY-MM-DD'));
				$('#add_service_st').val(start.format('HH:mm'));
				if (start.format('YYYY-MM-DD') !== end.format('YYYY-MM-DD')) {
					//	If end is the earliest of the next day, round it to the latest of the current day
					$('#add_service_et').val('23:59');
				} else {
					$('#add_service_et').val(end.format('HH:mm'));
				}
				//	Load Tutor
				var tutor_id = $("select#calendar_tutor option:selected").val();
				if (tutor_id !== '-1') {
					$("select#add_service_tutor option[value='" + tutor_id + "']").prop('selected', true);
				}
				//	Show
				$('.admin-page .popup .curtain').fadeIn();
				$('.admin-page .popup #cal_add_popup').fadeIn();
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
			events: function(fetchInfo, successCallback, failureCallback) {
				var weekNumAndSem = GeneralFunctions.getSemAndWeeks(fetchInfo.start);
				var tutor_id = $('.admin-page select#calendar_tutor option:selected').val();
				if (weekNumAndSem === false) {successCallback([]);}
				else if (weekNumAndSem.weekNumber === '-1') {
					$("select#calendar_semester option[value='Out of Semester']").prop('selected', true);
					$('#calendar_week_number').css('display', 'none');
					$('#calendar_tutor').css('display', 'none');
					successCallback([]);
				} else {
					//	From "Out of Semester"
					if ($('#calendar_week_number').css('display') === 'none' && $('#calendar_tutor').css('display') === 'none') {
						//	Re-calculate
						var sem_info = GlobalVariables.semester_json;
						var year = weekNumAndSem.year;
						var season = weekNumAndSem.season;
						var last_weeks = parseInt(sem_info[year][season].last_weeks);
						$('#calendar_week_number').html('');
						for (var i = 1; i <= last_weeks; ++i) {
							var html = "<option value='" + i + "'>Week " + i + "</option>";
							$('#calendar_week_number').append(html);
						}
						$('#calendar_week_number').css('display', 'inline-block');
						$('#calendar_tutor').css('display', 'inline-block');
					}
					$("select#calendar_semester option[value='" + weekNumAndSem.semester + "']").prop('selected', true);
					$("select#calendar_week_number option[value='" + weekNumAndSem.weekNumber + "']").prop('selected', true);
					var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_filter_services';
        			var postData = {
        			    csrfToken: 	GlobalVariables.csrfToken,
						tutor_id:	JSON.stringify((tutor_id === undefined || tutor_id === '-1') ? 'ALL' : tutor_id),
						semester: 	JSON.stringify(weekNumAndSem.semester),
						week: 		JSON.stringify(weekNumAndSem.weekNumber)
        			};
        			$.post(postUrl, postData, function (response) {
        			    if (!GeneralFunctions.handleAjaxExceptions(response)) {
        			        return;
        			    }
						
						var results = [];
						$.each(response, function(index, service) {
							var eve  = {
								id: service.id,
								title: service.service_type,
								start: service.start_datetime,
								end: service.end_datetime,
								extendedProps: {
									tutor_id: service.tutor_id,
									tutor: service.tutor_name,
									capacity: service.capacity,
									address: service.address,
									description: service.service_description,
									service_type_id: service.service_type_id
								}
							};
							results.push(eve);
						});
						successCallback(results);
        			}.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
				}
			},
			eventRender: function(info) {
				var hover_message = info.event.title + " - " + info.event.extendedProps.tutor;
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
				if (!info.isMirror) {
					el.hover(function() {
						el.toggleClass('service_hover');
					});
				} else {
					el.css('background-color', '#35b66f');
				}
			},
			eventClick: function(info) {
				helper.loadEditPopup(info.event);
				$('.admin-page .popup .curtain').fadeIn();
				$('.admin-page .popup #cal_edit_popup').fadeIn();
			},
			//	Advance: Draggables
//			editable: true,
//			eventResizableFromStart: true,
//			droppable: true,	// External event can be dropped on the calendar			
			//	Advance: Touch Support
			longPressDelay: 1000	// Defult is 1000
		});
		return calendar;
	};
	
})(window.AdminServiceConfig);
