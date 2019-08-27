/*------------------------------------------------------------------------
# KickStars - June 03, 2013
# ------------------------------------------------------------------------
# Designed by BestWebSoft & HTML by MegaDrupal
# Websites:  http://www.megadrupal.com -  Email: info@megadrupal.com
--------------------------------------------------------------------------*/

$(function(){
    var sys_show_popup_login = $(".sys_show_popup_login"),
        sys_popup_common = $("#sys_popup_common");
		
	/* Homepage Slider
	---------------------------------------------------------- */	
	if ($("#md-slider-1").length) {
		$("#md-slider-1").mdSlider({
			fullwidth: true,
			transitions: "fade",
			width: 980,
			height: 365,
			responsive: true,
			slideShowDelay: 6000,
			slideShow: true,
			loop: true,
			showLoading: false,
			showArrow: 1,
			showBullet: 1,
			posBullet: 2,
			showThumb: false,
			enableDrag: true
		});
	}
	
	/* get Twitter
	---------------------------------------------------------- */

	$('#sys_lst_tweets').tweet({
			modpath: '/twitter/',
			count: 2,
			loading_text: '<p class="rs ta-c fc-white">loading Twitter <br /><img src="images/ajax-loader.gif" alt="loading"/></p>',
			username: 'megadrupal',
			template: '<p class="rs tweet-mind">{text}</p><p class="rs timestamp">{time}</p><i class="icon iTwitter"></i>',
	});
	
	/* Project Slider
	---------------------------------------------------------- */	
    if ($("#slider1").length > 0) {
        $("#slider1").responsiveSlides({
            auto: false,
            pager: true,
            nav: true,
            speed: 500,
            maxwidth: 800,
            namespace: "centered-btns"
        });
    }

	/* Tabs
	---------------------------------------------------------- */
    $(".tabbable").on("click",".nav-tabs > li",function(){
        if($(this).hasClass("disable"))
            return false;
        var getIndex=$(this).index();
        $(this).siblings().removeClass("active").end().addClass("active");
        $(this).parents(".tabbable").find(".tab-content .tab-pane").removeClass("active").eq(getIndex).addClass("active");
        return false;
    });
	
	/* Accordion
	---------------------------------------------------------- */
    $(".accordion").on("click",".accordion-label",function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active").siblings(".accordion-content").slideUp(400,function(){
                $(this).removeClass("active").removeAttr("style");
            });
        }else{
            $(this).parents(".accordion").find(".accordion-label").removeClass("active");
            $(this).addClass("active").siblings(".accordion-content").slideDown(400,function(){
                $(this).addClass("active").removeAttr("style");
            });
            $(this).parent().siblings().find(".accordion-content").slideUp(400,function(){
                $(this).removeClass("active").removeAttr("style");
            });
        }
        return false;
    });

	/* Open popup when click to: Register, Login
	---------------------------------------------------------- */
    sys_show_popup_login.on("click",function(){
        sys_popup_common.fadeIn();
        $("body").on("keydown.closePopup",function(e){
            var getCode = e.keyCode ? e.keyCode : e.which;
            if(getCode == 27) {
                sys_popup_common.find(".closePopup").trigger("click");
            }
        });
        return false;
    });
    sys_popup_common.on("click.closePopup",".closePopup,.overlay-bl-bg",function(){
        sys_popup_common.fadeOut(function(){
            $("body").off("keydown.closePopup");
        });
    });
    sys_popup_common.on("click",".main-content",function(e){
        e.stopPropagation();
    });
	
	/* Loadmore button on Category
	---------------------------------------------------------- */	
    $('#showmoreproject').bind('click', function (e) {
        _self = $(this);
        _self.text('Loading...')
        $.ajax({
            url: "ajax/category.php"
        }).done(function(data) {
            $('#list-project-ajax').append(data);
            _self.text('Show more projects')
        });
        return false;
    });
	
	/* Loadmore button on blog
	---------------------------------------------------------- */	
    $('#showmorepost').bind('click', function (e) {
        _self = $(this);
        _self.text('Loading...')
        $.ajax({
            url: "ajax/blog.php"
        }).done(function(data) {
            $('#list-blog-ajax').append(data);
            _self.text('Show more posts')
        });
        return false;
    });
	
	/* Loadmore button on search results
	---------------------------------------------------------- */	
    $('#showmoreresults').bind('click', function (e) {
        _self = $(this);
        _self.text('Loading...')
        $.ajax({
            url: "ajax/search-results.php"
        }).done(function(data) {
            $('#list-search-ajax').append(data);
            _self.text('Show more projects')
        });
        return false;
    });
	
	/* Contact form: Ajax & Validate
	---------------------------------------------------------- */	
	if(jQuery("#contact-form").length > 0){
        // Validate the contact form
        jQuery('#contact-form').validate({
	
            // Add requirements to each of the fields
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                email: {
                    required: true,
                    email: true
                },
                message: {
                    required: true,
                    minlength: 10
                }
            },
		
            // Specify what error messages to display
            // when the user does something horrid
            messages: {
                name: {
                    required: "Please enter your name.",
                    minlength: jQuery.format("At least {0} characters required.")
                },
                email: {
                    required: "Please enter your email.",
                    email: "Please enter a valid email."
                },
                message: {
                    required: "Please enter a message.",
                    minlength: jQuery.format("At least {0} characters required.")
                }
            },
		
            // Use Ajax to send everything to processForm.php
            submitHandler: function(form) {
                jQuery("#submit-contact").attr("value", "Sending...");
                jQuery(form).ajaxSubmit({
                    success: function(responseText, statusText, xhr, $form) {
                        jQuery("#response").html(responseText).hide().slideDown("fast");
                        jQuery("#submit-contact").attr("value", "Submit");
                        jQuery(form).find("input[type=text]").val('');
                        jQuery(form).find("input[type=email]").val('');
                        jQuery(form).find("input[type=url]").val('');
                        jQuery(form).find("textarea").val('');
                    }
                });
                return false;
            }
        });
    }

    /* Responsive
	---------------------------------------------------------- */
    var sys_btn_toggle_search = $("#sys_btn_toggle_search"),
        sys_header_right = $("#sys_header_right");
    sys_btn_toggle_search.on("click",function(){
        sys_header_right.slideToggle(function(){
            if($(this).is(":visible")){
                $(this).addClass("active");
            }else{
                $(this).removeClass("active");
            }
            $(this).removeAttr("style");
        });
        sys_btn_toggle_search.toggleClass("active");
    });

    /* Navigation on mobile (Sidr)
	---------------------------------------------------------- */
    $('#btn-toogle-menu').sidr({
        side:"left",
        name:"alternate-menu",
        source:"#right-menu"
    });
    if ($("#sys-nav-menu-blog").length > 0) {
        selectnav("sys-nav-menu-blog");
    }
});