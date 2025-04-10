import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PhaseChart = ({ phases, formatSecondsToHMS }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!phases) return;

    const data = [
      { name: "Pre-SIM", duration: phases.pre_sim_time },
      { name: "SIM", duration: phases.sim_time },
      { name: "Post-SIM", duration: phases.post_sim_time },
    ];


    const containerWidth = parseInt(d3.select(svgRef.current.parentNode).style("width"));
    const width = containerWidth;
    const height = 350; 
    const margin = { top: 5, right: 20, bottom: 40, left: 80 }; 
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 
    svg.attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "auto");

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.4);

    const maxDuration = d3.max(data, d => d.duration);
    const yScale = d3.scaleLinear()
      .domain([0, maxDuration])
      .nice()
      .range([innerHeight, 0]);

    g.append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat("")
      )
      .selectAll("line")
      .attr("stroke", "lightgrey")
      .attr("stroke-dasharray", "3 3");

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.name))
      .attr("y", d => yScale(d.duration))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.duration))
      .attr("fill", "#82ca9d");

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("dy", "1em")
      .style("font-size", "14px"); 

    g.append("g")
      .call(d3.axisLeft(yScale).tickFormat(d => formatSecondsToHMS(d)))
      .selectAll("text")
      .style("font-size", "14px"); 
  }, [phases, formatSecondsToHMS]);

return (
    <div className="mt-5">
        <h4 className="font-semibold mb-4">Phases duration chart</h4>
        <svg ref={svgRef}></svg>
    </div>
);
};

export default PhaseChart;