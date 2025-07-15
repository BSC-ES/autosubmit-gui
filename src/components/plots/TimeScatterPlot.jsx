import React, { Component } from 'react'
import * as d3 from "d3";
import { secondsToDelta } from "../context/utils";
import { saveSVGObj } from '../../services/utils';


class TimeScatterPlot extends Component {

  constructor(props) {
    super(props);
    this.svgElement = null;
    this.setSvgElement = element => {
      this.svgElement = element;
    };
    this.data = this.props.data;
    this.height = 480;
    this.width = 480;
    this.padding = 40;
    this.colorScale = 
    d3.scaleLinear()
      .domain(d3.extent(this.data, d => {
        if (d.JPSY > 0) return Number.parseFloat(d.JPSY);
      }))
      .range(['#01949A', '#004369']);
  }


  applyLegendPlot() {
    const uniqueId = this.props.uniqueId;
    d3.select(this.svgElement)
    .append("rect")
      .attr("id", `legend-1-${uniqueId}`)
      .attr("x", this.width - 30 - this.padding)
      .attr("y", 0.5*this.padding)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", this.colorScale(d3.min(this.data, d => d.JPSY)));
  
    d3.select(this.svgElement)
      .append("rect")
        .attr("id", `legend-2-${uniqueId}`)
        .attr("x", this.width - 20 - this.padding)
        .attr("y", 0.5*this.padding)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", this.colorScale(d3.mean(this.data, d => d.JPSY)));
    
    d3.select(this.svgElement)
      .append("rect")
        .attr("id", `legend-3-${uniqueId}`)
        .attr("x", this.width - 10 - this.padding)
        .attr("y", 0.5*this.padding)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", this.colorScale(d3.max(this.data, d => d.JPSY)));
    
    d3.select(this.svgElement)
      .append("text")
        .attr("x", this.width - 45 - this.padding)
        .attr("y", 0.6*this.padding)
        .attr("dy", "0.45em")
        .attr("font-family", "Helvetica")
        .style("font-size", "0.9em")
        .style("text-anchor", "middle")
        .text("JPSY")
  }

  handleScatterPlot() {
    // const data = this.props.data;
    const attribute = this.props.attribute;
    const mainTitle = this.props.mainTitle;
    
    // console.log(data);
    // const helperId = this.props.helperId;

    const paddingLeft = 40;
    const maxSeconds = 1200;

    const getTimeInCorrectMeasure = (seconds, maxValue) => {
      if (maxValue > maxSeconds) {
        return getMinutes(seconds);
      } else {
        return Number.parseInt(seconds);
      }
    }

    const getTimeMeasurementName = (maxValue) => {
      if (maxValue > maxSeconds) {
        return "minutes";
      } else {
        return "seconds"
      }
    }

    const getTimeElementsName = (chosenAttrib) => {
      if (chosenAttrib === "PSYPD") {
        return "Queue + Run"
      } else {
        return "Run";
      }
    }

    const getTimeSeconds = (d, chosenAttrib) => {
      if (chosenAttrib === "PSYPD") {
        return Number.parseInt(d.queue + d.running);
      } else {
        return Number.parseInt(d.running);
      }
    }

    const getMinutes = (seconds) => {
      return Number.parseInt(Number.parseInt(seconds) / 60);
    }

    const maxTime = d3.max(this.data, d => getTimeSeconds(d, attribute));

    const yScale = d3.scaleLinear()
                    .domain(d3.extent(this.data, d => Number.parseFloat(d[attribute])))
                    .range([this.height - this.padding, this.padding]);
    
    const xScale = d3.scaleLinear()
                    .domain(d3.extent(this.data, d => getTimeInCorrectMeasure(getTimeSeconds(d, attribute), maxTime)))
                    .range([paddingLeft, this.width - this.padding]);


    
    // eslint-disable-next-line
    const radiusScale = d3.scaleLinear()
                        .domain(d3.extent(this.data, d => d.queue))
                        .range([2,10]);

    const xAxis = d3.axisBottom(xScale)
                    .tickSize(-this.height + (2*this.padding))
                    .tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale)
                    .tickSize(-this.width + (this.padding + paddingLeft))
                    .tickSizeOuter(0);
    
    const tooltip = d3.select("body")
                      .append("div")
                        .classed("tooltip-d3", true); 
    
    d3.select(this.svgElement)
      .append("g")
        .attr("transform", "translate(0," + (this.height - this.padding) + ")")
        .call(xAxis);
    
    d3.select(this.svgElement)
      .append("g")
        .attr("transform", "translate(" + paddingLeft + ")")
        .call(yAxis);
    
    d3.select(this.svgElement)
        .attr("width", this.width)
        .attr("height", this.height)
      .selectAll("circle")
      .data(this.data)
      .enter()
      .append("circle")
        .attr("cx", d => xScale(getTimeInCorrectMeasure(getTimeSeconds(d, attribute), maxTime)))
        .attr("cy", d => yScale(Number.parseFloat(d[attribute])))
        .attr("fill", d => this.colorScale(d.JPSY))
        .attr("r", 4)
        .on("mousemove", showTooltip)
        .on("touchstart", showTooltip)
        .on("mouseout", hideTooltip)      
        .on("touchend", hideTooltip);
        // .attr("r", d => radiusScale(d.queue));
    
    d3.select(this.svgElement)
      .append("text")
        .attr("x", this.width/2)
        .attr("y", this.height - 0.7*this.padding)
        .attr("dy", "1em")
        .attr("font-family", "Helvetica")
        .style("text-anchor", "middle")
        .text(getTimeElementsName(attribute) + " time in " + getTimeMeasurementName(maxTime) + "")
    
    d3.select(this.svgElement)
      .append("text")
        .attr("transform", "rotate(-90)")                        
        .attr("x", -this.height/2)
        .attr("y", 0.8*this.padding)
        .attr("dy", "-1em")
        .attr("font-family", "Helvetica")
        .style("text-anchor", "middle")
        .text(attribute);
    
    d3.select(this.svgElement)
      .append("text")
        .attr("x", this.width/2)
        .attr("y", 0.2*this.padding)
        .attr("dy", "1.5em")
        .attr("font-family", "Helvetica")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(mainTitle || mainTitle);

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
          <p>${attribute}: ${d[attribute]}</p>
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
      this.applyLegendPlot();
    }    
  }

  render () {

    if (this.props.data.length === 0) {
      return (
        <div>
          <div className="row">
            <div className="col">
              No data
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="scroll-x relative">
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

export default TimeScatterPlot
