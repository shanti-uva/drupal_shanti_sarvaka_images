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


	Drupal.behaviors.shantiImages = {
	    attach: function (context, settings) {
			if(context == document) {
				
				$('.item').on( 'click', '.next', function() {

			    	$(this).hidePreview();
			    	
			    	var nextPreview = $(this).parent('.item').next();

			        $nextPreview.showPreview();

			    });
			}
	    }
	};


}) (jQuery);