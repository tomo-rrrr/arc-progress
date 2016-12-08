$.fn.progress = function(option) {
    var defaultSettings = {
        color: '#e94b4b',
        radius: 50,
        strokeWidth: 2,
        mode: 'svg'
    };

    return this.each(function() {
        var my = $(this);
        var o = $.extend({}, defaultSettings, option);
        o.r = o.radius - o.strokeWidth;
        o.no = o.percent;

        var obj;

        if (lessIe8()) {
            appendStyle();
            obj = drawVml(o);
        } else {
            obj = drawSvg(o);
        }

        $(this).append(obj);
    });


    function appendStyle() {
        $('body').prepend('<style>v\\:*{Behavior: url(#default#VML);position: absolute;}</style>');
    }

    function lessIe8() {
        var flag = false;;
        var ua = navigator.userAgent.toLowerCase();
        var safariVersion = ua.match(/msie ([\d.]+)/);
        var ie = !!safariVersion;

        if (ie) {
            safariVersion = Number(safariVersion[1]);
            if (safariVersion < 9) {
                flag = true;
            }
        }

        return flag
    }

    function template(template, data) {
        return template.replace(/\{([\s\S]+?)\}/g, function(a, b) {
            return data[b];
        });
    }

    function drawVml(o) {
        o.d = o.radius * 2 - o.strokeWidth * 2;
        o.angle = o.no / 100 * 360;

        var arcTpl = '<v:arc filled="false" style="top:{strokeWidth}px;left:{strokeWidth}px;z-index:2; width:{d}px; height:{d}px;" StrokeWeight="{strokeWidth}" StrokeColor="{color}" StartAngle="0" EndAngle="{angle}" />';

        return $(template(arcTpl, o));
    }

    function drawSvg(o) {
        var pathTpl = '<path fill="none" stroke-width="{strokeWidth}" stroke="{color}" transform=translate({radius},{radius})/>';
        var path = $(template(pathTpl, o))[0];


        var r = o.r;
        var degrees = Math.min(50, o.no) / 100 * 360;
        var rad = degrees * (Math.PI / 180);
        var x = (Math.sin(rad) * r);
        var y = -(Math.cos(rad) * r);


        //大于180度时候画大角度弧，小于180度的画小角度弧，(deg > 180) ? 1 : 0
        var lenghty = window.Number(degrees > 180);

        var descriptions = ['M', 0, -r, 'A', r, r, 0, 0, 1, x, y];

        if (o.no > 50) {
            var degrees2 = o.no / 100 * 360;
            var rad2 = degrees2 * (Math.PI / 180);
            var x2 = (Math.sin(rad2) * r);
            var y2 = -(Math.cos(rad2) * r);
            descriptions = descriptions.concat(['M', 0, r, 'A', r, r, 0, 0, 1, x2, y2])
        }

        path.setAttribute('d', descriptions.join(' '));
        return $('<svg width="100px" height="100px" version="1.1" xmlns="http://www.w3.org/2000/svg">' + path.outerHTML + '</svg>');
    }

    function drawCanvas(o) {
        var canvas = $('<canvas width="100" height="100">')[0];
        var ctx = canvas.getContext("2d");
        var start = -Math.PI / 2;
        var end = start + Math.PI * 2 * (o.no / 100);

        ctx.beginPath();
        ctx.strokeStyle = o.color;
        ctx.lineWidth = o.strokeWidth;

        ctx.arc(o.radius, o.radius, o.r, start, end, false);
        ctx.stroke();
        return canvas;
    }


};