function removeTabIndex(element) {
    element.find("a").attr("tabindex", -1);
    element.find(".focus-enter").attr("tabindex", -1);
    element.find(".hide-tab").attr("tabindex", -1);
    element.attr("aria-hidden", true);
}

function addTabIndex(element) {
    element.find("a").attr("tabindex", 0);
    element.find(".focus-enter").attr("tabindex", 0);

    element.find(".hide-tab").attr("tabindex", 0);
    element.attr("aria-hidden", false);
}

function hideNav() {
    $("html").removeClass("nav-active");
    $("html").addClass("nav-removed");
    removeTabIndex($(".quick-links"));
    addTabIndex($("article"));
}

function hidePortfolio() {
    var index = $(".portfolio-detail-entry.active").index();
    $("html").removeClass("portfolio-active")
    $("html").addClass("portfolio-removed");
    $(".portfolio-detail-entry.active").removeClass("active");
    addTabIndex($("article"));
    removeTabIndex($(".portfolio-detail-entry"));
    $(".portfolio-utility-buttons a").attr("href", "");
    removeTabIndex($(".portfolio-utility-buttons"));
    return index;
}

function openPortfolio(target) {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh+"px");
    var element = $(".portfolio-detail-entry:eq("+target+")");
    var offset = element.offset().top-$(".portfolio-detail").offset().top+$(".portfolio-detail").scrollTop();
    var image = element.find(".hex-container.image .rotate-container").css("background-image");
    var link = element.find(".hex-container.link a").attr("href");
    var trophy = element.find(".hex-container.trophy a").attr("href");
    $(".portfolio-detail").scrollTop(offset);
    element.addClass("active");
    $("html").addClass("portfolio-active").removeClass("nav-removed portfolio-removed");
    if($(window).width() >= 1000) {
        addTabIndex(element);    
    } else {
        element.attr("aria-hidden", false);
        $(".portfolio-utility-buttons .image .rotate-container").css("background-image", image);
        $(".portfolio-utility-buttons .link a").attr("href", link);
        if(trophy != null) {
            $(".portfolio-utility-buttons .hex-container.trophy").removeClass("hidden");
            $(".portfolio-utility-buttons .trophy a").attr("href", trophy).attr("tabindex", "0");      
        } else {
            $(".portfolio-utility-buttons .hex-container.trophy").addClass("hidden");
            $(".portfolio-utility-buttons .trophy a").attr("href", "").attr("tabindex", "-1");   
        }
        if(link != null) {
            $(".portfolio-utility-buttons .hex-container.link").removeClass("hidden");
            $(".portfolio-utility-buttons .link a").attr("href", link).attr("tabindex", "0");      
        } else {
            $(".portfolio-utility-buttons .hex-container.link").addClass("hidden");
            $(".portfolio-utility-buttons .link a").attr("href", "").attr("tabindex", "-1");  
        }
    }
    removeTabIndex($("article"));
}

function convertFormToJSON(form) {
  var array = $(form).serializeArray();
  var json = {};
  $.each(array, function () {
    json[this.name] = this.value || "";
  });
  return json;
}

function calculatePortfolio() {
    if($("html").hasClass("portfolio-active")) {
        var element = $(".portfolio-detail-entry.active");
        var offset = element.offset().top-$(".portfolio-detail").offset().top+$(".portfolio-detail").scrollTop();
        $(".portfolio-detail").scrollTop(offset);
    }   
}

$( document ).ready(function() {
    var resizeScaler = _.debounce(calculatePortfolio, 250);
    $(window).resize(resizeScaler);
    $(".header h1.desktop").fitText(0.775);
    $(".header h1.mobile.first").fitText(0.355);
    $(".header h1.mobile.last").fitText(0.38);
    $(".nav-toggle").click(function(e) {
        e.preventDefault();
        if($("html").hasClass("portfolio-active")) {
            index = hidePortfolio();
            $(".portfolio-entry:eq("+index+") .focus-enter").focus({preventScroll: true});
        } else if($("html").hasClass("nav-active"))  {
            hideNav();
        } else {
            removeTabIndex($("article"));
            addTabIndex($("nav"));
            $("html").addClass("nav-active").removeClass("nav-removed portfolio-removed");
        }
    })
    $(".portfolio-entry .rotate-container").click(function(e) {
        e.preventDefault();
        if($("html").hasClass("portfolio-active")) {
            hidePortfolio();
        } else {
            var target = $(this).closest(".portfolio-entry").index();
            openPortfolio(target);
        }
    });
    $(document).keyup(function(e) {
      if (e.which == 27) {
        if($("html").hasClass("nav-active")) {
            hideNav();
        }
        if($("html").hasClass("portfolio-active")) {
            hidePortfolio();
        }
      }
      if (e.which == '13') {
        if($(':focus').hasClass("focus-enter")) {
            $(':focus').click();
        }
      }
    });
    $(".nav-link").click(function() {
        var target = $(this).attr('class').split(/\s+/)[2];
        var element = $("span.anchor-link."+target);
        var elementHeight = element.height();
        var windowHeight  = $(window).height();
        var offset = Math.min(elementHeight, windowHeight) + element.offset().top;
        $('html, body').animate({ scrollTop: offset }, 250);
        hideNav();
    });
    $('form[action="https://submit-form.com/ppoY1ZSd"]').each(function (
      i,
      element
    ) {
      var form = $(element);
      form.submit(function (e) {
        e.preventDefault();
        var data = convertFormToJSON(form);
        var action = form.attr("action");
          $.ajax({
            url: action,
            method: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: function () {
              $(".contact-hide").slideUp(250);
              $(".form-complete").slideDown(250, function() {
                setTimeout(function(){ $(".hex-loader").addClass("loaded");$(".hex-loader .interior").addClass("success-mark"); }, 1750);
                setTimeout(function(){ $(".form-complete .success").fadeIn()}, 2000);
              });
            },
            error: function () {
              $(".contact-hide").slideUp(250);
              // Display the "Done" block
              $(".form-complete").slideDown(250, function() {
                setTimeout(function(){ $(".hex-loader").addClass("loaded");$(".hex-loader .interior").addClass("failure-mark"); }, 1750);
                setTimeout(function(){ $(".form-complete .failure").fadeIn()}, 2000);
              });
            },
          });
      });
    });
});
