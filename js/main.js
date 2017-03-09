/*document.getElementById("jstest").innerHTML = "New text!";*/

function axisLabel(labelItem) {
    return labelItem.text;
}

function renderAxis(labels, d3Item) {
    return d3Item.selectAll('text')
                 .data(labels)
                 .enter()
                 .append("text")
                 .text(axisLabel);
}

function loadData() {
    $.ajax({
        url: "data.json",
        type: "Get",
        cache: false,
        success: function (data) {
            var i, y, j;
            var realdata = [];
            var graphics = [];
            var maxdomain = 0;
            var rangeto = 0;

            if (typeof data === "string") { // ensure a data array
                data = JSON.parse(data);
            }

            // extract the questions from the returned data
            for (i = 0; i < data.length; i++) {
                switch (data[i].typ) {
                    case 'multichoicerated':
                    case 'multichoice':
                        realdata.push(data[i]);
                        break;
                    default:
                        break;
                }
            }

            // extract the axis labels

            // This ONLY works if all questions have the same values!
            // if we have different questions, then we MUST create multiple graphs
            var xLabels = realdata[0].answerValues.map(function (d, i) {
                return {
                    xVal: i + 1,
                    yVal: 0,
                    text: Array.isArray(d)? d[1] : d
                };
            });

            // the y lables are the questions.
            var yLabels = realdata.map(function (d, i) {
                return {
                    xVal: 0,
                    yVal:i+1,
                    text: d.question
                };
            });

            // analyse the responses
            for (y = 0; y < realdata.length; y++) {
                var radius = [];
                var valueHash = {};
                var tmpRangeTo = parseInt(realdata[y].range_to);

                if(tmpRangeTo > rangeto){
                    rangeto = tmpRangeTo;
                }

                if (realdata[y].answers.length > maxdomain){
                    maxdomain = realdata[y].answers.length;
                }

                for (j = 0; j < realdata[y].answerValues.length; j++){
                    radius.push(0);
                    valueHash[realdata[y].answerValues[j][0]] = j;
                }

                for (i = 0; i < realdata[y].answers.length; i++) {
                    var radiusIndex = valueHash[realdata[y].answers[i]];
                    radius[radiusIndex]++;
                }

                for (i = 0; i < radius.length; i++) {
                    graphics.push({
                        rVal: radius[i],
                        xVal: i + 1,
                        yVal: y + 1
                    });
                }
            }

            // create d3 scale projection functions
            var rscale = d3.scale.linear()
                           .domain([0, maxdomain])
                           .range([0, 30]);
            var xscale = d3.scale.linear()
                           .domain([0, rangeto+1])
                           .range([0, 100 * rangeto + 10]);
            // reverse the y axis, so 0 is in the upper corner
            var yscale = d3.scale.linear()
                           .domain([realdata.length + 1, 0])
                           .range([220, 0]);

            // add the y axis labels
            renderAxis(yLabels,
                       d3.select('svg')
                         .append("g")
                         .attr('id', "y-axis")
                         .attr("transform","translate(20," + 10 + ")"))
                .attr('text-anchor', 'right')
                .attr('y', function (d, i) {
                    return yscale(d.yVal);
                })
                .attr('dy', '0.3ex');

            var yaxisWidth = d3.select('#y-axis').node().getBBox().width;

            // add the x axis
            renderAxis(xLabels,
                       d3.select('svg')
                         .append("g")
                         .attr('id', "x-axis")
                         .attr("transform","translate( " + (yaxisWidth + 10) + ",15)"))
               .attr('text-anchor', 'middle')
               .attr('x', function (d, i) {
                   return xscale(d.xVal);
               });

           d3.select('svg')
             .append("g")
             .attr("transform","translate(" + (yaxisWidth + 10) + "," + 10 + ")")
             .selectAll('circle')
             .data(graphics) // attach the graph data
             .enter()
             .append('circle')
             .attr('class', function (d) {
                 return "blue";
             })
             .attr('r', function (d) {
                 return rscale(d.rVal);
             })
             .attr('cx', function (d) {
                 return xscale(d.xVal);
             })
             .attr('cy', function (d) {
                 return yscale(d.yVal);
             });

            // setTimeout(loadData,10000);
        },
        error: function (msg) { alert(msg); }
    });
}
$(document).ready(loadData);
// $.urlParam = function(name){
//     var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
//     if (results==null){
//        return null;
//     }
//     else{
//        return results[1] || 0;
//     }
// }
// var urlcompleted = "/local/powertla/rest.php/content/survey/analysis/" +$.urlParam('id');
// var pathArray = window.location.pathname.split("/");
// console.log(pathArray);

//    });
// */
