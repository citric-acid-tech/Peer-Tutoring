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
		helper.getAllServiceTypes();
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
		//	Guess what, a date picker!!
		$('#edit_service_date').datepicker({
			dateFormat: "yy-mm-dd",
			constrainInput: true,
			autoSize: true,
			navigationAsDateFormat: true,
			firstDay: 1,
			showOtherMonths: true,
			showAnim: "fold"
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
			//	Show week numbers: show on external position
//			weekNumbers: true,
//			weekNumberCalculation: function(date) {	//	Calculate the week number according to the semester
//				<?=  =>
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
//			dateClick: function(dateClickInfo) {
//				alert("Date Clicked but not necessarily Selected:\n" + dateClickInfo.date);
//			},
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
			events: function(fetchInfo, successCallback, failureCallback) {
				//	Get Week from start date
				var weekNumAndSem = GeneralFunctions.getSemAndWeeks(fetchInfo.start);
				if (weekNumAndSem.weekNumber === '-1') {
					$('#calendar_semeseter').html(weekNumAndSem.semester);
					$('#calendar_week_number').html('');
					successCallback([]);
				} else {
					$('#calendar_semeseter').html(weekNumAndSem.semester);
					$('#calendar_week_number').html("Week " + weekNumAndSem.weekNumber);
					var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_filter_services';
        			var postData = {
        			    csrfToken: GlobalVariables.csrfToken,
        			    tutor_name: JSON.stringify('ALL'),
						semester: JSON.stringify(weekNumAndSem.semester),
						week: JSON.stringify(weekNumAndSem.weekNumber)
        			};
        			$.post(postUrl, postData, function (response) {
        			    if (!GeneralFunctions.handleAjaxExceptions(response)) {
        			        return;
        			    }
						
						var results = [];
//						alert(JSON.stringify(response));
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
				el.hover(function() {
					el.toggleClass('service_hover');
				});
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
//			longPressDelay: 1000	// Defult is 1000
		});
		return calendar;
	};
	
})(window.AdminServiceConfig);
