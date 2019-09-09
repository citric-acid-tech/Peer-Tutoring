(function () {

    'use strict';

    /**
     * AdminSettingsHelperSemester Class
     *
     * This class contains the methods that are used in the Students My Appointment page.
     *
     * @class AdminSettingsHelperSemester
     */
    function AdminSettingsHelperSemester() {
        this.filterResults = {};
		this.list_item = "<li class='sem_item'>" +
		 					"<strong>Semester </strong>" +
		 					" " + " " +
							"<input class='sem_year' title='Year' placeholder='Year' value='2019' type='number' min='2019' step='1' />" +
							" " + "<strong>-</strong>" + " " +
							"<select class='sem_season' title='Season' name='Season'>" +
								"<option value='Fall' selected>Fall</option>" +
								"<option value='Spring'>Spring</option>" +
								"<option value='Summer'>Summer</option>" +
							"</select>" +
							" " + " " +
							"<span> starts on </span>" +
							" " + " " +
							"<input class='sem_start_date' type='text' title='Start Date' placeholder='Start Date' value='2019-09-01' readonly />" +
							" " + " " +
							"<span> and will last for </span>" +
							"<input class='sem_last_weeks' title='Last Weeks' placeholder='Last Weeks' value='1' type='number' min='1' step='1' />" +
							" " + " " +
							"<span> weeks.</span>" +
							" " + " " +
							"<button class='sem_delete_row btn btn-danger' title='Delete this row'>" +
							"<i class='fas fa-times'></i>" +
							"</button>" +
						"</li>";
    }

    /**
     * Binds the default event handlers of the Students My Appointment page.
     */
    AdminSettingsHelperSemester.prototype.bindEventHandlers = function () {
        var instance = this;

        /**
         * Event: Upload JSON
         */
		$('#sem_upload').click(function() {
			//	If nothing modified, no need to update
			if ($('ul#sem_info .sem_modify').length === 0) {
				Admin.displayNotification("You did not modify anything and thus there is no need to update.");
				return false;
			}
			
			var itemSet = $('ul#sem_info .sem_item');
			var year, season, start_date, last_weeks;
			var sem_info = {};
			
//			//	Test: Replicate JSON: NICE!
//			console.log(GlobalVariables.semester_json);
//			console.log('----------------------------------');
//			console.log('--------- Now Replicate! ---------');
//			console.log('----------------------------------');
//			sem_info['2019'] = {};
//			sem_info['2019']['Fall'] = {
//				first_Monday: '2019-08-05',
//				last_weeks: '17'
//			};
//			sem_info['2019']['Spring'] = {
//				first_Monday: '2019-02-18',
//				last_weeks: '15'
//			};
//			sem_info['2019']['Summer'] = {
//				first_Monday: '2019-06-24',
//				last_weeks: '6'
//			};
//			console.log(sem_info);
			
			$.each(itemSet, function(index, item) {
//				console.log(index);	// index of the array
//				console.log(item);	// item
//				console.log('--------------------');
				year = $(item).find('.sem_year').val();
				season = $(item).find('.sem_season option:selected').val();
				start_date = $(item).find('.sem_start_date').val();
				last_weeks = $(item).find('.sem_last_weeks').val();
				
				//	if overlap, then override
				if (sem_info[year] === undefined) {
					sem_info[year] = {};
				}
				sem_info[year][season] = {
					first_Monday: start_date,
					last_weeks: last_weeks
				};
			});
			
			console.log(sem_info);
			alert(JSON.stringify(sem_info));
			
			//	Fantastic! Now you can update the info
		});

        /**
         * Event: New Row
         */
		$('#sem_new_row').click(function() {
			instance.newSemItem();
			var newLI = $('ul#sem_info li:last-of-type');
//			console.log(season + " - " + datetime_info);
			//	Set values
			newLI.find('.sem_year, .sem_season, .sem_start_date, .sem_last_weeks').addClass('sem_modify');
			newLI.find('.sem_start_date').datepicker({
				dateFormat: "yy-mm-dd",
				constrainInput: true,
				autoSize: true,
				navigationAsDateFormat: true,
				firstDay: 1,
				showOtherMonths: true,
				showAnim: "fold",
				onClose: function() {
					$('.sem_start_date').prop('disabled', false);
				}
			});
			newLI.fadeIn(500);
//			console.log(newLI);
		});

        /**
         * Event: Reset
         */
		$('#sem_reset').click(function() {
			instance.retrieveInfo();
		});

        /**
         * Event: Remove a row happens
         */
		$(document).on('click', 'ul#sem_info .sem_item .sem_delete_row', function() {
			var deleteItem = $(this).parent();
            var buttons = [
                {
                    text: EALang.confirm,
                    click: function () {
						$(deleteItem).fadeOut(500);
						setTimeout(function() {
							$(deleteItem).remove();
						}, 500);
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

            GeneralFunctions.displayMessageBox("Deleting a Semester Row",
                "Are you sure you want to delete this row?", buttons);
		});

        /**
         * Event: No Parallel Date Choosing
         */
		$(document).on('focus', 'ul#sem_info .sem_item .sem_start_date', function() {
			$('.sem_start_date').prop('disabled', true);
			$(this).prop('disabled', false);
		});

        /**
         * Event: Modify Hint
         */
		$(document).on('change', 'ul#sem_info .sem_item .sem_year, ul#sem_info .sem_item .sem_season, ul#sem_info .sem_item .sem_start_date, ul#sem_info .sem_item .sem_last_weeks', function() {
			$(this).addClass('sem_modify');
		});
		
		
	};

    /**
     * Save Semester Json
     */
    AdminSettingsHelperSemester.prototype.saveInfo = function () {
        var service_type_id = $('#service_type-id').val();
		var service_type_name = $('#service_type-name').val();
		var service_type_description = $('#service_type-description').val();
		
		//	AJAX
        var postUrl = GlobalVariables.baseUrl + '/index.php/admin_api/ajax_edit_service_type';
        var postData = {
            csrfToken: GlobalVariables.csrfToken,
			service_type_id : service_type_id,
			name : JSON.stringify(service_type_name),
			description : JSON.stringify(service_type_description)
        };
		
		var obj = this;

        $.post(postUrl, postData, function (response) {
			//	Test whether response is an exception or a warning
            if (!GeneralFunctions.handleAjaxExceptions(response)) {
                return;
            }
			
			if (response === 'success') {
				Admin.displayNotification("Uploaded successfully.", undefined, "success");
			} else if (response === 'fail') {
				Admin.displayNotification("ajax_edit_service_type: nonono", undefined, "failure");
			}
			
			var newName = $('#service_type-name').val();
			$('.admin-page #service_type_config .results .entry.selected')[0].title = newName;
			$('.admin-page #service_type_config .results .entry.selected strong.nameTags')[0].innerHTML = newName;
			
        }.bind(this), 'json').fail(GeneralFunctions.ajaxFailureHandler);
    };

    /**
     * Save Semester Json
     */
    AdminSettingsHelperSemester.prototype.retrieveInfo = function () {
		//	Pre-clear
		$('ul#sem_info').html('');
		var sem_info = GlobalVariables.semester_json;
		var obj = this;
		$.each(sem_info, function(year, season_info) {
			$.each(season_info, function(season, datetime_info) {
				obj.newSemItem();
				var newLI = $('ul#sem_info li:last-of-type');
//				console.log(season + " - " + datetime_info);
				//	Set values
				newLI.find('.sem_year').val(year);
				newLI.find(".sem_season option[value='" + season + "']").prop('selected', true);
				newLI.find('.sem_start_date').val(datetime_info.first_Monday);
				newLI.find('.sem_start_date').datepicker({
					dateFormat: "yy-mm-dd",
					constrainInput: true,
					autoSize: true,
					navigationAsDateFormat: true,
					firstDay: 1,
					showOtherMonths: true,
					showAnim: "fold",
					onClose: function() {
						$('.sem_start_date').prop('disabled', false);
					}
				});
				newLI.find('.sem_last_weeks').val(datetime_info.last_weeks);
				newLI.fadeIn(500);
//				console.log(newLI);
			});
		});
    };

    /**
     * Create a new list item to be wrapped in <ul>
     */
    AdminSettingsHelperSemester.prototype.newSemItem = function () {
		$('ul#sem_info').append(this.list_item);
    };
	
    window.AdminSettingsHelperSemester = AdminSettingsHelperSemester;
})();