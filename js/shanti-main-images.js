(function ($) {
	Drupal.behaviors.shantiImages = {
	  attach: function (context, settings) {
	  	if(context == document) {
			var $grid = $( '#flex-images' );
			if ($grid.length > 0) {
		  		$grid.imagesLoaded( function() {
		  			$('#flex-images .item ').each(function() {
		  				var img = $(this).find('img');
		  				var imgobj = new Image();
		  				imgobj.src = img.attr('src');
		  				$(this).attr('data-w', imgobj.width);
		  				$(this).attr('data-h', imgobj.height);
		  			});
		  			if (typeof(flexImages) == "function") {
		  				console.log('flex image initializing');
				  		new flexImages({ selector: '#flex-images', rowHeight: 200 });
			  		} else {
			  			console.log(typeof(flexImages));
			  		}
		  			
		  		}); 
			}
	  	 }
	  }
	};
}) (jQuery);
