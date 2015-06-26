/**
 * @file
 * Initialize the grid on the home page
 */
(function ($) {
	
		$(document).ready(function(){
      /* Start rowGrid.js */
      $(".container").rowGrid({itemSelector: ".item", minMargin: 10, maxMargin: 10, firstItemClass: "first-item"});
    });
    
    $(document).ready(function(){
				Grid.init();
	  });  
	  
	 $(document).ready(function(){
	    var itemHeight = $(this).closest('.item').height();	    
	    $('.og-grid .item > a').children('img').attr('height', itemHeight );    
	    
	    // --- Than - we need some form of the following for resize
	    // $(window).bind('load resize orientationchange', galleryGrid_Refresh );  
  
	  });
}) (jQuery);
