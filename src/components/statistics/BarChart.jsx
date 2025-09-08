import { useState } from "react";
import BarPlot from "../../common/plots/BarPlot";
import { formatNumberMoney } from "../context/utils";
import {
  failedQueueColor,
  failedRunAttempts,
  queueColor,
} from "../context/vars";

const StatsBarChart = ({ data, title, xtitle, metrics }) => {
  const [filteredMetrics, setFilteredMetrics] = useState(metrics);
  const helperId = `${Math.random().toString(36).slice(2, 9)}`;

  const tooltipFnAttempt = (d) => `
        <div class="font-semibold text-white mb-1">${d.name}</div>
        <div class="text-gray-200">
          Failed Attempts: <span class="font-medium text-red-300">${formatNumberMoney(
            d.failedCount,
            true
          )}</span>
        </div>
      `;

  const tooltipFn4Metrics = (d) => {
    const items = [
      { key: "completedQueueTime", label: "Queue", color: "pink-300" },
      { key: "completedRunTime", label: "Run", color: "green-300" },
      { key: "failedQueueTime", label: "Failed Queue", color: "orange-300" },
      { key: "failedRunTime", label: "Failed Run", color: "red-300" },
    ];
    return `
      <div class="font-semibold text-white mb-2">${d.name}</div>
      <div class="space-y-1">
        ${items
          .filter((item) => metrics.includes(item.key))
          .map(
            (item) =>
              `<div class="text-gray-200">${
                item.label
              }: <span class="font-medium text-${
                item.color
              }">${formatNumberMoney(d[item.key], false, 4)} h</span></div>`
          )
          .join("")}
      </div>
    `;
  };

  // Factory function for filter controls
  const makeFilter = ({
    key,
    label,
    color,
    checked = true,
    inputClass = "",
    labelClass = "",
    labelTextColor = "text-black",
  }) =>
    metrics.includes(key) ? (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name={`chartMetrics${key}`}
          id={`${key}Chart-${helperId}`}
          className={`w-4 h-4 ${inputClass} bg-gray-100 border-gray-300 rounded focus:ring-2`}
          defaultChecked={checked}
          value={key}
          onChange={(e) => {
            if (e.target.checked) {
              setFilteredMetrics((prev) =>
                prev.includes(key) ? prev : [...prev, key]
              );
            } else {
              setFilteredMetrics((prev) => prev.filter((m) => m !== key));
            }
          }}
        />
        <label
          htmlFor={`${key}Chart-${helperId}`}
          className={`px-3 py-1.5 text-sm font-medium ${labelTextColor} rounded-md transition-colors cursor-pointer hover:opacity-90 ${labelClass}`}
          style={{ backgroundColor: color }}
        >
          {label}
        </label>
      </div>
    ) : null;

  const queueFilter = makeFilter({
    key: "completedQueueTime",
    label: "Queue",
    color: queueColor.background,
    inputClass: "text-pink-600 focus:ring-pink-500",
  });

  const runFilter = makeFilter({
    key: "completedRunTime",
    label: "Run",
    color: "#4caf50",
    inputClass: "text-green-600 focus:ring-green-500",
  });

  const failedQueueFilter = makeFilter({
    key: "failedQueueTime",
    label: "Failed Queue",
    color: failedQueueColor,
    inputClass: "text-orange-600 focus:ring-orange-500",
  });

  const failedRunFilter = makeFilter({
    key: "failedRunTime",
    label: "Failed Run",
    color: failedRunAttempts,
    inputClass: "text-red-600 focus:ring-red-500",
    labelTextColor: "text-white",
  });

  const failedAttemptFilter = metrics.includes("failedCount") ? (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4"></div> {/* Spacer for alignment */}
      <label
        className="px-3 py-1.5 text-sm font-medium text-white rounded-md"
        style={{ backgroundColor: failedRunAttempts }}
      >
        Failed Attempts
      </label>
    </div>
  ) : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-x-auto">
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        {queueFilter}
        {runFilter}
        {failedQueueFilter}
        {failedRunFilter}
        {failedAttemptFilter}
      </div>
      <div className="flex justify-center"></div>
      <BarPlot
        data={data}
        labelKey="name"
        valueKeys={filteredMetrics}
        colorMap={{
          completedQueueTime: "lightpink",
          completedRunTime: "#4caf50",
          failedRunTime: "#ff6666",
          failedQueueTime: "lightSalmon",
          failedCount: "#ff6666",
        }}
        title={title}
        xtitle={xtitle}
        ytitle="Job Name"
        tooltipContentFn={
          metrics && metrics[0] === "failedCount"
            ? tooltipFnAttempt
            : tooltipFn4Metrics
        }
        integerXTicks={metrics && metrics[0] === "failedCount"}
      />
    </div>
  );
};

export default StatsBarChart;
