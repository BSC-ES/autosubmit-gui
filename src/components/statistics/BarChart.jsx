import React, { Component } from 'react';
import * as d3 from "d3";
import { queueColor, runningColor, unknownColor, failedQueueColor, failedRunAttempts } from "../context/vars";
import { formatNumberMoney } from "../context/utils";
// import StatsContext from "../context/statistics/statsContext";

// Use original color scheme with better text contrast
const chartColors = {
  background: "#FFFFFF", // White background
  border: "#E5E7EB", // Gray-200 for grid lines
  text: "#1F2937", // Dark gray for better contrast
  textLight: "#6B7280", // Gray-500
};

class BarChart extends Component { 

  constructor(props) {
    super(props);
    this.svgElement = null;
    this.setSvgElement = element => {
      this.svgElement = element;
    }  
    
    
  }

  handleBarChart() {
    const data = this.props.data;
    const metrics = this.props.metrics;
    const helperId = this.props.helperId;

    const minHeight = 280.0; // Increased minimum height
    const svgHeight = Math.max(data.length * 45.0, minHeight); // Increased spacing
    const svgWidth = 620.0; // Increased width for better readability
    const numBars = data.length * 1.0;
    const barPadding = 6; // Increased padding
    const padding = 40; // Increased padding
    const totalBarHeight = numBars > 0 ? Math.floor((svgHeight - 3*padding) / numBars - barPadding) : barPadding;
    const singleBarHeight = totalBarHeight / 4.0; // Maximum = 4
    const doubleBarHeight = totalBarHeight / 2.0;
    const tripleBarHeight = totalBarHeight / 3.0;

    d3.select(`#queueTimeChart-${helperId}`).property("checked", true);
    d3.select(`#runTimeChart-${helperId}`).property("checked", true);
    d3.select(`#failedQueueTimeChart-${helperId}`).property("checked", true);
    d3.select(`#failedRunTimeChart-${helperId}`).property("checked", true);

    const yScaleQueue = d3.scaleLinear()
      .domain([0, data.length])
      .range([padding*2, svgHeight - padding]);

    const tooltip = d3.select("body")
                      .append("div")
                      .classed("tooltip-d3", true)
                      .style("background-color", "rgba(0, 0, 0, 0.9)")
                      .style("color", "white")
                      .style("border-radius", "8px")
                      .style("padding", "12px")
                      .style("font-size", "14px")
                      .style("box-shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1)")
                      .style("backdrop-filter", "blur(8px)"); 
    
    const svgEl = d3.select(this.svgElement);
    svgEl.attr("width", svgWidth);
    svgEl.attr("height", svgHeight);
    svgEl.selectAll("*").remove();

    addBars(metrics);

    // enterSequence is the object returned by enter()
    function addBars(metrics, ignoredMetrics = []) {
      
      // Calculate domain
      let maxDomain = 0;
      if (metrics[0] === "failedCount"){
          maxDomain = d3.max(data, d => { return Number.parseInt(d.failedCount); });
      } else {
          maxDomain = d3.max([ignoredMetrics.includes("completedQueueTime") ? 0.00 : d3.max(data, d => { return Number.parseFloat(d.completedQueueTime); }),
                              ignoredMetrics.includes("completedRunTime") ? 0.00 : d3.max(data, d => { return Number.parseFloat(d.completedRunTime); }),
                              ignoredMetrics.includes("failedQueueTime") ? 0.00 : d3.max(data, d => { return Number.parseFloat(d.failedQueueTime); }),
                              ignoredMetrics.includes("failedRunTime") ? 0.00 : d3.max(data, d => { return Number.parseFloat(d.failedRunTime); })]);
      }

      let xScaleQueue = null;
      if (metrics[0] === "failedCount") {
        xScaleQueue = d3.scaleLinear()
          .domain([0, Number.parseInt(maxDomain)])
          .range([0, svgWidth - 1.3*padding]);
      } else {
        xScaleQueue = d3.scaleLinear()
        .domain([0, maxDomain])
        .range([0, svgWidth - 1.2*padding]);
      }
      const intDomain = Number.parseInt(maxDomain + 1);
      // console.log([...Array(intDomain).keys()])
      
      const xAxis = d3.axisBottom(xScaleQueue)
      .tickSize(-svgHeight + 2.8*padding)
      .tickValues(metrics[0] === "failedCount" ? [...Array(intDomain).keys()] : null)
      .tickFormat(x => {
        if (metrics[0] === "failedCount") {
          return `${x.toFixed(0)}`;
        } else {
          return x;
        }
      })
      .tickSizeOuter(0);                  

      const xAxisTop = d3.axisTop(xScaleQueue)
        .tickValues(metrics[0] === "failedCount" ? [...Array(intDomain).keys()] : null)
        .tickFormat(x => {
          if (metrics[0] === "failedCount") {
            return `${x.toFixed(0)}`;
          } else {
            return x;
          }
        })
        .tickSizeOuter(0);

      svgEl.append("g")
        .classed(`xaxis-${helperId}`, true)
        .attr("transform", "translate(" + padding + "," + (svgHeight - padding) + ")")
        .call(xAxis)
        .selectAll("line")
        .style("stroke", chartColors.border)
        .style("stroke-dasharray", "2,2");
      
      svgEl.append("g")
        .classed(`xaxis-${helperId}`, true)
        .attr("transform", "translate(" + padding + "," + (1.8*padding) + ")")
        .call(xAxisTop)
        .selectAll("text")
        .style("fill", chartColors.text)
        .style("font-size", "12px");
  
      const groupsEnter = svgEl.selectAll("rect")
        .data(data)
        .enter()   

      // console.log(metrics);
      for (let j = 0; j < metrics.length; j++){

        const color = colorMetric(metrics[j]);
        //const metricClassName = `bar-${metrics[j]}`

        
        groupsEnter.append("rect")
        .classed(`newbar-${helperId}`, true)        
        .attr("height", d => { 
          if (metrics[0] === "failedCount") {
            return totalBarHeight;
          } else {
            return calculateBarHeight(d, ignoredMetrics);
          }})
        .attr("x", padding)
        .attr("y", function(d, i) {
          if (metrics[0] === "failedCount"){
            return yScaleQueue(i);
          } else {
            let validValues = [ignoredMetrics.includes("completedRunTime") ? 0.00 : d.completedRunTime, 
            ignoredMetrics.includes("completedQueueTime") ? 0.00 : d.completedQueueTime, 
            ignoredMetrics.includes("failedQueueTime") ? 0.00 : d.failedQueueTime,
            ignoredMetrics.includes("failedRunTime") ? 0.00 : d.failedRunTime]     
            let sequantialIndex = 0;
            for (let k = 0; k < validValues.length; k++ ){
              if (Number.parseFloat(validValues[k]) > 0.00) {
                validValues[k] = sequantialIndex;
                sequantialIndex++;          
              } else {
                validValues[k] = 0;
              }
              
            }        
            return yScaleQueue(i) + validValues[j]*calculateBarHeight(d, ignoredMetrics);
          }
        })
        .attr("rx", 4) // Rounded corners
        .attr("ry", 4)
        .style("opacity", 0.9)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          showTooltip(event, d);
        })
        .on("mouseout", function(event, d) {
          hideTooltip();
        })
        .transition()   
        .duration(750) // Slower, smoother animation           
        .ease(d3.easeCubicOut) // More natural easing
        .attr("width", d => { 
          if (metrics[0] === "failedCount") {
            return xScaleQueue(d.failedCount);
          } else {
            if (ignoredMetrics.includes(metrics[j])){
              return xScaleQueue(0.00);
            } else {
              return xScaleQueue(d[metrics[j]]);
            }
            
          }
          })        
        .attr("fill", color)
        .style("opacity", 1);
      }

