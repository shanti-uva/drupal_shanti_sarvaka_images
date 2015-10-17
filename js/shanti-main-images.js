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

					
					$(".og-grid > .item > a").not(".og-grid > .item.expanded > a").click(function(event) {						
						var itemHeight = $(this).closest(".item").height();	
						$(this).css("height", itemHeight );
					});				

			}
	    }
	};
}) (jQuery);