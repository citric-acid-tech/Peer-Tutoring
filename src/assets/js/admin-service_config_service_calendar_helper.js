(function () {

    'use strict';

    /**
     * AdminServiceConfigServiceCalendarHelper Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class AdminServiceConfigServiceCalendarHelper
     */
    function AdminServiceConfigServiceCalendarHelper() {
        this.filterResults = {};
		this.currentSelect = {};
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    AdminServiceConfigServiceCalendarHelper.prototype.bindEventHandlers = function () {
        var instance = this;
		
   		/**
   		 * Event: Create Event button clicked
   		 */
		$('.admin-page #service-calendar .calendar-btns #create_event').click(function() {
			alert("Okay sir. Creating an event.\nHere is what I got:\n" + 
				 instance.currentSelect.start + "\n~\n" + instance.currentSelect.end);
		});
	};
	
    window.AdminServiceConfigServiceCalendarHelper = AdminServiceConfigServiceCalendarHelper;
})();
