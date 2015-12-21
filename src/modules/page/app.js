define(function(require, exports, module) {

    var app = require("../../lib/app");


    app.page.login = function() {

        var color = {

            rgb2hsv: function(R, G, B) {

                var max = Math.max.apply(null, [R, G, B]);
                var min = Math.min.apply(null, [R, G, B]);
                var hsv = {};
                var x = max - min;
                if (R === G && G === B) {
                    hsv.H = 0;
                    hsv.S = 0;
                } else {

                    switch (max) {
                        case R:
                            hsv.H = (G - B) / x;
                            break;
                        case G:
                            hsv.H = 2 + (B - R) / x;
                            break;
                        case B:
                            hsv.H = 4 + (R - G) / x;
                            break;
                    }

                    hsv.H *= 60;
                    if (hsv.H < 0) {
                        hsv.H += 360;
                    }

                    hsv.H = Math.round(hsv.H);
                    hsv.S = Math.round(100 * (max - min) / max);
                }

                hsv.V = Math.round(100 * max / 255);


                return hsv;
            },
            hsv2rgb: function(H, S, V) {

                S = S > 1 ? 1 : S;
                S = S < 0 ? 0 : S;

                V = V > 1 ? 1 : V;
                V = V < 0 ? 0 : V;

                var rgb = {};
                if (S === 0) {
                    rgb.R = rgb.G = rgb.B = Math.round(255 * V);
                } else {

                    var hi = Math.floor(H / 60) % 6;

                    var f = (H / 60) - hi;

                    var p = Math.round(V * (1 - S) * 255);
                    var q = Math.round(V * (1 - f * S) * 255);
                    var t = Math.round(V * (1 - (1 - f) * S) * 255);
                    V = Math.round(V * 255);
                    switch (hi) {
                        case 0:
                            rgb.R = V;
                            rgb.G = t;
                            rgb.B = p;
                            break;
                        case 1:
                            rgb.R = q;
                            rgb.G = V;
                            rgb.B = p;
                            break;
                        case 2:
                            rgb.R = p;
                            rgb.G = V;
                            rgb.B = t;
                            break;
                        case 3:
                            rgb.R = p;
                            rgb.G = q;
                            rgb.B = V;
                            break;
                        case 4:
                            rgb.R = t;
                            rgb.G = p;
                            rgb.B = V;
                            break;
                        case 5:
                            rgb.R = V;
                            rgb.G = p;
                            rgb.B = q;
                            break;
                    }
                }

                return rgb;
            }
        };


        function createColorPanel(rbg_color) {

            var bc_rgb = {
                R: to10(rbg_color.substr(0, 2)),
                G: to10(rbg_color.substr(2, 2)),
                B: to10(rbg_color.substr(4, 2))
            };

            var bc_hsv = color.rgb2hsv(bc_rgb.R, bc_rgb.G, bc_rgb.B);

            var h = bc_hsv.H;
            var s = bc_hsv.S / 100;
            var v = bc_hsv.V / 100;

            var colors = [];
            var colors_name = ['@H050', '@H100', '@H200', '@H300', '@H400', '@H500', '@H600', '@H700', '@H800', '@H900'];


            var k_s = [-0.8, -0.5, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.5];
            var k_v = [0.5, 0.4, 0.3, 0.2, 0.1, 0, -0.1, -0.2, -0.3, -0.4];


            for (var i = 0, len = k_s.length, _s, _v; i < len; i++) {
                if (i === 5) {
                    colors.push({
                        R: bc_rgb.R,
                        G: bc_rgb.G,
                        B: bc_rgb.B
                    });
                    continue;
                }
                _s = k_s[i];
                if (bc_rgb.R === bc_rgb.G && bc_rgb.R === bc_rgb.B) {
                    _s = 0;
                }
                _v = k_v[i];
                colors.push(color.hsv2rgb(h, s + _s, v + _v));
            }


            var panel_index = new Date().getTime();

            $("#panel_color_wrap").append("<ul id='cl_" + panel_index + "' class='panel_color'></ul>");

            i = 0;
            var k = setInterval(function() {

                if (i === colors.length) {
                    clearInterval(k);
                    return;
                }
                var rgb = to16(colors[i].R) + to16(colors[i].G) + to16(colors[i].B);
                var font_color = i >= 5 ? "color:#fff" : "color:#555";
                var item = $("<li style='display:none;background:#" + rgb + ";" + font_color + "'>" + colors_name[i] + ":#" + rgb + ";</li>");
                $("#cl_" + panel_index).append(item);

                item.slideDown();
                i++;

            }, 100);

        }


        function to16(n) {
            var n16 = n.toString(16);
            if (n16.length === 1) {
                n16 = "0" + n16;
            }
            return n16;
        }

        function to10(n) {
            var n10 = parseInt("0x" + n);
            return n10;
        }


        createColorPanel("1b9451");

        setTimeout(function() {
            createColorPanel("29a7e1");
        }, 200);

        setTimeout(function() {
            createColorPanel("9c27b0");
        }, 500);


        $("#btn_add_color").click(function() {
            var color = $("#txt_color").val();
            if (color.indexOf("#") > -1) {
                color = color.substr(1);
            }
            if (color.length !== 6) {
                view.showMessage("格式错误", "error");
                return;
            }
            createColorPanel(color);

        });


        var handleColorPicker = function() {
            if (!jQuery().colorpicker) {
                return;
            }
            $('.colorpicker-default').colorpicker({
                format: 'hex'
            });
            $('.colorpicker-rgba').colorpicker();
        };


        handleColorPicker();

    };


    module.exports = app;

});