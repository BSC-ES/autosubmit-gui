import { useMemo } from "react";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { useParams, useSearchParams } from "react-router-dom";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "../common/Table";

const UserMetricsTable = ({ metrics }) => {
  const groupedMetrics = useMemo(() => {
    return metrics?.reduce((acc, metric) => {
      const { job_name, metric_name, metric_value } = metric;
      if (!acc[job_name]) {
        acc[job_name] = [];
      }
      acc[job_name].push({ metric_name, metric_value });
      return acc;
    }, {});
  }, [metrics]);

  return (
    <div className="overflow-auto custom-scrollbar">
      <Table>
        <TableHead className="bg-dark text-white">
          <TableRow>
            <TableHeader className="w-1/4">Job Name</TableHeader>
            <TableHeader className="w-1/4">Metric</TableHeader>
            <TableHeader className="w-1/2">Value</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedMetrics &&
            Object.entries(groupedMetrics).map(([jobName, metrics]) => (
              <>
                {metrics.map((metric, index) => (
                  <TableRow key={`${jobName}-${metric.metric_name}`}>
                    {index === 0 && (
                      <TableCell
                        rowSpan={metrics.length}
                        className="font-semibold"
                      >
                        {jobName}
                      </TableCell>
                    )}
                    <TableCell className="font-semibold">
                      {metric.metric_name}
                    </TableCell>
                    <TableCell>{metric.metric_value}</TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          {groupedMetrics && Object.keys(groupedMetrics).length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center opacity-50 py-6">
                No metrics available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const UserMetricsSelection = ({ expid, runs }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const runId = useMemo(() => {
    return searchParams.get("run_id") || runs[0].run_id;
  }, [searchParams]);

  const { data } = autosubmitApiV4.endpoints.getUserMetricsByRun.useQuery(
    {
      expid: expid,
      run_id: runId,
    },
    {
      skip: !runId,
    }
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 mx-8">
        <div className="font-semibold">Select Run:</div>
        <select
          className="border rounded-xl px-2 py-3 bg-white text-black min-w-[25%] max-w-full"
          value={runId}
          onChange={(e) => setSearchParams({ run_id: e.target.value })}
        >
          <option value="" disabled>
            Select a run
          </option>
          {runs.map((run) => (
            <option key={run.run_id} value={run.run_id}>
              Run {run.run_id}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <UserMetricsTable metrics={data?.metrics} />
      </div>
    </div>
  );
};

const UserMetricsPage = () => {
  const routeParams = useParams();
  useASTitle(`Experiment ${routeParams.expid} user-defined metrics`);
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`,
    },
    {
      name: `User-defined metrics`,
      route: `/experiment/${routeParams.expid}/user-metrics`,
    },
  ]);

  const {
    data: runsData,
    isFetching: runsIsFetching,
    isError: runsIsError,
  } = autosubmitApiV4.endpoints.getExperimentRuns.useQuery({
    expid: routeParams.expid,
  });

  return (
    <div className="w-full h-full flex flex-col min-w-0">
      {runsIsFetching ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : (
        <>
          {runsIsError ||
          !Array.isArray(runsData?.runs) ||
          runsData.runs.length === 0 ? (
            <div className="text-danger w-full grow flex flex-col gap-8 items-center justify-center">
              <i className="fa-solid fa-triangle-exclamation text-9xl"></i>
              <div className="text-2xl">
                {"Error fetching the experiment runs or no runs found"}
              </div>
            </div>
          ) : (
            <UserMetricsSelection
              expid={routeParams.expid}
              runs={[...runsData.runs].sort((a, b) => b.run_id - a.run_id)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserMetricsPage;
