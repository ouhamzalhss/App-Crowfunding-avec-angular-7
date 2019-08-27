/*------------------------------------------------------------------------
# MD Slider - March 18, 2013
# ------------------------------------------------------------------------
# Websites:  http://www.megadrupal.com -  Email: info@megadrupal.com
--------------------------------------------------------------------------*/

(function ($) {
    effectsIn = ['rollIn', 'fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight', 'fadeInUpBig', 'fadeInDownBig','fadeInLeftBig','fadeInRightBig', 'bounceIn', 'bounceInDown', 'bounceInUp', 'bounceInLeft', 'bounceInRight', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight','lightSpeedIn'];
    effectsOut = ['rollOut', 'fadeOut', 'fadeOutUp', 'fadeOutDown', 'fadeOutLeft', 'fadeOutRight', 'fadeOutUpBig', 'fadeOutDownBig', 'fadeOutLeftBig', 'fadeOutRightBig', 'bounceOut', 'bounceOutDown', 'bounceOutUp', 'bounceOutLeft', 'bounceOutRight', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight', 'lightSpeedOut'];
    var e_in_length = effectsIn.length;
    var e_out_length = effectsOut.length;
    $.fn.mdSlider = function(options) {
        var defaults = {
            className: 'md-slide-wrap',
            itemClassName: 'md-slide-item',
            transitions: 'scrollHorz', // name of transition effect (fade, scrollLeft, scrollRight, scrollHorz, scrollUp, scrollDown, scrollVert)
            transitionsSpeed: 600, // speed of the transition (millisecond)
            width: 990, // responsive = false: this appear as container width; responsive = true: use for scale ;fullwidth = true: this is effect zone width
            height: 420, // container height
            responsive: true,
			fullwidth: true,
            styleBorder: 0, // Border style, from 1 - 9, 0 to disable
            styleShadow: 0, // Dropshadow style, from 1 - 5, 0 to disable
			posBullet: 2, // Bullet position, from 1 to 6, default is 5
			posThumb: 1, // Thumbnail position, from 1 to 5, default is 1
            slideShowDelay: 6000, // stop time for each slide item (millisecond)
            slideShow: true,
			loop: false,
            pauseOnHover: false,
            showLoading: true, // Show/hide loading bar
            loadingPosition: 'bottom', // choose your loading bar position (top, bottom)
            showArrow: true, // show/hide next, previous arrows
            touchArrow: false,
            showBullet: true,
            videoBox: false,
            showThumb: true, // Show thumbnail, if showBullet = true and showThumb = true, thumbnail will be shown when you hover bullet navigation
            enableDrag: true, // Enable mouse drag
            touchSensitive: 50,
            onEndTransition: function() {  },	//this callback is invoked when the transition effect ends
            onStartTransition: function() {  }	//this callback is invoked when the transition effect starts
        };
        options = $.extend({}, defaults, options);
        var self= $(this),
            wrap,
            hoverDiv,
            hasTouch,
            numItem = 0,
            slideWidth,
            slideHeight,
            slideItems,
            activeIndex = -1,
            oIndex,
            arrowButton,
            buttons,
            loadingBar,
            timerGlow,
            slideThumb,
            minThumbsLeft = 0,
            touchstart,
            mouseleft,
            thumbsDrag = false,
            slideShowDelay = 0,
            play = false,
            pause = false,
            timer,
            step = 0;

        // init
        function init() {
            self.addClass("loading-image");
            var slideClass = '';
            if (options.responsive)
                slideClass += ' md-slide-responsive';
            if (options.fullwidth)
                slideClass += ' md-slide-fullwidth';
            if (options.showBullet && options.posBullet)
                slideClass += ' md-slide-bullet-' + options.posBullet;
            if (!options.showBullet && options.showThumb && options.posThumb)
                slideClass += ' md-slide-thumb-' + options.posThumb;
            self.wrap('<div class="' + options.className + slideClass + '"><div class="md-item-wrap"></div></div>');
            hoverDiv = self.parent();
            wrap = hoverDiv.parent();
            slideWidth = options.responsive ? self.width() : options.width;
            slideHeight = options.height;
            slideItems = [];
            hasTouch = documentHasTouch();
            if(hasTouch)
                wrap.addClass("md-touchdevice");
            //
            self.find('.' + options.itemClassName).each(function (index) {
                numItem++;
                slideItems[index] = $(this);
                $(this).find(".md-object").each(function() {
                    var top =  $(this).data("y") ? $(this).data("y") : 0,
                        left = $(this).data("x") ? $(this).data("x") : 0,
                        width = $(this).data("width") ? $(this).data("width") : 0,
                        height = $(this).data("height") ? $(this).data("height") : 0;
                    if(width > 0) {
                        $(this).width((width / options.width * 100) + "%");
                    }
                    if(height > 0) {
                        $(this).height((height / options.height * 100) + "%");
                    }
                    var css = {
                        top:(top / options.height * 100) + "%",
                        left:(left / options.width * 100) + "%"
                    };
                    $(this).css(css);
                });
                if(index > 0)
                    $(this).hide();
            });
            initControl();
            initDrag();
            if(options.slideShow) {
                play = true;
            }
            $('.md-object', self).hide();
            if($(".md-video", wrap).size() > 0) {
                if(options.videoBox) {
                    $(".md-video", wrap).mdvideobox();
                } else {
                    var videoCtrl = $('<div class="md-video-control" style="display: none"></div>');
                    wrap.append(videoCtrl);
                    $(".md-video", wrap).click(function() {
                        var video_ele = $("<iframe></iframe>");
                        video_ele.attr('allowFullScreen' , '').attr('frameborder' , '0').css({width:"100%", height: "100%", background: "black"});
                        video_ele.attr("src", $(this).attr("href"));
                        var closeButton = $('<a href="#" class="md-close-video" title="Close video"></a>');
                        closeButton.click(function() {
                            videoCtrl.html("").hide();
                            play = true;
                            return false;
                        });
                        videoCtrl.html("").append(video_ele).append(closeButton).show();
                        play = false;
                        return false;
                    });
                }
            }
            $(window).resize(function() {
                resizeWindow();
            });
            preloadImages();
            resizeWindow();
        }
        function initControl() {
            // Loading bar
            if(options.slideShow && options.showLoading) {
                var loadingDiv = $('<div class="loading-bar-hoz loading-bar-' + options.loadingPosition + '"><div class="br-timer-glow" style="left: 120px;"></div><div class="br-timer-bar" style="width:220px"></div></div>');
                wrap.append(loadingDiv);
                loadingBar = $(".br-timer-bar", loadingDiv);
                timerGlow  = $(".br-timer-glow", loadingDiv);
            }
            if(options.slideShow && options.pauseOnHover) {
                hoverDiv.hover(function() {
                   pause = true;
                }, function() {
                    pause = false;
                });
            }
            // Border
            if (options.styleBorder != 0) {
                var borderDivs = '<div class="border-top border-style-' + options.styleBorder + '"></div>';
                borderDivs += '<div class="border-bottom border-style-' + options.styleBorder + '"></div>';
                if (!options.fullwidth) {
                    borderDivs += '<div class="border-left border-style-' + options.styleBorder + '"><div class="edge-top"></div><div class="edge-bottom"></div></div>';
                    borderDivs += '<div class="border-right border-style-' + options.styleBorder + '"><div class="edge-top"></div><div class="edge-bottom"></div></div>';
                }
                wrap.append(borderDivs);
            }
            // Shadow
            if (options.styleShadow != 0) {
                var shadowDivs = '<div class="md-shadow md-shadow-style-' + options.styleShadow + '"></div>';
            }
            // Next, preview arrow
            if (options.showArrow) {
                arrowButton = $('<div class="md-arrow" style="opacity:0;"><div class="md-arrow-left"><span></span></div><div class="md-arrow-right"><span></span></div></div>');
                hoverDiv.append(arrowButton);
                $('.md-arrow-right', arrowButton).bind('click', function () {
                    slideNext();
                });
                $('.md-arrow-left', arrowButton).bind('click', function () {
                    slidePrev();
                });
            };
            if (options.showBullet != false) {
                buttons = $('<div class="md-bullets"></div>');
                wrap.append(buttons);
                for (var i = 0; i < numItem; i++) {
                    buttons.append('<div class="md-bullet"  rel="' + i + '"><a></a></div>');
                };
                if (options.showThumb) {
                    var thumbW = parseInt(self.data("thumb-width")),
                        thumbH = parseInt(self.data("thumb-height"));
                    for (var i = 0; i < numItem; i++) {
                        var thumbSrc = slideItems[i].data("thumb");
                        if(thumbSrc) {
                            var thumb = $('<img />').attr("src", thumbSrc).css({top: -(9 + thumbH) + "px", left: -(thumbW/2 - 2) + "px", opacity: 0});
                            $('div.md-bullet:eq(' + i + ')', buttons).append(thumb).append('<div class="md-thumb-arrow" style="opacity: 0"></div>');
                        }
                    }
                    $('div.md-bullet', buttons).hover(function () {
                        $(this).addClass('md_hover');
                        var img = $("img", this);
                        if(img.length) {
                            img.show().animate({'opacity':1},200);
                            $('.md-thumb-arrow', this).show().animate({'opacity':1}, 200);
                        }
                    }, function () {
                        $(this).removeClass('md_hover');
                        $('img', this).animate({'opacity':0}, 200,function(){
                            $(this).hide();
                        });
                        $('.md-thumb-arrow',this).animate({'opacity':0},200,function(){
                            $(this).hide();
                        });
                    });
                }
                $('div.md-bullet', wrap).click(function () {
                    if ($(this).hasClass('md-current')) {
                        return false;
                    };
                    var index = $(this).attr('rel');
                    slide(index);
                });
            } else if (options.showThumb) {
                var thumbDiv = $('<div class="md-thumb"><div class="md-thumb-container"><div class="md-thumb-items"></div></div></div>').appendTo(wrap);
                slideThumb =  $(".md-thumb-items", thumbDiv);
                for (var i = 0; i < numItem; i++) {
                    var thumbSrc = slideItems[i].data("thumb");
                    if(thumbSrc) {
                        var link = $('<a class="md-thumb-item" />').attr("rel", i).append($('<img />').attr("src", thumbSrc));
                        slideThumb.append(link);
                    }
                }
                $("a", slideThumb).click(function() {
                    if ($(this).hasClass('md-current') || thumbsDrag) {
                        return false;
                    };
                    var index = $(this).attr('rel');
                    slide(index);
                });
            }
        }
        function initDrag() {
            if(hasTouch) {
                self.bind('touchstart', function (event) {
                    event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    if (!touchstart) {
                        touchstart = true;
                        if(options.transitions == "scrollVert" || options.transitions == "scrollUp" || options.transitions == "scrollDown")
                            this.mouseY = event.pageY;
                        else
                            this.mouseX = event.pageX;
                    };
                });
                self.bind('touchmove', function (event) {
                    event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    if (touchstart) {
                        if(options.transitions == "scrollVert" || options.transitions == "scrollUp" || options.transitions == "scrollDown")
                            mouseleft = event.pageY - this.mouseY;
                        else
                            mouseleft = event.pageX - this.mouseX;
                    };
                    return false;
                });
                self.bind('touchend', function (event) {
                    touchstart = false;
                    if(mouseleft > options.touchSensitive) {
                        slidePrev();
                        mouseleft = 0;
                        return false;
                    } else if(mouseleft < -options.touchSensitive) {
                        slideNext();
                        mouseleft = 0;
                        return false;
                    }

                });
                if(options.touchArrow && arrowButton) {
				    arrowButton.css({opacity:1}).show();
                }
            } else {
                hoverDiv.hover(function() {
                    if (arrowButton) {
                        arrowButton.stop(true, true).animate({opacity:1},200);
                    }
                }, function() {
                    if (arrowButton) {
                        arrowButton.stop(true, true).animate({opacity:0},200);
                    }
                });
                wrap.trigger("hover");
            }

            if (options.enableDrag) {
                self.mousedown(function (event) {
                    if (!touchstart) {
                        touchstart = true;
                        if(options.transitions == "scrollVert" || options.transitions == "scrollUp" || options.transitions == "scrollDown")
                            this.mouseY = event.pageY;
                        else
                            this.mouseX = event.pageX;
                    };
                    return false;
                });
                self.mousemove(function (event) {
                    if (touchstart) {
                        if(options.transitions == "scrollVert" || options.transitions == "scrollUp" || options.transitions == "scrollDown")
                            mouseleft = event.pageY - this.mouseY;
                        else
                            mouseleft = event.pageX - this.mouseX;
                    };
                    return false;
                });
                self.mouseup(function (event) {
                    touchstart = false;
                    if(mouseleft > options.touchSensitive) {
                        slidePrev();
                    } else if(mouseleft < -options.touchSensitive) {
                        slideNext();
                    }
                    mouseleft = 0;
                    return false;
                });
                self.mouseleave(function (event) {
                    self.mouseup();
                });
            };

        }
        function resizeThumbDiv() {
            if(slideThumb) {
                slideThumb.unbind("touchstart");
                slideThumb.unbind("touchmove");
                slideThumb.unbind("touchmove");
                slideThumb.css("left", 0);
                var thumbsWidth = $("a", slideThumb).width() * numItem;
                var thumbDiv = slideThumb.parent().parent();

                $(".md-thumb-next", thumbDiv).remove();
                $(".md-thumb-prev", thumbDiv).remove();
                if(thumbsWidth > $(".md-thumb-container", thumbDiv).width()) {
                    minThumbsLeft = $(".md-thumb-container", thumbDiv).width() - thumbsWidth;
                    slideThumb.width(thumbsWidth);
                    thumbDiv.append('<div class="md-thumb-prev"></div><div class="md-thumb-next"></div>');
                    $(".md-thumb-prev", thumbDiv).click(function() {
                        scollThumb("right");
                    });
                    $(".md-thumb-next", thumbDiv).click(function() {
                        scollThumb("left");
                    });

                    checkThumbArrow();
                    if(hasTouch) {
                        thumbsDrag = true;

                        var thumbTouch, thumbLeft;
                        slideThumb.bind('touchstart', function (event) {
                            event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            thumbTouch = true;
                            this.mouseX = event.pageX;
                            thumbLeft = slideThumb.position().left;
                            return false;
                        });
                        slideThumb.bind('touchmove', function (event) {
                            event.preventDefault();
                            event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            if (thumbTouch) {
                                slideThumb.css("left", thumbLeft + event.pageX - this.mouseX);
                            };
                            return false;
                        });
                        slideThumb.bind('touchend', function (event) {
                            event.preventDefault();
                            event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            thumbTouch = false;
                            if(Math.abs(event.pageX - this.mouseX) < options.touchSensitive) {
                                var item = $(event.target).closest('a.md-thumb-item');
                                if(item.length) {
                                    slide(item.attr('rel'));
                                }
                                slideThumb.stop(true, true).animate({left: thumbLeft}, 400);
                                return false;
                            }
                            if(slideThumb.position().left < minThumbsLeft) {
                                slideThumb.stop(true, true).animate({left: minThumbsLeft}, 400, function() {checkThumbArrow()});
                            } else if(slideThumb.position().left > 0) {
                                slideThumb.stop(true, true).animate({left: 0}, 400, function() {checkThumbArrow()});
                            }
                            thumbLeft = 0;
                            return false;
                        });
                    }
                }
            }
        }
        function scollThumb(position) {
            if(slideThumb) {
                if(position == "left") {
                    var thumbLeft = slideThumb.position().left;
                    if(thumbLeft > minThumbsLeft) {
                        var containerWidth = $(".md-thumb-container", wrap).width();
                        if((thumbLeft - containerWidth) > minThumbsLeft) {
                            slideThumb.stop(true, true).animate({left: thumbLeft - containerWidth}, 400, function() {checkThumbArrow()});
                        } else {
                            slideThumb.stop(true, true).animate({left: minThumbsLeft}, 400, function() {checkThumbArrow()});
                        }
                    }
                } else if(position == "right") {
                    var thumbLeft = slideThumb.position().left;
                    if(thumbLeft < 0) {
                        var containerWidth = $(".md-thumb-container", wrap).width();
                        if((thumbLeft + containerWidth) < 0) {
                            slideThumb.stop(true, true).animate({left: thumbLeft + containerWidth}, 400, function() {checkThumbArrow()});
                        } else {
                            slideThumb.stop(true, true).animate({left: 0}, 400, function() {checkThumbArrow()});
                        }
                    }
                } else {
                    var thumbCurrent = $("a", slideThumb).index($("a.md-current", slideThumb));
                    if(thumbCurrent >= 0) {
                        var thumbLeft = slideThumb.position().left;
                        var currentLeft = thumbCurrent * $("a", slideThumb).width();
                        if(currentLeft + thumbLeft < 0) {
                            slideThumb.stop(true, true).animate({left: -currentLeft}, 400, function() {checkThumbArrow()});
                        } else {
                            var currentRight = currentLeft + $("a", slideThumb).width();
                            var containerWidth = $(".md-thumb-container", wrap).width();
                            if (currentRight + thumbLeft > containerWidth) {
                                slideThumb.stop(true, true).animate({left: containerWidth - currentRight}, 400, function() {checkThumbArrow()});
                            }
                        }
                    }
                }
            }
        }
        function checkThumbArrow() {
            var thumbLeft = slideThumb.position().left;
            if(thumbLeft > minThumbsLeft) {
                $(".md-thumb-next", wrap).show();
            } else {
                $(".md-thumb-next", wrap).hide();
            }
            if(thumbLeft < 0) {
                $(".md-thumb-prev", wrap).show();
            } else {
                $(".md-thumb-prev", wrap).hide();
            }
        }
        function slide(index, next) {
            step = 0;
            if(loadingBar) {
                var width = step * slideWidth / slideShowDelay;
                loadingBar.width(width);
                timerGlow.css({left: width - 100 + 'px'});
            }
            if (index != activeIndex) {
                oIndex = activeIndex;
                if(next === null) {
                    next = index > oIndex;
                }
                var transitions = getTransitions(options.transitions, next);
                if (transitions) {
                    options.onStartTransition.call(self);
                    if (slideItems[oIndex]) {
                        $('div.md-bullet:eq(' + oIndex + ')', buttons).removeClass('md-current');
                        $('a:eq(' + oIndex + ')', slideThumb).removeClass('md-current');
                        removeTheCaptions(slideItems[oIndex]);
                        slideItems[oIndex].animate(transitions.oSlide, options.transitionsSpeed, function() {slideItems[oIndex].hide();});
                        slideShowDelay = slideItems[index].data("timeout") ? slideItems[index].data("timeout") : options.slideShowDelay;
                        slideItems[index].css(transitions.newSlide.before).show();
                        slideItems[index].animate(transitions.newSlide.after, options.transitionsSpeed, function() { options.onEndTransition.call(self);});
                    } else {
                        slideShowDelay = slideItems[index].data("timeout") ? slideItems[index].data("timeout") : options.slideShowDelay;
                        slideItems[index].css(transitions.newSlide.after).show();
                    }
					if(buttons)
						$('div.md-bullet:eq(' + index + ')', buttons).addClass('md-current');
					if(slideThumb)
						$('a:eq(' + index + ')', slideThumb).addClass('md-current');
                    animateTheCaptions(slideItems[index]);
                    scollThumb();
                    activeIndex = index;
                }
            }
        }
        function setTimer() {
			slide(0);
            timer = setInterval(next, 20);
        }
        function next() {
           if(play && !pause) {
               step += 20;
               if(step > slideShowDelay) {
                   slideNext();
               } else if(loadingBar) {
                   var width = step * slideWidth / slideShowDelay;
                   loadingBar.width(width);
                   timerGlow.css({left: width - 100 + 'px'});
               }
           }
        }

        function slideNext() {
			var index = activeIndex;
			index++;
			if(index >= numItem && options.loop) {
				index = 0;
				slide(index, true);
			} else if(index < numItem) {
				slide(index, true);
			}
        }
        function slidePrev() {
			
			var index = activeIndex;
			index--;
			if(index < 0 && options.loop) {
				index = numItem - 1;
				slide(index, false);
			} else if(index >= 0) {
				slide(index, false);
			}	
        }
        function endMoveCaption(caption) {
            clearTimeout(caption.data('timer-start'));
            if ($.browser.msie && parseInt($.browser.version) <= 9) {
                caption.fadeOut();
            } else {
                caption.removeClass(effectsIn.join(' '));
                var easeout = caption.data("easeout");
                if(easeout) {
                    if(easeout == "random")
                        easeout = effectsOut[Math.floor(Math.random() * e_out_length)];
                    caption.addClass(easeout);

                } else {
                    caption.hide();
                }
            }
        }
        function removeTheCaptions(oItem) {
            oItem.find(".md-object").each(function() {
                var caption = $(this);
                caption.stop(true,true);
                clearTimeout(caption.data('timer-start'));
                clearTimeout(caption.data('timer-stop'));
            });
        }
        function animateTheCaptions(nextItem) {
            nextItem.find(".md-object").each(function (boxIndex) {
                var caption = $(this);
                if(caption.data("easeout"))
                    caption.removeClass(effectsOut.join(' '));
                var easein = caption.data("easein") ? caption.data("easein") : "";
                if(easein == "random")
                    easein = effectsIn[Math.floor(Math.random() * e_in_length)];

                caption.removeClass(effectsIn.join(' '));
                caption.hide();
                if(caption.data("start") != undefined) {
                    caption.data('timer-start', setTimeout(function() {
                        if (easein == "" || ($.browser.msie && parseInt($.browser.version) <= 9)) {
                            caption.fadeIn();
                        } else {
                            caption.show().addClass(easein);
                        }

                    }, caption.data("start")));
                } else {
                    caption.show().addClass(easein);
                }
				
                if(caption.data("stop") != undefined) {
					if((numItem == 1) && caption.data("stop") == slideShowDelay && caption.data("easeout") == null) return;
                    caption.data('timer-stop', setTimeout(function() {
                        endMoveCaption(caption);
                    }, caption.data('stop')));
                }
            });
        }
        function getTransitions(transitions, next) {
            if (transitions == "scrollLeft") {
                return {
                    oSlide: {left: - slideWidth + "px", top: 0},
                    newSlide: {
                        before: {left: slideWidth + "px", top: 0},
                        after: {left: 0, top: 0}
                    }
                };
            } else if (transitions == "scrollRight") {
                return {
                    oSlide: {left: slideWidth + "px", top: 0},
                    newSlide: {
                        before: {left: -slideWidth + "px", top: 0},
                        after: {left: 0, top: 0}
                    }
                };
            }  else if (transitions == "scrollHorz") {
                if (next)
                    return getTransitions("scrollLeft");
                else
                    return getTransitions("scrollRight");
            } else if (transitions == "scrollUp") {
                return {
                    oSlide: {left: 0, top: - slideHeight + "px"},
                    newSlide: {
                        before: {left: 0, top: slideHeight+ "px"},
                        after: {left: 0, top: 0}
                    }
                };
            } else if (transitions == "scrollDown") {
                return {
                    oSlide: {left: 0, top: slideHeight+ "px"},
                    newSlide: {
                        before: {left: 0, top: -slideHeight+ "px"},
                        after: {left: 0, top: 0}
                    }
                };
            } else if (transitions == "scrollVert") {
                if (next)
                    return getTransitions("scrollUp");
                else
                    return getTransitions("scrollDown");
            } else if (transitions == "fade") {
                return {
                    oSlide: {left: 0, top: 0, opacity:0},
                    newSlide: {
                        before: {left: 0, top: 0, opacity: 0},
                        after: {left: 0, top: 0, opacity: 1}
                    }
                };
            }
        }
        function documentHasTouch() {
            return ('ontouchstart' in window || 'createTouch' in document);
        }
        function resizeWindow() {
			wrap.width();
            slideWidth = options.responsive ? wrap.width() : options.width;
            if(options.responsive && (slideWidth < options.width)) {
                slideHeight =  Math.round(slideWidth / options.width * options.height);
				
            } else {
                slideHeight = options.height;
            }
            if(!options.responsive && !options.fullwidth)
                wrap.width(slideWidth);
            if(!options.responsive && options.fullwidth)
                wrap.css({"min-width": slideWidth + "px"});
            if (options.fullwidth) {
                $(".md-objects", self).width(options.width);
				var bulletSpace = 20;
				if ((wrap.width() - options.width)/2 > 20)
					bulletSpace = (wrap.width() - options.width)/2;
				wrap.find(".md-bullets").css({'left':bulletSpace,'right':bulletSpace});
				wrap.find(".md-thumb").css({'left':bulletSpace,'right':bulletSpace});
			}
			if(options.responsive && options.fullwidth && (wrap.width() < options.width))
                $(".md-objects", self).width(slideWidth);
            wrap.height(slideHeight);
            $(".md-slide-item", self).height(slideHeight);
            resizeBackgroundImage();
            resizeThumbDiv();
			resizeFontSize();
			resizePadding();
			setThumnail()
        }
        function resizeBackgroundImage() {
            $(".md-slide-item", self).each(function() {
                var $background = $(".md-mainimg img", this);
                if($background.data("defW") && $background.data("defH")) {
                    var width = $background.data("defW"),
                        height = $background.data("defH");
                    changeImagePosition($background, width, height);
                }
            });
        }
        function preloadImages() {
            var count = $(".md-slide-item .md-mainimg img", self).length;
            self.data('count', count);
            if(self.data('count') == 0)
                slideReady();
            $(".md-slide-item .md-mainimg img", self).each(function() {
                $(this).load(function() {
                    var $image = $(this);
                    if(!$image.data('defW')) {
                        var dimensions = getImgSize($image.attr("src"));
                        changeImagePosition($image, dimensions.width, dimensions.height);
                        $image.data({
                            'defW': dimensions.width,
                            'defH': dimensions.height
                        });
                    }
                    self.data('count', self.data('count') - 1);
                    if(self.data('count') == 0)
                        slideReady();
                });
				if(this.complete) $(this).load();
            });
        }
        function slideReady() {
            self.removeClass("loading-image");
			self.removeAttr("style");
            setTimer();
        }
        function changeImagePosition($background, width, height) {
            var panelWidth = $(".md-slide-item:visible", self).width(),
                panelHeight = $(".md-slide-item:visible", self).height();
				
            if(height > 0 && panelHeight > 0) {
                if (((width / height) > (panelWidth / panelHeight))) {
                    var left = panelWidth - (panelHeight / height) * width;
                    $background.css({width: "auto", height: "100%"});
                    if(left < 0) {
                        $background.css({left: (left/2) + "px", top: 0 });
                    } else {
                        $background.css({left: 0, top: 0 });
                    }
                } else {
                    var top = panelHeight - (panelWidth / width) * height;
                    $background.css({width: "100%", height: "auto"});
                    if(top < 0) {
                        $background.css({top: (top/2) + "px", left: 0 });
                    } else {
                        $background.css({left: 0, top: 0 });
                    }
                }
            }
        }
		function resizeFontSize() {
			var fontDiff = 1;
			if (parseInt($.browser.version, 10) < 9)
				fontDiff = 6;
			if (wrap.width() < options.width) {
				$(".md-objects", self).css({'font-size': wrap.width() / options.width * 100 - fontDiff + '%'});
			} else {
				$(".md-objects", self).css({'font-size': 100 - fontDiff + '%'});
			}
		}
		function resizePadding() {
			if (wrap.width() < options.width && options.responsive) {
				$(".md-objects > div", self).each(function() {
					var objectRatio = wrap.width() / options.width,
						$_object = $(this),
						objectPadding = [];
					if ($_object.data('padding-top')) objectPadding['padding-top'] = $_object.data('padding-top') * objectRatio;
					if ($_object.data('padding-right')) objectPadding['padding-right'] = $_object.data('padding-right') * objectRatio;
					if ($_object.data('padding-bottom')) objectPadding['padding-bottom'] = $_object.data('padding-bottom') * objectRatio;
					if ($_object.data('padding-left')) objectPadding['padding-left'] = $_object.data('padding-left') * objectRatio;
                    if ($_object.find('a').length) {
                        $_object.find('a').stop().animate(objectPadding, 0);
                    } else {
                        $_object.stop().animate(objectPadding, 0);
                    }

				})
			} else {
				$(".md-objects > div", self).each(function() {
					var $_object = $(this),
						objectPadding = [];
					if ($_object.data('padding-top')) {objectPadding['padding-top'] = $_object.data('padding-top');}
					if ($_object.data('padding-right')) objectPadding['padding-right'] = $_object.data('padding-right');
					if ($_object.data('padding-bottom')) objectPadding['padding-bottom'] = $_object.data('padding-bottom');
					if ($_object.data('padding-left')) objectPadding['padding-left'] = $_object.data('padding-left');
                    if ($_object.find('a').length) {
                        $_object.find('a').stop().animate(objectPadding, 0);
                    } else {
                        $_object.stop().animate(objectPadding, 0);
                    }
				})
			}
		}
		function setThumnail() {
			if(options.showThumb && !options.showBullet) {
				thumbHeight = self.data('thumb-height');
				if(options.posThumb == '1') {
					thumbBottom = thumbHeight / 2;
					wrap.find(".md-thumb").css({'height': thumbHeight + 10,'bottom': -thumbBottom - 10});
					wrap.css({'margin-bottom': thumbBottom + 10})
				} else {
					wrap.find(".md-thumb").css({'height': thumbHeight + 10,'bottom': -(thumbHeight + 40)});
					wrap.css({'margin-bottom': thumbHeight + 50})
				}
			}
		}
        function getImgSize(imgSrc) {
            var newImg = new Image();
            newImg.src = imgSrc;
            var dimensions = {height: newImg.height, width: newImg.width};
            return dimensions;
        }
        init();
    }
})(jQuery);
