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
	





	Drupal.behaviors.popupImageCentering = {
	    attach: function (context, settings) {
			if(context == document) {
				$(".og-img-wrapper").each(function(){
					  //get height and width (unitless) and divide by 2
					  var hWide = ($(this).width())/2; //half the image's width
					  var hTall = ($(this).height())/2; //half the image's height, etc.

					  // attach negative and pixel for CSS rule
					  hWide = '-' + hWide + 'px';
					  hTall = '-' + hTall + 'px';

					  $(this).addClass("js-fix").css({
					    "margin-left" : hWide,
					    "margin-top" : hTall
					  });
				});
			}
	    }
	};




}) (jQuery);