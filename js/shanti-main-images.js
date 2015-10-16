(function ($) {
	Drupal.behaviors.shantiImages = {
	    attach: function (context, settings) {
			if(context == document) {
				if ($("#og-grid").length > 0) {
					$("#og-grid").rowGrid({itemSelector: ".item", minMargin: 10, maxMargin: 10, firstItemClass: "first-item"});
					setTimeout( $.proxy(function() {
						$('#og-grid items').attr('style', '');
						$('#og-grid items img').attr('width', '');
						Grid.init();
						var itemHeight = jQuery(this).closest(".item").height();	 
						$("#og-grid .item > a").children("img").attr("height", itemHeight );
					}, this), 1000);
				}
			}
	    }
	};
}) (jQuery);