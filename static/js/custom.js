jQuery(document).ready(function ($) {
  /***--------  mobile-nav   ------- ***/
  $('.mobile-nav .menu-item-has-children').on('click', function (event) {
    $(this).toggleClass('active');
    event.stopPropagation();
  });

  $('#mobile-menu').click(function () {
    $(this).toggleClass('open');
    $('#mobile-nav').toggleClass('open');
  });

  $('#desktop-menu').click(function () {
    $(this).toggleClass('open');
    $('.desktop-menu').toggleClass('open');
  });

  $('#res-cross').click(function () {
    $('#mobile-nav').removeClass('open');
    $('#mobile-menu').removeClass('open')
  });

  /***--------  sticky header scroll   ------- ***/
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 100) {
      $('header').addClass('sticky');
    } else {
      $('header').removeClass('sticky');
    }
  });
});
/***--------  search-box & Premium Interactive Live Search   ------- ***/
(function ($) {
  const SEARCH_DB = [
    // Services
    {
      title: "Bedroom Decor & Design",
      category: "Service",
      desc: "We craft beautiful, functional bedroom interiors with premium materials, smart storage, and elegant lighting tailored to your budget.",
      url: "our-service.html",
      image: "assets/img/specialize/1.png"
    },
    {
      title: "Modular Kitchen",
      category: "Service",
      desc: "Stylish and highly functional quality modular kitchens designed to fit your unique lifestyle, layout, and storage needs.",
      url: "our-service.html",
      image: "assets/img/specialize/2.png"
    },
    {
      title: "TV Cabinet & Wall Panel",
      category: "Service",
      desc: "Smart TV cabinets and sleek wall paneling that elevate your living room entertainment area with modern layouts.",
      url: "our-service.html",
      image: "assets/img/specialize/3.png"
    },
    {
      title: "Sofa & Furniture",
      category: "Service",
      desc: "Premium customized sofas, elegant lounge chairs, and bespoke furniture crafted with high durability fabrics.",
      url: "our-service.html",
      image: "assets/img/specialize/4.png"
    },
    {
      title: "Window & Door Paneling",
      category: "Service",
      desc: "Exquisite wood-textured frame paneling that adds clean architectural lines and elegance to your windows and doorways.",
      url: "our-service.html",
      image: "assets/img/specialize/5.png"
    },
    {
      title: "UPVC & WPVC Doors",
      category: "Service",
      desc: "High-grade weather-resistant UPVC and WPVC door systems offering supreme durability and noise insulation.",
      url: "our-service.html",
      image: "assets/img/specialize/6.png"
    },
    {
      title: "False Ceiling & Painting",
      category: "Service",
      desc: "Stunning modern false ceilings integrated with warm ambient cove lighting and premium flawless wall finishes.",
      url: "our-service.html",
      image: "assets/img/specialize/7.png"
    },
    {
      title: "Urban Planning & Design",
      category: "Service",
      desc: "Combining property development realities with supreme architectural creativity and detailed neighborhood planning.",
      url: "our-service.html",
      image: "assets/img/specialize/1.png"
    },
    {
      title: "Architecture Design",
      category: "Service",
      desc: "High-end luxury architectural designs blending aesthetic excellence, environmental standards, and technical durability.",
      url: "our-service.html",
      image: "assets/img/specialize/3.png"
    },

    // Projects
    {
      title: "Modern Premium Bedroom",
      category: "Project",
      desc: "A luxurious master bedroom project designed with warm ambient illumination and custom wood paneling finishes.",
      url: "index.html#projects",
      image: "assets/img/Dream_Home/1.png"
    },
    {
      title: "Luxurious Living Room Layout",
      category: "Project",
      desc: "Sleek and spacious living area styling showcasing custom-built furniture, glassmorphic textures, and gold accents.",
      url: "index.html#projects",
      image: "assets/img/Dream_Home/2.png"
    },
    {
      title: "Flawless Modern Bathroom",
      category: "Project",
      desc: "Clean architectural bathroom renovation combining textured marble slabs and premium gold sanitary fixtures.",
      url: "index.html#projects",
      image: "assets/img/Dream_Home/5.png"
    },
    {
      title: "State of the Art Kitchen",
      category: "Project",
      desc: "Highly-functional ergonomic modular kitchen project finished in matte charcoal and premium marble countertops.",
      url: "index.html#projects",
      image: "assets/img/Dream_Home/3.png"
    },
    {
      title: "Dynamic Room Decoration",
      category: "Project",
      desc: "Elegant and cozy room styling featuring curated wall decor, textured fabrics, and customized bookshelves.",
      url: "index.html#projects",
      image: "assets/img/Dream_Home/6.png"
    },
    {
      title: "Soothing Landscape Garden",
      category: "Project",
      desc: "Exquisite outdoor garden design with seamless walking paths, warm spot lighting, and curated flora.",
      url: "index.html#projects",
      image: "assets/img/Dream_Home/4.png"
    },

    // Team
    {
      title: "Team 1 - Lead Interior Designer",
      category: "Team",
      desc: "We don't just design spaces — we craft experiences that feel like home. Lead Architect at Perfecto.",
      url: "our-team.html",
      image: "https://placehold.co/351x520/111111/cda45e?text=Lead+Designer"
    },
    {
      title: "Team 2 - Modular Kitchen Specialist",
      category: "Team",
      desc: "Smart modular kitchens are where beauty meets functionality. Expert kitchen layout designer.",
      url: "our-team.html",
      image: "https://placehold.co/351x520/111111/cda45e?text=Kitchen+Specialist"
    },
    {
      title: "Team 3 - Furniture & Decor Expert",
      category: "Team",
      desc: "Every detail adds beauty to a space. Specialist in bespoke sofas, lighting matching, and styling.",
      url: "our-team.html",
      image: "https://placehold.co/351x520/111111/cda45e?text=Decor+Expert"
    },
    {
      title: "Team 4 - Site Supervisor & Quality Head",
      category: "Team",
      desc: "Quality and precision build lasting spaces. Handles material auditing and final client delivery.",
      url: "our-team.html",
      image: "https://placehold.co/351x520/111111/cda45e?text=Site+Supervisor"
    },

    // General pages
    {
      title: "About Perfecto Interior Studio",
      category: "Page",
      desc: "Perfecto Interior delivers flawless interiors across Kolkata, Medinipur & Ghatal. Discover our work process.",
      url: "about.html",
      image: "assets/img/heading-img.png"
    },
    {
      title: "Contact Us & Free Consultation",
      category: "Page",
      desc: "Contact us to request a quote or book a free design consultation. Let's build your dream home.",
      url: "contact.html",
      image: "assets/img/heading-img.png"
    },
    {
      title: "Frequently Asked Questions (FAQs)",
      category: "Page",
      desc: "Find quick answers about our project delivery, renovation budgets, design scopes, and service guidelines.",
      url: "faqs.html",
      image: "assets/img/heading-img.png"
    }
  ];

  if ($('.search-popup').length) {
    const $popup = $('.search-popup');
    
    // Inject suggested popular search terms UI dynamically
    if (!$popup.find('.search-suggestions').length) {
      const suggestionsHTML = `
        <div class="search-suggestions">
          <span class="suggestion-label">Popular searches:</span>
          <button type="button" class="search-tag-btn">Kitchen</button>
          <button type="button" class="search-tag-btn">Bedroom</button>
          <button type="button" class="search-tag-btn">Furniture</button>
          <button type="button" class="search-tag-btn">Team</button>
          <button type="button" class="search-tag-btn">Consultation</button>
        </div>
      `;
      $popup.find('form').after(suggestionsHTML);
    }
    
    // Inject custom scrollable search results grid dynamically
    if (!$popup.find('.search-results-container').length) {
      const resultsHTML = `
        <div class="search-results-container">
          <div class="search-results-grid"></div>
        </div>
      `;
      $popup.append(resultsHTML);
    }

    const $input = $popup.find('input[name="search-field"]');
    const $form = $popup.find('form');
    const $grid = $popup.find('.search-results-grid');
    
    // Hook up outer triggers and overlay toggle
    $('.search-box-outer').on('click', function (e) {
      e.preventDefault();
      $('body').addClass('search-active');
      setTimeout(function() {
        $input.focus();
      }, 600);
    });

    $('.close-search').on('click', function (e) {
      e.preventDefault();
      $('body').removeClass('search-active');
      $popup.removeClass('has-input');
      $input.val('');
      $grid.empty();
    });

    // Handle form submit (by overriding to dynamic UI view)
    $form.on('submit', function (e) {
      e.preventDefault();
      const val = $input.val();
      if (val.trim().length > 0) {
        $popup.addClass('has-input');
        performSearch(val);
      }
    });

    // Perform live matching as user types
    $input.on('input', function () {
      const query = $(this).val();
      if (query.trim().length > 0) {
        $popup.addClass('has-input');
        showLoadingState();
        debounceSearch(query);
      } else {
        $popup.removeClass('has-input');
        $grid.empty();
      }
    });

    // Handle tag trigger button clicks
    $popup.on('click', '.search-tag-btn', function (e) {
      e.preventDefault();
      const tagVal = $(this).text();
      $input.val(tagVal);
      $popup.addClass('has-input');
      showLoadingState();
      setTimeout(function() {
        performSearch(tagVal);
      }, 30);
    });

    // Premium skeleton builder
    function showLoadingState() {
      $grid.html(`
        <div class="search-skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-text title"></div>
          <div class="skeleton-text desc"></div>
        </div>
        <div class="search-skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-text title"></div>
          <div class="skeleton-text desc"></div>
        </div>
        <div class="search-skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-text title"></div>
          <div class="skeleton-text desc"></div>
        </div>
      `);
    }

    // Debounce live searching to improve scrolling stability
    let searchTimeout;
    function debounceSearch(val) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function() {
        performSearch(val);
      }, 50);
    }

    // Search and Render Engine
    function performSearch(query) {
      const term = query.trim().toLowerCase();
      if (term.length === 0) {
        $grid.empty();
        return;
      }

      // Filter database matches
      const matches = SEARCH_DB.filter(function(item) {
        return item.title.toLowerCase().indexOf(term) !== -1 ||
               item.desc.toLowerCase().indexOf(term) !== -1 ||
               item.category.toLowerCase().indexOf(term) !== -1;
      });

      // No results layout
      if (matches.length === 0) {
        $grid.html(`
          <div class="search-no-results">
            <div class="no-results-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
            <h3>No premium spaces matched "${escapeHTML(query)}"</h3>
            <p>Try searching for standard concepts like <strong>Kitchen</strong>, <strong>Bedroom</strong>, <strong>Furniture</strong>, or meet our <strong>Team</strong>.</p>
          </div>
        `);
        return;
      }

      // Populate results
      let cardsHTML = '';
      matches.forEach(function(item) {
        const titleHighlight = highlightMatch(item.title, query);
        const descHighlight = highlightMatch(item.desc, query);
        
        cardsHTML += `
          <div class="search-result-card">
            <div class="result-card-img">
              <img src="${item.image}" alt="${item.title}" onerror="this.src='https://placehold.co/400x300/111111/cda45e?text=Archik+Interior'">
            </div>
            <div class="result-card-content">
              <span class="result-card-badge">${item.category}</span>
              <h4>${titleHighlight}</h4>
              <p>${descHighlight}</p>
              <a href="${item.url}" class="result-card-link">
                View Details <i class="fa-solid fa-arrow-right-long"></i>
              </a>
            </div>
          </div>
        `;
      });
      
      $grid.html(cardsHTML);
    }

    // Highlight query characters using RegExp
    function highlightMatch(sourceText, query) {
      if (!query) return sourceText;
      const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp('(' + escapedQuery + ')', 'gi');
      return sourceText.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    // Guard escaping HTML
    function escapeHTML(text) {
      return text.replace(/[&<>"']/g, function(m) {
        switch (m) {
          case '&': return '&amp;';
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '"': return '&quot;';
          case "'": return '&#039;';
        }
      });
    }
  }
})(window.jQuery);


