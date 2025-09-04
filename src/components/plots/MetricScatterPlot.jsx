import ScatterPlot from "../../common/plots/ScatterPlot";
import { formatNumberMoney, secondsToDelta } from "../context/utils";

const StatsMetricScatterPlot = ({
  data,
  attributeX,
  attributeY,
  titleX,
  titleY,
  mainTitle,
}) => {
  const tooltipContentFn = (d) => `
    <p class="font-semibold text-white">${d.name} </p>
    <p>Queue: <span class="text-pink-300">${secondsToDelta(d.queue)}</span></p>
    <p>Run: <span class="text-green-300">${secondsToDelta(d.running)}</span></p>
    <p>${attributeX}: ${
    attributeX === "JPSY" ? formatNumberMoney(d[attributeX]) : d[attributeX]
  }</p>
    <p>${attributeY}: ${d[attributeY]}</p>
  `;

  return (
    <ScatterPlot
      data={data}
      xKey={attributeX}
      yKey={attributeY}
      colorKey={"running"}
      title={mainTitle}
      xTitle={titleX || attributeX}
      yTitle={titleY || attributeY}
      legendTitle={"Run"}
      tooltipContentFn={tooltipContentFn}
      colorRange={["lightgreen", "darkgreen"]}
      radiusRange={[4, 4]}
      showSaveButton={true}
    />
  );
};

export default StatsMetricScatterPlot;
