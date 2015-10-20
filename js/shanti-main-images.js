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


	Drupal.behaviors.shantiImagesPreviewNav = {
	    attach: function (context, settings) {
			if(context == document) {
				
				$('.item').on( 'click', '.next', function() {

			    	var thisPreview = $(this).parent('.item');
			    	var nextPreview = $(this).parent('.item').next();

			    	$thisPreview.hidePreview();

			        $nextPreview.showPreview();

			    });
			}
	    }
	};


}) (jQuery);