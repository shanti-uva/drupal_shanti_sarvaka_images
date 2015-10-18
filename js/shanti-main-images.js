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

					
					$(".og-grid > .item:not(.expanded)").click(function(e) {	

						var itemHeight = $(this).closest(".item").height();	
						$(".og-grid > .item:not(.expanded)").closest("a").css("height", itemHeight );

					});				


			}
	    }
	};
}) (jQuery);