import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { saveSVGObj } from "../../services/utils";

const CHART_COLORS = {
  background: "#FFFFFF", // White background
  border: "#E5E7EB", // Gray-200 for grid lines
  text: "#1F2937", // Dark gray for better contrast
  textLight: "#6B7280", // Gray-500
};

const ScatterPlot = ({
  data,
  xKey,
  yKey,
  colorKey,
  radiusKey,
  title,
  xTitle,
  yTitle,
  legendTitle,
  tooltipContentFn,
  colorRange = ["#01949A", "#004369"],
  radiusRange = [3, 8],
  width = 480,
  height = 480,
  showLegend = true,
  showSaveButton = false,
}) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  const handleSaveClick = () => {
    if (svgRef.current && title) {
      saveSVGObj(svgRef.current, title);
    }
  };

  const generatePlot = () => {
    const padding = 40;
    const paddingLeft = 40;

    // Set up SVG
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    svgEl.attr("width", width).attr("height", height);

    setupTooltip();

    // Filter data to remove null/undefined values
    const filteredData = data.filter(
      (d) =>
        d[xKey] !== undefined &&
        d[xKey] !== null &&
        d[yKey] !== undefined &&
        d[yKey] !== null
    );

    if (filteredData.length === 0) return;

    // Define scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(filteredData, (d) => Number.parseFloat(d[xKey])))
      .range([paddingLeft, width - padding]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(filteredData, (d) => Number.parseFloat(d[yKey])))
      .range([height - padding, padding]);

    // Color scale (optional)
    let colorScale = null;
    if (colorKey) {
      const colorExtent = d3.extent(filteredData, (d) => {
        const value = Number.parseFloat(d[colorKey]);
        return !isNaN(value) ? value : undefined;
      });

      if (colorExtent[0] !== undefined && colorExtent[1] !== undefined) {
        colorScale = d3.scaleLinear().domain(colorExtent).range(colorRange);
      }
    }

    // Radius scale (optional)
    let radiusScale = null;
    if (radiusKey) {
      const radiusExtent = d3.extent(filteredData, (d) => {
        const value = Number.parseFloat(d[radiusKey]);
        return !isNaN(value) ? value : undefined;
      });

      if (radiusExtent[0] !== undefined && radiusExtent[1] !== undefined) {
        radiusScale = d3.scaleLinear().domain(radiusExtent).range(radiusRange);
      }
    }

    // Add axes
    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(-height + 2 * padding)
      .tickSizeOuter(0);

    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(-width + padding + paddingLeft)
      .tickSizeOuter(0);

    svgEl
      .append("g")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    svgEl
      .append("g")
      .attr("transform", `translate(${paddingLeft}, 0)`)
      .call(yAxis);

    // Add circles
    svgEl
      .selectAll("circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(Number.parseFloat(d[xKey])))
      .attr("cy", (d) => yScale(Number.parseFloat(d[yKey])))
      .attr("r", (d) => {
        if (
          radiusScale &&
          d[radiusKey] !== undefined &&
          d[radiusKey] !== null
        ) {
          const value = Number.parseFloat(d[radiusKey]);
          return !isNaN(value) ? radiusScale(value) : radiusRange[0];
        }
        return radiusRange[0];
      })
      .attr("fill", (d) => {
        if (colorScale && d[colorKey] !== undefined && d[colorKey] !== null) {
          const value = Number.parseFloat(d[colorKey]);
          return !isNaN(value) ? colorScale(value) : colorRange[0];
        }
        return colorRange[0];
      })
      // .attr("stroke", "#fff")
      // .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => showTooltip(event, d))
      .on("mouseout", hideTooltip)
      .on("touchstart", (event, d) => showTooltip(event, d))
      .on("touchend", hideTooltip);

    // Add title
    if (title) {
      svgEl
        .append("text")
        .attr("x", width / 2)
        .attr("y", 0.2 * padding)
        .attr("dy", "1.5em")
        .attr("font-family", "Helvetica")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", CHART_COLORS.text)
        .text(title);
    }

    // Add x-axis title
    if (xTitle) {
      svgEl
        .append("text")
        .attr("x", width / 2)
        .attr("y", height - 0.7 * padding)
        .attr("dy", "1em")
        .attr("font-family", "Helvetica")
        .style("text-anchor", "middle")
        .text(xTitle);
    }

    // Add y-axis title
    if (yTitle) {
      svgEl
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 0.8 * padding)
        .attr("dy", "-1em")
        .attr("font-family", "Helvetica")
        .style("text-anchor", "middle")
        .text(yTitle);
    }

    // Add legend (if color scale exists and legend is enabled)
    if (showLegend && colorScale && legendTitle) {
      const legendData = [
        {
          value: d3.min(filteredData, (d) => Number.parseFloat(d[colorKey])),
          position: 30,
        },
        {
          value: d3.mean(filteredData, (d) => Number.parseFloat(d[colorKey])),
          position: 20,
        },
        {
          value: d3.max(filteredData, (d) => Number.parseFloat(d[colorKey])),
          position: 10,
        },
      ];

      // Legend title
      svgEl
        .append("text")
        .attr("x", width - 45 - padding)
        .attr("y", 0.6 * padding)
        .attr("dy", "0.45em")
        .attr("font-family", "Helvetica")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .text(legendTitle);

      // Legend rectangles
      legendData.forEach((legend, index) => {
        svgEl
          .append("rect")
          .attr("x", width - legend.position - padding)
          .attr("y", 0.5 * padding)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", colorScale(legend.value));
      });
    }
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
      .style("left", `${event.pageX - 60}px`)
      .style("top", `${event.pageY}px`)
      .html(
        tooltipContentFn
          ? tooltipContentFn(d)
          : `
            <div>
              <p><strong>${d.name || "Item"}</strong></p>
              <p>${xTitle || xKey}: ${d[xKey]}</p>
              <p>${yTitle || yKey}: ${d[yKey]}</p>
              ${
                colorKey
                  ? `<p>${legendTitle || colorKey}: ${d[colorKey]}</p>`
                  : ""
              }
              ${radiusKey ? `<p>${radiusKey}: ${d[radiusKey]}</p>` : ""}
            </div>
          `
      );
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
    xKey,
    yKey,
    colorKey,
    radiusKey,
    title,
    xTitle,
    yTitle,
    legendTitle,
    tooltipContentFn,
    colorRange,
    radiusRange,
    width,
    height,
    showSaveButton,
  ]);

  return (
    <>
      {data === undefined || data.length === 0 ? (
        <div
          className="text-center text-gray-500"
          style={{ minWidth: `${width}px` }}
        >
          No data available
        </div>
      ) : (
        <div className="scroll-x relative">
          <svg
            version="1.1"
            baseProfile="full"
            xmlns="http://www.w3.org/2000/svg"
            ref={svgRef}
          />
          {showSaveButton && (
            <button
              className="absolute top-0 start-0 btn"
              onClick={handleSaveClick}
              title="Save as SVG"
            >
              <i className="fa-solid fa-floppy-disk"></i>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ScatterPlot;

/**
 * Example props for the ScatterPlot component.
PROPS_EXAMPLE = {
  data: [
    {
      name: "Job A",
      x_value: 10,
      y_value: 20,
      color_value: 5,
      radius_value: 3,
      queue: 100,
      running: 200,
    },
    {
      name: "Job B", 
      x_value: 15,
      y_value: 25,
      color_value: 8,
      radius_value: 5,
      queue: 150,
      running: 300,
    },
  ],
  xKey: "x_value", // string - key for x-axis data
  yKey: "y_value", // string - key for y-axis data
  colorKey: "color_value", // string (optional) - key for color mapping
  radiusKey: "radius_value", // string (optional) - key for radius mapping
  title: "Performance Scatter Plot",
  xTitle: "X Axis Label",
  yTitle: "Y Axis Label", 
  legendTitle: "Color Scale",
  tooltipContentFn: (data) => `
    <div>
      <p><strong>${data.name}</strong></p>
      <p>Queue: ${secondsToDelta(data.queue)}</p>
      <p>Running: ${secondsToDelta(data.running)}</p>
      <p>X: ${data.x_value}</p>
      <p>Y: ${data.y_value}</p>
    </div>
  `,
  colorRange: ["#01949A", "#004369"], // array of 2 colors
  radiusRange: [3, 8], // array of 2 numbers for min/max radius
  width: 480, // number
  height: 480, // number
  showLegend: true, // boolean
  showSaveButton: false, // boolean - shows save as SVG button
};
 */
