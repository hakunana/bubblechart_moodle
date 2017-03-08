  <!-- Swissmetrix Code -->
  <script type="text/javascript">
    var _paq = _paq || [];
    _paq.push(["setDomains", ["*.moodle.htwchur.ch"]]);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
      var u="//www.swissmetrix.ch/analytics/";
      _paq.push(['setTrackerUrl', u+'smx.php']);
      _paq.push(['setSiteId', '25']);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'smx.js'; s.parentNode.insertBefore(g,s);
    })();
  </script>
  <noscript><p><img src="//www.swissmetrix.ch/analytics/smx.php?idsite=25" style="border:0;" alt="" /></p></noscript>
  <!-- End Swissmetrix Code -->



    <script src="https://d3js.org/d3.v3.min.js"></script>

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js"></script>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script>

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}
  var urlcompleted = "/local/powertla/rest.php/content/survey/analysis/" +$.urlParam('id');
  var pathArray = window.location.pathname.split("/");
    console.log(pathArray);
    var secondLevelPath = pathArray[3];
    console.log(secondLevelPath);

if(secondLevelPath == "analysis.php"){
  var margin = {top: 20, right: 20, bottom: 70, left: 40},
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;


  // set the ranges
  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

  var y = d3.scale.linear().range([height, 0]);

  // define the axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")


  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);


  // add the SVG element
  var svg = d3.select(".feedback_info").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");


  // load the data
  d3.json(urlcompleted, function(error, data) {

      data.forEach(function(d) {
          d.label = d.label;
          d.average_value = +d.average_value;
      });
    
    // scale the range of the data
    x.domain(data.map(function(d) { return d.label; }));
    y.domain([0, d3.max(data, function(d) { return d.average_value; })]);

    // add axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-45)" );

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Skalenwerte");


    // Add bar chart
    svg.selectAll("bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.label); })

        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.average_value); })
        .attr("height", function(d) { return height - y(d.average_value); 
        });

  });
}else{
  console.log("not an analysis page");
}
  /*
  angular.module('testbar', []).

     directive('bars', function ($parse) {
        return {
           restrict: 'E',
           replace: true,
           template: '<div id="chart"></div>',
           link: function (scope, element, attrs) {
             var data = attrs.data.split(','),
             chart = d3.select('#chart')
               .append("div").attr("class", "chart")
               .selectAll('div')
               .data(data).enter()
               .append("div")
               .transition().ease("elastic")
               .style("width", function(d) { return d + "%"; })
               .text(function(d) { return d + "%"; });
           } 
        };
     });
  */

  </script>