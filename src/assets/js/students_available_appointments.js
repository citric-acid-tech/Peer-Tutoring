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
					showWeek: true,
					onSelect: function() {
						helper.filter($('#date-title').val());
					}
				});
				helper.filter($('#date-title').val());
			} else if ($(this).attr('href') === '#check-available-time-in-calendar') {
				//	This may not happens, cause it cannot be changed directly
				//	This may still happen if privileges are added
				helper = studentsAvailableAppointmentsCalendarHelper;
			} else {
				alert("What have you pressed, my friend??");
			}
			
			//	Place footer one more time
			Students.placeFooterToBottom();
		});
		
//		document.addEventListener('DOMContentLoaded', function() {
//			var calendarEl = document.getElementById('student-full-calendar');
//			var calendar = new FullCalendar.Calendar(calendarEl, {
//				plugins: [ 'dayGrid' ]
//			});
//			calendar.render();
//		});
		
        studentsAvailableAppointmentsTutorHelper.bindEventHandlers();
        studentsAvailableAppointmentsTimeHelper.bindEventHandlers();
        studentsAvailableAppointmentsCalendarHelper.bindEventHandlers();
    }

})(window.StudentsAvailableAppointments);
