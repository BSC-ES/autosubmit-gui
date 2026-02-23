import { useParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { autosubmitApiV3 } from "../services/autosubmitApiV3";
import {
  groupByAndAggregate,
  secondsToDelta,
} from "../components/context/utils";
import { exportToCSV } from "../services/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../common/Table";

const ExperimentTableView = () => {
  const routeParams = useParams();
  useASTitle(`Experiment ${routeParams.expid} table view`);
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`,
    },
    {
      name: `Table View`,
      route: `/experiment/${routeParams.expid}/table`,
    },
  ]);

  const { data, isFetching, isError } =
    autosubmitApiV3.endpoints.getExperimentTreeView.useQuery({
      expid: routeParams.expid,
    });

  // Data Wrappers
  const sourceData = (data?.jobs || [])
    .filter((item) => item.status === "COMPLETED" || item.status === "RUNNING")
    .map((item) => ({
      Name: item.id,
      Queue: item.minutes_queue,
      Run: item.minutes,
      Status: item.status,
      Section: item.section,
    }));
  const groupedNodes = groupByAndAggregate(sourceData, "Section");

  const exportAggregatedToCSV = () => {
    const exportableData = groupedNodes.map((item) => {
      return [
        item.Section,
        item.Count,
        secondsToDelta(item.SumQueue),
        secondsToDelta(item.AverageQueue),
        secondsToDelta(item.SumRun),
        secondsToDelta(item.AverageRun),
      ];
    });
    exportToCSV(
      [
        "Section",
        "Count",
        "Queue Sum",
        "Average Queue",
        "Run Sum",
        "Average Run",
      ],
      exportableData,
      `${new Date().toISOString()}_AggregatedJobSections_${
        routeParams.expid
      }.csv`,
    );
  };

  const exportJobListToCSV = () => {
    const exportableData = sourceData.map((item) => {
      return [
        item.Name,
        secondsToDelta(item.Queue),
        secondsToDelta(item.Run),
        item.Status,
      ];
    });
    exportToCSV(
      ["Job Name", "Queue", "Run", "Status"],
      exportableData,
      `${new Date().toISOString()}_JobList_${routeParams.expid}.csv`,
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {(isError || data?.error) && (
        <span className="alert alert-danger rounded-2xl">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>{" "}
          {data?.error_message || "Unknown error"}
        </span>
      )}
      {isFetching ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">
                Aggregated by Job Section
              </h3>
              <button
                onClick={exportAggregatedToCSV}
                className="btn btn-light text-sm border"
              >
                Export to CSV
              </button>
            </div>

            <div className="overflow-x-auto w-full">
              <Table>
                <TableHead className="bg-dark text-white">
                  <TableRow>
                    {[
                      "Section",
                      "Count",
                      "Queue Sum",
                      "Average Queue",
                      "Run Sum",
                      "Average Run",
                    ].map((item, index) => (
                      <TableHeader key={index}>{item}</TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedNodes.map((item) => (
                    <TableRow key={item.Section}>
                      <TableCell className="font-semibold">
                        {item.Section}
                      </TableCell>
                      <TableCell>{item.Count}</TableCell>
                      <TableCell>{secondsToDelta(item.SumQueue)}</TableCell>
                      <TableCell>{secondsToDelta(item.AverageQueue)}</TableCell>
                      <TableCell>{secondsToDelta(item.SumRun)}</TableCell>
                      <TableCell>{secondsToDelta(item.AverageRun)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Job List</h3>
              <button
                onClick={exportJobListToCSV}
                className="btn btn-light text-sm border"
              >
                Export to CSV
              </button>
            </div>

            <div className="overflow-x-auto w-full">
              <Table>
                <TableHead className="bg-dark text-white">
                  <TableRow>
                    {["Job Name", "Queue", "Run", "Status"].map((item) => (
                      <TableHeader>{item}</TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sourceData.map((item) => (
                    <TableRow key={item.Name}>
                      <TableCell className="font-semibold">
                        {item.Name}
                      </TableCell>
                      <TableCell>{secondsToDelta(item.Queue)}</TableCell>
                      <TableCell>{secondsToDelta(item.Run)}</TableCell>
                      <TableCell>{item.Status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExperimentTableView;
