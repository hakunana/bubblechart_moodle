/*document.getElementById("jstest").innerHTML = "New text!";*/
function loadData() {
    $.ajax({
        url: "data.json",
        type: "Get",

        success: function (data) {
           var realdata = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].typ === "multichoicerated") {
                  realdata.push(data[i]);
                }
            }
            var graphics=[];
            var maxdomain=0;
            var rangeto=0;
            console.log("realdata length " + realdata.length);
            for (var y = 0; y < realdata.length; y++) {

              var radius = [];
              var valueHash = {};
              var tmpRangeTo = parseInt(realdata[y].range_to);
              if(tmpRangeTo>rangeto){
                rangeto = tmpRangeTo;
              }
              console.log("realdata length 2 " + realdata[y].answerValues.length);
              for (var j=0; j<realdata[y].answerValues.length;j++){
                radius.push(0);
                valueHash[realdata[y].answerValues[j][0]]=j;
              }
              console.log("realdata length 3 " + realdata[y].answers.length);
              if(realdata[y].answers.length>maxdomain){
                maxdomain=realdata[y].answers.length;
              }
              for (var i = 0; i< realdata[y].answers.length; i++) {
                var radiusValue = realdata[y].answers[i];
                var radiusIndex = valueHash[radiusValue];
                radius[radiusIndex]++;
              }
              for (i=0; i < radius.length; i++) {
                graphics.push({
                  label: realdata[y].question,
                  yAxisLabel: y+1,
                  xAxisLabel: realdata[y].answerValues[i][1],
                  rVal: radius[i]/realdata[y].answers.length*2,
                  xVal: i + 1,
                  yVal: y + 1
                });
              }
              console.log(graphics);
            }
            console.log("rangeto "+rangeto);
/* diese labels werden angezeigt - statische dummies */

          var ticks = [1,2,3,4];
          var tickLabels = ['a','b','c','d'];
/* so hätte es eigentlich in den balken diagrammen funktioniert - allerdings console log sagt d ist keine Funktion*/
    data.forEach(function(d) {
        d.question = d.question;
        console.log("question : " + d.question);
    });
                var svgElm = d3.select('svg')
                .append("g")
                .attr("transform","translate(" + 60 + "," + 10 + ")");
            var rscale = d3.scale.linear().domain([0, maxdomain])
            .range([0, 90]);
            var xscale = d3.scale.linear().domain([0, rangeto+1])
            .range([0, 320]);
            var yscale = d3.scale.linear().domain([0, realdata.length+1])
            .range([220, 0]);
            var xlabel ="";
            var xAxis = d3.svg.axis()
                .scale(xscale)
                .orient("bottom")
                .ticks(rangeto+1)
                /*  Ticks erstellen  */
                .tickValues(ticks)
                .tickFormat(function(d,i){ return tickLabels[i] });

            var yAxis = d3.svg.axis()
                .scale(yscale)
                .orient("left")
                .ticks(realdata.length+1);
            // Circles now easily reusable
            svgElm.append('g')
              .attr("class", "x axis")
              .attr("transform", "translate(0," + 220 + ")")
              .call(xAxis)
              .selectAll("text")
              /*  Ticks anhängen / drehen etc.   */
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", "-.155em")
              .attr("transform", "rotate(-45)" )
              // .text(xAxisLabel);
            svgElm.append('g')
              .attr("class", "y axis")
              .call(yAxis)
              /*  Ticks anhängen / drehen etc.   */
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 5)
              .attr("dy", ".11em")
              .style("text-anchor", "end");
            // var tip = d3.tip()
            //   .attr('class', 'd3-tip')
            //   .offset([-10, 0])
            //   .html(function(d) {
            //     return "<strong>Frequency:</strong> <span style='color:red'>" + d.label + "</span>";
            //   })
            svgElm.selectAll('circle')
                .data(graphics)
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