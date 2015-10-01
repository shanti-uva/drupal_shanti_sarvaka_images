(function($) {
	Drupal.behaviors.shantiImages = {
		attach: function (context, settings) {
			if(context == document) {
				$("#og-grid").rowGrid({itemSelector: ".item", minMargin: 10, maxMargin: 15, firstItemClass: "first-item"});
				Grid.init();
				var itemHeight = jQuery(this).closest(".item").height();	    
				$("#og-grid .item > a").children("img").attr("height", itemHeight );    
			}
		}
	};
}) (jQuery);