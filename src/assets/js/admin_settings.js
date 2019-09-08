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
	
	var firstload_email = true;
	var trumbowyg;
	
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
		$("#settings_main_navtab a[data-toggle='tab']").on('shown.bs.tab', function() {
			if ($(this).attr('href') === '#common_settings') {
				helper = adminSettingsHelperCommon;
				//	Maybe there is no need to reload
			} else if ($(this).attr('href') === '#semester_information') {
				helper = adminSettingsHelperSemester;
			} else if ($(this).attr('href') === '#email_configurations') {
				helper = adminSettingsHelperEmail;
				if (firstload_email) {
					//	Nice Select
					$('.niceselect').niceSelect();
					//	Guess what, a trumbowyg editor!
					var lang = 'en';
					switch(GlobalVariables.curLanguage) {
						case 'english': lang = 'en'; break;
						case '简体中文': lang = 'zh_cn'; break;
						default: lang = 'en';
					}
					trumbowyg = $('.trumbowyg#email_content').trumbowyg({
						//	locale
						lang: lang,
						//	disable all at first
						disabled: true,
						//	Advanced Buttons
						btnsDef: {
							date: {
								fn: function() {
									//	Restore Range - No need ??? Oh, maybe buttons on that have done this already!!
//									$('#email_content').trumbowyg('restoreRange');
									//	Insert at caret
									$('#email_content').trumbowyg('execCmd', {
										cmd: 'insertText',
										param: ' $DATE$ ',
										foreCss: false
									});
									return true;
								},
								title: 'Date Parameter',
								text: 'Date Parameter',
								hasIcon: false
							},
							servType: {
								fn: function() {
									//	Restore Range - No need ??? Oh, maybe buttons on that have done this already!!
//									$('#email_content').trumbowyg('restoreRange');
									//	Insert at caret
									$('#email_content').trumbowyg('execCmd', {
										cmd: 'insertText',
										param: ' $SERV_TYPE$ ',
										foreCss: false
									});
									return true;
								},
								title: 'Service Type Parameter',
								text: 'Service Type Parameter',
								hasIcon: false
							},
							address: {
								fn: function() {
									//	Restore Range - No need ??? Oh, maybe buttons on that have done this already!!
//									$('#email_content').trumbowyg('restoreRange');
									//	Insert at caret
									$('#email_content').trumbowyg('execCmd', {
										cmd: 'insertText',
										param: ' $ADDRESS$ ',
										foreCss: false
									});
									return true;
								},
								title: 'Address Parameter',
								text: 'Address Parameter',
								hasIcon: false
							},
							left: {
								fn: function() {
									//	Restore Range - No need ??? Oh, maybe buttons on that have done this already!!
//									$('#email_content').trumbowyg('restoreRange');
									//	Insert at caret
									$('#email_content').trumbowyg('execCmd', {
										cmd: 'insertText',
										param: ' $LEFT$ ',
										foreCss: false
									});
									return true;
								},
								title: '#(Students Applied) Parameter',
								text: '#(Students Applied) Parameter',
								hasIcon: false
							},
							sysParam: {
								dropdown: ['date', 'servType', 'address', 'left'],
								title: 'System Paramters',
								hasIcon: false
							}
						},
						//	button panel
						btns: [
							['viewHTML'],
							['historyUndo', 'historyRedo'],
							['formatting'],
							['strong', 'em', 'del'],
							['superscript', 'subscript'],
							['link'],
//							['insertImage'],
							['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
							['unorderedList', 'orderedList'],
							['horizontalRule'],
							['removeformat'],
							['fullscreen'],
							//	Plugin - fontfamily & fontsize
							['fontfamily', 'fontsize'],
							//	Plugin - lineheight
							['lineheight'],
							//	Plugin - colors
							['foreColor', 'backColor'],
							//	Plugin - emoji
							['specialChars', 'emoji'],
							//	Plugin - table
							['table'],
							//	Customize
							['sysParam']
						],
						//	Do not affect the look of the text in the editor
						resetCss: true,
						//	Security, filter away these tags
						tagsToRemove: ['script', 'link'],
						urlProtocol: true,
						//	Plugin: colors
						plugins: {
							colors: {
								colorList: [
									//	'black', 'white', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'
									'000000', 'ffffff', 'ff0000', 'ff8000', 'ffff00', '00ff00', '00ffff', '0000ff', '8a2be2'
								]
							}
						}
					});
					helper.trumbowyg = trumbowyg;
					//	Pre Get Settings
					helper.getEmailSettings();
					firstload_email = false;
				}
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