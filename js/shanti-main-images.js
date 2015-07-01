Drupal.behaviors.shantiImages = {
  attach: function (context, settings) {
  	if(context == document) {
  		jQuery(".container.og-grid").rowGrid({itemSelector: ".item", minMargin: 10, maxMargin: 10, firstItemClass: "first-item"});
		
			Grid.init();
			
			var itemHeight = jQuery(this).closest(".item").height();	    
			jQuery(".og-grid .item > a").children("img").attr("height", itemHeight );    
			  
  	}
  }
};