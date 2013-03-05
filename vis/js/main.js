var width = 960,
    height = 600;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-200)
    .linkDistance(90)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 6)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
  .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000');

d3.json("vis.json", function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .style('marker-end', 'url(#end-arrow)')
      .style('stroke', 'black')
      .style("stroke-width", 2);

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append('g').attr("class", "node");
  // node.append('rect')
  //       .attr('rx', 6).attr('ry', 6)
  //       .attr("width", 20)
  //       .attr("height", 20)
  //       .style("fill", function(d) { return color(d.group); });
  node.append('text')
        .attr('font-family', 'monospace')
        .attr('font-size', '10')
        .attr('text-anchor', 'middle')
        .style('fill', function(d) { return color(d.group); })
        .text(function(d){ return d.name; });
  node.call(force.drag);

  force.on("tick", function() {
    link.attr('d', function(d){
      var deltaX = d.target.x - d.source.x,
      deltaY = d.target.y - d.source.y,
      dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
      normX = deltaX / dist,
      normY = deltaY / dist,
      sourcePadding = 12,
      targetPadding = 15,
      sourceX = d.source.x + (sourcePadding * normX),
      sourceY = d.source.y + (sourcePadding * normY),
      targetX = d.target.x - (targetPadding * normX),
      targetY = d.target.y - (targetPadding * normY);
      return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    });

    node.attr("transform", function(d) { return 'translate('+d.x+','+d.y+')'; });
  });
});

