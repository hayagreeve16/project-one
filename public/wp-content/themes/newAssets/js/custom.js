// Center Elements

// function center() {};
// center.prototype = {
//   init: function(elem) {
// 	    elem.css("position","absolute");
// 	    // elem.css("top", Math.max(0, (($(window).height() - $(elem).outerHeight()) / 2) + 
// 	    //                                             $(window).scrollTop()) + "px");
// 	    elem.css("left", Math.max(0, (($(window).width() - $(elem).outerWidth()) / 2) + 
// 	                                                $(window).scrollLeft()) + "px");
// 	    return elem;
//   },
//   destroy: function(elem) {
// 	    elem.css("position","");
// 	    // elem.css("top", Math.max(0, (($(window).height() - $(elem).outerHeight()) / 2) + 
// 	    //                                             $(window).scrollTop()) + "px");
// 	    elem.css("left", '');
// 	    return elem; 
//   }
// };

jQuery.fn.center = function () {
    this.css("position","absolute");
    // this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
    //                                             $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}







// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = [37, 38, 39, 40];

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function keydown(e) {
    for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
        }
    }
}

function wheel(e) {
  preventDefault(e);
}

function disable_scroll() {
  if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', wheel, false);
  }
  window.onmousewheel = document.onmousewheel = wheel;
  document.onkeydown = keydown;
}

function enable_scroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = document.onkeydown = null;  
}







// Disable Stuff for touch devices
var md = new MobileDetect(window.navigator.userAgent);
function detectTouch() {
	if ( (Modernizr.touch) && (md.mobile()) ) { // Touch mobiles
		// Disable Scrolljacking
		firstScroll = false;
		if(!$('body').hasClass('is-touch')) {
			$('body').addClass('is-touch');
		}
	}
}




var lastScrollTop = 0;
var firstScroll;
var pos;
function firstScrolljack() {
	firstScroll = true;
	$(window).on('scroll', function(){
		detectTouch();
		if(!$('body').hasClass('max767')){
			pos = $(window).scrollTop();


			if (pos > lastScrollTop){
			   // downscroll code
			   // console.log('scrolling down');

				if(firstScroll) {
					// alert('first')
					$('html, body').animate({scrollTop : 100},
						{
							progress: function() {
								disable_scroll();
							},
							complete: function() {
								enable_scroll();
							}
						}, 800);
					firstScroll = false;
				}

			} else {
				// upscroll code
				// console.log('scrolling up');

				firstScroll = false;
				if(pos === 0) {
					firstScroll = true;
				}
			}
			lastScrollTop = pos;


			// if(firstScroll) {
			// 	// alert('first')
			// 	$('html, body').animate({scrollTop : 100},800);
			// 	firstScroll = false;
			// }

			// console.log(pos)

			// if(pos === 0) {
			// 	firstScroll = true;
			// }
		}

	});
}






// function sliderImg() {};
// sliderImg.prototype = {
//   init: function(element, elementHeight) {
// 	$(element).css('width', $('.slider-image.bottom-image img').width())
// 	$(elementHeight).css('height', $('.slider-image.bottom-image img').height())
// 	// $(element).center();
// 	img_center = new center();
// 	img_center.init($(element));
//   },
//   destroy: function(element, elementHeight) {
// 	$(element).css('width', '')
// 	$(elementHeight).css('height', '')
// 	// $(element).center();
// 	img_center = new center();
// 	img_center.destroy($(element));
//   }
// };

function sliderImg(element, elementHeight) {
	$(element).css('width', $('.slider-image.bottom-image img').width())
	$(elementHeight).css('height', $('.slider-image.bottom-image img').height())
	$(element).center();
}

function alignImages() {
	var alignHeroImagesVertical = $(window).height() - $('.slider-image.top-image img').height();
	$('.slider-image img').each(function(){
		$(this).css('margin-top', alignHeroImagesVertical/2)
	})
	$('.sp-wrapper.mainpointers').each(function(){
		$(this).css('margin-top', alignHeroImagesVertical/2)
	})
}



// Is element Visible
function checkPosition(container, offset) {
    container.each(function(){
        var actualContainer = $(this);
        if( $(window).scrollTop() + $(window).height()*offset > actualContainer.offset().top) {
            actualContainer.addClass('is-visible');
        }
    });
}


