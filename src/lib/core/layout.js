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
    function _getViewPort() {
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
    }

    /**
     * 初始化主要设置
     */
    function doInit() {

        if ($('body').css('direction') === 'rtl') {
            isRTL = true;
        }

        isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

        if (isIE10) {
            $('html').addClass('ie10'); // detect IE10 version
        }

        if (isIE10 || isIE9 || isIE8) {
            $('html').addClass('ie'); // detect IE10 version
        }
    }


    /**
     * 重新初始化上的窗口大小调整布局
     */
    function doResponsive() {

        doSidebarAndContentHeight();
        doAppResizeEvent();
        doModalHeight();
    }

    /**
     *  在初始化页面加载布局
     */
    function doResponsiveOnInit() {
        doSidebarAndContentHeight();
    }

    /**
     *  处理窗口大小调整布局初始化
     */
    function doResponsiveOnResize() {

        var resize;
        if (isIE8) {
            var currheight;
            $(window).resize($p.tool.debounce(function() {
                if (currheight === document.documentElement.clientHeight) {
                    return; //quite event since only body resized not window.
                }
                doResponsive();
                currheight = document.documentElement.clientHeight;
            }, 50));
        } else {
            $(window).resize($p.tool.debounce(function() {
                doResponsive();
            }, 50));
        }
    }

    /**
     * 设置适当的高度，侧边栏和内容。内容和侧边栏的高度必须始终同步。
     */
    function doSidebarAndContentHeight() {
        var content = $('.page-content');
        var available_height = $(window).height() - $('.footer').outerHeight() - $('.header').outerHeight();
        if ($('.footer').hasClass("fixed")) {
            $('.footer').removeClass("fixed");
        }
        content.css("min-height", available_height + 'px');
    }

    /**
     * 设置Modal的滚动高度
     */
    function doModalHeight() {

        var modal_body = $(".modal:visible .modal-body");

        if (modal_body.length < 1) {
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
        } else {
            modal_body.css("max-height", "none");
        }
    }


    /**
     * 把手portlet的工具和行动
     */
    function doPortletTools() {
        $('body').on('click', '.portlet > .portlet-title > .tools > a.remove', function(e) {
            e.preventDefault();
            $(this).closest(".portlet").remove();
        });
        $('body').on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function(e) {
            e.preventDefault();
            var el = $(this).closest(".portlet").children(".portlet-body");

            if ($(this).hasClass("collapse")) {
                $(this).removeClass("collapse").addClass("expand");
                el.slideUp(200);
            } else {
                $(this).removeClass("expand").addClass("collapse");
                el.slideDown(200);
            }
        });
    }

    /**
     * 处理使用jQuery插件统一定制的复选框和收音机
     */
    function doUniform() {
        if (!jQuery().uniform) {
            return;
        }
        var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");
        if (test.size() > 0) {
            test.each(function() {
                if ($(this).parents(".checker").size() === 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    }



    /**
     * 处理 Bootstrap Tooltips.
     */
    function doTooltips() {
        $('.tooltips').tooltip();
    }

    /**
     * 处理 Bootstrap Dropdowns
     */
    function doDropdowns() {

        $('body').on('click', '.dropdown-menu.hold-on-click', function(e) {
            e.stopPropagation();
        });

        $(document).delegate("[data-type='select'] .dropdown-menu a", 'click', function() {
            var text = $(this).text();
            var icon = $(this).parents(".btn-group").find("button>i").prop("outerHTML");
            $(this).parents(".dropdown-menu").prev().html(text + ' ' + icon);
        });
    }

    /**
     * 处理 Hower Dropdowns
     */
    function doDropdownHover() {
        if ($.fn.dropdownHover) {
            $('[data-hover="dropdown"]').dropdownHover();
        }
    }

    /**
     * 处理 Alerts
     */
    function doAlerts() {
        $('body').on('click', '[data-close="alert"]', function(e) {
            $(this).parent('.alert').hide();
            e.preventDefault();
        });
    }


    /**
     * 处理 popovers
     */
    function doPopovers() {
        $('.popovers').popover();
    }

    /**
     * 处理 Tabs
     */
    function doTabs() {

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
    }


    /**
     * 解决IE8和IE9的Placeholder问题
     */
    function doFixInputPlaceholderForIE() {
        if (isIE8 || isIE9) {
            $('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function() {

                var input = $(this);

                if (input.val() === '' && input.attr("placeholder") !== '') {
                    input.addClass("placeholder").val(input.attr('placeholder'));
                }

                input.focus(function() {
                    if (input.val() === input.attr('placeholder')) {
                        input.val('');
                    }
                });

                input.blur(function() {
                    if (input.val() === '' || input.val() === input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    }



    /**
     * 处理 Select2 Dropdowns
     */
    function doSelect2() {
        if (jQuery().select2) {
            $('.select2me').select2({
                placeholder: "Select",
                allowClear: true
            });
        }
    }


    function doHighlightCode() {
        if (!window.hljs) {
            return;
        }

        $('pre code').each(function() {
            var lines = $(this).text().split('\n').length;
            var $numbering = $('<ul/>').addClass('pre-numbering');
            $(this).addClass('has-numbering').parent().append($numbering);
            for (i = 1; i <= lines; i++) {
                $numbering.append($('<li/>').text(i));
            }
        });

        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    }

    //处理APP回调事件
    function doAppResizeEvent() {
        for (var i = 0, len = resizeEventQueue.length; i < len; i++) {
            if ("function" === typeof resizeEventQueue[i]) {
                resizeEventQueue[i]();
            }
        }
    }

    function doSidebarOver() {
        var $spanner = $(".page-sidebar-spanner");
        var $sidebar = $(".page-sidebar-wrapper");

        var menuHeight = $(".page-sidebar-menu").height();
        var sidebarHeight = $sidebar.height();

        var top = $sidebar.scrollTop();
        var left = $(window).scrollLeft();
        if ((top - 50 + sidebarHeight) >= menuHeight) {
            $spanner.removeClass("over");
        } else {
            $spanner.addClass("over");
        }

        if(left > 2){
            $sidebar.addClass("over");
        }else{
            $sidebar.removeClass("over");
        }

    }

    //处理左侧菜单滚动事件
    function doSidebarScroll() {

        resizeEventQueue.push(doSidebarOver);
        $(".page-sidebar-wrapper").scroll(function() {
            doSidebarOver();
        });
        doSidebarOver();
    }


    function doWindowScroll(){
        $(window).scroll(function() {
            doSidebarOver();
        });
    }

    //处理左侧菜单隐藏显示
    function doSidebarToggle() {

        if (!$(".page-sidebar-wrapper").length) {
            return;
        }

        var display = $.cookie("sidebar_display") || "show";
        if (display === "show") {
            show();
        } else {
            hide();
        }

        function setCookie(value) {
            display = value;
            $.cookie("sidebar_display", value, {
                path: '/'
            });
        }

        function hide() {
            $("body").addClass("sidebar-hide");
        }

        function show() {
            $("body").removeClass("sidebar-hide");
        }

        function toggle() {
            if (display === "show") {
                hide();
                setCookie("hide");
                return;
            }
            show();
            setCookie("show");
        }

        $(".page-sidebar-spanner").click(function() {
            toggle();
            doAppResizeEvent();
        });

    }

    //更新菜单状态
    function doSidebarMenuStatus() {

        var menuId = $(".page-sidebar-menu").attr("id") || "menu";
        var items = $.cookie(menuId + "_close_items");
        items = items ? items.split(",") : [];

        $(".page-sidebar-menu>li").each(function(index) {
            index = $(this).data("id");
            if ($.inArray(index, items) >= 0) {
                $(this).removeClass("open");
            } else {
                $(this).addClass("open");
            }
        });

        return function() {
            var items = [];
            $(".page-sidebar-menu>li").each(function(index) {
                if (!$(this).hasClass("open")) {
                    items.push($(this).data("id"));
                }
            });
            $.cookie(menuId + "_close_items", items, {
                path: '/'
            });
        };
    }

    var resizeEventQueue = [];

    module.exports = {

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
            doDropdownHover();
            doTooltips();
            doPopovers();
            doTabs();
            doHighlightCode();
            doSidebarScroll();
            doSidebarToggle();
            doWindowScroll();
        },

        fixContentHeight: function() {
            doSidebarAndContentHeight();
        },
        resize: function(callback) {
            resizeEventQueue.push(callback);
        },
        activateCurrentMenu: function() {
            if (window.CONFIG && CONFIG.appId) {
                $(".page-sidebar-menu li[data-id='" + CONFIG.appId + "']").addClass("active");
            }
        },
        updateUniform: function() {
            doUniform();
        },
        custom: function() {

            var _doSidebarMenuStatus = doSidebarMenuStatus();
            $(".page-sidebar-menu>li>a").on("click", function(e) {

                var $li = $(this).parent();
                if ($li.hasClass("open")) {
                    $li.removeClass("open");
                    $li.find(".arrow").removeClass("open");
                } else {
                    $li.addClass("open");
                    $li.find(".arrow").addClass("open");
                }

                _doSidebarMenuStatus();
                doSidebarOver();
            });

        }
    };
});
