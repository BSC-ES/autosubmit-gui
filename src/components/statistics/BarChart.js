import React, { Component } from 'react';
import * as d3 from "d3";
import { queueColor, runningColor, unknownColor, failedQueueColor, failedRunAttempts } from "../context/vars";
import { formatNumberMoney } from "../context/utils";
// import StatsContext from "../context/statistics/statsContext";

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

    const minHeight = 240.0;
    const svgHeight = Math.max(data.length * 35.0, minHeight);
    const svgWidth = 620.0;
    const numBars = data.length * 1.0;
    const barPadding = 4;
    const padding = 30;
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
                      .classed("tooltip-d3", true); 
    
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
        .call(xAxis);
      
      svgEl.append("g")
        .classed(`xaxis-${helperId}`, true)
        .attr("transform", "translate(" + padding + "," + (1.8*padding) + ")")
        .call(xAxisTop);
  
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
        .transition()   
        .duration(500)           
        .ease(d3.easeLinear)
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
        .attr("fill", color);
      }

      groupsEnter.append("text")
      .attr("x", 0 + padding + 5 )
      .attr("y", function(d, i) {
        return yScaleQueue(i) + (barPadding + totalBarHeight)/2;
      })
      .classed(`newtext-${helperId}`, true)
      .text(d => d.name)
      .on("mousemove", showTooltip)
      .on("touchstart", showTooltip)
      .on("mouseout", hideTooltip)      
      .on("touchend", hideTooltip);

    }
    
    // Add title
    d3.select(this.svgElement)
      .append("text")
        .attr("x", svgWidth / 2)
        .attr("y", padding - 5)
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .text(this.props.title);
    
    // Add xAxis title
    d3.select(this.svgElement)
      .append("text")
        .attr("x", svgWidth / 2)
        .attr("y", svgHeight - padding + 2)
        .attr("dy", "1.5em")
        .style("text-anchor", "middle")
        .text(this.props.xtitle);
    
    // Add yAxis title
    d3.select(this.svgElement)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -svgHeight/2)
        .attr("y", padding)
        .attr("dy", "-1.1em")
        .style("text-anchor", "middle")
        .text("Job Name");
    
    function showTooltip(event, d) {
      
      tooltip
        .style("opacity", 1)
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px")
        .html(
          (metrics[0] === "failedCount" ? 
          `
          <p> Failed Attempts: ${formatNumberMoney(d.failedCount, true)} </p>
          `
          : 
          `
          <p> Queue: ${formatNumberMoney(d.completedQueueTime, false, 4)} h.</p>
        ` + (metrics.includes("completedRunTime") ? `<p> Run: ${formatNumberMoney(d.completedRunTime, false, 4)} h.</p>`: ``)
          + (metrics.includes("failedQueueTime") ? `<p> Failed Queue: ${formatNumberMoney(d.failedQueueTime, false, 4)} h.</p>` : ``)
          + (metrics.includes("failedRunTime") ? `<p> Failed Run: ${formatNumberMoney(d.failedRunTime, false, 4)} h.</p>` : ``))
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
          color = runningColor.background;
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
        <div>
          <div className="row">
            <div className="col">No data</div>
          </div>
        </div>
      );
    }

  
  const queueFilter = this.props.metrics.includes("completedQueueTime") ? <div className="form-check form-check-inline">                
  <input type="checkbox" name="chartMetricsQ" id={`queueTimeChart-${this.props.helperId}`} className="form-check-input" defaultChecked value="completedQueueTime"/>
  <label htmlFor="queueTimeChart" className="px-1 mx-1 rounded form-check-label " style={{ background: queueColor.background }}>Queue</label>
  </div> : null;
  const runFilter = this.props.metrics.includes("completedRunTime") ? <div className="form-check form-check-inline">
  <input type="checkbox" name="chartMetricsR" id={`runTimeChart-${this.props.helperId}`} className="form-check-input" defaultChecked value="completedRunTime"/>
  <label htmlFor="runTimeChart" className="px-1 mx-1 rounded form-check-label text-white" style={{ background: runningColor.background }}>Run</label>
  </div> : null;
  const failedQueueFilter = this.props.metrics.includes("failedQueueTime") ? <div className="form-check form-check-inline">
  <input type="checkbox" name="chartMetricsFq" id={`failedQueueTimeChart-${this.props.helperId}`} className="form-check-input" defaultChecked value="failedQueueTime"/>
  <label htmlFor="failedQueueTimeChart" className="px-1 mx-1 rounded form-check-label" style={{ background: failedQueueColor }}>Failed Queue</label>
  </div> : null;
  const failedRunFilter = this.props.metrics.includes("failedRunTime") ? <div className="form-check form-check-inline">
  <input type="checkbox" name="chartMetricsFr" id={`failedRunTimeChart-${this.props.helperId}`} className="form-check-input" defaultChecked value="failedRunTime"/>
  <label htmlFor="failedRunTimeChart" className="px-1 mx-1 rounded form-check-label" style={{ background: failedRunAttempts }}>Failed Run</label>
  </div> : null;
  const failedAttemptFilter = this.props.metrics.includes("failedCount") ? <div className="form-check form-check-inline"><label className="px-1 mx-1 rounded form-check-label" style={{ background: failedRunAttempts }}>Failed Attempts</label></div> : null;

  return (
    <div>
        <div className="flex items-center justify-center gap-4">
          {queueFilter}          
          {runFilter}
          {failedQueueFilter}  
          {failedRunFilter}  
          {failedAttemptFilter}              
        </div>
        <svg version="1.1"
        baseProfile="full"
        xmlns="http://www.w3.org/2000/svg"
        ref={this.setSvgElement} />
    </div>
  );
  }
  
}

export default BarChart;

