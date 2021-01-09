// Demo 3 Js file
$(document).ready(function () {
	'use strict';

	// Deal of the day countdown
	if ($.fn.countdown) {
		$('.deal-countdown').each(function () {
			var $this = $(this),
				untilDate = $this.data('until'),
				compact = $this.data('compact');

			$this.countdown({
				until: untilDate, // this is relative date +10h +5m vs..
				format: 'HMS',
				padZeroes: true,
				labels: ['سال', 'دقیقه', 'هفته', 'روز', 'ساعت', 'دقیقه', 'ثانیه'],
				labels1: ['سال', 'دقیقه', 'هفته', 'روز', 'ساعت', 'دقیقه', 'ثانیه']
			});
		});

		// Pause
		// $('.deal-countdown').countdown('pause');
	}
});