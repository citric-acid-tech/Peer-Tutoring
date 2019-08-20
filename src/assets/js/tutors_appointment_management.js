window.TutorsAppointmentManagement = window.TutorsAppointmentManagement || {};

/**
 * Tutors Appointment Management
 *
 * Tutors Appointment Management javascript namespace. Contains the main functionality of the Tutors Appointment Management
 * page.
 *
 * @module TutorsAppointmentManagement
 */
(function (exports) {

    'use strict';

    /**
     * The page helper contains methods that implement each record type functionality
     * TutorsAppointmentManagementHelper
     *
     * @type {Object}
     */
    var helper = {};

    /**
     * This method initializes the Tutors Appointment Management page.
     *
     * @param {Boolean} defaultEventHandlers Optional (false), whether to bind the default
     * event handlers or not.
     */
    exports.initialize = function (defaultEventHandlers) {
        defaultEventHandlers = defaultEventHandlers || false;
		
		//	Guess what, a date picker!!
		//	calculateWeek: myWeekCalc
		//	showButtonPanel: true
		//	numberOfMonths: [2, 2]
		//	showOptions: {direction: "down"}
		$('#tutor-appointment_management_start_date, #tutor-appointment_management_end_date').datepicker({
			dateFormat: "yy-mm-dd",
			constrainInput: true,
			autoSize: true,
			navigationAsDateFormat: true,
			firstDay: 1,
			showOtherMonths: true,
			showAnim: "fold",
			onClose: function() {
				setTimeout(function () {
					$('#tutor-appointment_management_start_date, #tutor-appointment_management_end_date').prop('disabled', false);
				}, 100);
			}
		});
		
        helper = new TutorsAppointmentManagementHelper();
        helper.resetForm();
        helper.filter(undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'true');

        if (defaultEventHandlers) {
            _bindEventHandlers();
        }
    };

    /**
     * Default event handlers declaration for Students My Appointment page.
     */
    function _bindEventHandlers() {
        helper.bindEventHandlers();
    }

})(window.TutorsAppointmentManagement);
