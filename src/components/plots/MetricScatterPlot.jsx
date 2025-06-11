import React, { Component } from 'react'
import * as d3 from "d3";
import { secondsToDelta, formatNumberMoney } from "../context/utils";
import { saveSVGObj } from '../../services/utils';

export class MetricScatterPlot extends Component {

  constructor(props) {
    super(props);
    this.svgElement = null;
    this.setSvgElement = element => {
      this.svgElement = element;
    }
  }

  handleScatterPlot() {
    const data = this.props.data;
    const attributeX = this.props.attributeX;
    const attributeY = this.props.attributeY;
    const titleX = this.props.titleX;
    const mainTitle = this.props.mainTitle;
    const uniqueId = this.props.uniqueId;
    const height = 480;
    const width = 480;
    const padding = 40;
    const paddingLeft = 40;

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d[attributeY]))
      .range([height - padding, padding]);

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d[attributeX]))
      .range([paddingLeft, width - padding]);

    const xAxis = d3.axisBottom(xScale)
      .tickSize(-height + (2 * padding))
      .tickSizeOuter(0);

    const yAxis = d3.axisLeft(yScale)
      .tickSize(-width + (padding + paddingLeft))
      .tickSizeOuter(0);

    const colorScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.running))
      .range(["lightgreen", "darkgreen"]);

    const tooltip = d3.select("body")
      .append("div")
      .classed("tooltip-d3", true);

    d3.select(this.svgElement)
      .append("g")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);

    d3.select(this.svgElement)
      .append("g")
      .attr("transform", "translate(" + paddingLeft + ")")
      .call(yAxis);

    d3.select(this.svgElement)
      .attr("width", width)
      .attr("height", height)
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d[attributeX]))
      .attr("cy", d => yScale(d[attributeY]))
      .attr("fill", d => colorScale(d.running))
      .attr("r", 4)
      .on("mousemove", showTooltip)
      .on("touchstart", showTooltip)
      .on("mouseout", hideTooltip)
      .on("touchend", hideTooltip);

    d3.select(this.svgElement)
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0.2 * padding)
      .attr("dy", "1.5em")
      .attr("font-family", "Helvetica")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text(mainTitle || mainTitle)

    d3.select(this.svgElement)
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 0.7 * padding)
      .attr("dy", "1em")
      .attr("font-family", "Helvetica")
      .style("text-anchor", "middle")
      .text(titleX ? titleX : attributeX);

    d3.select(this.svgElement)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 0.8 * padding)
      .attr("dy", "-1em")
      .attr("font-family", "Helvetica")
      .style("text-anchor", "middle")
      .text(attributeY);

    d3.select(this.svgElement)
      .append("text")
      .attr("x", width - 45 - padding)
      .attr("y", 0.6 * padding)
      .attr("dy", "0.45em")
      .attr("font-family", "Helvetica")
      .style("font-size", "0.9em")
      .style("text-anchor", "middle")
      .text("Run")

    d3.select(this.svgElement)
      .append("rect")
      .attr("id", `legend-1-${uniqueId}`)
      .attr("x", width - 30 - padding)
      .attr("y", 0.5 * padding)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colorScale(d3.min(data, d => d.running)));

    d3.select(this.svgElement)
      .append("rect")
      .attr("id", `legend-2-${uniqueId}`)
      .attr("x", width - 20 - padding)
      .attr("y", 0.5 * padding)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colorScale(d3.mean(data, d => d.running)));

    d3.select(this.svgElement)
      .append("rect")
      .attr("id", `legend-3-${uniqueId}`)
      .attr("x", width - 10 - padding)
      .attr("y", 0.5 * padding)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colorScale(d3.max(data, d => d.running)));

    function showTooltip(event, d) {
      tooltip
        .style("opacity", 1)
        .style("left", (event.pageX - 60) + "px")
        .style("top", event.pageY + "px")
        .html(
          `
          <p>${d.name} </p>
          <p>Queue: ${secondsToDelta(d.queue)}</p>
          <p>Run: ${secondsToDelta(d.running)}</p>
          <p>${attributeX}: ${attributeX === "JPSY" ? formatNumberMoney(d[attributeX]) : d[attributeX]}</p>
          <p>${attributeY}: ${d[attributeY]}</p>
          `
        );
    }

    function hideTooltip() {
      tooltip
        .style("left", "10px")
        .style("top", "10px")
        .style("opacity", 0);
    }

  }

  componentDidMount() {
    if (this.props.data.length > 0) {
      this.handleScatterPlot();
    }
  }

  render() {
    if (this.props.data.length === 0) {
      return (
        <div>
          <div className="row">
            <div className="col">
              No data
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className='scroll-x relative'>
        <svg
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
          ref={this.setSvgElement}
        >
        </svg>
        <button className='absolute top-0 start-0 btn'
          onClick={() => saveSVGObj(this.svgElement, this.props.mainTitle)}>
          <i className="fa-solid fa-floppy-disk"></i>
        </button>
      </div>
    )
  }
}

export default MetricScatterPlot
