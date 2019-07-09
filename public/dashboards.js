$(document).ready(function() {
  chart = {
    const arcs = pie(data);

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("text-anchor", "middle")
        .style("font", "12px sans-serif");

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    g.selectAll("path")
      .data(arcs)
      .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
      .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    const text = g.selectAll("text")
      .data(arcs)
      .join("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em");

    text.append("tspan")
        .attr("x", 0)
        .attr("y", "-0.7em")
        .style("font-weight", "bold")
        .text(d => d.data.name);

    text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.value.toLocaleString());

    return svg.node();
  };
}
