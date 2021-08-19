import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";
import { queueColor, runningColor, unknownColor, failedQueueColor, failedRunAttempts } from "../context/vars";

const BarChart = ( {data, title, metrics, xtitle} ) => {
  const svgRef = useRef(null);
  // const svgWidth = 500;
  // const svgHeight = 600;

  useEffect(() => {

    // let hourValues = [];
    // let attemptValues = [];
    // // Build total 
    // data.forEach(element => {
    //   hourValues.push(element.queue);
    //   hourValues.push(element.run);
    //   hourValues.push(element.failedQueue);
    //   hourValues.push(element.failedRun);
    // });
    // console.log(data);
    // Min Max pairs
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

    const tooltip = d3.select("body")
                      .append("div")
                        .classed("tooltip-d3", true);

    const svgEl = d3.select(svgRef.current);
    svgEl.attr("width", svgWidth);
    svgEl.attr("height", svgHeight);
    svgEl.selectAll("*").remove();

    svgEl.append("g")
      .attr("transform", "translate(" + padding + "," + (svgHeight - padding) + ")")
      .call(xAxis);

    let groupsEnter = svgEl.selectAll("rect")
      .data(data)
      .enter()
    
    
    for (let j = 0; j < metrics.length; j++){
      let color = unknownColor.background;
      switch(metrics[j]) {
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

      groupsEnter.append("rect")
      .attr("width", d => { 
        if (metrics[0] === "failedAttempts") {
          return xScaleQueue(d.failedAttempts);
        } else {
          return xScaleQueue(d[metrics[j]]);
        }
        })
      .attr("height",d => { 
        if (metrics[0] === "failedAttempts") {
          return totalBarHeight;
        } else {
          return calculateBarHeight(d);
        }})
      .attr("x", padding)
      .attr("y", function(d, i) {
        //console.log(d.name);        
        //console.log(yScaleQueue(i) + j*singleBarHeight );
        if (metrics[0] === "failedAttempts"){
          return yScaleQueue(i);
        } else {
          let validValues = [d.run, d.queue, d.failedQueue, d.failedRun];        
          let sequantialIndex = 0;
          for (let k = 0; k < validValues.length; k++ ){
            if (Number.parseFloat(validValues[k]) > 0.00) {
              validValues[k] = sequantialIndex;
              sequantialIndex++;          
            } else {
              validValues[k] = 0;
            }
            
          }        
          return yScaleQueue(i) + validValues[j]*calculateBarHeight(d);
        }
      })
      .attr("fill", color);
    }
    

    groupsEnter.append("text")
      .attr("x", 0 + padding + 5 )
      .attr("y", function(d, i) {
        return yScaleQueue(i) + (barPadding + totalBarHeight)/2;
      })
      .text(d => d.name)
      .on("mousemove", showTooltip)
      .on("touchstart", showTooltip)
      .on("mouseout", hideTooltip)      
      .on("touchend", hideTooltip);
        
    
    // Add title
    d3.select(svgRef.current)
      .append("text")
        .attr("x", svgWidth / 2)
        .attr("y", padding - 5)
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .text(title);
    
    d3.select(svgRef.current)
      .append("text")
        .attr("x", svgWidth / 2)
        .attr("y", svgHeight - padding + 2)
        .attr("dy", "1.5em")
        .style("text-anchor", "middle")
        .text(xtitle);
    
    d3.select(svgRef.current)
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

    function calculateBarHeight(d) {
      // const metricsNumber = metrics.length;      
      const _barCount = [d.run, d.queue, d.failedQueue, d.failedRun].filter(x => Number.parseFloat(x) > 0.00);      
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

  }, [data, title, metrics, xtitle]);

  
  return <svg version="1.1"
              baseProfile="full"
              xmlns="http://www.w3.org/2000/svg"
              ref={svgRef} />;
  
}

export default BarChart

