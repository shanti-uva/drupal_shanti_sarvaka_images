(function ($) {
	Drupal.behaviors.shantiImages = {
	    attach: function (context, settings) {
			if(context == document) {
				if ($("#og-grid").length > 0) {
					Grid.init();
				}
				setTimeout(function() { $('#admin-menu').slideUp(); $('body').removeClass('admin-menu'); }, 1000);
				$('body').mousemove(function(event) { 
					var x = event.pageX;
					var y = event.pageY; 
					if (y < 50 && x < 200) { 
						if ($('#admin-menu').is(":hidden")) {
							console.log("showing admin menu");
							$('#admin-menu').slideDown(); 
							$('body').addClass('admin-menu');
						}
					} else if (y > 100) { 
						if ($('#admin-menu').is(":visible")) {
							console.log("hiding admin menu");
							setTimeout(function() { $('#admin-menu').slideUp(); $('body').removeClass('admin-menu'); }, 1500);
						} 
					} 
				});
			}
	    }
	};
	
}) (jQuery);