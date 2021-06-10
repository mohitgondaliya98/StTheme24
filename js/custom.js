$(document).ready(function () {
	
	var $isTouch = false;

	//Prevent Page Reload on all # links
	$("body").on("click", "a[href='#']", function (e) {
		e.preventDefault();
	});

	//placeholder
	$("[placeholder]").each(function () {
		$(this).attr("data-placeholder", this.placeholder);
		$(this).bind("focus", function () {
			this.placeholder = '';
		});
		$(this).bind("blur", function () {
			this.placeholder = $(this).attr("data-placeholder");
		});
	});

	// On scroll Add Class
	$(window).scroll(function (e) {
		if ($(window).scrollTop() > 200) {
			$(".wrapper").addClass('page-scrolled');
		}
		else {
			$(".wrapper").removeClass('page-scrolled');
		}
	});

	// Footer margin set for stick to bottom
	function footerAdj() {
		var footerH = $(".footer").innerHeight();
		$(".footer").css({ "margin-top": -footerH });
		$(".main-content").css({ "padding-bottom": footerH });
	};
	footerAdj();
	$(window).resize(function () {
		footerAdj();
	});

	// Add remove class when window resize finished
	var $resizeTimer;
	$(window).on("resize", function (e) {
		if($isTouch){ 
			$(".single-scroller").getNiceScroll().remove();
			$(".scroller").niceScroll(".scroll-wrap").remove();
		}
		if (!$("body").hasClass("window-resizing")) {
			$("body").addClass("window-resizing");
		}
		clearTimeout($resizeTimer);
		$resizeTimer = setTimeout(function () {
			$("body").removeClass("window-resizing");
		}, 250);
	});

	// Responsive Tab Accordion --------------------------------------------------------------
	var $mainClass = $(".responsive-tab-accordion");
	var $blockId = 1;

	$mainClass.each(function () {
		var $block = $(this);

		// Add Scroll in Desktop Tab Heading
		var $tabHeading = $block.find(">.tab-heading");
		function setNavTabWidth() {
			var $navW = 0;
			var $navTabs = $tabHeading.find(">.nav-tabs");
			$navTabs.find(">a").each(function () {
				$navW = $navW + $(this).outerWidth(true);
			});
			$navTabs.css({ "width": $navW + 5 });
		}
		setNavTabWidth();

		var $animatScroll = true;
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
			$animatScroll = false;
		$tabHeading.jScrollPane({
			showArrows: true,
			animateScroll: $animatScroll,
			resizeSensor: true,
			arrowButtonSpeed: 100
		}).addClass("scroll-added");


		$tabHeading.find(".nav-tabs a").click(function (e) {
			var $this = $(this);
			e.preventDefault();
			if ($tabHeading.attr("data-active-tab-center") == "true")
				$tabHeading.data('jsp').scrollByX(parseInt(($this.offset().left - $tabHeading.offset().left) + ($this.innerWidth() / 2)) - ($tabHeading.innerWidth() / 2));
		});


		// Add Accordion in Tabs For Small Screens
		var $parentId = "responsive-tab-accordion-parent-" + $blockId;
		$block.find(">.tab-content").addClass("accordion").attr("id", $parentId);
		$block.find(">.tab-content").find(">.tab-pane").addClass("card").each(function () {
			var $pane = $(this);
			var $paneId = "responsive-accordion-" + $pane.attr("id");
			var $heading = $block.find(".tab-heading").find(".nav-item.nav-link[href='#" + $pane.attr("id") + "']");
			$pane.wrapInner('<div class="collapse" id="' + $paneId + '" data-parent="#' + $parentId + '"><div class="tab-card-body"></div></div>');
			$pane.prepend('<div class="tab-card-header"><a data-toggle="collapse" href="#' + $paneId + '">' + $heading.html() + '</a></div>');

			if ($pane.hasClass('active')) {
				$pane.find(".tab-card-header > a").attr("aria-expanded", true);
				$pane.find(".collapse").addClass("show");
			}
		});
		$blockId++;


		// Add Class for Tab and Accordion
		function setClassForResponsive() {
			var $winW = $(window).innerWidth();
			var $breakPoint = $block.attr("data-accordion");

			if ($winW < $breakPoint && !$block.hasClass("responsive-accordion"))
				$block.addClass("responsive-accordion").removeClass("responsive-tab");
			else if ($winW >= $breakPoint && !$block.hasClass("responsive-tab"))
				$block.addClass("responsive-tab").removeClass("responsive-accordion");

			if ($block.hasClass("responsive-tab"))
				setNavTabWidth();
		};
		setClassForResponsive();
		$(window).resize(function () {
			setClassForResponsive();
		});
	});

	// Sync 
	var $clickFlag = true;

	// Manage Class to Accordion on Tab Change
	$(".responsive-tab-accordion .tab-heading .nav-item.nav-link").on("show.bs.tab", function () {
		var $this = $(this);
		if ($clickFlag) {
			$($this.attr("href")).siblings(".card").find(".tab-card-header>a").removeAttr("aria-expanded");
			$($this.attr("href")).siblings(".card").find(".collapse.show").removeClass("show");
			$($this.attr("href")).find(".tab-card-header>a").attr("aria-expanded", "true");
			$($this.attr("href")).find(".collapse").addClass('show');
			$clickFlag = false;
		}
	});

	$(".responsive-tab-accordion .tab-heading .nav-item.nav-link").on("shown.bs.tab", function () {
		$clickFlag = true;
	});

	// Manage Class to Tab on Accordion Change
	$(".responsive-tab-accordion .accordion .collapse").on("show.bs.collapse", function () {
		var $this = $(this).closest(".tab-pane").attr("id");
		$clickFlag = false;
		$("a[href='#" + $this + "']").tab('show');
	});

	// Add new js functions here -----------------------------------------------------------------

	$(".btn-menu").on("click", function () {
		$("body").toggleClass("open");
	});

	$(".btn-info-drawer").on("click", function () {
		$("body").toggleClass("open-info-drawer");
	});

	$(".btn-search").on("click", function () {
		$("body").toggleClass("open-search");
		$(".header-search").focus();
	});

	$(".overlayer").on("click", function () {
		$("body").removeClass("open open-search open-info-drawer");
	});

	$(".scroller").niceScroll(".scroll-wrap", {
		cursorcolor: "#E3E3E3",
		cursorborder: 'none',
		cursorborderradius: 4,
		bouncescroll: false,
	});
	$(".single-scroller").niceScroll({
		cursorcolor: "#AFAFAF",
		cursorborder: 'none',
		cursorborderradius: 4,
		bouncescroll: false,
	});

	$("select").selectpicker();
	
	$(".nav-link").on("shown.bs.tab", function(){
		$(".single-scroller").getNiceScroll().resize();
	});

	//To detect the Touch
	function detectTouch() {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			$isTouch = true;
		}
	}
	detectTouch();

	if($isTouch){ 
		$(".single-scroller").getNiceScroll().remove();
		$(".scroller").niceScroll(".scroll-wrap").remove();
	}
	
	// Don't add anything below this --------------------------------------------------------------
	// Add Class on Window Load
	$("body").addClass("page-loaded");
});