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

	var calendar;
	//	Re-init seems more than refetching...
	var calendar_needs_retrieval = false;
	
	var cropper;
	
	var cbfpre = "<div class='col-xs-12 col-md-3'>";
	var cbfpost = "</div>";
	
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
		helper.getAllTutors();
		helper.getAllSemesters();
		//	Guess what, a large calendar!!!
		var calendarEl = document.getElementById('admin-full-calendar');
		calendar = AdminServiceConfig.initCalendar(calendarEl);
		switch(GlobalVariables.curLanguage) {
			case "english": calendar.setOption('locale', Admin.CALENDAR_LOCALES_ENGLISH); break;
			case "简体中文": calendar.setOption('locale', Admin.CALENDAR_LOCALES_ZH_CN); break;
			default: calendar.setOption('locale', Admin.CALENDAR_LOCALES_ENGLISH);
		}
		//	Media Queries
		var mql = window.matchMedia("screen and (max-width: 1100px)");
		mediaQueryResponse(mql);
		mql.addListener(mediaQueryResponse);
		helper.calendar = calendar;
		calendar.render();
		if (mql.matches) {
			setTimeout(function() {
				calendar.changeView('listWeek');
			}, 50);
		}
		$(".fc-scheduleToAllWeeks-button").prop('disabled', true);	//	Default: All tutors, so no this button
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
			var national_holiday_week = parseInt(sem_info[year][season].national_holiday_week);
			$('#calendar_week_number').html('');
			for (var i = 1, j = 1; i <= last_weeks; ++i) {
				var html;
				if(i === national_holiday_week){
					html = "<option value='" + i + "'>" + "National Holiday Week" + "</option>";
				}else{
					html = "<option value='" + i + "'>Week " + (j++) + "</option>";
				}
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
				$(this).attr('value', EALang.go_to_date);
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
				//	Retrieve boolean value
				calendar_needs_retrieval = helper.calendar_needs_retrieval;
				//	Reset boolean value of previous one
				helper.calendar_needs_retrieval = false;
//				//	For test
//				console.log(calendar_needs_retrieval);
				helper = adminServiceConfigServiceCalendarHelper;
				//	Need to refresh the calendar if a tutor is created/dismissed, or if a service_type is created.
				if (calendar_needs_retrieval) {
					//	Re-init everything...
					helper.getAllServiceTypes();
					helper.getAllTutors();
					helper.getAllSemesters();
					//	except that the calendar need not be re-created
					calendar.refetchEvents();
					//	Reset the boolean
					calendar_needs_retrieval = false;
				}
			} else if ($(this).attr('href') === '#tutor_config') {
				$('#avatar_file_input').prop('disabled', true);
				$('#avatar_setting .avatar_label').css({
					'cursor': 'not-allowed',
					'opacity': '1'
				});
				helper = adminServiceConfigTutorHelper;
				helper.resetForm();				
				helper.getAllTutors();				
				$('.admin-page #tutor-edit').prop('disabled', true);
			} else if ($(this).attr('href') === '#service_type_config') {
				helper = adminServiceConfigServiceTypeHelper;
				helper.resetForm();
				helper.getAllServiceTypes();
				$('.admin-page #service_type-edit').prop('disabled', true);
			} else {
				alert(EALang.genius_unknown_op);
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
					text: EALang.add_service,
					click: function() {
						//	Before showing, grab the date and time for loading
						//	Load Tutor
						var tutor_id = $("select#calendar_tutor option:selected").val();
						if (tutor_id !== '-1') {
							$("select#add_service_tutor option[value='" + tutor_id + "']").prop('selected', true);
						}
						//	Show
						$('.admin-page #service-calendar .popup .curtain').fadeIn();
						$('.admin-page .popup #cal_add_popup').fadeIn();
					}
				},
				scheduleToAllWeeks: {
					text: EALang.schedule_to_selected_weeks,
					click: function() {
						//	Update the modal box
						var cb_field = $('#stsw_cb_field');
						cb_field.html('');	// Clear
						var sem_opt = $('select#calendar_semester option:selected');
						var html, id, title, parity;
						var sem_info = GlobalVariables.semester_json;
						var year = sem_opt.attr('data-year');
						var season = sem_opt.attr('data-season');
						var last_weeks = parseInt(sem_info[year][season].last_weeks);
						var national_holiday_week = parseInt(sem_info[year][season].national_holiday_week);
						for (var wn = 1; wn <= last_weeks; ++wn) {	// Load
							id = "stsw_" + wn;
							if (national_holiday_week === 0) {
								//	There is no national holiday week
								title = "Week " + wn;
								parity = (wn % 2 === 0) ? 'even' : 'odd';
							} else {
								//	There is a national holiday week
								if (wn < national_holiday_week) {
									//	Just same as supposed
									title = "Week " + wn;
									parity = (wn % 2 === 0) ? 'even' : 'odd';
								} else if (wn === national_holiday_week) {
									//	National Holiday Week, parity has 'none' value
									title = ' <i class="fas fa-flag"></i>';
									parity = 'none';
								} else {
									//	>
									//	After, each week is displayed as natural week-1
									title = "Week " + (wn-1);
									parity = ((wn-1) % 2 === 0) ? 'even' : 'odd';
								}
							}
							html = cbfpre;
							html += "<input name='stsw' value='" + wn + "' id='" + id + "' type='checkbox' title='" + title + "' data-parity='" + parity + "' />";
							html += "<label class='control-label' for='" + id + "' style='cursor:pointer;'>" + title + "</label>";
							html += cbfpost;
							cb_field.append(html);
						}
						$('#scheduleToSome').modal('show');	// Show
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
			slotDuration: '00:20',	//	Slot Time Duration
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
//				left: 'timeGridWeek,timeGridDay dayGridWeek,dayGridDay listWeek,listDay',	// buttons for switching between views
				left: 'timeGridWeek listWeek',	// buttons for switching between views
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
				$('.admin-page #service-calendar .popup .curtain').fadeIn();
				$('.admin-page .popup #cal_add_popup').fadeIn();
			},
//			unselect: function(jsEvent, view) {	//	callback when a region is unselected
//					
//			},
			//	Business Hours
			businessHours: [
				{
					daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday, Tuesday, Wednesday, Thursday, Friday
					startTime: '09:00', // 9am
					endTime: '17:00' // 5pm
				},
				{
					daysOfWeek: [ 0, 6 ], // Saturday, Sunday
					startTime: '09:00', // 9am
					endTime: '17:00' // 5pm
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
					$(".fc-scheduleToAllWeeks-button").prop('disabled', true);
					successCallback([]);
				} else {
					//	From "Out of Semester"
					if ($('#calendar_week_number').css('display') === 'none' && $('#calendar_tutor').css('display') === 'none') {
						//	Re-calculate
						var sem_info = GlobalVariables.semester_json;
						var year = weekNumAndSem.year;
						var season = weekNumAndSem.season;
						var last_weeks = parseInt(sem_info[year][season].last_weeks);
						var national_holiday_week = parseInt(sem_info[year][season].national_holiday_week);
						$('#calendar_week_number').html('');
						for (var i = 1, j = 1; i <= last_weeks; ++i) {
							var html;
							if(i === national_holiday_week){
								html = "<option value='" + i + "'>" + "National Holiday Week" + "</option>";
							}else{
								html = "<option value='" + i + "'>Week " + (j++) + "</option>";
							}
							$('#calendar_week_number').append(html);
						}
						$('#calendar_week_number').css('display', 'inline-block');
						$('#calendar_tutor').css('display', 'inline-block');
						if ($('select#calendar_tutor option:selected').val() === '-1') {
							$(".fc-scheduleToAllWeeks-button").prop('disabled', true);
						} else {
							$(".fc-scheduleToAllWeeks-button").prop('disabled', false);
						}
					}
					// alert(weekNumAndSem.semester);
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
								title: service.service_type + " - " + service.tutor_name,
								start: service.start_datetime,
								end: service.end_datetime,
								extendedProps: {
									tutor_id: service.tutor_id,
									tutor: service.tutor_name,
									capacity: service.capacity,
									address: service.address,
									description: service.service_description,
									service_type_id: service.service_type_id,
									appointed: service.appointments_number
								}
							};
							results.push(eve);
						});
						successCallback(results);
        			}.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
				}
			},
			eventRender: function(info) {
				var hover_message = info.event.title;
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
					var appointed = parseInt(info.event.extendedProps.appointed);
					var capacity = parseInt(info.event.extendedProps.capacity);
					if (appointed < capacity) {
						//	If no one makes an appointment, normal color
						if (appointed !== 0) {
							//	If there are appointments for this service, give a green color
							el.css('background-color', '#35b66f');
						}
					} else if (appointed === capacity) {
						//	If full capacity, give a red color
						el.css('background-color', 'red');
					} else if (appointed > capacity) {
						//	Abnormal Behavior, ask for fixing
						alert('Oops, sth wrong. Please contact us to fix it!');
					} else {
						//	Abnormal Behavior, ask for fixing
						alert('Oops, sth wrong. Please contact us to fix it!');
					}
				} else {
					// For Mirror select, give it orange
					el.css('background-color', '#245F83');
				}
			},
			eventClick: function(info) {
				helper.loadEditPopup(info.event);
				$('.admin-page #service-calendar .popup .curtain').fadeIn();
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
	
    /**
     * Media Queries
     */
	function mediaQueryResponse(mql) {
		if (mql.matches) {
			calendar.setOption('header', {
				left: 'title',	// put title in the first line
//				center: 'timeGridWeek,timeGridDay dayGridWeek,dayGridDay listWeek,listDay',	// buttons for switching between views
				center: 'timeGridWeek listWeek',	// buttons for switching between views
				right: 'scheduleToAllWeeks addService prev,today,next'	// buttons for locating a date
			});
			return true;
		} else {
			calendar.setOption('header', {
//				left: 'timeGridWeek,timeGridDay dayGridWeek,dayGridDay listWeek,listDay',	// buttons for switching between views
				left: 'timeGridWeek listWeek',	// buttons for switching between views
				center: 'title',	// put title in the center
				right: 'scheduleToAllWeeks addService prev,today,next'	// buttons for locating a date
			});
			return false;
		}
	}
	
})(window.AdminServiceConfig);
