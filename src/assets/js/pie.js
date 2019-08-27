Raphael.fn.pieChart = function (cx, cy, r, values, stroke) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();
    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }
    var angle = 90,
        total = 100,
        process = function (j) {
            var value = values[j],
                angleplus = 360 * value / total;
            if(values[j] == 100) {
                var p = paper.circle(cx, cy, r).attr({fill: "#ea503d", stroke: "#ea503d", "stroke-width": 0});
            }else{
                if (j == 1) {
                    var p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-#ea503d-#ea503d", stroke: stroke, "stroke-width": 0});
                }else{
                    var p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-#cecece-#cecece", stroke: stroke, "stroke-width": 0});
                }
                angle += angleplus;
            }
            chart.push(p);
    };
    for (var i = 0; i < values.length; i++) {
        process(i);
    }
    return chart;
};

$(function () {
    var values = [];
    $(".sys_circle_progress").each(function () {
        var getDonePercent = parseInt($(this).attr("data-percent"));
        var getPendingPercent = 100 - getDonePercent;
        if(getPendingPercent==0){
            values[0] = getDonePercent;
        }else{
            values[0] = getPendingPercent;
            values[1]=getDonePercent;
        }
        Raphael($(this).find(".sys_holder_sector")[0], 78, 78).pieChart(39, 39, 39, values, "#cecece");
        $(this).append('<span class="val-progress">' + $(this).attr("data-percent") + '%</span>');
    });
});
