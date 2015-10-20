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


	Drupal.behaviors.shantiImagesNavPreview = {
	    attach: function (context, settings) {
			if(context == document) {
						    
			    $('.next').on( 'click', function() {
		    		// var thisPreview = $(this).parent('.item');
		    		// var nextPreview = $(this).parent('.item').next();

		    		// $thisPreview.hidePreview();
		        	// $nextPreview.showPreview();

        			current = -1;
					var preview = $.data( this, 'preview' );
					preview.close();
					$.removeData( this, 'preview' );
		        });
		    
			}
	    }
	};


}) (jQuery);