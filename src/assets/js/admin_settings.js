window.AdminSettings = window.AdminSettings || {};

/**
 * Admin Settings
 *
 * Admin Settings javascript namespace. Contains the main functionality of the Admin Settings
 * page.
 *
 * @module AdminSettings
 */
(function (exports) {

    'use strict';

    /**
     * The page helper contains methods that implement each record type functionality
     * AdminSettingsTutorHelper
     *
     * @type {Object}
     */
    var helper = {};
	
	var adminSettingsHelperCommon = new AdminSettingsHelperCommon();
	var adminSettingsHelperSemester = new AdminSettingsHelperSemester();
	var adminSettingsHelperEmail = new AdminSettingsHelperEmail();
	var adminSettingsHelperSurvey = new AdminSettingsHelperSurvey();
	
    /**
     * This method initializes the Admin Settings page.
     *
     * @param {Boolean} defaultEventHandlers Optional (false), whether to bind the default
     * event handlers or not.
     */
    exports.initialize = function (defaultEventHandlers) {
        defaultEventHandlers = defaultEventHandlers || false;
		//	Common Settings by default
        helper = adminSettingsHelperCommon;
		//	Other default initializations
		helper.getCommonSettings();
		
		
        if (defaultEventHandlers) {
            _bindEventHandlers();
        }
    };

    /**
     * Default event handlers declaration for Admin Settings page.
     */
    function _bindEventHandlers() {
		
        /**
         * Event: Page Tab Button "Click"
		 *
		 * Changes the displayed tab
         */
		$("a[data-toggle='tab']").on('shown.bs.tab', function() {
			if ($(this).attr('href') === '#common_settings') {
				helper = adminSettingsHelperCommon;
				//	Maybe there is no need to reload
			} else if ($(this).attr('href') === '#semester_information') {
				helper = adminSettingsHelperSemester;
			} else if ($(this).attr('href') === '#email_configurations') {
				helper = adminSettingsHelperEmail;
			} else if ($(this).attr('href') === '#survey_configurations') {
				helper = adminSettingsHelperSurvey;
			} else {
				alert("What have you pressed, my friend??");
			}
			
			//	Place footer one more time
			Admin.placeFooterToBottom();
		});
		
        adminSettingsHelperCommon.bindEventHandlers();
        adminSettingsHelperSemester.bindEventHandlers();
        adminSettingsHelperEmail.bindEventHandlers();
        adminSettingsHelperSurvey.bindEventHandlers();
    }
	
})(window.AdminSettings);