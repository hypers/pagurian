define(function(require, exports, module) {

    var isRTL = false;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;

    var sidebarWidth = 225;
    var sidebarCollapsedWidth = 35;

    /**
     * 获取可视范围的高度，宽度
     * @return {Object} [{width,height}]
     */
    var _getViewPort = function() {
        var e = window,
            a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        };
    };

    /**
     * 初始化主要设置
     */
    var doInit = function() {

        if ($('body').css('direction') === 'rtl') {
            isRTL = true;
        }

        isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

        if (isIE10) {
            jQuery('html').addClass('ie10'); // detect IE10 version
        }

        if (isIE10 || isIE9 || isIE8) {
            jQuery('html').addClass('ie'); // detect IE10 version
        }


    };


    /**
     * 重新初始化上的窗口大小调整布局
     */
    var doResponsive = function() {
        doSidebarAndContentHeight();
        doAppResizeEvent();
        doModalHeight();
    };

    /**
     *  在初始化页面加载布局
     */
    var doResponsiveOnInit = function() {
        doSidebarAndContentHeight();
    };

    /**
     *  处理窗口大小调整布局初始化
     */
    var doResponsiveOnResize = function() {
        var resize;
        if (isIE8) {
            var currheight;
            $(window).resize(function() {
                if (currheight == document.documentElement.clientHeight) {
                    return; //quite event since only body resized not window.
                }
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function() {
                    doResponsive();
                }, 50); // wait 50ms until window resize finishes.
                currheight = document.documentElement.clientHeight; // store last body client height
            });
        } else {
            $(window).resize(function() {
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function() {
                    doResponsive();
                }, 50); // wait 50ms until window resize finishes.
            });
        }
    };

    /**
     * 设置适当的高度，侧边栏和内容。内容和侧边栏的高度必须始终同步。
     */
    var doSidebarAndContentHeight = function() {
        var content = $('.page-content');
        var sidebar = $('.page-sidebar');
        var sidebarMenu = $('.page-sidebar-menu');
        var container = $('.page-container');
        var body = $('body');
        var height;
        var available_height;
        var side_height;

        if (body.hasClass("page-footer-fixed") === true && body.hasClass("page-sidebar-fixed") === false) {
            available_height = $(window).height() - $('.footer').outerHeight();
            if (content.height() < available_height) {
                content.css("min-height", available_height + 'px');
            }
        } else {

            if ($('.footer').hasClass("fixed")) {
                $('.footer').removeClass("fixed");
            }
            if (body.hasClass('page-sidebar-fixed')) {
                height = _calculateFixedSidebarViewportHeight();
            } else {
                available_height = $(window).height() - $('.footer').outerHeight() - $('.header').outerHeight();
                side_height = sidebarMenu.height();
                if (content.height() < available_height) {
                    if (available_height < side_height) {
                        available_height = side_height;
                    }
                    container.css("min-height", available_height + 'px');
                }

            }


        }
    };

    /**
     * 设置Modal的滚动高度
     */
    var doModalHeight = function() {
        var modal_body = $(".modal.in .modal-body");


        if(modal_body.length<1){
            return;
        }
        //modal 滚动高度
        var available_height = modal_body[0].scrollHeight;

        //$('#modal' + _id + ' .modal-footer') + $('#modal' + _id + ' .modal-footer');
        var custom_height = 114;
        //$('.footer').outerHeight()
        var footer_height = 50;
        //$('.header').outerHeight()
        var header_height = 50;

        //页面的工作区域高度
        var content_height = $(window).height() - footer_height - header_height - custom_height;

        if (available_height >= content_height) {
            modal_body.css("max-height", content_height);
        }

    };


    /**
     * 辅助函数来计算侧边栏高度固定侧边栏布局。
     */
    var _calculateFixedSidebarViewportHeight = function() {
        var sidebarHeight = $(window).height() - $('.header').height() + 1;
        if ($('body').hasClass("page-footer-fixed")) {
            sidebarHeight = sidebarHeight - $('.footer').outerHeight();
        }

        return sidebarHeight;
    };



    /**
     * 把手portlet的工具和行动
     */
    var doPortletTools = function() {
        jQuery('body').on('click', '.portlet > .portlet-title > .tools > a.remove', function(e) {
            e.preventDefault();
            jQuery(this).closest(".portlet").remove();
        });
        jQuery('body').on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function(e) {
            e.preventDefault();
            var el = jQuery(this).closest(".portlet").children(".portlet-body");
            if (jQuery(this).hasClass("collapse")) {
                jQuery(this).removeClass("collapse").addClass("expand");
                el.slideUp(200);
            } else {
                jQuery(this).removeClass("expand").addClass("collapse");
                el.slideDown(200);
            }
        });
    }

    /**
     * 处理使用jQuery插件统一定制的复选框和收音机
     */
    var doUniform = function() {
        if (!jQuery().uniform) {
            return;
        }
        var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");
        if (test.size() > 0) {
            test.each(function() {
                if ($(this).parents(".checker").size() == 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    }



    /**
     * 处理 Bootstrap Tooltips.
     */
    var doTooltips = function() {
        jQuery('.tooltips').tooltip();
    }

    /**
     * 处理 Bootstrap Dropdowns
     */
    var doDropdowns = function() {

        $('body').on('click', '.dropdown-menu.hold-on-click', function(e) {
            e.stopPropagation();
        });
    }

    /**
     * 处理 Hower Dropdowns
     */
    var doDropdownHover = function() {
        $('[data-hover="dropdown"]').dropdownHover();
    }

    /**
     * 处理 Alerts
     */
    var doAlerts = function() {
        $('body').on('click', '[data-close="alert"]', function(e) {
            $(this).parent('.alert').hide();
            e.preventDefault();
        });
    };


    /**
     * 处理 popovers
     */
    var doPopovers = function() {
        jQuery('.popovers').popover();

    };

    /**
     * 处理 Tabs
     */
    var doTabs = function() {

        $('body').on('shown.bs.tab', '.nav.nav-tabs', function() {
            doSidebarAndContentHeight();
        });
        if (location.hash) {
            var tabid = location.hash.substr(1);
            $('a[href="#' + tabid + '"]').parents('.tab-pane:hidden').each(function() {
                var tabid = $(this).attr("id");
                $('a[href="#' + tabid + '"]').click();
            });
            $('a[href="#' + tabid + '"]').click();
        }
    };


    /**
     * 解决IE8和IE9的Placeholder问题
     */
    var doFixInputPlaceholderForIE = function() {
        if (isIE8 || isIE9) {
            jQuery('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function() {

                var input = jQuery(this);

                if (input.val() == '' && input.attr("placeholder") != '') {
                    input.addClass("placeholder").val(input.attr('placeholder'));
                }

                input.focus(function() {
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });

                input.blur(function() {
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    }



    /**
     * 处理 Select2 Dropdowns
     */
    var doSelect2 = function() {
        if (jQuery().select2) {
            $('.select2me').select2({
                placeholder: "Select",
                allowClear: true
            });
        }
    }

    /**
     * 处理 Theme Settings
     */
    var doTheme = function() {

        var panel = $('.theme-panel');

        var setColor = function(color) {
            $("#style_themes").attr("href", pagurian.path.app + "resources/css/themes-" + (color || "default") + ".css");
            $.cookie('style_color', color);
        }

        $('.toggler', panel).click(function() {
            $('.toggler').hide();
            $('.toggler-close').show();
            $('.theme-panel > .theme-options').show();
        });

        $('.toggler-close', panel).click(function() {
            $('.toggler').show();
            $('.toggler-close').hide();
            $('.theme-panel > .theme-options').hide();
        });

        $('.theme-colors > ul > li', panel).click(function() {
            var color = $(this).attr("data-style");
            setColor(color);

            $('ul > li', panel).removeClass("current");
            $(this).addClass("current");
        });


    }

    var doHLJS = function() {
        if (!window.hljs) {
            return;
        }

        $('pre code').each(function() {
            var lines = $(this).text().split('\n').length;
            var $numbering = $('<ul/>').addClass('pre-numbering');
            $(this)
                .addClass('has-numbering')
                .parent()
                .append($numbering);
            for (i = 1; i <= lines; i++) {
                $numbering.append($('<li/>').text(i));
            }
        });

        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    }

    //处理APP回调事件
    var doAppResizeEvent = function() {
        for (var i = 0, len = callbackQueue.length; i < len; i++) {
            if ("function" === typeof callbackQueue[i]) {
                callbackQueue[i]();
            }
        }
    }

    var callbackQueue = [];

    var loyout = {

        init: function() {

            doInit();
            doResponsiveOnResize();
            doUniform();
            doResponsiveOnInit();

            doFixInputPlaceholderForIE();

            doSelect2();
            doPortletTools();
            doAlerts();
            doDropdowns();
            doTooltips();
            doPopovers();
            doTabs();
            doTheme();
            doHLJS();
        },

        fixContentHeight: function() {
            doSidebarAndContentHeight();
        },
        resize: function(callback) {
            callbackQueue.push(callback);
        },
        custom: function() {

            $(".page-sidebar-menu>li>a").click(function() {
                var o = $(this).parents("li");
                if (o.hasClass("open")) {
                    o.removeClass("open");
                    o.find(".arrow").removeClass("open");
                    o.find(".sub-menu").slideUp(100);
                    return;
                }
                o.addClass("open");
                o.find(".arrow").addClass("open");
                o.find(".sub-menu").slideDown(100);
            });

        }

    };

    module.exports = loyout;

});
