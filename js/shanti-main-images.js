(function ($) {
	Drupal.behaviors.shantiImages = {
	    attach: function (context, settings) {
			if(context == document) {
				if ($("#og-grid").length > 0) {
					Grid.init();
				}
			}
	    }
	};

	Drupal.behaviors.shantiImagesAdjust = {
	    attach: function (context, settings) {
			if(context == document) {					
				var itemHeight = jQuery(this).closest(".item").height();	
				$('.og-grid .item > a').css("height", itemHeight );				
			}
	    }
	};
}) (jQuery);