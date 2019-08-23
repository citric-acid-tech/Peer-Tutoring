window.AdminAppointmentsManagement = window.AdminAppointmentsManagement || {};

/**
 * Admin Appointment Management
 *
 * Admin Appointment Management javascript namespace. Contains the main functionality of the Admin Appointment Management
 * page.
 *
 * @module AdminAppointmentsManagement
 */
(function (exports) {

    'use strict';

    /**
     * The page helper contains methods that implement each record type functionality
     * AdminAppointmentsManagementHelper
     *
     * @type {Object}
     */
    var helper = {};

    /**
     * This method initializes the Admin Appointment Management page.
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
		$('#appointments_management_start_date, #appointments_management_end_date').datepicker({
			dateFormat: "yy-mm-dd",
			constrainInput: true,
			autoSize: true,
			navigationAsDateFormat: true,
			firstDay: 1,
			showOtherMonths: true,
			showAnim: "fold",
			onClose: function() {
				setTimeout(function () {
					$('#appointments_management_start_date, #appointments_management_end_date').prop('disabled', false);
				}, 100);
			}
		});
		
        helper = new AdminAppointmentsManagementHelper();
        helper.resetForm();
        helper.filter(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'true');

        if (defaultEventHandlers) {
            _bindEventHandlers();
        }
    };

    /**
     * Default event handlers declaration for Admin Appointment Management page.
     */
    function _bindEventHandlers() {
        helper.bindEventHandlers();
    }

})(window.AdminAppointmentsManagement);
