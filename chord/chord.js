// From http://mkweb.bcgsc.ca/circos/guide/tables/
var chord = d3.layout.chord()
  .padding(.05)
  .sortSubgroups(d3.descending)
  .matrix(d3.transpose([
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
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]]));

var w = 600,
    h = 600,
    r0 = Math.min(w, h) * .41,
    r1 = r0 * 1.1;
    
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

var fill = d3.scale.category20()
    .domain(d3.range(4));
    //.range(["#000000", "#FFDD89", "#957244", "#F26223"]);
    
var svg = d3.select("#chart")
  .append("svg:svg")
    .attr("width", w+200)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

svg.append("svg:g")
  .selectAll("path")
    .data(chord.groups)
  .enter().append("svg:path")
    .attr("fill", function(d) { return fill(d.index); })
    .attr("stroke", function(d) { return fill(d.index); })
    .attr("d", d3.svg.arc().innerRadius(r0).outerRadius(r1))
    .attr("xlink:title", function(d,i){ return "Totaal " + labels[i] + ": " + 1000 * Math.round(d.value);})
    .on("mouseover", fadeGroup(.1))
    .on("mouseout", fadeGroup(1));

var ticks = svg.append("svg:g")
  .selectAll("g")
    .data(chord.groups)
  .enter().append("svg:g")
  .selectAll("g")
    .data(groupTicks)
  .enter().append("svg:g")
    .attr("transform", function(d) {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
          + "translate(" + r1 + ",0)";
    });

ticks.append("svg:line")
    .attr("x1", 1)
    .attr("y1", 0)
    .attr("x2", 5)
    .attr("y2", 0)
    .attr("stroke", "#000");

ticks.append("svg:text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) {
      return d.angle > Math.PI ? "end" : null;
    })
    .attr("transform", function(d) {
      return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
    })
    .text(function(d) { return d.label; });

svg.append("svg:g")
    .attr("class", "chord")
  .selectAll("path")
    .data(chord.chords)
  .enter().append("svg:path")
    .attr("fill", function(d) { return fill(d.target.index); })
    .attr("xlink:title", function(d,i){ return labels[d.target.index] + " -> "+ labels[d.source.index] + ": " + d.source.value + "000"})
    .attr("d", d3.svg.chord().radius(r0))
    .attr("opacity", 1)
    .on("mouseover", fadeChord(.1))
    .on("mouseout", fadeChord(1));

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
      .style("fill", function(d,i){return fill(i)});

legend.append("svg:text")
      .attr("x", 30)
      .attr("y", 15)
      .attr("dy", ".35em")
      .text(function(d,i){return labels[i]});
    
    /** Returns an array of tick angles and labels, given a group. */
function groupTicks(d) {
  var k = (d.endAngle - d.startAngle) / d.value;
  if (d.value > 1000){
     return d3.range(0, d.value, 50).map(function(v, i) {
       return {
         angle: v * k + d.startAngle,
         label: i % 2 ? null : v/1000  + "M"
       };
     });
  }
  return d3.range(0, d.value, 10).map(function(v, i) {
    return {
      angle: v * k + d.startAngle,
      label: i % 5 ? null : v  + "k"
    };
  });
}

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

/** Returns an event handler for fading a given chord group. */
function fadeChord(opacity) {
  return function(g, i) {
    //console.log(g);
    svg.selectAll("g.chord path")
        .filter(function(d) {
          return d != g;
        })
      .transition()
        .attr("opacity", opacity);

    svg.selectAll("g.legend g")
        .filter(function(d, j) {
          return g.source.index != j && g.target.index != j;
        })
      .transition()
        .attr("opacity", opacity);
  };
}