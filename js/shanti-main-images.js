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

					
					$(".og-grid > .item:not(.og-expanded)").click(function(e) {	

						var itemHeight = $(this).closest(".item").height();	
						$(this).find("a").css("height", itemHeight );

					});				


			}
	    }
	};
}) (jQuery);