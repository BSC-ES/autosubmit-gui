import React, { Component } from 'react';
import * as d3 from "d3";
import { queueColor, runningColor, unknownColor, failedQueueColor, failedRunAttempts } from "../context/vars";
// import StatsContext from "../context/statistics/statsContext";

class BarChart extends Component { 

  constructor(props) {
    super(props);
    this.svgElement = null;
    this.setSvgElement = element => {
      this.svgElement = element;
    }    
  }
  

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.loading !== this.props.loading){
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {

    // Min Max pairs
    const data = this.props.data;
    const metrics = this.props.metrics;
    const helperId = this.props.helperId;

    const minHeight = 120.0;
    const svgHeight = data.length * 40.0 > minHeight ? data.length * 40.0 : minHeight;
    const svgWidth = 620.0;
    // const rangeQueue = d3.extent(data, d => { return d.queue; });
    let maxDomain = 0;
    if (metrics[0] === "failedAttempts"){
        maxDomain = d3.max(data, d => { return Number.parseInt(d.failedAttempts); });
    } else {
        maxDomain = d3.max([d3.max(data, d => { return Number.parseFloat(d.queue); }),
                            d3.max(data, d => { return Number.parseFloat(d.run); }),
                            d3.max(data, d => { return Number.parseFloat(d.failedQueue); }),
                            d3.max(data, d => { return Number.parseFloat(d.failedRun); })]);
    }
        
    // const minQueue = d3.min(data, d => { return d.queue; });
    // const rangeRun = d3.extent(data, d => { return d.run; });
    // const rangeFailedQueue = d3.extent(data, d => { return d.failedQueue; });
    // const rangeFailedRun = d3.extent(data, d => { return d.failedRun; });
    const numBars = data.length * 1.0;
    const barPadding = 6;
    const padding = 30;
    // const paddingTop = 10;
    // const paddingBottom = 10;
    
    //const height = 500;
    const totalBarHeight = numBars > 0 ? Math.floor((svgHeight - 2*padding) / numBars - barPadding) : barPadding;
    const singleBarHeight = totalBarHeight / 4.0; // Maximum = 4
    const doubleBarHeight = totalBarHeight / 2.0;
    const tripleBarHeight = totalBarHeight / 3.0;
    // console.log(rangeQueue);
    // console.log(rangeRun);
    // console.log(rangeFailedQueue);
    // console.log(rangeFailedRun);
    let xScaleQueue = null;
    if (metrics[0] === "failedAttempts") {
      xScaleQueue = d3.scaleLinear()
        .domain([0, maxDomain])
        .range([0, svgWidth - 1.3*padding]);
    } else {
      xScaleQueue = d3.scaleLinear()
      .domain([0, maxDomain])
      .range([0, svgWidth - 1.2*padding]);
    }
    
    
    const yScaleQueue = d3.scaleLinear()
      .domain([0, data.length])
      .range([padding, svgHeight - padding]);

    const xAxis = d3.axisBottom(xScaleQueue)
      .tickSize(-svgHeight + 2*padding)
      .tickSizeOuter(0);

      
    // Tooltip
    const tooltip = d3.select("body")
                      .append("div")
                        .classed("tooltip-d3", true);
    // console.log(this.svgElement);
    const svgEl = d3.select(this.svgElement);
    svgEl.attr("width", svgWidth);
    svgEl.attr("height", svgHeight);
    svgEl.selectAll("*").remove();

    svgEl.append("g")
      .attr("transform", "translate(" + padding + "," + (svgHeight - padding) + ")")
      .call(xAxis);

    let groupsEnter = svgEl.selectAll("rect")
      .data(data)
      .enter()      
    

    addBars(metrics, groupsEnter);

    // enterSequence is the object returned by enter()
    function addBars(metrics, enterSequence, ignoredMetrics = []) {
      // console.log(metrics);
      for (let j = 0; j < metrics.length; j++){

        const color = colorMetric(metrics[j]);
        //const metricClassName = `bar-${metrics[j]}`

        
        enterSequence.append("rect")
        .classed(`newbar-${helperId}`, true)        
        .attr("height", d => { 
          if (metrics[0] === "failedAttempts") {
            return totalBarHeight;
          } else {
            return calculateBarHeight(d, ignoredMetrics);
          }})
        .attr("x", padding)
        .attr("y", function(d, i) {
          // console.log(d.name);        
          //console.log(yScaleQueue(i) + j*singleBarHeight );
          if (metrics[0] === "failedAttempts"){
            return yScaleQueue(i);
          } else {
            let validValues = [ignoredMetrics.includes("run") ? 0.00 : d.run, 
            ignoredMetrics.includes("queue") ? 0.00 : d.queue, 
            ignoredMetrics.includes("failedQueue") ? 0.00 : d.failedQueue,
            ignoredMetrics.includes("failedRun") ? 0.00 : d.failedRun]
            // [d.run, d.queue, d.failedQueue, d.failedRun];        
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
          if (metrics[0] === "failedAttempts") {
            return xScaleQueue(d.failedAttempts);
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
    
    d3.select(this.svgElement)
      .append("text")
        .attr("x", svgWidth / 2)
        .attr("y", svgHeight - padding + 2)
        .attr("dy", "1.5em")
        .style("text-anchor", "middle")
        .text(this.props.xtitle);
    
    d3.select(this.svgElement)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -svgHeight/2)
        .attr("y", padding)
        .attr("dy", "-1.1em")
        .style("text-anchor", "middle")
        .text("Job Name");
    
    function showTooltip(d) {
      tooltip
        .style("opacity", 1)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px")
        .html(
          (metrics[0] === "failedAttempts" ? 
          `
          <p> Failed Attempts: ${d.failedAttempts} </p>
          `
          : 
          `
          <p> Queue: ${d.queue} h.</p>
        ` + (metrics.includes("run") ? `<p> Run: ${d.run} h.</p>`: ``)
          + (metrics.includes("failedQueue") ? `<p> Failed Queue: ${d.failedQueue} h.</p>` : ``)
          + (metrics.includes("failedRun") ? `<p> Failed Run: ${d.failedRun} h.</p>` : ``))
         );
    }
    
    function hideTooltip() {  
      tooltip
        .style("opacity", 0);  
    }

    function colorMetric(metric) {
      let color = unknownColor.background;
      switch(metric) {
        case "queue":
          color = queueColor.background;
          break;
        case "run":
          color = runningColor.background;
          break;
        case "failedQueue":
          color = failedQueueColor;
          break;
        case "failedAttempts":
        case "failedRun":
          color = failedRunAttempts;
          break;         
        default:
          color = unknownColor.background;
      }
      return color;
    }  

    function calculateBarHeight(d, ignoredMetrics = []) {
      // const metricsNumber = metrics.length;      

      const _barCount = [ignoredMetrics.includes("run") ? 0.00 : d.run, 
      ignoredMetrics.includes("queue") ? 0.00 : d.queue, 
      ignoredMetrics.includes("failedQueue") ? 0.00 : d.failedQueue,
      ignoredMetrics.includes("failedRun") ? 0.00 : d.failedRun].filter(x => Number.parseFloat(x) > 0.00);      
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
      //console.log(currentQueue);
      // const targetValue = d3.event.target.value;
      // console.log(targetValue);
      // console.log(currentChecked);
      const ignoreMetrics = [
        currentQueue === false || (currentValue === "queue" && currentValue === false) ? "queue" : "",
        currentRun === false || (currentValue === "run" && currentValue === false) ? "run" : "",
        currentFailedQueue === false || (currentValue === "failedQueue" && currentValue === false) ? "failedQueue" : "",
        currentFailedRun === false || (currentValue === "qufailedRunue" && currentValue === false) ? "failedRun" : "",
      ];

      // console.log(ignoreMetrics);

      if (currentChecked === false) {
        // console.log(d3.selectAll(".bar-queue"));
        d3.selectAll(`.newbar-${helperId}`).remove();  
        d3.selectAll(`.newtext-${helperId}`).remove();
        // const svgEl = d3.select(this.svgElement);          
        // let newGroupsEnter = d3.select(this.svgElement).selectAll("rect")
        //   .data(data)
        //   .enter();

        // console.log(newGroupsEnter);
        // console.log(groupsEnter);
        addBars(metrics, groupsEnter, ignoreMetrics);       
      } else {
        d3.selectAll(`.newbar-${helperId}`).remove();  
        d3.selectAll(`.newtext-${helperId}`).remove();
        addBars(metrics, groupsEnter, ignoreMetrics);
      }
    }

    // Actions
    d3.select(`#queueTimeChart-${helperId}`)
      .on("click", function() {
        const currentChecked = d3.event.target.checked;
        const currentValue = d3.event.target.value;
        onClickFilter(currentChecked, currentValue);
      });
    
    d3.select(`#runTimeChart-${helperId}`)
      .on("click", function() {
        const currentChecked = d3.event.target.checked;
        const currentValue = d3.event.target.value;
        onClickFilter(currentChecked, currentValue);
      })
    
      d3.select(`#failedQueueTimeChart-${helperId}`)
      .on("click", function() {
        const currentChecked = d3.event.target.checked;
        const currentValue = d3.event.target.value;
        onClickFilter(currentChecked, currentValue);
      })

      d3.select(`#failedRunTimeChart-${helperId}`)
      .on("click", function() {
        const currentChecked = d3.event.target.checked;
        const currentValue = d3.event.target.value;
        onClickFilter(currentChecked, currentValue);
      })

  };

  componentWillUnmount() {
    this.props.clearStats();
  }
  // console.log(metrics);

  render() {

  
  const queueFilter = this.props.metrics.includes("queue") ? <div className="form-check form-check-inline">                
  {/* <input type="checkbox" name="chartMetricsQ" id="queueTimeChart" className="form-check-input" defaultChecked onClick={onChangeQueue} value="queue"/> */}
  <input type="checkbox" name="chartMetricsQ" id={`queueTimeChart-${this.props.helperId}`} className="form-check-input" defaultChecked value="queue"/>
  <label htmlFor="queueTimeChart" className="px-1 mx-1 rounded form-check-label " style={{ background: queueColor.background }}>Queue</label>
  </div> : null;
  const runFilter = this.props.metrics.includes("run") ? <div className="form-check form-check-inline">
  <input type="checkbox" name="chartMetricsR" id={`runTimeChart-${this.props.helperId}`} className="form-check-input" defaultChecked value="run"/>
  <label htmlFor="runTimeChart" className="px-1 mx-1 rounded form-check-label text-white" style={{ background: runningColor.background }}>Run</label>
  </div> : null;
  const failedQueueFilter = this.props.metrics.includes("failedQueue") ? <div className="form-check form-check-inline">
  <input type="checkbox" name="chartMetricsFq" id={`failedQueueTimeChart-${this.props.helperId}`} className="form-check-input" defaultChecked value="failedQueue"/>
  <label htmlFor="failedQueueTimeChart" className="px-1 mx-1 rounded form-check-label" style={{ background: failedQueueColor }}>Failed Queue</label>
  </div> : null;
  const failedRunFilter = this.props.metrics.includes("failedRun") ? <div className="form-check form-check-inline">
  <input type="checkbox" name="chartMetricsFr" id={`failedRunTimeChart-${this.props.helperId}`} className="form-check-input" defaultChecked value="failedRun"/>
  <label htmlFor="failedRunTimeChart" className="px-1 mx-1 rounded form-check-label" style={{ background: failedRunAttempts }}>Failed Run</label>
  </div> : null;
  const failedAttemptFilter = this.props.metrics.includes("failedAttempts") ? <div className="form-check form-check-inline"><label className="px-1 mx-1 rounded form-check-label" style={{ background: failedRunAttempts }}>Failed Attempts</label></div> : null;

  return (
    <div>
        <div className="row">
          <div className="col">            
            {queueFilter}          
            {runFilter}
            {failedQueueFilter}  
            {failedRunFilter}  
            {failedAttemptFilter}              
          </div>
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

