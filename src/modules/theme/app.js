define(function(require, exports, module) {

    var app = require("../../lib/app");
    var model = require('./model');

    require('../../plugins/colorpicker/js/colorpicker');

    app.page.color = function() {
        /*
         * Color utility functions
         * Source: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
         * Github: https://github.com/mbitson/mcg
         */
        function shadeColor(color, percent) {
            var f = parseInt(color.slice(1), 16),
                t = percent < 0 ? 0 : 255,
                p = percent < 0 ? percent * -1 : percent,
                R = f >> 16,
                G = f >> 8 & 0x00FF,
                B = f & 0x0000FF;
            return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
        }

        function computeColors(color) {
            // Return array of color objects.
            return [{
                hex: shadeColor(color, 0.9),
                name: '@H050'
            }, {
                hex: shadeColor(color, 0.7),
                name: '@H100'
            }, {
                hex: shadeColor(color, 0.5),
                name: '@H200'
            }, {
                hex: shadeColor(color, 0.333),
                name: '@H300'
            }, {
                hex: shadeColor(color, 0.166),
                name: '@H400'
            }, {
                hex: shadeColor(color, 0),
                name: '@H500'
            }, {
                hex: shadeColor(color, -0.125),
                name: '@H600'
            }, {
                hex: shadeColor(color, -0.25),
                name: '@H700'
            }, {
                hex: shadeColor(color, -0.375),
                name: '@H800'
            }, {
                hex: shadeColor(color, -0.5),
                name: '@H900'
            }];
        }

        function ColorPanel() {

            var id = '_' + (Math.random() * 1E18).toString(36).slice(0, 5).toUpperCase(),
                i = 0;

            this.element = $("<ul id='cl_" + id + "' class='panel_color'></ul>");

            this.draw = function(color) {

                $("#panel_color_wrap").append(this.element);
                var colors = computeColors(color),
                    i = 0,
                    element = this.element,
                    font_color = "#f5f5f5";
                var timer = setInterval(function() {
                    if (i === colors.length) {
                        clearInterval(timer);
                        return;
                    }

                    if (i >= 5) {
                        font_color = "color:#fff";
                    }
                    var item = $("<li style='display:none;background:" + colors[i].hex + ";" + font_color + "'>" + colors[i].name + ":" + colors[i].hex + ";</li>");
                    element.append(item);
                    i++;
                    item.slideDown();
                }, 100);
            };
        }

        $("#btn_add_color").click(function() {
            var color = $("#txt_color").val();
            new ColorPanel().draw(color);
        });

        var handleColorPicker = function() {
            if (!jQuery().colorpicker) {
                return;
            }
            $('.colorpicker-default').colorpicker({
                format: 'hex'
            });

        };


        new ColorPanel().draw("#1b9451");
        new ColorPanel().draw("#29a7e1");
        new ColorPanel().draw("#9c27b0");

        handleColorPicker();
    };

    app.page.buttons = function() {

    };



    module.exports = app;

});
