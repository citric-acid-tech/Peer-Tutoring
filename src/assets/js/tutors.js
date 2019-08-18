window.Tutors = window.Tutors || {};

/**
 * Tutors
 *
 * This module contains functions that are used in the students section of the application.
 *
 * @module Tutors
 */
(function (exports) {

    'use strict';

    /**
     * Main javascript code for the students of CLE Peer-Tutoring | SUSTech
     */
    $(document).ready(function () {
        window.console = window.console || function () {
        }; // IE compatibility
		
		//	When the window is resized, re-define the 
		//	footer's position at the page
        $(window)
            .on('resize', function () {
                Tutors.placeFooterToBottom();
            })
            .trigger('resize');
		
		//	Loading Icon will do their work on ajax
        $(document).ajaxStart(function () {
            $('#loading').show();
        });
        $(document).ajaxStop(function () {
            $('#loading').hide();
        });
		
		//	tooltip: my is the position of the triangle leadout,
		//	at is the content position
        $('.menu-item').qtip({
            position: {
                my: 'top center',
                at: 'bottom center'
            },
            style: {
                classes: 'qtip-green qtip-shadow custom-qtip'
            }
        });
		
		//	Language Selection
        GeneralFunctions.enableLanguageSelection($('#select-language'));
    });

    /**
     * Tutors Constants
     */
    exports.DB_SLUG_ADMIN = 'admin';
    exports.DB_SLUG_PROVIDER = 'provider';
    exports.DB_SLUG_SECRETARY = 'secretary';
    exports.DB_SLUG_CUSTOMER = 'customer';

    exports.PRIV_VIEW = 1;
    exports.PRIV_ADD = 2;
    exports.PRIV_EDIT = 4;
    exports.PRIV_DELETE = 8;

    exports.PRIV_APPOINTMENTS = 'appointments';
    exports.PRIV_CUSTOMERS = 'customers';
    exports.PRIV_SERVICES = 'services';
    exports.PRIV_USERS = 'users';
    exports.PRIV_SYSTEM_SETTINGS = 'system_settings';
    exports.PRIV_USER_SETTINGS = 'user_settings';
	
	//	This is for header active state
    exports.PRIV_APPOINTMENTS_MANAGEMENT = 'appointments_management';
    exports.PRIV_TUTOR_SETTINGS = 'tutor_settings';
	
    /**
     * Place the students footer always on the bottom of the page.
     */
    exports.placeFooterToBottom = function () {
        var $footer = $('#footer');
		
        if (window.innerHeight > $('body').height()) {
            //	If window size is larger, place the footer at the bottom
			$footer.css({
                'position': 'absolute',
                'width': '100%',
                'bottom': '0px'
            });
        } else {
			//	If window is not enough for all content, place the footer normally
			//	at the end of the body content
            $footer.css({
                'position': 'static'
            });
        }
    };

    /**
     * Display tutors notifications to user.
     *
     * Using this method you can display notifications to the use with custom messages. If the
     * 'actions' array is provided then an action link will be displayed too.
     *
     * @param {String} message Notification message
     * @param {Array} actions An array with custom actions that will be available to the user. Every
     * array item is an object that contains the 'label' and 'function' key values.
	 * @param {String} The type of message defines the background-color of the message box
     */
    exports.displayNotification = function (message, actions, type) {
        message = message || 'NO MESSAGE PROVIDED FOR THIS NOTIFICATION';

        if (actions === undefined) {
            actions = [];
            setTimeout(function () {
                $('#notification').fadeIn();
            }, 5000);
            setTimeout(function () {
                $('#notification').fadeOut();
            }, 10000);
        }

        var customActionsHtml = '';

        $.each(actions, function (index, action) {
            var actionId = action.label.toLowerCase().replace(' ', '-');
            customActionsHtml += '<button id="' + actionId + '" class="btn btn-default btn-xs">' +
                action.label + '</button>';

            $(document).off('click', '#' + actionId);
            $(document).on('click', '#' + actionId, action.function);
        });
		
		type = (type === undefined || (type !== 'success' && type !== 'failure')) ? "alert" : "alert " + type;

        var notificationHtml =
            '<div class="notification ' + type + '">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">×</span>' +
            '</button>' +
            '<strong>' + message + '</strong>' +
            customActionsHtml +
            '</div>';

        $('#notification').html(notificationHtml);
        $('#notification').show('fade');
    };
	
    /**
     * Provide animation class control on header navicon
     */
    exports.naviconGo = function(x) {
		x.classList.toggle("change_navicon");
    };

})(window.Tutors);
