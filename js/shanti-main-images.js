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
}) (jQuery);

(function ($) {
	Drupal.behaviors.shantiImagesAdjust = {
	    attach: function (context, settings) {
			if(context == document) {

					jQuery(".og-grid > .item > a:not(.expanded)").click(function(event) {						
						var itemHeight = jQuery(this).closest(".item").height();	
						$(this).css("height", itemHeight );
					});					

			}
	    }
	};
}) (jQuery);