// 

function inVisible(element) {
  //Checking if the element is
  //visible in the viewport
  var WindowTop = $(window).scrollTop();
  var WindowBottom = WindowTop + $(window).height();
  var ElementTop = element.offset().top;
  var ElementBottom = ElementTop + element.height();
  //animating the element if it is
  //visible in the viewport
  if ((ElementBottom <= WindowBottom) && ElementTop >= WindowTop)
    animate(element);
}

function animate(element) {
  //Animating the element if not animated before
  if (!element.hasClass('ms-animated')) {
    var maxval = element.data('max');
    var html = element.html();
    element.addClass("ms-animated");
    $({
      countNum: element.html()
    }).animate({
      countNum: maxval
    }, {
      //duration 5 seconds
      duration: 5000,
      easing: 'linear',
      step: function () {
        element.html(Math.floor(this.countNum) + html);
      },
      complete: function () {
        element.html(this.countNum + html);
      }
    });
  }

}

//When the document is ready
$(function () {
  $(window).scroll(function () {
    $("h2[data-max]").each(function () {
      inVisible($(this));
    });
  })
});

function inVisible(element) {
  var WindowTop = $(window).scrollTop();
  var WindowBottom = WindowTop + $(window).height();
  var ElementTop = element.offset().top;
  var ElementBottom = ElementTop + element.height();
  if ((ElementBottom <= WindowBottom) && ElementTop >= WindowTop)
    animate(element);
}

