/*
* debouncedresize: special jQuery event that happens once after a window resize
*
* latest version and complete README available on Github:
* https://github.com/louisremi/jquery-smartresize/blob/master/jquery.debouncedresize.js
*
* Copyright 2011 @louis_remi
* Licensed under the MIT license.
*/

(function ($) {
var $event = $.event,
$special,
resizeTimeout;

$special = $event.special.debouncedresize = {
	setup: function() {
		$( this ).on( "resize", $special.handler );
	},
	teardown: function() {
		$( this ).off( "resize", $special.handler );
	},
	handler: function( event, execAsap ) {
		// Save the context
		var context = this,
			args = arguments,
			dispatch = function() {
				// set correct event type
				event.type = "debouncedresize";
				$event.dispatch.apply( context, args );
			};

		if ( resizeTimeout ) {
			clearTimeout( resizeTimeout );
		}

		execAsap ?
			dispatch() :
			resizeTimeout = setTimeout( dispatch, $special.threshold );
	},
	threshold: 250
};

}) (jQuery);

var Grid = (function($) {
	
		// list of items
	var $grid = $( '#og-grid' ),
		// the items
		$items = $grid.children( '.item' ),
		// current expanded item's index
		current = -1,
		// position (top) of the expanded item
		// used to know if the preview will expand in a different row
		previewPos = -1,
		// extra amount of pixels to scroll the window
		scrollExtra = 0,
		// extra margin when expanded (between preview overlay and the next items)
		marginExpanded = 10,
		$window = $( window ), winsize,
		$body = $( 'html, body' ),
		// transitionend events
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		// support for csstransitions
		support = Modernizr.csstransitions,
		// default settings
		settings = {
			minHeight : 500,
			speed : 350,
			easing : 'ease'
		};

	function init( config ) {
		
		// the settings..
		settings = $.extend( true, {}, settings, config );

		imagesLoaded($grid, $.proxy(function() {
			initGridLayout();
			initLightbox();
			// save item´s size and offset
			saveItemInfo( true );
			// get window´s size
			getWinSize();
			// initialize some events
			initEvents();
		}, this));

	}
	
	// Initialize the row Grid layout called from init and on window resize
	function initGridLayout() {
		var res = $("#og-grid").rowGrid({itemSelector: ".item", minMargin: 10, maxMargin: 10, firstItemClass: "first-item"});
		// iterate through grid children (= div.item) and set their <a> heights
		res.children('.item').each(function() {  
			var mya = $(this).children('a').eq(0);
			mya.css( {"height" : $(this).height(), "display" : "block" } );
		});
	}
	
	// Initialization of lightbox by creating list of items.
	function initLightbox() {
		var items = [];
		$("#og-grid .item a").each(function() {
			var data = $(this).attr('data-hugesrc');
			data = data.split("::");
			var item = {
				'src': data[0],
				'w': data[1],
				'h': data[2],
			};
			items.push(item);
		});
		
		Drupal.settings.media_sharedshelf = {'lbitems' : items};
		
	}
	
	// add more items to the grid.
	// the new items need to appended to the grid.
	// after that call Grid.addItems(theItems);
	function addItems( $newitems ) {

		$items = $items.add( $newitems );

		$newitems.each( function() {
			var $item = $( this );
			$item.data( {
				offsetTop : $item.offset().top,
				height : $item.height()
			} );
		} );

		initItemsEvents( $newitems );

	}

	// saves the item´s offset top and height (if saveheight is true)
	function saveItemInfo( saveheight ) {
		$items.each( function() {
			var $item = $( this );
			$item.data( 'offsetTop', $item.offset().top );
			if( saveheight ) {
				$item.data( 'height', $item.height() );
			}
		} );
	}

	function initEvents() {
		
		// when clicking an item, show the preview with the item´s info and large image.
		// close the item if already expanded.
		// also close if clicking on the item´s cross
		initItemsEvents( $items );
		
		// on window resize get the window´s size again
		// reset some values..
		$window.on( 'debouncedresize', function() {
			scrollExtra = 0;
			previewPos = -1;
			// save item´s offset
			saveItemInfo();
			getWinSize();
			var preview = $.data( this, 'preview' );
			if( typeof preview != 'undefined' ) {
				hidePreview();
			}
			initGridLayout();
		} );

	}

	function initItemsEvents( $items ) {
		$items.on( 'click', 'span.og-close', function() {
			hidePreview();
			return false;
		} ).children( 'a' ).on( 'click', function(e) {

			var $item = $( this ).parent();
			// check if item already opened
			current === $item.index() ? hidePreview() : showPreview( $item );
			return false;

		} );
	}

	function getWinSize() {
		winsize = { width : $window.width(), height : $window.height() - 30 };
	}

	function showPreview( $item ) {
		
		var preview = $.data( this, 'preview' ),
			// item´s offset top
			position = $item.data( 'offsetTop' );

		scrollExtra = 0;

		// if a preview exists and previewPos is different (different row) from item´s top then close it
		if( typeof preview != 'undefined' ) {

			// not in the same row
			if( previewPos !== position ) {
				// if position > previewPos then we need to take te current preview´s height in consideration when scrolling the window
				if( position > previewPos ) {
					scrollExtra = preview.height;
				}
				hidePreview();
			}
			// same row
			else {
				preview.update( $item );
				prevNextButtons($item);
				return false;
			}
		}

		// update previewPos
		previewPos = position;
		// initialize new preview for the clicked item
		preview = $.data( this, 'preview', new Preview( $item ) );
		// expand preview overlay
		preview.open();
		prevNextButtons($item);
	}

	function hidePreview() {
		current = -1;
		var preview = $.data( this, 'preview' );
		preview.close();
		$.removeData( this, 'preview' );
	}

	// the preview obj / overlay
	function Preview( $item ) {
		this.$item = $item;
		this.expandedIdx = this.$item.index();
		this.create();
		this.update();
	}
	
	// Enable the previews previous and next buttons
	function prevNextButtons($item) {
		var prevItem = $item.prev();
		if (prevItem.length == 0) {
			prevItem = $item.nextAll().last();
		}
		$('.og-expander .prev').unbind('click').click(function() {
			showPreview(prevItem);
		});
		var nextItem = $item.next();
		if (nextItem.length == 0) {
			nextItem = $('.og-grid .item').eq(0);
		}
		$('.og-expander .next').unbind('click').click(function() {
			showPreview(nextItem);
		});
	}

	Preview.prototype = {
		create : function() {
			// create Preview structure:
			this.$title = $( '<h3></h3>' );
			this.$description = $( '<p></p>' );
			this.$href = $( '<a href="#" class="og-details-more og-view-more"><span class="icon shanticon-list2">Read More</span></a>' );
			this.$lightboxLink = $( '<a href="#" class="lightbox-link btn-lightbox og-view-more"><span class="icon fa-expand">View Full Screen</span></a>' );

			this.$tabs = $('<ul class="nav nav-tabs" role="tablist">' +
	   			'<li role="presentation" class="active"><a href="#desc" aria-controls="desc" role="tab" data-toggle="tab">Description</a></li>' +
	   			'<li role="presentation"><a href="#info" aria-controls="info" role="tab" data-toggle="tab">Details</a></li></ul>');
	   		this.$desctab = $('<div role="tabpanel" class="tab-pane active" id="desc"></div>').append( this.$title, this.$description, this.$lightboxLink);
	   		//this.$photographer = $('<li class="photographer">Photographer</li>');
	   		this.$date = $('<li class="date">Date</li>');
	   		this.$place = $('<li class="place">Place</li>');
	   		this.$creator = $('<li class="creator">Photographer</li>');
	   		this.$dtype = $('<li class="dtype">Type</li>');
	   		this.$ssid = $('<li class="dtype">Shared Shelf ID</li>');
	   		this.$infolist = $('<ul></ul>').append(this.$creator, this.$date, this.$place, this.$dtype, this.$ssid);
	   		this.$infotab = $('<div role="tabpanel" class="tab-pane" id="info"></div>').append(this.$infolist, this.$href);
	   		this.$tabcontent = $('<div class="tab-content"></div>').append(this.$desctab, this.$infotab);
			this.$details = $( '<div class="og-details"></div>' ).append(this.$tabs, this.$tabcontent);
			
			this.$loading = $( '<div class="og-loading"></div>' );
			this.$fullimage = $( '<div class="og-fullimg"></div>' ).append( this.$loading );
			this.$closePreview = $( '<span class="og-close"></span>' );
			
			this.$nextPreview = $( '<span class="next og-nav-arrow"><span class="icon"></span></span>' );
			this.$prevPreview = $( '<span class="prev og-nav-arrow"><span class="icon"></span></span>' );

			this.$previewInner = $( '<div class="og-expander-inner"></div>' ).append( this.$closePreview, this.$nextPreview, this.$prevPreview, this.$fullimage, this.$details );
			this.$previewEl = $( '<div class="og-expander"></div>' ).append( this.$previewInner );
			// append preview element to the item
			this.$item.append( this.getEl() );
			// set the transitions for the preview and the item
			if( support ) {
				this.setTransition();
			}
		},
		update : function( $item ) {

			if( $item ) {
				this.$item = $item;
			}
			
			// if already expanded remove class "og-expanded" from current item and add it to new item
			if( current !== -1 ) {
				var $currentItem = $items.eq( current );
				$currentItem.removeClass( 'og-expanded' );
				this.$item.addClass( 'og-expanded' );
				// position the preview correctly
				this.positionPreview();
			}

			// update current value
			current = this.$item.index();

			// update preview´s content
			var $itemEl = this.$item.children( 'a' ),
				eldata = {
					href : $itemEl.attr( 'href' ),
					largesrc : $itemEl.data( 'largesrc' ),
					hugesrc : $itemEl.data( 'hugesrc' ),
					title : $itemEl.data( 'title' ),
					description : $itemEl.data( 'description' ),
					creator : $itemEl.data( 'creator' ),
					date : $itemEl.data( 'date' ),
					place : $itemEl.data( 'place' ), 
					dtype: $itemEl.data('type'),
					ssid: $itemEl.data('ssid'),
				};

			this.$title.html( eldata.title );
			this.$description.html( eldata.description );
			
			var lnktxt = (eldata.dtype == 'pdf') ? "View PDF" : "Read more ...";
			this.$href.html('<span>' + lnktxt + '</span>').attr( 'href', eldata.href );
			
			this.$creator.html( "<label>Photographer:</label> " + eldata.creator );
			this.$date.html( "<label>Date:</label> " + eldata.date );
			this.$place.html( "<label>Location:</label> " + eldata.place );
			this.$dtype.html("<label>Type:</label> " + eldata.dtype);
			this.$ssid.html("<label>Shared Shelf ID:</label> " + eldata.ssid);


			var self = this;
			
			// remove the current image in the preview
			if( typeof self.$largeImg != 'undefined' ) {
				self.$largeImg.remove();
			}

			// preload large image and add it to the preview
			// for smaller screens we don´t display the large image (the media query will hide the fullimage wrapper)
			if( self.$fullimage.is( ':visible' ) ) {
				this.$loading.show();
				$( '<img/>' ).load( function() {
					var $img = $( this ); 
					if( $img.attr( 'src' ) === self.$item.children('a').data( 'largesrc' ) ) {
						//self.$loading.hide();
						self.$fullimage.find( 'img' ).remove();
						self.$fullimage.find('.og-img-wrapper').remove();
						self.$largeImgDiv = $('<div class="og-img-wrapper"></div>');
						self.$largeImg = $( '<a href="#" class="lightbox-img-link"></a>' );
						
						self.$largeImgDiv.append(self.$largeImg);
						self.$largeImg.append( $img.fadeIn( 100 ));
						self.$fullimage.append( self.$largeImgDiv );
						// Find the lightbox icon and enable click to initiate gallery
						$("a.lightbox-link, a.lightbox-img-link").click(function(event) {
							event.preventDefault();
       						var pswpElement = document.querySelectorAll('.pswp')[0];
       						var iind = self.$item.prevAll().length;
							var options = { index: iind, getNumItemsFn: function() { return Drupal.settings.sarvaka_image_gallery.total_items; }};
							Drupal.settings.media_sharedshelf.gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, Drupal.settings.media_sharedshelf.lbitems, options);
							Drupal.settings.media_sharedshelf.gallery.init();
							Drupal.settings.media_sharedshelf.gallery.goTo(iind);
							var iteminfo = Drupal.settings.sarvaka_image_gallery,
									  incr = parseInt(iteminfo.items_per_page) * parseInt(iteminfo.page_number),
								 	  pts = $('.pswp__counter').text().split(' / ');
							pts[0] = iind + incr + 1;
							$('.pswp__counter').text(pts.join(' / '));
								
							// Adjust current item number based on pagination after markup change
							Drupal.settings.media_sharedshelf.gallery.listen('afterChange', function() {
								var iteminfo = Drupal.settings.sarvaka_image_gallery,
									  incr = parseInt(iteminfo.items_per_page) * parseInt(iteminfo.page_number),
								 	  pts = $('.pswp__counter').text().split(' / '),
									  index = this.items.indexOf(this.currItem) + 1;
								pts[0] = index + incr;
								$('.pswp__counter').text(pts.join(' / '));
								
							});
						});
						setTimeout(function() {
							 jQuery(".og-img-wrapper img").popupImageCentering();
						}, 300);
					}
				}).attr( 'src', eldata.largesrc );	
			}

		},
		open : function() {

			setTimeout( $.proxy( function() {	
				// set the height for the preview and the item
				this.setHeights();
				// scroll to position the preview in the right place
				this.positionPreview();
			}, this ), 25 );

		},
		close : function() {

			var self = this,
				onEndFn = function() {
					if( support ) {
						$( this ).off( transEndEventName );
					}
					self.$item.removeClass( 'og-expanded' );
					self.$previewEl.remove();
				};

			setTimeout( $.proxy( function() {

				if( typeof this.$largeImg !== 'undefined' ) {
					this.$largeImg.fadeOut( 'fast' );
				}
				this.$previewEl.css( 'height', 0 );
				// the current expanded item (might be different from this.$item)
				var $expandedItem = $items.eq( this.expandedIdx );
				$expandedItem.css( 'height', $expandedItem.data( 'height' ) ).on( transEndEventName, onEndFn );

				if( !support ) {
					onEndFn.call();
				}

			}, this ), 25 );
			
			return false;

		},
		calcHeight : function() {

			var heightPreview = winsize.height - this.$item.data( 'height' ) - marginExpanded,
				itemHeight = winsize.height;

			if( heightPreview < settings.minHeight ) {
				heightPreview = settings.minHeight;
				itemHeight = settings.minHeight + this.$item.data( 'height' ) + marginExpanded;
			}

			this.height = heightPreview;
			this.itemHeight = itemHeight;

		},
		setHeights : function() {

			var self = this,
				onEndFn = function() {
					if( support ) {
						self.$item.off( transEndEventName );
					}
					self.$item.addClass( 'og-expanded' );
				};

			this.calcHeight();
			this.$previewEl.css( 'height', this.height );
			this.$item.css( 'height', this.itemHeight ).on( transEndEventName, onEndFn );

			if( !support ) {
				onEndFn.call();
			}

		},
		positionPreview : function() {

			// scroll page
			// case 1 : preview height + item height fits in window´s height
			// case 2 : preview height + item height does not fit in window´s height and preview height is smaller than window´s height
			// case 3 : preview height + item height does not fit in window´s height and preview height is bigger than window´s height
			var position = this.$item.data( 'offsetTop' ),
				previewOffsetT = this.$previewEl.offset().top - scrollExtra,
				scrollVal = this.height + this.$item.data( 'height' ) + marginExpanded <= winsize.height ? position : this.height < winsize.height ? previewOffsetT - ( winsize.height - this.height ) : previewOffsetT;
			
			$body.animate( { scrollTop : scrollVal }, settings.speed );

		},
		setTransition  : function() {
			this.$previewEl.css( 'transition', 'height ' + settings.speed + 'ms ' + settings.easing );
			this.$item.css( 'transition', 'height ' + settings.speed + 'ms ' + settings.easing );
		},
		getEl : function() {
			return this.$previewEl;
		}
	};

	return { 
		init : init,
		addItems : addItems
	};

}) (jQuery);