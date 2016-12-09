(function() {
    "use strict";

    function template(template, data) {
        return template.replace(/\{([\s\S]+?)\}/g, function(a, b) {
            return data[b];
        });
    }

    function lessIe8() {
        var flag = false;
        var ua = navigator.userAgent.toLowerCase();
        var safariVersion = ua.match(/msie ([\d.]+)/);

        if (!!safariVersion) {
            safariVersion = Number(safariVersion[1]);
            if (safariVersion < 9) {
                flag = true;
            }
        }
        return flag;
    }

    var isLessIe8 = lessIe8();

    if (isLessIe8) {
        $('body').prepend('<style>v\\:*{Behavior: url(#default#VML);position: absolute;}</style>');
    }

    $.fn.arcProgress = function(option) {
        var defaultSettings = {
            color: '#e94b4b',
            radius: 50,
            strokeWidth: 2,
            mode: 'svg'
        };

        function drawVml(o) {
            o.d = o.radius * 2 - o.strokeWidth * 2;
            o.angle = o.percent / 100 * 360;

            var style = ' style="top:{strokeWidth}px;left:{strokeWidth}px;z-index:2; width:{d}px; height:{d}px;" ';
            var property = ' filled="false" StrokeWeight="{strokeWidth}" StrokeColor="{stroke}" StartAngle="0" EndAngle="{angle}"';
            var arcTpl = '<v:arc' + style + property + '/>';
            return $(template(arcTpl, o));
        }

        function descriptions(r, percent, max, no) {
            var degrees = Math.min(percent, max) / 100 * 360;
            var rad = degrees * (Math.PI / 180);
            var x = (Math.sin(rad) * r);
            var y = -(Math.cos(rad) * r);
            return ['M', 0, no * r, 'A', r, r, 0, 0, 1, x, y];
        }

        function drawSvg(o) {

            var pathTpl = '<path fill="none" stroke-width="{strokeWidth}" stroke="{stroke}" transform=translate({radius},{radius})/>';
            var path = $(template(pathTpl, o))[0];
            var arr = descriptions(o.r, o.percent, 50, -1);

            if (o.percent > 50) {
                arr = arr.concat(descriptions(o.r, o.percent, 100, 1));
            }

            path.setAttribute('d', arr.join(' '));
            var svg = template('<svg width="{size}px" height="{size}px" version="1.1" xmlns="http://www.w3.org/2000/svg">', o);
            return $(svg + path.outerHTML + '</svg>');
        }

        function drawCanvas(o) {
            var tpl = '<canvas width="{size}" height="{size}">';
            var canvas = $(template(tpl, o))[0];
            var ctx = canvas.getContext("2d");
            var start = -Math.PI / 2;
            var end = start + Math.PI * 2 * (o.percent / 100);

            ctx.beginPath();
            ctx.strokeStyle = o.stroke;
            ctx.lineWidth = o.strokeWidth;
            ctx.arc(o.radius, o.radius, o.r, start, end, false);
            ctx.stroke();
            return canvas;
        }


        return this.each(function() {
            var o = $.extend({}, defaultSettings, option);
            o.size = o.radius * 2;
            o.r = o.radius - o.strokeWidth / 2;

            var arc = isLessIe8 ? drawVml(o) : {
                svg: drawSvg,
                canvas: drawCanvas
            }[o.mode](o);

            $(this).append(arc);
        });

    };

}());