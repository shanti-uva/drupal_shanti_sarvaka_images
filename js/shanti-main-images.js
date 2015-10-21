(function ($) {
	Drupal.behaviors.shantiImages = {
	    attach: function (context, settings) {
			if(context == document) {
				if ($("#og-grid").length > 0) {
					Grid.init();
				}
				setTimeout(function() { $('#admin-menu').slideUp(); $('body').removeClass('admin-menu'); }, 1000);
				$('body').mousemove(function(event) { 
					var x = event.pageX;
					var y = event.pageY; 
					if (y < 50 && x < 200) { 
						if ($('#admin-menu').is(":hidden")) {
							console.log("showing admin menu");
							$('#admin-menu').slideDown(); 
							$('body').addClass('admin-menu');
						}
					} else if (y > 100) { 
						if ($('#admin-menu').is(":visible")) {
							console.log("hiding admin menu");
							setTimeout(function() { $('#admin-menu').slideUp(); $('body').removeClass('admin-menu'); }, 1500);
						} 
					} 
				});
			}
	    }
	};
	





	Drupal.behaviors.popupImageCentering = {
	    attach: function (context, settings) {
			if(context == document) {
				$(".og-img-wrapper img").each(function(){
					  //get height and width (unitless) and divide by 2
					  var hWide = ($(this).width())/2; //half the image's width
					  // var hTall = ($(this).height())/2; //half the image's height, etc.

					  // attach negative and pixel for CSS rule
					  hWide = '-' + hWide + 'px';
					  // hTall = '-' + hTall + 'px';

					  $('.og-img-wrapper').addClass("js-fix").css({
					    "margin-left" : hWide,
					    // "margin-top" : hTall
					  });
				});
			}
	    }
	};




}) (jQuery);