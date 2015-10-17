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

					var itemHeight = $(this).closest(".item").height();	

					$(".og-grid > .item:not(.expanded)").click(function(e) {						
						$(this).next("a").css("height", itemHeight );
					});				

					$(".og-grid > .item > a").css("height", itemHeight );
			}
	    }
	};
}) (jQuery);