      groupsEnter.append("text")
      .attr("x", 0 + padding + 8 ) // Slightly more padding
      .attr("y", function(d, i) {
        return yScaleQueue(i) + (barPadding + totalBarHeight)/2;
      })
      .classed(`newtext-${helperId}`, true)
      .text(d => d.name)
      .style("font-size", "14px")
      .style("font-weight", "600") // Bold for better visibility
      .style("fill", chartColors.text)
      .style("cursor", "pointer")
      // .style("text-shadow", "1px 1px 2px rgba(255,255,255,0.5)") // White text shadow for better contrast
      .on("mouseover", function(event, d) {
        showTooltip(event, d);
      })
      .on("mouseout", function(event, d) {
        hideTooltip();
      });

    }
    
    // Add title
    d3.select(this.svgElement)
      .append("text")
        .attr("x", svgWidth / 2)
        .attr("y", padding - 8)
        .attr("font-size", "18px")
        .attr("font-weight", "600")
        .style("text-anchor", "middle")
        .style("fill", chartColors.text)
        .text(this.props.title);
    
    // Add xAxis title
    d3.select(this.svgElement)
      .append("text")
        .attr("x", svgWidth / 2)
        .attr("y", svgHeight - padding + 2)
        .attr("dy", "1.8em")
        .attr("font-size", "14px")
        .attr("font-weight", "500")
        .style("text-anchor", "middle")
        .style("fill", chartColors.textLight)
        .text(this.props.xtitle);
    
    // Add yAxis title
    d3.select(this.svgElement)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -svgHeight/2)
        .attr("y", padding)
        .attr("dy", "-1.4em")
        .attr("font-size", "14px")
        .attr("font-weight", "500")
        .style("text-anchor", "middle")
        .style("fill", chartColors.textLight)
        .text("Job Name");
    
    function showTooltip(event, d) {
      
      tooltip
        .style("opacity", 1)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 10) + "px")
        .html(
          (metrics[0] === "failedCount" ? 
          `
          <div class="font-semibold text-white mb-1">${d.name}</div>
          <div class="text-gray-200">Failed Attempts: <span class="font-medium text-red-300">${formatNumberMoney(d.failedCount, true)}</span></div>
          `
          : 
          `
          <div class="font-semibold text-white mb-2">${d.name}</div>
          <div class="space-y-1">
            <div class="text-gray-200">Queue: <span class="font-medium text-pink-300">${formatNumberMoney(d.completedQueueTime, false, 4)} h</span></div>
        ` + (metrics.includes("completedRunTime") ? `<div class="text-gray-200">Run: <span class="font-medium text-green-300">${formatNumberMoney(d.completedRunTime, false, 4)} h</span></div>`: ``)
          + (metrics.includes("failedQueueTime") ? `<div class="text-gray-200">Failed Queue: <span class="font-medium text-orange-300">${formatNumberMoney(d.failedQueueTime, false, 4)} h</span></div>` : ``)
          + (metrics.includes("failedRunTime") ? `<div class="text-gray-200">Failed Run: <span class="font-medium text-red-300">${formatNumberMoney(d.failedRunTime, false, 4)} h</span></div>` : ``)
          + `</div>`)
         );
    }
    
    function hideTooltip() {        
      tooltip
        .style("left", "10px")
        .style("top", "10px")
        .style("opacity", 0);         
    }

    function colorMetric(metric) {
      let color = unknownColor.background;
      switch(metric) {
        case "completedQueueTime":
          color = queueColor.background;
          break;
        case "completedRunTime":
          color = "#4caf50";
          // color = runningColor.background;
          break;
        case "failedQueueTime":
          color = failedQueueColor;
          break;
        case "failedCount":
        case "failedRunTime":
          color = failedRunAttempts;
          break;         
        default:
          color = unknownColor.background;
      }
      return color;
    }  

    function calculateBarHeight(d, ignoredMetrics = []) {
      // const metricsNumber = metrics.length;      

      const _barCount = [ignoredMetrics.includes("completedRunTime") ? 0.00 : d.completedRunTime, 
      ignoredMetrics.includes("completedQueueTime") ? 0.00 : d.completedQueueTime, 
      ignoredMetrics.includes("failedQueueTime") ? 0.00 : d.failedQueueTime,
      ignoredMetrics.includes("failedRunTime") ? 0.00 : d.failedRunTime].filter(x => Number.parseFloat(x) > 0.00);      
      // console.log(_barCount);
      const barCount = _barCount.length;      
      // console.log(d.name + " : " + barCount);
      // return (barCount) * singleBarHeight;
      switch (barCount) {
        case 3:
          return tripleBarHeight;
        case 4:
        default:
          return singleBarHeight;
        case 2:
          return doubleBarHeight;
        case 1: 
          return totalBarHeight;        
        case 0:
          return totalBarHeight;    
      }
    }

    function onClickFilter(currentChecked, currentValue) {
      // console.log(currentChecked);
      // console.log(currentValue);
      const currentQueue = d3.select(`#queueTimeChart-${helperId}`).property("checked");
      const currentRun = d3.select(`#runTimeChart-${helperId}`).property("checked");
      const currentFailedQueue = d3.select(`#failedQueueTimeChart-${helperId}`).property("checked");
      const currentFailedRun = d3.select(`#failedRunTimeChart-${helperId}`).property("checked");
      const ignoreMetrics = [
        currentQueue === false || (currentValue === "completedQueueTime" && currentValue === false) ? "completedQueueTime" : "",
        currentRun === false || (currentValue === "completedRunTime" && currentValue === false) ? "completedRunTime" : "",
        currentFailedQueue === false || (currentValue === "failedQueueTime" && currentValue === false) ? "failedQueueTime" : "",
        currentFailedRun === false || (currentValue === "qufailedRunue" && currentValue === false) ? "failedRunTime" : "",
      ];


      if (currentChecked === false) {
        d3.selectAll(`.newbar-${helperId}`).remove();  
        d3.selectAll(`.newtext-${helperId}`).remove();
        d3.selectAll(`.xaxis-${helperId}`).remove();
        addBars(metrics, ignoreMetrics);       
      } else {
        d3.selectAll(`.newbar-${helperId}`).remove();  
        d3.selectAll(`.newtext-${helperId}`).remove();
        d3.selectAll(`.xaxis-${helperId}`).remove();
        addBars(metrics, ignoreMetrics);
      }
    }

    // Actions
    d3.select(`#queueTimeChart-${helperId}`)
      .on("click", function(event) {
        const currentChecked = event.target.checked;
        const currentValue = event.target.value;
        onClickFilter(currentChecked, currentValue);
      });
    
    d3.select(`#runTimeChart-${helperId}`)
      .on("click", function(event) {
        const currentChecked = event.target.checked;
        const currentValue = event.target.value;
        onClickFilter(currentChecked, currentValue);
      })
    
    d3.select(`#failedQueueTimeChart-${helperId}`)
      .on("click", function(event) {
        const currentChecked = event.target.checked;
        const currentValue = event.target.value;
        onClickFilter(currentChecked, currentValue);
      })

    d3.select(`#failedRunTimeChart-${helperId}`)
      .on("click", function(event) {
        const currentChecked = event.target.checked;
        const currentValue = event.target.value;
        onClickFilter(currentChecked, currentValue);
      })
  }

  componentDidMount() {

    // Min Max pairs
    if (this.props.data.length > 0) {
      this.handleBarChart();
    }    

  };

  componentDidUpdate() {
    if (this.props.data.length > 0) {
      this.handleBarChart();
    }
  }

  componentWillUnmount() {
   // console.log('Unmounting Bar Chart')
  }

  render() {

    if (this.props.data.length === 0) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-gray-500 text-lg font-medium">No data available</div>
            <div className="text-gray-400 text-sm mt-2">No statistics to display at this time</div>
          </div>
        </div>
      );
    }

  
  const queueFilter = this.props.metrics.includes("completedQueueTime") ? 
    <div className="flex items-center space-x-2">                
      <input 
        type="checkbox" 
        name="chartMetricsQ" 
        id={`queueTimeChart-${this.props.helperId}`} 
        className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2" 
        defaultChecked 
        value="completedQueueTime"
      />
      <label 
        htmlFor="queueTimeChart" 
        className="px-3 py-1.5 text-sm font-medium text-black rounded-md transition-colors cursor-pointer hover:opacity-90" 
        style={{ backgroundColor: queueColor.background }}
      >
        Queue
      </label>
    </div> : null;
    
  const runFilter = this.props.metrics.includes("completedRunTime") ? 
    <div className="flex items-center space-x-2">
      <input 
        type="checkbox" 
        name="chartMetricsR" 
        id={`runTimeChart-${this.props.helperId}`} 
        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2" 
        defaultChecked 
        value="completedRunTime"
      />
      <label 
        htmlFor="runTimeChart" 
        className="px-3 py-1.5 text-sm font-medium text-black rounded-md transition-colors cursor-pointer hover:opacity-90" 
        // style={{ backgroundColor: runningColor.background  }}
        style={{ backgroundColor: "#4caf50"  }}
      >
        Run
      </label>
    </div> : null;
    
  const failedQueueFilter = this.props.metrics.includes("failedQueueTime") ? 
    <div className="flex items-center space-x-2">
      <input 
        type="checkbox" 
        name="chartMetricsFq" 
        id={`failedQueueTimeChart-${this.props.helperId}`} 
        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2" 
        defaultChecked 
        value="failedQueueTime"
      />
      <label 
        htmlFor="failedQueueTimeChart" 
        className="px-3 py-1.5 text-sm font-medium text-black rounded-md transition-colors cursor-pointer hover:opacity-90" 
        style={{ backgroundColor: failedQueueColor }}
      >
        Failed Queue
      </label>
    </div> : null;
    
  const failedRunFilter = this.props.metrics.includes("failedRunTime") ? 
    <div className="flex items-center space-x-2">
      <input 
        type="checkbox" 
        name="chartMetricsFr" 
        id={`failedRunTimeChart-${this.props.helperId}`} 
        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2" 
        defaultChecked 
        value="failedRunTime"
      />
      <label 
        htmlFor="failedRunTimeChart" 
        className="px-3 py-1.5 text-sm font-medium text-white rounded-md transition-colors cursor-pointer hover:opacity-90" 
        style={{ backgroundColor: failedRunAttempts }}
      >
        Failed Run
      </label>
    </div> : null;
    
  const failedAttemptFilter = this.props.metrics.includes("failedCount") ? 
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4"></div> {/* Spacer for alignment */}
      <label 
        className="px-3 py-1.5 text-sm font-medium text-white rounded-md" 
        style={{ backgroundColor: failedRunAttempts }}
      >
        Failed Attempts
      </label>
    </div> : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          {queueFilter}          
          {runFilter}
          {failedQueueFilter}  
          {failedRunFilter}  
          {failedAttemptFilter}              
        </div>
        <div className="flex justify-center">
          <svg 
            version="1.1"
            baseProfile="full"
            xmlns="http://www.w3.org/2000/svg"
            ref={this.setSvgElement}
            className="drop-shadow-sm"
            style={{ background: chartColors.background, borderRadius: '8px' }}
          />
        </div>
    </div>
  );
  }
  
}

export default BarChart;