function drags(dragElement, resizeElement, container, labelContainer, labelResizeElement) {
    dragElement.on("mousedown vmousedown", function(e) {
        dragElement.addClass('draggable');
        resizeElement.addClass('resizable');
        container.addClass('dragon');

        var dragWidth = dragElement.outerWidth(),
            xPosition = dragElement.offset().left + dragWidth - e.pageX,
            containerOffset = container.offset().left,
            containerWidth = container.outerWidth(),
            minLeft = containerOffset + 10,
            maxLeft = containerOffset + containerWidth - dragWidth - 10;
        
        dragElement.parents().on("mousemove vmousemove", function(e) {
            leftValue = e.pageX + xPosition - dragWidth;
            
            //constrain the draggable element to move inside his container
            if(leftValue < minLeft ) {
                leftValue = minLeft;
            } else if ( leftValue > maxLeft) {
                leftValue = maxLeft;
            }

            widthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth+'%';
            
            $('.draggable').css('left', widthValue).on("mouseup vmouseup", function() {
                $(this).removeClass('draggable');
                resizeElement.removeClass('resizable');
            });

            $('.resizable').css('width', widthValue);

            updateLabel(labelResizeElement, resizeElement, 'left');
            updateLabel(labelContainer, resizeElement, 'right');
            
        }).on("mouseup vmouseup", function(e){
            dragElement.removeClass('draggable');
            resizeElement.removeClass('resizable');
            container.removeClass('dragon');
        });
        e.preventDefault();
    }).on("mouseup vmouseup", function(e) {
        dragElement.removeClass('draggable');
        resizeElement.removeClass('resizable');
        container.removeClass('dragon');
    });
}

function updateLabel(label, resizeElement, position) {
    if(position == 'left') {
        ( label.offset().left + label.outerWidth() < resizeElement.offset().left + resizeElement.outerWidth() ) ? label.removeClass('is-hidden') : label.addClass('is-hidden') ;
    } else {
        ( label.offset().left > resizeElement.offset().left + resizeElement.outerWidth() ) ? label.removeClass('is-hidden') : label.addClass('is-hidden') ;
    }
}


function reset() {

	// alignImages()
	$('.slider-image img').each(function(){
		$(this).css('margin-top', '')
	})
	$('.sp-wrapper').each(function(){
		$(this).css('margin-top', '')
	})


	// sliderImg() & center()
	$('.slider-image.top-image img').each(function(){
		$(this).css({
			'width': '',
			'height': '',
			'left': '',
			'position': ''
		})
	})
	$('.sp-wrapper').each(function(){
		$(this).css({
			'width': '',
			'height': '',
			'left': '',
			'position': ''
		})
	})

	// Disable scrolljack
	// firstScroll = false;

	

}




