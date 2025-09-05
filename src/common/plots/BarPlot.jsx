import * as d3 from "d3";
import { useEffect, useRef } from "react";

const CHART_COLORS = {
  background: "#FFFFFF", // White background
  border: "#E5E7EB", // Gray-200 for grid lines
  text: "#1F2937", // Dark gray for better contrast
  textLight: "#6B7280", // Gray-500
};

const BarPlot = ({
  data,
  labelKey,
  valueKeys,
  colorMap,
  title,
  xtitle,
  ytitle,
  tooltipContentFn,
  integerXTicks = false,
}) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  const calculateDomain = (data, metrics) => {
    const values = data.map((d) => metrics.map((key) => d[key] || undefined));
    const flatValues = values.flat();
    const filteredValues = flatValues.filter((v) => v !== undefined);
    let maxDomain = d3.max(filteredValues);
    if (maxDomain === undefined) maxDomain = 1;
    return [d3.min(filteredValues), maxDomain];
  };

  const tickXFormatFn = (x) => {
    return integerXTicks ? Math.round(x) : x;
  };

  const generatePlot = () => {
    const numBars = data.length;
    const minHeight = 280.0;
    const svgHeight = Math.max(numBars * 45.0, minHeight);
    const svgWidth = 620.0;
    const padding = 40;

    // Set up SVG
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    svgEl.attr("width", svgWidth).attr("height", svgHeight);

    setupTooltip();

    // Define scales
    const yScaleQueue = d3
      .scaleLinear()
      .domain([0, numBars])
      .range([padding * 2, svgHeight - padding]);

    const maxDomain = calculateDomain(data, valueKeys)[1];
    const xScaleQueue = d3
      .scaleLinear()
      .domain([0, maxDomain])
      .range([0, svgWidth - 1.2 * padding]);

    // Add title
    d3.select(svgRef.current)
      .append("text")
      .attr("x", svgWidth / 2)
      .attr("y", padding - 8)
      .attr("font-size", "18px")
      .attr("font-weight", "600")
      .style("text-anchor", "middle")
      .style("fill", "black")
      .text(title);

    // Add xAxis title
    d3.select(svgRef.current)
      .append("text")
      .attr("x", svgWidth / 2)
      .attr("y", svgHeight - padding + 2)
      .attr("dy", "1.8em")
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .style("text-anchor", "middle")
      .style("fill", CHART_COLORS.textLight)
      .text(xtitle);

    // Add yAxis title
    d3.select(svgRef.current)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -svgHeight / 2)
      .attr("y", padding)
      .attr("dy", "-1.4em")
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .style("text-anchor", "middle")
      .style("fill", CHART_COLORS.textLight)
      .text(ytitle);

    // Add axes
    const xAxis = d3
      .axisBottom(xScaleQueue)
      .tickSize(-svgHeight + 2.8 * padding)
      .tickValues(
        integerXTicks ? [...Array(parseInt(maxDomain) + 1).keys()] : null
      )
      .tickFormat(tickXFormatFn)
      .tickSizeOuter(0);

    const xAxisTop = d3
      .axisTop(xScaleQueue)
      .tickValues(
        integerXTicks ? [...Array(parseInt(maxDomain) + 1).keys()] : null
      )
      .tickFormat(tickXFormatFn)
      .tickSizeOuter(0);

    svgEl
      .append("g")
      .attr("transform", `translate(${padding}, ${svgHeight - padding})`)
      .call(xAxis)
      .selectAll("line")
      .style("stroke", CHART_COLORS.border)
      .style("stroke-dasharray", "2,2");

    svgEl
      .append("g")
      .attr("transform", `translate(${padding}, ${1.8 * padding})`)
      .call(xAxisTop)
      .selectAll("text")
      .style("fill", CHART_COLORS.text)
      .style("font-size", "12px");

    // Adding bars
    const groupsEnter = svgEl.selectAll(".bar-group").data(data).enter();

    const barPadding = 6;
    const barHeight =
      numBars > 0
        ? Math.floor((svgHeight - 3 * padding) / numBars - barPadding)
        : barPadding;

    valueKeys.forEach((key, index) => {
      const barColor = colorMap[key] || "#999999";
      groupsEnter
        .append("rect")
        .attr("height", (d) => {
          // Calculate valid sub bars for this data point
          const validSubBars = valueKeys.filter(
            (k) => d[k] !== undefined && d[k] !== null && d[k] > 0
          );
          return validSubBars.length > 0 ? barHeight / validSubBars.length : 0;
        })
        .attr("x", padding)
        .attr("y", (d, idx) => {
          // Check how many valid sub bars (> 0 and not null) will be rendered
          const validSubBars = valueKeys.filter(
            (k) => d[k] !== undefined && d[k] !== null && d[k] > 0
          );
          const subBarHeight =
            validSubBars.length > 0 ? barHeight / validSubBars.length : 0;
          const subBarIndex = validSubBars.indexOf(key);
          if (subBarIndex === -1) return yScaleQueue(idx) + barHeight; // Place it outside the bar if not valid
          return yScaleQueue(idx) + subBarHeight * subBarIndex;
        })
        .attr("rx", 4)
        .attr("ry", 4)
        .style("cursor", "pointer")
        .style("fill", barColor)
        .on("mouseover", (event, d) => showTooltip(event, d))
        .on("mouseout", hideTooltip)
        .on("touchstart", (event, d) => showTooltip(event, d))
        .on("touchend", hideTooltip)
        .transition()
        .duration(750)
        .ease(d3.easeCubicOut)
        .attr("width", (d) => {
          return xScaleQueue(Number.parseFloat(d[key] || 0));
        });
    });

    // Add bar labels
    svgEl
      .selectAll(".bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", padding + 8)
      .attr("y", (d, idx) => yScaleQueue(idx) + (barPadding + barHeight) / 2)
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .style("fill", CHART_COLORS.text)
      .text((d) => d[labelKey])
      .on("mouseover", (event, d) => showTooltip(event, d))
      .on("mouseout", hideTooltip)
      .on("touchstart", (event, d) => showTooltip(event, d))
      .on("touchend", hideTooltip);
  };

  const setupTooltip = () => {
    const tooltip = d3.select("body").append("div").classed("tooltip-d3", true);
    tooltipRef.current = tooltip;
  };

  const cleanupTooltip = () => {
    const tooltip = tooltipRef.current;
    if (tooltip) {
      tooltip.remove();
      tooltipRef.current = null;
    }
  };

  const showTooltip = (event, d) => {
    const tooltip = tooltipRef.current;
    tooltip
      .style("opacity", 1)
      .style("left", `${event.pageX + 15}px`)
      .style("top", `${event.pageY - 10}px`)
      .html(tooltipContentFn ? tooltipContentFn(d) : `Value: ${d[labelKey]}`);
  };

  const hideTooltip = () => {
    const tooltip = tooltipRef.current;
    tooltip.style("opacity", 0);
  };

  useEffect(() => {
    if (!data || data.length === 0) return;
    generatePlot();

    return () => {
      // Cleanup code if needed
      cleanupTooltip();
    };
  }, [
    generatePlot,
    data,
    labelKey,
    valueKeys,
    colorMap,
    title,
    xtitle,
    ytitle,
    tooltipContentFn,
    integerXTicks,
  ]);

  return (
    <>
      {data === undefined || data.length === 0 ? (
        <div className="text-center text-gray-500 min-w-[620px]">
          No data available
        </div>
      ) : (
        <svg
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
          ref={svgRef}
        />
      )}
    </>
  );
};

export default BarPlot;

/**
 * Example props for the BarPlot component.
PROPS_EXAMPLE = {
  data: [
    {
      label: "Category A",
      val1: 30,
      val2: 50,
    },
    {
      label: "Category B",
      val1: 80,
    },
    {
      label: "Category C",
      val1: 45,
      val3: 55,
    },
  ],
  labelKey: "label", // string
  valueKeys: ["val1", "val2", "val3"], // array of strings
  colorMap: {
    val1: "#00A63E",
    val2: "#007BFF",
    val3: "#FF5733",
  },
  title: "Statistics",
  xtitle: "Hours",
  ytitle: "Job Name",
  tooltipContentFn: (data) => `
  <div>
    <strong>Value 1:</strong> ${data["val1"] || 0}<br />
    <strong>Value 2:</strong> ${data["val2"] || 0}<br />
    <strong>Value 3:</strong> ${data["val3"] || 0}<br />
  </div>
  `,
};
 */