function animate(element) {
  if (!element.hasClass('ms-animated')) {
    var maxval = element.data('max');
    var html = element.html();
    element.addClass("ms-animated");
    $({
      countNum: element.html()
    }).animate({
      countNum: maxval
    }, {
      duration: 5000,
      easing: 'linear',
      step: function () {
        element.html(Math.floor(this.countNum) + html);
      },
      complete: function () {
        element.html(this.countNum + html);
      }
    });
  }

}
$(function () {
  $(window).scroll(function () {
    $("h2[data-max]").each(function () {
      inVisible($(this));
    });
  })
});

// count end

if (typeof Swiper !== 'undefined') {
  var swiper = new Swiper(".hero-one-slider", {
    slidesPerView: 1,
    loop: true,
    speed: 1000,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
  var heroTwoSwiper = new Swiper(".hero-two-slider", {
    slidesPerView: 1,
    loop: true,
    speed: 1000,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
  window.heroTwoSwiper = heroTwoSwiper;

  var swiper = new Swiper(".hero-three-slider", {
    slidesPerView: 1,
    loop: true,
    speed: 1000,
    grabCursor: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
  var swiper = new Swiper(".flip-img", {
    loop: true,
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    speed: 1000,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
  var swiper = new Swiper(".innovative-slider", {

    slidesPerView: 1,
    loop: true,
    speed: 1000,
    freeMode: true,
    grabCursor: true,
    effect: "creative",
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    creativeEffect: {
      prev: {
        shadow: true,
        translate: ["-20%", 0, -1],
      },
      next: {
        translate: ["100%", 0, 0],
      },
    }
  });
  var swiper = new Swiper(".visit-slider", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    speed: 1000,
    freeMode: true,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      1: {
        slidesPerView: 1,
      },
      500: {
        slidesPerView: 1,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
  var swiper = new Swiper(".testimonial-slider", {
    slidesPerView: 1,
    loop: true,
    speed: 1000,
    freeMode: true,
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
  var swiper = new Swiper(".blog-slider", {
    slidesPerView: 2,
    loop: true,
    speed: 1000,
    spaceBetween: 20,
    freeMode: true,
    autoplay: {
      delay: 3000,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1: {
        slidesPerView: 1,
      },
      556: {
        slidesPerView: 2,
      },
    },
  });
  var swiper = new Swiper(".company-slider", {
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    speed: 1000,
    freeMode: true,
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      1: {
        slidesPerView: 1,
      },
      556: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    speed: 1000,
    freeMode: true,
    autoplay: {
      delay: 2000,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      10: {
        slidesPerView: 1,
      },
      480: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

/*************  accordion-item ****************/

$('.accordion-item .heading').on('click', function (e) {
  e.preventDefault();

  if ($(this).closest('.accordion-item').hasClass('active')) {
    $('.accordion-item').removeClass('active');
  } else {
    $('.accordion-item').removeClass('active');

    $(this).closest('.accordion-item').addClass('active');
  }
  var $content = $(this).next();
  $content.slideToggle(100);
  $('.accordion-item .content').not($content).slideUp('fast');
});

// end


//  progress_bar

$(document).ready(function () {
  progress_bar();
});

function progress_bar() {
  var speed = 30;
  var items = $('.progress_bar').find('.progress_bar_item');

  items.each(function () {
    var item = $(this).find('.progress');
    var itemValue = item.data('progress');
    var i = 0;
    var value = $(this);

    var count = setInterval(function () {
      if (i <= itemValue) {
        var iStr = i.toString();
        item.css({
          'width': iStr + '%'
        });
        value.find('.item_value').html(iStr + '%');
      }
      else {
        clearInterval(count);
      }
      i++;
    }, speed);
  });
}


$(".wwb-ul li").hover(function () {
  $(".wwb-ul li").removeClass("active");
  $(this).addClass("active");
});

function scrollTopPercentage() {
  const scrollPercentage = () => {
    const scrollTopPos = document.documentElement.scrollTop;
    const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollValue = Math.round((scrollTopPos / calcHeight) * 100);
    const scrollElementWrap = $("#scroll-percentage");

    scrollElementWrap.css("background", `conic-gradient( #fff ${scrollValue}%, #000 ${scrollValue}%)`);

    // ScrollProgress
    if (scrollTopPos > 100) {
      scrollElementWrap.addClass("active");
    } else {
      scrollElementWrap.removeClass("active");
    }

    if (scrollValue < 99) {
      $("#scroll-percentage-value").text(`${scrollValue}%`);
    } else {
      $("#scroll-percentage-value").html('<i class="fa-solid fa-arrow-up-long"></i>');
    }
  }
  window.onscroll = scrollPercentage;
  window.onload = scrollPercentage;
  // Back to Top
  function scrollToTop() {
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  $("#scroll-percentage").on("click", scrollToTop);
}
scrollTopPercentage(); 
 
/*----------------------------------------------------------------------------------------------------
---------------------------------------- heading hover ----------------------------------------------
----------------------------------------------------------------------------------------------------*/


(function($) {
    function title_animation() {
    var tg_var = jQuery('.sec-title-animation');
    if (!tg_var.length) {
      return;
    }
    const quotes = document.querySelectorAll(".sec-title-animation .title-animation");

    quotes.forEach(quote => {

      //Reset if needed
      if (quote.animation) {
        quote.animation.progress(1).kill();
        quote.split.revert();
      }

      var getclass = quote.closest('.sec-title-animation').className;
      var animation = getclass.split('animation-');
      if (animation[1] == "style4") return

      quote.split = new SplitText(quote, {
        type: "lines,words,chars",
        linesClass: "split-line"
      });
      gsap.set(quote, {
        perspective: 400
      });

      // if (animation[1] == "style1") {
      //   gsap.set(quote.split.chars, {
      //     opacity: 0,
      //     y: "90%",
      //     rotateX: "-40deg"
      //   });
      // }
      if (animation[1] == "style2") {
        gsap.set(quote.split.chars, {
          opacity: 0,
          x: "50"
        });
      }
      // if (animation[1] == "style3") {
      //   gsap.set(quote.split.chars, {
      //     opacity: 0,
      //   });
      // }
      quote.animation = gsap.to(quote.split.chars, {
        scrollTrigger: {
          trigger: quote,
          start: "top 90%",
        },
        x: "0",
        y: "0",
        rotateX: "0",
        opacity: 1,
        duration: 1,
        ease: Back.easeOut,
        stagger: .02
      });
    });
  }
  ScrollTrigger.addEventListener("refresh", title_animation);
  
    
    $(window).on('load', function() {
         title_animation();
    });
 
})(window.jQuery);