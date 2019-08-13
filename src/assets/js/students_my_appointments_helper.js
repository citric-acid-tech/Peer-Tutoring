(function () {

    'use strict';

    /**
     * StudentsMyAppointmentHelper Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class StudentsMyAppointmentHelper
     */
    function StudentsMyAppointmentHelper() {
        this.filterResults = {};
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    StudentsMyAppointmentHelper.prototype.bindEventHandlers = function () {
        var instance = this;

        /**
         * Event: Filter My Appointments Form "Submit"
         */
        $('#filter-my_appointments form').submit(function () {
            var key = $('#filter-my_appointments .key').val();
            $('#filter-my_appointments .selected').removeClass('selected');
            instance.resetForm();
            instance.filter(key);
            return false;	//	why?
        });

        /**
         * Event: Filter My Appointments Button "Click"
         */
        $('#filter-my_appointments .clear').click(function () {
            $('#filter-my_appointments .key').val('');
            instance.filter('');
            instance.resetForm();
        });

        /**
         * Event: Filter Entry "Click"
         *
         * Display the My Appointments data of the selected row.
         */
        $(document).on('click', '.entry', function () {
			//	Get clicked id
            var appointmentId = $(this).attr('data-id');
			
			//	Find the appointment according to id and get its data
            var appointment = {};
            $.each(instance.filterResults, function (index, item) {
                if (item.id === appointmentId) {
                    appointment = item;
                    return false;
                }
            });
			
			//	Display the data
            instance.display(appointment);
			
			//	Change selected display
            $('#filter-my_appointments .selected').removeClass('selected');
            $(this).addClass('selected');
        });

		
        /**
         * Event: Cancel Appointment Button "Click"
         */
        $('#cancel-appointment').click(function () {
			//	Get current appointment id
            var appointmentId = $('#appointment-id').val();
            var buttons = [
                {
                    text: EALang.cancel_appointment,
                    click: function () {
                        instance.cancelAppointment(appointmentId);
                        $('#message_box').dialog('close');
                    }
                },
                {
                    text: EALang.cancel,
                    click: function () {
                        $('#message_box').dialog('close');
                    }
                }
            ];

            GeneralFunctions.displayMessageBox(EALang.cancel_appointment_title,
                EALang.cancel_appointment_hint, buttons);
        });
    };

    /**
     * Cancel an appointment record from database.
     *
     * @param {Number} id Record id to be cancelled.
     */
    StudentsMyAppointmentHelper.prototype.cancelAppointment = function (id) {
        var postUrl = GlobalVariables.baseUrl + '/index.php/students_api/ajax_cancel_appointment';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
            appointment_id: id
        };

        $.post(postUrl, postData, function (response) {
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }

            Students.displayNotification(EALang.appointment_cancelled);
            this.resetForm();
            this.filter($('#filter-my_appointments .key').val());
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };

    /**
     * Bring the appointment form back to its initial state.
     */
    StudentsMyAppointmentHelper.prototype.resetForm = function () {
        $('.record-details').find('input, textarea').val('');


        $('.record-details').find('input, textarea').prop('readonly', true);

        $('#customer-appointments').empty();
        $('#appointment-details').toggleClass('hidden', true).empty();
        $('#edit-appointment, #delete-appointment').prop('disabled', true);
        $('#add-edit-delete-group').show();
        $('#save-cancel-group').hide();

        $('.record-details .has-error').removeClass('has-error');
        $('.record-details #form-message').hide();

        $('#filter-my_appointments button').prop('disabled', false);
        $('#filter-my_appointments .selected').removeClass('selected');
        $('#filter-my_appointments .results').css('color', '');
    };

    /**
     * Display an appointment record into the form.
     *
     * @param {Object} appointment Contains the appointment record data.
     */
    StudentsMyAppointmentHelper.prototype.display = function (appointment) {
        $('#customer-id').val(appointment.id);
        $('#first-name').val(appointment.first_name);
        $('#last-name').val(appointment.last_name);
        $('#email').val(appointment.email);
        $('#phone-number').val(appointment.phone_number);
        $('#address').val(appointment.address);
        $('#city').val(appointment.city);
        $('#zip-code').val(appointment.zip_code);
        $('#notes').val(appointment.notes);

        $('#customer-appointments').empty();
        $.each(appointment.appointments, function (index, appointment) {
            var start = GeneralFunctions.formatDate(Date.parse(appointment.start_datetime), GlobalVariables.dateFormat, true);
            var end = GeneralFunctions.formatDate(Date.parse(appointment.end_datetime), GlobalVariables.dateFormat, true);
            var html =
                '<div class="appointment-row" data-id="' + appointment.id + '">' +
                start + ' - ' + end + '<br>' +
                appointment.service.name + ', ' +
                appointment.provider.first_name + ' ' + appointment.provider.last_name +
                '</div>';
            $('#customer-appointments').append(html);
        });

        $('#appointment-details').empty();
    };

    /**
     * Filter appointment records.
     *
     * @param {String} key This key string is used to filter the appointment records.
     * @param {Number} selectId Optional, if set then after the filter operation the record with the given
     * ID will be selected (but not displayed).
     * @param {Boolean} display Optional (false), if true then the selected record will be displayed on the form.
     */
    StudentsMyAppointmentHelper.prototype.filter = function (key, selectId, display) {
        display = display || false;

        var postUrl = GlobalVariables.baseUrl + '/index.php/backend_api/ajax_filter_my_appointments';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
            key: key
        };

        $.post(postUrl, postData, function (response) {
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }

            this.filterResults = response;

            $('#filter-my_appointments .results').html('');
            $.each(response, function (index, appointment) {
                var html = this.getFilterHtml(appointment);
                $('#filter-my_appointments .results').append(html);
            }.bind(this));
            if (response.length == 0) {
                $('#filter-my_appointments .results').html('<em>' + EALang.no_records_found + '</em>');
            }

            if (selectId != undefined) {
                this.select(selectId, display);
            }

        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };

    /**
     * Get the filter results row HTML code.
     *
     * @param {Object} appointment Contains the appointment data.
     *
     * @return {String} Returns the record HTML code.
     */
    StudentsMyAppointmentHelper.prototype.getFilterHtml = function (appointment) {
        var name = appointment.first_name + ' ' + appointment.last_name;
        var info = appointment.email;
        info = (appointment.phone_number != '' && appointment.phone_number != null) ?
            info + ', ' + appointment.phone_number : info;

        var html =
            '<div class="entry" data-id="' + appointment.id + '">' +
            '<strong>' +
            name +
            '</strong><br>' +
            info +
            '</div><hr>';

        return html;
    };

    /**
     * Select a specific record from the current filter results.
     *
     * If the appointment id does not exist in the list then no record will be selected.
     *
     * @param {Number} id The record id to be selected from the filter results.
     * @param {Boolean} display Optional (false), if true then the method will display the record
     * on the form.
     */
    StudentsMyAppointmentHelper.prototype.select = function (id, display) {
        display = display || false;

        $('#filter-my_appointments .selected').removeClass('selected');

        $('#filter-my_appointments .entry').each(function () {
            if ($(this).attr('data-id') == id) {
                $(this).addClass('selected');
                return false;
            }
        });

        if (display) {
            $.each(this.filterResults, function (index, appointment) {
                if (appointment.id == id) {
                    this.display(appointment);
                    $('#edit-appointment, #delete-appointment').prop('disabled', false);
                    return false;
                }
            }.bind(this));
        }
    };

    /**
     * Display appointment details on appointments backend page.
     *
     * @param {Object} appointment Appointment data
     */
    StudentsMyAppointmentHelper.prototype.displayAppointment = function (appointment) {
        var start = GeneralFunctions.formatDate(Date.parse(appointment.start_datetime), GlobalVariables.dateFormat, true);
        var end = GeneralFunctions.formatDate(Date.parse(appointment.end_datetime), GlobalVariables.dateFormat, true);

        var html =
            '<div>' +
            '<strong>' + appointment.service.name + '</strong><br>' +
            appointment.provider.first_name + ' ' + appointment.provider.last_name + '<br>' +
            start + ' - ' + end + '<br>' +
            '</div>';

        $('#appointment-details').html(html).removeClass('hidden');
    };

    window.StudentsMyAppointmentHelper = StudentsMyAppointmentHelper;
})();
