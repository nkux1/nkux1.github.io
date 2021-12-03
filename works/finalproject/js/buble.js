


// set the dimensions and margins of the graph
var width = 450
var height = 450

// append the svg object to the body of the page
var svg = d3.select("#bub_chart")
  .append("svg")
    .attr("width", 450)
    .attr("height", 450);

    
// create dummy data -> just one element per circle
var data = [{ "name": "A", "group": "pac" }, { "name": "B", "group": "pac" }, { "name": "C", "group": "pac" }, { "name": "D", "group": "pac" }, { "name": "E", "group": "pac" }, { "name": "F", "group": "pac" },
            { "name": "G", "group": "fac" }, { "name": "H", "group": "fac" }, { "name": "I", "group": "fac" }, { "name": "J", "group": "fac" }, { "name": "K", "group": "fac" }, { "name": "L", "group": "fac" },
            { "name": "M", "group": 3 }, { "name": "N", "group": 3 }, { "name": "O", "group": 3 }]

console.log("bub data",data);

// A scale that gives a X target position for each group
var x = d3.scaleOrdinal()
  .domain([1, 2, 3])
  .range([50, 200, 340])

// A color scale
var color = d3.scaleOrdinal()
  .domain([1, 2, 3])
  .range([ "#F8766D", "#00BA38", "#619CFF"])

// Initialize the circle: all located at the center of the svg area
var node = svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("g")
  .append("circle")
    .attr("r", 29)
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", function(d){ return color(d.group)})
    .style("fill-opacity", 0.8)
    .attr("stroke", "black")
    .style("stroke-width", 4)
    .call(d3.drag() // call specific function when circle is dragged
         .on("start", dragstarted)
         .on("drag", dragged)
         .on("end", dragended));

var txt = svg.selectAll("g").append("text");

txt.attr("y",width / 2).attr("x",height / 2).text("textt").attr("baseline-shift", "-50%");

// Features of the forces applied to the nodes:
var simulation = d3.forceSimulation()
    .force("x", d3.forceX().strength(0.5).x( function(d){ return x(d.group) } ))
    .force("y", d3.forceY().strength(0.1).y( height/2 ))
    .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.1).radius(40).iterations(1)) // Force that avoids circle overlapping

// Apply these forces to the nodes and update their positions.
// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.

var lineWidth = txt.node().getBoundingClientRect().width;

simulation
    .nodes(data)
    .on("tick", function(d){
        node
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; }); 

        txt
          .attr("x", function(d){ return d.x-lineWidth/2; })
          .attr("y", function(d){ return d.y; }); 
    });

// What happens when a circle is dragged?
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(.03).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}
function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(.03);
  d.fx = null;
  d.fy = null;
}