$(document).ready(function(){


$('.sp-wrapper').css('height', ($(window).width()*0.3148)+'px')
$(window).load(function(){
	$('.sp-wrapper').css('height', ($(window).width()*0.3148)+'px')
	$('.herounit-p2 img').css('margin-top', (($(window).width()*0.3148)/2)+'px')
})







// top_imgSlider = new sliderImg();
// top_imgSlider.init($('.slider-image.top-image img'));
// sp_wrapperSlider = new sliderImg();
// sp_wrapperSlider.init($('.sp-wrapper'),$('.sp-wrapper'));
sliderImg('.slider-image.top-image img');
sliderImg('.sp-wrapper.mainpointers', '.sp-wrapper.mainpointers');
$('.hero-sliderImage-block').css('height', $(window).height());

$(window).on('resize', function(){
	// top_imgSlider.init($('.slider-image.top-image img'));
	// sp_wrapperSlider.init($('.sp-wrapper'),$('.sp-wrapper'));
    sliderImg('.slider-image.top-image img');
    sliderImg('.sp-wrapper.mainpointers', '.sp-wrapper.mainpointers');
    alignImages();
    $('.hero-sliderImage-block').css('height', $(window).height());

});
$(window).on('load', function(){
    alignImages();
});
// alignImages();








controller = new ScrollMagic();
// Hero Unit Pin Animation
// var hero_tl = new TimelineLite({smoothChildTiming: true});


//from




var hero_scroll = new ScrollScene({triggerElement: ".hero-unit", duration: 300, triggerHook: 'onLeave', tweenChanges: true})
      .setPin(".hero-unit")
      // .setTween(hero_tl)
      .addTo(controller);


var heroBike = $('.hero-unit .herounit-p2');
var heroTextTop = $('.hero-unit .hero-bigtext .hero-bt-top');
var heroTextBottom = $('.hero-unit .hero-bigtext .hero-bt-bottom');

// var hero_reverse_progress;
hero_scroll.on("start", function (event) {
    $('.hero-unit').addClass('hero-anim-start');
    // hero_reverse_progress = 0;
});
hero_scroll.on("leave", function (event) {
    $('.hero-unit').removeClass('hero-anim-start');
});
hero_scroll.on("end", function (event) {
    $('.hero-unit').addClass('hero-anim-end');
    // hero_reverse_progress = 1;

});

hero_scroll.on("progress", function (event) {
	if($('.hero-unit').hasClass('hero-anim-end')) {
		$('.hero-unit').removeClass('hero-anim-end');
	}
	hero_progress = hero_scroll.progress();

	if(hero_progress<=0) {
		// hero_reverse_progress = 0;
		$('.hero-unit').addClass('anim-initial');
		$('.hero-unit').removeClass('anim-progress');
	} else {
		$('.hero-unit').removeClass('anim-initial');
		$('.hero-unit').addClass('anim-progress');
	}

	if($('.hero-unit').hasClass('anim-progress')) {
		$('.nav-container').addClass('hide-nav');
	} else if($('.hero-unit').hasClass('anim-initial') || $('.hero-unit').hasClass('hero-anim-end')) {
		$('.nav-container').removeClass('hide-nav');
	}

	// if(hero_progress<hero_reverse_progress) {
	// 	$('.hero-unit').removeClass('anim-progress');
	// 	$('.hero-unit').removeClass('hero-anim-end');
	// 	$('.hero-unit').addClass('anim-initial');
	// }
    
})




// On Landing limit first scroll
//firstScrolljack();

// $(".nav-item-3 a").click(function() {
// 	firstScroll = false;
//     $('html, body').animate({
//         scrollTop: $(".blog-press-wrapper").offset().top
//     }, 2000);
// });

if(window.location.hash){
   if(window.location.hash=="#demo"){
	//alert("goto demo");     
	};	
};

$(".nav-item-4 a").click(function() {
	firstScroll = false;
    $('html, body').animate({
        scrollTop: $(".demo-wrapper").offset().top
    }, 2000);
});

////


// If safari add a class
if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {$('body').addClass('safari-yu-no-image-in-svg');}



// Hero UNit Slider

$('.ba-bike-slider').each(function(){
    var actual = $(this);
    drags(actual.find('.ba-handle'), actual.find('.slider-image.top-image'), actual, actual.find('.cd-image-label[data-type="beauty"]'), actual.find('.cd-image-label[data-type="engineered"]'));
});



// Set Min height for icons
(function($){
	function equalizeHeights(selector) {
		var heights = new Array();

		// Loop to get all element heights
		$(selector).each(function() {

			// Need to let sizes be whatever they want so no overflow on resize
			$(this).css('min-height', '0');
			$(this).css('max-height', 'none');
			$(this).css('height', 'auto');

			// Then add size (no units) to array
	 		heights.push($(this).height());
		});

		// Find max height of all elements
		var max = Math.max.apply( Math, heights );

		// Set all heights to max height
		$(selector).each(function() {
			$(this).css('min-height', max + 'px');
		});	
	}

	$(window).load(function() {
		// Fix heights on page load
		equalizeHeights('.feature-icon-block');

		// Fix heights on window resize
		$(window).resize(function() {

			// Needs to be a timeout function so it doesn't fire every ms of resize
			setTimeout(function() {
	      		equalizeHeights('.feature-icon-block');
			}, 120);
		});
	});
})(jQuery);







// Waypoints
$('.section-2-wrapper')
.waypoint(function(direction) { 
  if (direction === 'down') {
  	$(this).addClass('is-visible')
  }
}, { offset: '40%' })
.waypoint(function(direction) {
  if (direction === 'up') {
  	$(this).removeClass('is-visible')
  }
}, { offset: '60%' });



$('.battery-pack-wrapper')
.waypoint(function(direction) { 
  if (direction === 'down') {
  	$(this).addClass('is-visible')
  }
}, { offset: '40%' })
.waypoint(function(direction) {
  if (direction === 'up') {
  	$(this).removeClass('is-visible')
  }
}, { offset: '60%' });



$('#isw-3')
.waypoint(function(direction) { 
  if (direction === 'down') {
  	$(this).addClass('is-visible')
  }
}, { offset: '90%' })
.waypoint(function(direction) {
  if (direction === 'up') {
  	$(this).removeClass('is-visible')
  }
}, { offset: '10%' });
// End of waypoints



$(window).on('scroll', function(){
    // checkPosition($('.sec2-image-anim'), 0.2);
    // getSliderWidth = $('.slider-image.top-image')[0].style.width;

});








$('.herounit-p2').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
	checkPosition($('.herounit-p2'), 0.001);
});













// Media queries to disable scrollmagic | Enquirejs



