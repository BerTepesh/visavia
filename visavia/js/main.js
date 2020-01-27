let setProgress = function() {
  $(".anim-section").each(function(){
    let section = $(this).offset().top;
    let viewSpot = $(window).scrollTop() + $(window).height()/1.3;
    if(viewSpot > section) {
      $(this).addClass("active");
    }
  })
};
$(document).ready(() => {
  if($(window).scrollTop() > 0) {
    $(".scrolldown").removeClass("active");
  }
  setProgress();
});
$(window).scroll(() => {
  if($(window).scrollTop() > 0) {
    $(".scrolldown").removeClass("active");
  } else {
    $(".scrolldown").addClass("active");
  }
  setProgress();
});
$(".ham-menu-trigger").click(() => {
  $(".ham-menu").toggleClass("active");
  $(".ham-menu-trigger").toggleClass("ham-menu-trigger_close")
});
$(".amount__btn").click(function(){
  let num = $(this).closest(".amount").find(".amount__number");
  if($(this).hasClass("amount__btn_minus") && num.val() > 0) {
    num.val(num.val() - 1);
  } else if($(this).hasClass("amount__btn_plus")) {
    num.val(parseInt(num.val()) + 1);
  }
});
$(window).on('load resize', function() {
  $(".slider__holder").slick({
    arrows: true,
    dots: false,
    slidesToShow: 1,
    swipeToSlide: true,
    accessibility: false,
    infinite: false,
    autoplay: true,
    speed: 900,
    prevArrow: '<button type="button" class="prev"><div class="btn"><div class="btn__holder"><svg class="icon-arrow"><use xlink:href="img/svg/symbol/sprite.svg#arrow"></use></svg></div></div></button>',
    nextArrow: '<button type="button" class="next"><div class="btn"><div class="btn__holder"><svg class="icon-arrow"><use xlink:href="img/svg/symbol/sprite.svg#arrow"></use></svg></div></div></button>',
    appendArrows: $('.slider__nav')
  });
});