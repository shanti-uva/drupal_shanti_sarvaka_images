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
					var targetAnchor = $(".og-grid > .item > a").not(".og-grid > .item.expanded > a");
					
					$(".og-grid > .item > a").not(".og-grid > .item.expanded > a").click(function(event) {						
						
						$(this).css("height", itemHeight );
					});				

			}
	    }
	};
}) (jQuery);