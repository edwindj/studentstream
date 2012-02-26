var m = [
[ 1352, 10, 5, 176, 1, 0, 0, 0, 0, 0, 0, 0, 9 ],
[ 0, 32, 1, 8, 3, 0, 0, 0, 0, 0, 0, 0, 0 ],
[ 1, 1, 56, 2, 0, 0, 0, 0, 1, 0, 0, 0, 5 ],
[ 0, 0, 1, 198, 1, 97, 40, 44, 1, 0, 0, 0, 3 ],
[ 0, 0, 0, 0, 21, 0, 0, 0, 2, 0, 0, 0, 3 ],
[ 0, 0, 0, 0, 0, 107, 10, 0, 89, 0, 0, 0, 8 ],
[ 0, 0, 0, 0, 0, 3, 98, 2, 7, 34, 0, 0, 11 ],
[ 0, 0, 0, 0, 0, 0, 8, 121, 0, 5, 25, 0, 9 ],
[ 0, 0, 0, 0, 0, 0, 1, 0, 336, 24, 0, 0, 145 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 281, 10, 0, 93 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 171, 0, 44 ],     
[ 195, 1, 4, 4, 0, 2, 2, 1, 78, 54, 26, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]];

var w = 600,
    h = 600;
    
var labels = ["Basisonderwijs"
,"Speciaal basisonderwijs"
,"Speciale scholen"
,"Brugjaren voortgezet onderwijs"
,"Praktijkonderwijs"
,"Vmbo"
,"Havo"
,"Vwo"
,"Middelbaar beroepsonderwijs"
,"Hoger beroepsonderwijs"
,"Wetenschappelijk onderwijs"
,"Instroom"
, "Uitstroom"
];

var idx = 0;

var d = {};
d.out = m[idx]
d.in = d3.transpose(m)[idx]
d.total = d3.sum(d.in) + d3.sum(d.out) - d.in[idx];

d.sin = d.in.map(function(d, i) {return {label:labels[i], index: i, value: d}}).filter(function(o){return o.value > 0;});

d.sout = d.out.map(function(d, i) {return {label:labels[i], index: i, value: d}}).filter(function(o){return o.value > 0;});

var offset = 0;
var d_offset = d.in.map(function(x){ offset += x; return offset-x/2;});

var n = labels.length;
var sc = {};
sc.x = d3.scale.linear();
sc.fill = d3.scale.category20()
    .domain(d3.range(n));
	
    
var svg = d3.select("#chart")
  .append("svg:svg")
    .attr("width", w+200)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

svg.append("svg:g")
var legend = svg.append("svg:g")
   .attr("class", "legend")
   .selectAll("g")
   .data(labels)
   .enter().append("svg:g")
   .attr("id", function(d, i) {return "label" + i})
   .attr("transform", function(d,i) {return "translate(300, "+ (25*i-300) +")"})
   .on("mouseover", fadeGroup(.1))
   .on("mouseout", fadeGroup(1))
   ;
   
   
legend.append("svg:rect")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", function(d,i){return sc.fill(i)});

legend.append("svg:text")
      .attr("x", 30)
      .attr("y", 15)
      .attr("dy", ".35em")
      .text(function(d,i){return labels[i]});
    
/** Returns an event handler for fading a given chord group. */
function fadeGroup(opacity) {
  return function(g, i) {
    svg.selectAll("g.chord path")
        .filter(function(d) {
          return d.source.index != i && d.target.index != i;
        })
      .transition()
        .attr("opacity", opacity);
    
    legend.filter(function(d, j) {
          return j != i;
        })
      .transition()
        .attr("opacity", opacity);
  };
}