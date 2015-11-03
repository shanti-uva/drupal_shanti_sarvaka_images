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
	
	/*
	 * popupImageCenter: jQuery extension function called in grid.js when opening popup. Positions image and lightbox link centered vertically
	 */
    $.fn.popupImageCentering = function() {
		return this.each(function() {
				var imght = $(this).height();
				var cnthgt = $(this).parents('.og-fullimg').height();
				if (imght < cnthgt - 30) {
					// Adjust top margin of image
					var tmarg = ((cnthgt - imght) / 2);
					$(this).css("margin-top", tmarg  + "px" );
					// Adjust vertical position of lightbox link
					var os = $(this).prev('a').offset();
					os.top = os.top +tmarg;
					 $(this).prev('a').offset(os);
				}
			});
	   };

}) (jQuery);





