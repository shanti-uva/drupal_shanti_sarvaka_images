(function ($) {
	Drupal.behaviors.shantiImages = {
	    attach: function (context, settings) {
			if(context == document) {
				if ($("#og-grid").length > 0) {
					Grid.init();
				}
				
				// Code to hide Admin menu when cursor not in upper right
				setTimeout(function() { $('#admin-menu').slideUp(); $('body').removeClass('admin-menu'); }, 1000);
				$('body').mousemove(function(event) { 
					var x = event.pageX;
					var y = event.pageY; 
					if (y < 50 && x < 200) { 
						if ($('#admin-menu').is(":hidden")) {
							$('#admin-menu').slideDown(); 
							$('body').addClass('admin-menu');
						}
					} else if (y > 200) { 
						if ($('#admin-menu').is(":visible")) {
							setTimeout(function() { $('#admin-menu').slideUp(); $('body').removeClass('admin-menu'); }, 15000);
						} 
					} 
				});
			}
	    }
	};
	



/*

	Drupal.behaviors.popupImageCentering = {
	    attach: function (context, settings) {
			if(context == document) {
				$(".og-img-wrapper img").each(function(){
					  //get height and width (unitless) and divide by 2
					  var hWide = ($(this).width())/2; //half the image's width
					  var hTall = ($(this).height())/2; //half the image's height, etc.

					  // attach negative and pixel for CSS rule
					  hWide = '-' + hWide + 'px';
					  hTall = '-' + hTall + 'px';

					  $(".og-img-wrapper").css("margin-left", hWide );
					  $(".og-img-wrapper").css("margin-top", hTall );
				});
			}
	    }
	};

*/



}) (jQuery);





