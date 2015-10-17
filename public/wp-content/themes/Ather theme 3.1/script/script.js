$(document).ready(function(){
	var mainHeight = $('.wrapper').height();
	var docHeight = $(document).height();
	var headerHeight = $('.headerWrapper').height();
	var footerHeight = $('.footer').height();
	if((headerHeight+mainHeight+footerHeight) < docHeight) {
	$('.footer').addClass('fixFooter');
		mainHeight = docHeight - (headerHeight+footerHeight);
	$('.wrapper').css('height', mainHeight);
	}
});
$(document).ready(function(){
	$('.picture').click(function(){
		$(this).parent().find('.Details').slideToggle("slow");
	});
	$('.name').click(function(){
		$(this).parent().find('.Details').slideToggle("slow");
	});
});