var maxQuery = "(max-width: 767px)",
	maxHandle = {
	    setup : function(){
			$('body').addClass('max767');
			var enabled = controller.enabled();

			alignImages();
	    },
	    match : function(){
			$('body').addClass('max767');
			// Disable ScrollMagic controller
			controller.enabled(false);







			// top_imgSlider.destroy($('.slider-image.top-image img'));
			// sp_wrapperSlider.destroy($('.sp-wrapper'),$('.sp-wrapper'));
			$(window).on('resize load ready', function(){
				// top_imgSlider.destroy($('.slider-image.top-image img'));
				// sp_wrapperSlider.destroy($('.sp-wrapper'),$('.sp-wrapper'));
				reset();
				$('.hero-sliderImage-block').css('height', '');
			})





			// Hamburger Menu
			$('.hamburger-nav').on('click', function(){
			  if(!$(this).hasClass('open')) {
			    $(this).addClass('open');
			    $(this).removeClass('close');
			    $('.nav-overlay-wrapper').addClass('open');
			    $('.nav-overlay-wrapper').removeClass('close');
			    $('.hamburger-menu-wrapper').addClass('open');
			    $('.hamburger-menu-wrapper').removeClass('close');
			  } else if(!$(this).hasClass('close')) {
			    $(this).addClass('close');
			    $(this).removeClass('open');
			    $('.nav-overlay-wrapper').addClass('close');
			    $('.nav-overlay-wrapper').removeClass('open');
			    $('.hamburger-menu-wrapper').addClass('close');
			    $('.hamburger-menu-wrapper').removeClass('open');  
			  }
			});

			$('.nav-overlay-wrapper .nav-item .ni-inside a').each(function(){
				$(this).on('click', function(){
					if(!$('.hamburger-nav').hasClass('close')) {
					    $('.hamburger-nav').addClass('close');
					    $('.hamburger-nav').removeClass('open');
					    $('.nav-overlay-wrapper').addClass('close');
					    $('.nav-overlay-wrapper').removeClass('open');
					    $('.hamburger-menu-wrapper').addClass('close');
					    $('.hamburger-menu-wrapper').removeClass('open');  
					  }
				})
			})






	    },
	    unmatch : function(){
			$('body').removeClass('max767');
			// Enable ScrollMagic controller
			controller.enabled(true);

			// top_imgSlider.init($('.slider-image.top-image img'));
			// sp_wrapperSlider.init($('.sp-wrapper'),$('.sp-wrapper'));
			sliderImg('.slider-image.top-image img');
			sliderImg('.sp-wrapper.mainpointers', '.sp-wrapper.mainpointers');
			alignImages();
			$('.hero-sliderImage-block').css('height', $(window).height());
			
			$(window).on('resize', function(){
				// top_imgSlider.init($('.slider-image.top-image img'));
				// sp_wrapperSlider.init($('.sp-wrapper'),$('.sp-wrapper'));
				// alignImages();
			    sliderImg('.slider-image.top-image img');
			    sliderImg('.sp-wrapper.mainpointers', '.sp-wrapper.mainpointers');
			    alignImages();
			    $('.hero-sliderImage-block').css('height', $(window).height());
			})




	    },
	    deferSetup: true
	},
	orientation_query = "(min-width: 768px) and (orientation: portrait)",
	orientation_handle = {
	    setup : function(){
			$('body').addClass('max767');
			var enabled = controller.enabled();
			alignImages();
	    },
	    match : function(){
			$('body').addClass('max767');
			// Disable ScrollMagic controller
			controller.enabled(false);
			$(window).on('resize load ready', function(){
				reset();
				$('.hero-sliderImage-block').css('height', '');
			})
			// paddingOffset = $('.scrollmagic-pin-spacer').css('padding-bottom');
			// $('.sp-wrapper-mobile').css('margin-top', -(parseInt(paddingOffset)-50));

	    },
	    unmatch : function(){
			$('body').removeClass('max767');
			// Enable ScrollMagic controller
			controller.enabled(true);

			sliderImg('.slider-image.top-image img');
			sliderImg('.sp-wrapper.mainpointers', '.sp-wrapper.mainpointers');
			alignImages();
			$('.hero-sliderImage-block').css('height', $(window).height());
			
			$(window).on('resize', function(){
			    sliderImg('.slider-image.top-image img');
			    sliderImg('.sp-wrapper.mainpointers', '.sp-wrapper.mainpointers');
			    alignImages();
			    $('.hero-sliderImage-block').css('height', $(window).height());
			})
			$('.sp-wrapper-mobile').css('margin-top', '');
	    },
	    deferSetup: true
	};
	
	enquire.register(maxQuery, maxHandle);
	enquire.register(orientation_query, orientation_handle);








// balaji Main Signup form
$('.balaji-form .demoNewsletter input').on('click', function(){
	if($(this).is(':checked')) {
		$('.balaji-form .demo input').prop('checked', false);
	} else {
		$('.balaji-form .demo input').prop('checked', true);
	}
})





}) //End of document.ready





