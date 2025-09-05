import { useMemo } from "react";
import ScatterPlot from "../../common/plots/ScatterPlot";
import { secondsToDelta } from "../context/utils";

const StatsTimeScatterPlot = ({ data, attribute, mainTitle }) => {
  const maxSeconds = 1200;

  const getTimeInCorrectMeasure = (seconds, maxValue) => {
    if (maxValue > maxSeconds) {
      return getMinutes(seconds);
    } else {
      return Number.parseInt(seconds);
    }
  };

  const getTimeMeasurementName = (maxValue) => {
    if (maxValue > maxSeconds) {
      return "minutes";
    } else {
      return "seconds";
    }
  };

  const getTimeElementsName = (chosenAttrib) => {
    if (chosenAttrib === "ASYPD") {
      return "Queue + Run";
    } else {
      return "Run";
    }
  };

  const getTimeSeconds = (d, chosenAttrib) => {
    if (chosenAttrib === "ASYPD") {
      return Number.parseInt(d.queue + d.running);
    } else {
      return Number.parseInt(d.running);
    }
  };

  const getMinutes = (seconds) => {
    return Number.parseInt(Number.parseInt(seconds) / 60);
  };

  const tooltipContentFn = (d) => `
    <p class="font-semibold text-white">${d.name} </p>
    <p>Queue: <span class="text-pink-300">${secondsToDelta(d.queue)}</span></p>
    <p>Run: <span class="text-green-300">${secondsToDelta(d.running)}</span></p>
    <p>JPSY: <span class="text-cyan-300">${d.JPSY}</span></p>
    <p>${attribute}: ${d[attribute]}</p>
    `;

  const maxTime = useMemo(
    () => Math.max(...data.map((d) => getTimeSeconds(d, attribute))),
    [data, attribute]
  );

  return (
    <ScatterPlot
      data={data.map((d) => ({
        ...d,
        runningNormalized: getTimeInCorrectMeasure(
          getTimeSeconds(d, attribute),
          maxTime
        ),
      }))}
      xKey={"runningNormalized"}
      yKey={attribute}
      xTitle={
        getTimeElementsName(attribute) +
        " time in " +
        getTimeMeasurementName(maxTime) +
        ""
      }
      yTitle={attribute}
      colorKey={"JPSY"}
      title={mainTitle}
      colorRange={["#01949A", "#004369"]}
      legendTitle={"JPSY"}
      tooltipContentFn={tooltipContentFn}
      showSaveButton={true}
    />
  );
};

export default StatsTimeScatterPlot;
