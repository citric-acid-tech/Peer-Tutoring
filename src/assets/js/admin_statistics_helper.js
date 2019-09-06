(function () {

    'use strict';

    /**
     * AdminStatisticsHelper Class
     *
     * This class contains the methods that are used in the AdminStatisticsHelper page.
     *
     * @class AdminStatisticsHelper
     */
    function AdminStatisticsHelper() {
        this.filterResults = [];
		this.cnt = 0;
		this.datatable = undefined;
    }

    /**
     * Binds the default event handlers of the AdminStatisticsHelper page.
     */
    AdminStatisticsHelper.prototype.bindEventHandlers = function () {
        var instance = this;
		
		/**
         * Event: When selecting date, other date pickers should not occur at the same time
         */
		$('#start_date').focus(function() {
			$('#end_date').prop('disabled', true);
		});
		$('#end_date').focus(function() {
			$('#start_date').prop('disabled', true);
		});
		
		/**
         * Event: Clear dates
         */
		$('#clear_dates').click(function() {
			$('#start_date').val('Start Date');
			$('#end_date').val('End Date');
			instance.datatable.ajax.reload();
		});
		
	};

    /**
     * Translate booking_status from numbers into language pack supported strings
     *
     * @param {Object} a number
     *
     * @return {String} Returns the string so it can be used as lang(str) or EALang.str
     */
    AdminStatisticsHelper.prototype.decodeBookingStatus = function (booking_status) {
		var translation_mark = "";
		switch(booking_status) {
			case "0": translation_mark = EALang.bs0;	break;
			case "1": translation_mark = EALang.bs1;	break;
			case "2": translation_mark = EALang.bs2;	break;
			case "3": translation_mark = EALang.bs3;	break;
			default: translation_mark = "no match booking status";
		}
		
        return translation_mark;
    };
	
    /**
     * Get all service categories and wrap them in an html
     */
    AdminStatisticsHelper.prototype.validateDateTime = function(sd, ed) {
		//	Use moment.js to parse the date
		var start_date = moment(sd, 'YYYY-MM-DD');
		var end_date = moment(ed, 'YYYY-MM-DD');
		//	Check if dates separately are valid
		var start_valid = (sd === '') || (sd === 'Start Date') || start_date.isValid();
		var end_valid = (ed === '') || (ed === 'End Date') || end_date.isValid();
		//	Check Validity
		if (start_valid && end_valid) {
			//	If end_date is before start_date, gg
			if (start_date > end_date) {
				Admin.displayNotification("Ending Date is before Starting Date!", undefined, "failure");
				return false;
			} else {
				return true;
			}
		} else {
			//	If Any of them is invalid, gg
			Admin.displayNotification("Invalid Date Input!", undefined, "failure");
			return false;
		}
    };
	
    window.AdminStatisticsHelper = AdminStatisticsHelper;
})();
