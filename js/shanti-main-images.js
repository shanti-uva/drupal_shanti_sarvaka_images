(function ($) {
	Drupal.behaviors.shantiImages = {
	  attach: function (context, settings) {
	  	if(context == document) {
	  		
				var $grid = $( '#og-grid' );
	  		$grid.imagesLoaded( function() {
	  			$('#og-grid .item ').each(function() {
	  				var img = $(this).find('img');
	  				var imgobj = new Image();
	  				imgobj.src = img.attr('src');
	  				$(this).attr('data-w', imgobj.width);
	  				$(this).attr('data-h', imgobj.height);
	  			});
	  			new flexImages({ selector: '#og-grid', rowHeight: 190 });
	  			/*
		  		$(".container.og-grid").rowGrid({itemSelector: ".item", minMargin: 5, maxMargin: 5, firstItemClass: "first-item"});
					Grid.init();
					*/
	  		}); 
	  		
					// What do these two lines do? "this" does not have a clear referent here
					// May be the problem with images not showing up (MANU-1872) (ndg)
					var itemHeight = jQuery(this).closest(".item").height();	    
					jQuery(".og-grid .item > a").children("img").attr("height", itemHeight );  
					
	  	}
	  }
	};
}) (jQuery);
