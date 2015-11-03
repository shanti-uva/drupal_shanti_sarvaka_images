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
	
	
	
    $.fn.popupImageCentering = function() {
		return this.each(function() {
				console.log($(this));
				console.log('img wide: ' + $(this).width() + ' tall: ' + $(this).height());
				console.log('og fullimg height: ' + $('.og-fullimg').height());
				var imgwd = $(this).width();
				var imght = $(this).height();
				var ogfimg = $(this).parents('.og-fullimg');
				var cnthgt = ogfimg.height();
				if (imght < cnthgt - 30) {
					var totalpad = cnthgt - imght;
					var tmarg = (totalpad / 2) + "px";
					console.log("top margin: " + tmarg);
					$(this).css("margin-top", tmarg );
				}
				
				/*var hWide = ($(this).width())/2; //half the image's width
				var hTall = ($(this).height())/2; //half the image's height, etc.
				
				// attach negative and pixel for CSS rule
				hWide = '-' + hWide + 'px';
				hTall = '-' + hTall + 'px';
				console.log('wide: ' + hWide + ' tall: ' + hTall);
				$(this).css("margin-left", hWide ); 
				$(this).css("margin-top", hTall );*/
			});
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
					console.log('wide: ' + hWide + ' tall: ' + hTall);
					  $(".og-img-wrapper").css("margin-left", hWide );
					  $(".og-img-wrapper").css("margin-top", hTall );
				});
			}
	    }
	};



*/

}) (jQuery);





