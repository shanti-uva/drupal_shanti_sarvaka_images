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

					// var test = $(".og-grid > .item > a").not(".og-grid > .item.og-expanded > a");
					
					$(".og-grid > .item > a").click(function(e) {	

						var itemHeight = $(".og-grid > .item > a").closest(".item").height();	
						
						$(this).css( {"height" : itemHeight, "display" : "block" });

					});				


			}
	    }
	};
}) (jQuery);