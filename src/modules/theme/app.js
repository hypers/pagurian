define(function(require, exports, module) {

    var app = require('../../lib/app');
    var model = require('./model');


    require('../../plugins/bootstrap-colorpicker/js/bootstrap-colorpicker');
    seajs.use("../plugins/bootstrap-colorpicker/css/colorpicker.css");

    app.page.color = function() {

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
            },
            hsl2rgb: function(H, S, L) {

                /*
                 * H ∈ [0°, 360°)
                 * S ∈ [0, 1]
                 * L ∈ [0, 1]
                 */

                /* calculate chroma */
                var C = (1 - Math.abs((2 * L) - 1)) * S;

                /* Find a point (R1, G1, B1) along the bottom three faces of the RGB cube, with the same hue and chroma as our color (using the intermediate value X for the second largest component of this color) */
                var H_ = H / 60;

                var X = C * (1 - Math.abs((H_ % 2) - 1));

                var R1, G1, B1;

                if (H === undefined || isNaN(H) || H === null) {
                    R1 = G1 = B1 = 0;
                } else {

                    if (H_ >= 0 && H_ < 1) {
                        R1 = C;
                        G1 = X;
                        B1 = 0;
                    } else if (H_ >= 1 && H_ < 2) {
                        R1 = X;
                        G1 = C;
                        B1 = 0;
                    } else if (H_ >= 2 && H_ < 3) {
                        R1 = 0;
                        G1 = C;
                        B1 = X;
                    } else if (H_ >= 3 && H_ < 4) {
                        R1 = 0;
                        G1 = X;
                        B1 = C;
                    } else if (H_ >= 4 && H_ < 5) {
                        R1 = X;
                        G1 = 0;
                        B1 = C;
                    } else if (H_ >= 5 && H_ < 6) {
                        R1 = C;
                        G1 = 0;
                        B1 = X;
                    }
                }

                /* Find R, G, and B by adding the same amount to each component, to match lightness */

                var m = L - (C / 2);

                var R, G, B;

                /* Normalise to range [0,255] by multiplying 255 */
                R = (R1 + m) * 255;
                G = (G1 + m) * 255;
                B = (B1 + m) * 255;

                R = Math.round(R);
                G = Math.round(G);
                B = Math.round(B);

                return {
                    R: R,
                    G: G,
                    B: B
                };
            },
            rgb2hsl: function(r, g, b) {
                r /= 255, g /= 255, b /= 255;
                var max = Math.max(r, g, b),
                    min = Math.min(r, g, b);
                var h, s, l = (max + min) / 2;

                if (max == min) {
                    h = s = 0; // achromatic
                } else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r:
                            h = (g - b) / d + (g < b ? 6 : 0);
                            break;
                        case g:
                            h = (b - r) / d + 2;
                            break;
                        case b:
                            h = (r - g) / d + 4;
                            break;
                    }
                    h /= 6;
                }

                return {
                    H: h,
                    S: s,
                    L: l
                }
            }
        };
        var colors_name = ['@H050', '@H100', '@H200', '@H300', '@H400', '@H500', '@H600', '@H700', '@H800', '@H900'];


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

        function colorLoop() {

            var count = 0,
                base_color, k = 0,
                rgb;

            for (var i = 19; i >= 0; i--) {
                base_color = "";

                if (i % 2 == 0) {
                    continue;
                }
                if (k == 5) {
                    base_color = "base_color";
                }
                $("#palette").append("<div class='color-title " + base_color + "'>" + colors_name[k] + "</div>");
                for (var j = 0; j < 36; j++) {

                    $("#palette").append("<div class='color-dot " + base_color + "'></div>");
                    rgb = color.hsl2rgb(j * 10, 1, (i + 1) / 21);

                    //$(".color-dot").eq(count++).css("background-color", "hsl(" + (j * 10) + ", " + "100%, " + parseInt(((i + 1) / 21) * 100) + "%)");
                    $(".color-dot").eq(count++).css("background-color", "rgb(" + rgb.R + ", " + rgb.G + ", " + rgb.B + ")");
                }
                $("#palette").append("<div style='clear: both;'></div>");
                k++;
            }
        }

    };

    app.page.buttons = function() {

    };

    module.exports = app;

});