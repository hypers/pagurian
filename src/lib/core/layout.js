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
            $('html').addClass('ie10'); // detect IE10 version
        }

        if (isIE10 || isIE9 || isIE8) {
            $('html').addClass('ie'); // detect IE10 version
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
                if (currheight === document.documentElement.clientHeight) {
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
    };

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
                if ($(this).parents(".checker").size() === 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    };



    /**
     * 处理 Bootstrap Tooltips.
     */
    var doTooltips = function() {
        $('.tooltips').tooltip();
    };

    /**
     * 处理 Bootstrap Dropdowns
     */
    var doDropdowns = function() {

        $('body').on('click', '.dropdown-menu.hold-on-click', function(e) {
            e.stopPropagation();
        });

        $("[data-type='select']").on("click", " .dropdown-menu a", function() {
            var text = $(this).text();
            var icon = $(this).parents(".btn-group").find("button>i").prop("outerHTML");
            $(this).parents(".dropdown-menu").prev().html(text + ' ' + icon);
        });

    };

    /**
     * 处理 Hower Dropdowns
     */
    var doDropdownHover = function() {
        if ($.fn.dropdownHover) {
            $('[data-hover="dropdown"]').dropdownHover();
        }
    };

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
        $('.popovers').popover();
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
    };



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
    };


    /**
     * 处理 Theme Settings
     */
    var doTheme = function() {

        var panel = $('.theme-panel');

        var setColor = function(color) {
            $("#style_themes").attr("href", pagurian.path.app + "resources/css/themes-" + (color || "default") + ".css");
            $.cookie('style_color', color);
        };

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

    };

    var doHighlightCode = function() {
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
    };

    //处理APP回调事件
    var doAppResizeEvent = function() {
        for (var i = 0, len = callbackQueue.length; i < len; i++) {
            if ("function" === typeof callbackQueue[i]) {
                callbackQueue[i]();
            }
        }
    };

    var callbackQueue = [];

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
            doTheme();
            doHighlightCode();
        },

        fixContentHeight: function() {
            doSidebarAndContentHeight();
        },
        resize: function(callback) {
            callbackQueue.push(callback);
        },
        initDropdownMenu: function() {
            var dropdown = new Dropdown("#dropdown_pro_menu");
            callbackQueue.push(function() {
                dropdown.update();
            });
            this.dropdown = dropdown;
            return this;
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

            $(".page-sidebar-menu>li>a").on("click", function() {
                var $li = $(this).parents("li");
                if ($li.hasClass("open")) {
                    $li.removeClass("open");
                    $li.find(".arrow").removeClass("open");
                } else {
                    $li.addClass("open");
                    $li.find(".arrow").addClass("open");
                }
            });
        }
    };

    function Dropdown(selector, options) {

        this.windowHeight = $(window).height();
        this.isExpandSubMenu = 0;

        var dom = $(selector); //当前菜单对象
        var header_h = 60; //的高度
        var item_h = 40; //每一个菜单高度
        var scroll_min_h = 200; //滚动最小高度
        var arrow_h = 20; //上下箭头高度

        var first = dom.find(".dropdown-level-first"); //一级菜单
        var second = dom.find(".dropdown-level-second"); //二级菜单
        var third = dom.find(".dropdown-level-third"); //三级菜单

        var first_count = first.children("ul").children("li").length; //一级菜单个数
        var first_h = first_count * item_h; //一级菜单的总高度

        this.initFirstHeight = function() {
            first.find(".dropdown-scroll-top").remove();
            first.find(".dropdown-scroll-bottom").remove();

            //如果可视高度小于一级菜单高度时显示箭头
            if ((this.windowHeight - header_h) < first_h) {
                first.prepend('<a class="dropdown-scroll-top disabled"><i class="fa fa-angle-up "></i></a>');
                first.append('<a class="dropdown-scroll-bottom"><i class="fa fa-angle-down"></i></a>');
                first.css("height", this.windowHeight - header_h);
            } else {
                first.css("height", first_h);
            }
        };

        this.init = function() {

            this.level_in = 1;
            this.level_out = 1;
            this.level_base = 0;
            var dropdown = this;

            this.initFirstHeight();

            dom.hover(function() {
                dropdown.level_base = 1;
                first.show();
            }, function() {
                first.hide();
                dropdown.level_base = 0;
                if (dropdown.level_in === 1 && dropdown.level_out === 1) {
                    second.hide();
                    third.hide();
                }
            });

            $(".dropdown-wrap").mouseenter(function() {
                dropdown.level_in = $(this).data("level");
                $(".dropdown-wrap").each(function() {
                    var o = $(this);
                    var level = o.data("level");
                    if (dropdown.isExpandSubMenu === 1 && (level - dropdown.level_in === 1)) {
                        //...
                    } else if (level > dropdown.level_in) {
                        o.hide();
                    }
                });
            });

            $(".dropdown-wrap").mouseleave(function() {
                dropdown.level_out = $(this).data("level");
                var o = $(this);

                var k = setTimeout(function() {
                    if (dropdown.level_base) {
                        return;
                    }

                    if (dropdown.level_in === dropdown.level_out) {
                        first.hide();
                        second.hide();
                        third.hide();
                        dom.find("li").removeClass("active");
                    }

                    clearTimeout(k);
                }, 100);
            });

            $(".dropdown-wrap").click(function() {
                second.hide();
                third.hide();
            });

            //设置一级滚动事件
            this.setDropdownScroll(first);

            //展开二级菜单
            this.hoverMenu(first, second);

            this.dropdownMouseWheel(first);
            this.dropdownMouseWheel(second);
            this.dropdownMouseWheel(third);

        };
        this.update = function() {
            this.windowHeight = $(window).height();
            this.initFirstHeight();
            this.setDropdownScroll(first);
            this.hoverMenu(first, second);
        };

        //鼠标滚动事件
        this.dropdownMouseWheel = function(obj) {

            obj.unbind("mousewheel");
            obj.bind('mousewheel', function(event, delta) {

                var scroll_top = obj.find(".dropdown-scroll-top");
                var scroll_bottom = obj.find(".dropdown-scroll-bottom");

                var dir = delta > 0 ? 'up' : 'down';



                if ($(this).find(".dropdown-scroll-top").length === 0) {
                    return;
                }

                var item = $(this).children(".dropdown-menu");
                var t = parseInt(item.css("top"));
                var _l = item.children("li").length;


                if (dir === "up") {
                    scroll_bottom.removeClass("disabled");
                    if (t >= 20) {
                        scroll_top.addClass("disabled");
                        return false;
                    }
                    t += 20;
                    item.css("top", t);
                } else {
                    scroll_top.removeClass("disabled");
                    if (t <= ($(this).height() - (_l * item_h) - arrow_h)) {
                        scroll_bottom.addClass("disabled");
                        return false;
                    }
                    t -= 20;
                    item.css("top", t);
                }
                return false;
            });
        };

        this.setDropdownScroll = function(obj) {


            var levels = ['first', 'second', 'third'];
            var _l = obj.children("ul").children("li").length;
            var dropdown = this;
            var timer; //定时器
            obj.find(".dropdown-scroll-top").unbind();
            obj.find(".dropdown-scroll-top").hover(function() {

                obj.find(".dropdown-scroll-bottom").removeClass("disabled");
                var scroll = $(this);

                hideChild(scroll);

                var that = $(this).next();
                var t = parseInt(that.css("top"));
                timer = setInterval(function() {
                    if (t >= 20) {
                        scroll.addClass("disabled");
                        clearInterval(timer);
                        return;
                    }
                    t += 10;
                    that.css("top", t);
                }, 30);

            }, function() {
                clearInterval(timer);
            });

            obj.find(".dropdown-scroll-bottom").unbind();
            obj.find(".dropdown-scroll-bottom").hover(function() {

                obj.find(".dropdown-scroll-top").removeClass("disabled");

                var scroll = $(this);
                hideChild(scroll);

                var o = $(this).prev();
                var t = parseInt(o.css("top"));

                timer = setInterval(function() {

                    if (t <= (obj.height() - (_l * item_h) - arrow_h)) {
                        scroll.addClass("disabled");
                        clearInterval(timer);
                        return;
                    }

                    t -= 10;
                    o.css("top", t);
                }, 30);
            }, function() {
                clearInterval(timer);
            });


            function hideChild(activeObj) {
                var obj_dropdown = activeObj.parents(".dropdown-wrap");
                var level = obj_dropdown.data("level");
                if (level === 1) {
                    second.hide();
                    third.hide();
                }
                if (level === 2) {
                    third.hide();
                }

            }
        };

        this.hoverMenu = function(obj, subObj) {

            var dropdown = this;
            var timer;
            var level_active = 0;
            obj.find("li").unbind("mouseenter");
            obj.find("li").mouseenter(function() {

                level_active = dropdown.level_in;
                obj.find("li").removeClass("active");

                //console.log(dropdown.level_in + "========" + dropdown.level_out + "--------" + dropdown.level_base + ">>>>>>>>>" + dropdown.isExpandSubMenu + "//////////////" + level_active);

                if ($(this).hasClass("dropdown-submenu")) {

                    if (timer) {
                        clearTimeout(timer);
                    }

                    dropdown.isExpandSubMenu = 1;

                    $(this).addClass("active");
                    var offset = $(this).offset();
                    var top = offset.top;
                    var item = $(this).find(".dropdown-menu:eq(0)");
                    var l = item.children("li").length;
                    var total_h = item_h * l; //二级菜单高度

                    subObj.html(item.clone());
                    subObj.css("top", top - 1);

                    //如果可视高度小于二级菜单高度时显示箭头
                    if (dropdown.windowHeight < (total_h + top)) {

                        if (total_h > scroll_min_h) {
                            subObj.prepend('<a class="dropdown-scroll-top disabled"><i class="fa fa-angle-up"></i></a>');
                            subObj.append('<a class="dropdown-scroll-bottom"><i class="fa fa-angle-down"></i></a>');
                        }

                        var _total_h = dropdown.windowHeight - top; //二级菜单可显示的高度

                        if (scroll_min_h > _total_h) {
                            subObj.css("height", scroll_min_h);
                            subObj.css("top", top - (scroll_min_h - _total_h));
                        } else {
                            subObj.css("height", _total_h);
                        }

                    } else {
                        subObj.css("height", total_h);
                    }

                    subObj.show();

                    //设置滚动事件
                    dropdown.setDropdownScroll(subObj);

                    //展开三级菜单
                    dropdown.hoverMenu(second, third);

                    return;
                }

                dropdown.isExpandSubMenu = 0;
                timer = setTimeout(function() {

                    if (level_active === 2) {
                        subObj.hide();
                        return;
                    }

                    if (dropdown.level_in > dropdown.level_out || dropdown.isExpandSubMenu === 1) {
                        return;
                    }

                    subObj.hide();

                }, 300);

            });
        };

        this.init();
    }


});
