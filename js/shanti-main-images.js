(function ($) {
	Drupal.behaviors.shantiImages = {
	    attach: function (context, settings) {
			if(context == document) {
				if ($("#og-grid").length > 0) {
					Grid.init();
				}
				
				// Code to hide Admin menu when cursor not in upper right
				setTimeout(function() { $('#admin-menu').slideUp(); $('body').removeClass('admin-menu'); }, 1000);
				$('body').mousemove(function(event) { 
					var x = event.pageX;
					var y = event.pageY; 
					if (y < 50 && x < 200) { 
						if ($('#admin-menu').is(":hidden")) {
							$('#admin-menu').slideDown(); 
							$('body').addClass('admin-menu');
						}
					} else if (y > 200) { 
						if ($('#admin-menu').is(":visible")) {
							setTimeout(function() { $('#admin-menu').slideUp(); $('body').removeClass('admin-menu'); }, 15000);
						} 
					} 
				});
			}
	    }
	};

}) (jQuery);





