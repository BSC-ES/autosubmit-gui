import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const wrap = (textSelection, maxWidth = 70) => {
  textSelection.each(function () {
    const textEl = d3.select(this);
    const words = textEl.text().split(/\s+/);
    let line = [];
    let lineNumber = 0;
    
    textEl.text(null);
    
    let tspan = textEl.append("tspan")
      .attr("x", textEl.attr("x") || 0)
      .attr("dy", lineNumber === 0 ? 0 : "1.2em");
    
    for (let i = 0; i < words.length; i++) {
      line.push(words[i]);
      tspan.text(line.join(" "));
      
      if (tspan.node().getComputedTextLength() > maxWidth && line.length > 1) {
        line.pop();
        tspan.text(line.join(" "));
        
        line = [words[i]];
        lineNumber++;
        tspan = textEl.append("tspan")
          .attr("x", textEl.attr("x") || 0)
          .attr("dy", "1.2em")
          .text(words[i]);
      }
    }
  });
};


const BarPlot = ({ data, width = 500, height = 250, margin = { top: 20, right: 20, bottom: 40, left: 20 }, maxWridthTextAxisY = 70 }) => {
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerHeight])
      .padding(0.1);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([0, innerWidth]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xAxis = g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));
    
    xAxis.selectAll("text")
      .style("text-anchor", "start")
      .attr("dx", ".8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(45)");

    const grid = g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        d3.axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickFormat("")
      );

    grid.selectAll("line")
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "4 2");

    grid.selectAll("line")
      .filter((d, i, nodes) => i === nodes.length - 1)
      .remove();

    const yAxis = g.append("g")
      .call(d3.axisLeft(yScale));

    yAxis.selectAll("text")
      .call(wrap, maxWridthTextAxisY);

    const bars = g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", d => yScale(d.label))
      .attr("x", 0)
      .attr("height", yScale.bandwidth())
      .attr("width", d => xScale(d.value))
      .attr("fill", d => d.color || "#8884d8");

      const formatNumber = d3.format(",");

      const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "lightblue") 
        .style("color", "black")          
        .style("padding", "4px 8px")
        .style("border", "1px solid blue") 
        .style("border-radius", "4px")
        .style("font-size", "16px")       
        .style("pointer-events", "none")
        .style("box-shadow", "0 0 5px rgba(0, 0, 0, 0.3)");
      
      bars.on("mouseover", (event, d) => {
          const formattedValue = typeof d.value === "number" ? formatNumber(d.value) : d.value;
          tooltip.text(formattedValue);
          tooltip.style("visibility", "visible");
        })
        .on("mousemove", (event, d) => {
          tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });
  }, [data, width, height, margin, maxWridthTextAxisY]);

  return <svg ref={svgRef} width="100%" height="100%"></svg>;
};

export default BarPlot;