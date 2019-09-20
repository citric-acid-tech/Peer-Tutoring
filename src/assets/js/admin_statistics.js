window.AdminStatistics = window.AdminStatistics || {};

/**
 * Admin Appointment Management
 *
 * Admin Appointment Management javascript namespace. Contains the main functionality of the Admin Appointment Management
 * page.
 *
 * @module AdminStatistics
 */
(function (exports) {

    'use strict';

    /**
     * The page helper contains methods that implement each record type functionality
     * AdminStatisticsHelper
     *
     * @type {Object}
     */
    var helper = {};
	
	var cnt = 0;
	var datatable;

    /**
     * This method initializes the Admin Appointment Management page.
     *
     * @param {Boolean} defaultEventHandlers Optional (false), whether to bind the default
     * event handlers or not.
     */
    exports.initialize = function (defaultEventHandlers) {
        defaultEventHandlers = defaultEventHandlers || false;

		helper = new AdminStatisticsHelper();
		
		//	Guess what, a date picker!!
		$('#start_date, #end_date').datepicker({
			dateFormat: "yy-mm-dd",
			constrainInput: true,
			autoSize: true,
			firstDay: 1,
			showOtherMonths: true,
			hideIfNoPrevNext: true,
			navigationAsDateFormat: true,
			showAnim: "fold",
			onSelect: function() {
				datatable.ajax.reload();
			},
			onClose: function() {
				setTimeout(function () {
					$('#start_date, #end_date').prop('disabled', false);
				}, 100);
			}
		});
		
		//	Guess what, a data table!
		datatable = $('#service_statistics').DataTable({
			"autoWidth": true,
			"processing": true,
			"scrollY": "377px",
			"scrollCollapse": true,
			responsive: true,
			"initComplete": function(settings, json) {
				Admin.placeFooterToBottom();	//	Fix the footer gg problem
			},
			"drawCallback": function( settings ) {
				Admin.placeFooterToBottom();	//	Fix the footer gg problem
			},
			"stateLoaded": function (settings, data) {
				Admin.placeFooterToBottom();	//	Fix the footer gg problem
			},
			"ajax": function(data, callback, settings) {
				var sd = $('#start_date').val();
				var ed = $('#end_date').val();
				if (!helper.validateDateTime(sd, ed)) {
					callback({data:[]});
					return false;
				}
				
				var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_service_statistic';
				var postData = {
					csrfToken: GlobalVariables.csrfToken,
					start_date: JSON.stringify((sd === undefined || sd === '' || sd === EALang.start_date) ? 'ALL' : sd),
					end_date: JSON.stringify((ed === undefined || ed === '' || ed === EALang.end_date) ? 'ALL' : ed)
				};

				$.post(postUrl, postData, function (response) {
					//	Test whether response is an exception or a warning
					if (!GeneralFunctions.handleAjaxExceptions(response)) {
						return;
					}			
					//	Iterate through all services, generate htmls for them and
					//	add them to the results			
					cnt = 0;
					
					var dataArray = [];
					var subArray = [];
					for (var i = 0; i < response.length; ++i) {
						var item = response[i];
						subArray = [(++cnt).toString(), item.name, item.not_started, item.service_completed, item.service_finished, item.cancelled];
						dataArray.push(subArray);
					}
					
					callback(
						{
							data: dataArray
						}
					);
					
				}.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
			}
		});
		
		Admin.placeFooterToBottom();	//	Fix the footer gg problem
		
		helper.datatable = datatable;

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

})(window.AdminStatistics);
