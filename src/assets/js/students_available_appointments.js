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
				helper.resetForm();
				helper.filter(undefined, undefined, undefined, undefined, 'true');
			} else if ($(this).attr('href') === '#check-available-time-in-calendar') {
				//	This may not happens, cause it cannot be changed directly
				helper = studentsAvailableAppointmentsCalendarHelper;
				helper.resetForm();
				helper.filter(undefined, undefined, undefined, undefined, 'true');
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

})(window.StudentsAvailableAppointments);
