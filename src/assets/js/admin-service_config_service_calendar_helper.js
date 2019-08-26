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
		this.calendar = undefined;
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    AdminServiceConfigServiceCalendarHelper.prototype.bindEventHandlers = function () {
        var instance = this;
		
   		/**
   		 * Event: Create Event button clicked
   		 */
		$('.admin-page #service-calendar .calendar-btns #show_selected').click(function() {
			alert("Okay sir. Creating an event.\nHere is what I got:\n" + 
				 instance.currentSelect.start + "\n~\n" + instance.currentSelect.end);
		});
		
   		/**
   		 * Event: Check Event button clicked
   		 */
		$('.admin-page #service-calendar .calendar-btns #fetch_event_0').click(function() {
			var event = instance.calendar.getEventById('testEvent0');
			alert("Yes sir. You want to check on test event 0 right?\nHere is what I got:\n" + 
				 "Title: " + event.title + "\n" +
				  event.start + "\n~\n" + event.end);
		});
		
   		/**
   		 * Event: Add Event button clicked
   		 */
		$('.admin-page #service-calendar .calendar-btns #add_event_through_button').click(function() {
			var datetimeStr = prompt('Enter a date in YYYY-MM-DD format');
			var date = new Date(datetimeStr + 'T00:00:00');	// local time
			if (!isNaN(date.valueOf())) {
				instance.calendar.addEvent({
					title: 'Event added from pressing the button',
					start: date,
					allDay: true
				});
				alert('Event Added Successfully');
			} else {
				alert('Invalid date.');
			}
		});
		
	};
	
    window.AdminServiceConfigServiceCalendarHelper = AdminServiceConfigServiceCalendarHelper;
})();
