<script>
	document.addEventListener('DOMContentLoaded', function() {
		var calendarEl = document.getElementById('admin-full-calendar');
		var calendar = new FullCalendar.Calendar(calendarEl, {
			plugins: [ 'dayGrid' ]
		});
		calendar.render();
	});
</script>

<div class="container">
	<div id="admin-full-calendar"></div>
</div>