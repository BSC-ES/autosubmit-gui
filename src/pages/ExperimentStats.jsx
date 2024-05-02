import { useParams, useSearchParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { useEffect, useRef, useState } from "react";
import { useGetExperimentStatsQuery } from "../services/autosubmitApiV3";
import { calculateStatistics } from "../components/context/utils";
import BarChart from "../components/statistics/BarChart";
import * as Tooltip from "@radix-ui/react-tooltip";

const StatsMetricsTable = ({ stats, filteredStats, metrics, caption }) => {
  return (
    <table className="table w-full text-sm table-bordered mb-0 caption-bottom">
      <caption className="text-dark">{caption}</caption>
      <thead className="bg-dark text-white font-bold">
        <tr>
          <th>Metric</th>
          <th className="text-end">Value</th>
          {Object.keys(filteredStats).length > 0 && (
            <th className="text-end">
              Value <sup>(*)</sup>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {metrics.map((metric) => (
          <tr key={metric.key}>
            <td className="font-bold">{metric.title}</td>
            <td className="text-end">{stats[metric.key]}</td>
            {Object.keys(filteredStats).length > 0 && (
              <td className="text-end">{filteredStats[metric.key]}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/**
 *
 * @param {Array} jobStats
 * @param {string} pattern
 * @returns {Array}
 */
const filterJobs = (jobStats, pattern) => {
  let isValidRegExp = true;
  try {
    new RegExp(pattern, "i");
  } catch (e) {
    isValidRegExp = false;
  }
  if (isValidRegExp === false || String(pattern).trim().length === 0) {
    const totalData = jobStats;
    return totalData;
  }
  const re = RegExp(pattern, "i");
  const filteredDataSet = jobStats.filter((job) => {
    return re.test(job.name);
  });
  return filteredDataSet;
};

const StatsReport = ({ data, selectedSection }) => {
  const [pattern, setPattern] = useState("");
  const [stats, setStats] = useState({});
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filteredStats, setFilteredStats] = useState({});

  useEffect(() => {
    if (data && data.Statistics && data.Statistics.JobStatistics) {
      const newStats = calculateStatistics(data.Statistics.JobStatistics);
      setStats(newStats);

      if (pattern) {
        const newFilterJobs = filterJobs(
          data.Statistics.JobStatistics,
          pattern
        );
        const newFilterStats = calculateStatistics(newFilterJobs);
        setFilteredJobs(newFilterJobs);
        setFilteredStats(newFilterStats);
      } else {
        setFilteredJobs(data.Statistics.JobStatistics);
        setFilteredStats({});
      }
    }
  }, [data, pattern]);

  const handleFilterChange = (e) => {
    setPattern(e.target.value);
  };

  return (
    <div className="flex flex-col grow">
      <div className="rounded-2xl border grow dark:bg-neutral-50 dark:text-black">
        <div className="bg-dark rounded-t-xl flex flex-wrap gap-4 justify-between items-center text-white px-6 py-2 mb-6">
          <label className="flex gap-2 items-center">
            Selected job section:{" "}
            <span className="badge bg-primary text-white">
              {selectedSection}
            </span>
          </label>
          {data && data.Statistics && data.Statistics.Period && (
            <label className="flex gap-2 items-center">
              Time range:{" "}
              <span className="badge bg-primary text-white">
                {data.Statistics.Period.From !== "None"
                  ? data.Statistics.Period.From
                  : "Start of experiment"}
              </span>{" "}
              to{" "}
              <span className="badge bg-primary text-white">
                {data.Statistics.Period.To}
              </span>
            </label>
          )}

          <div>
            <label className="text-sm me-2">Filter jobs:</label>
            <input
              className="form-input text-sm px-3 bg-white text-black"
              placeholder="e.g: _71_SIM"
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {data && data.Statistics && data.Statistics.JobStatistics && (
          <>
            <div className="flex px-4 mb-3 gap-4 justify-center">
              <span>
                CPU Consumption{" "}
                <span className="bg-light rounded px-1">{`${stats.cpuConsumptionPercentage} %`}</span>{" "}
                {Object.keys(filteredStats).length > 0 && (
                  <span className="bg-light rounded px-1">
                    {`${filteredStats.cpuConsumptionPercentage} %`}
                    <sup>(*)</sup>
                  </span>
                )}
              </span>
              <span>
                Total Queue Time{" "}
                <span className="bg-light rounded px-1">{`${stats.totalQueueTime} hours`}</span>{" "}
                {Object.keys(filteredStats).length > 0 && (
                  <span className="bg-light rounded px-1">
                    {`${filteredStats.totalQueueTime} hours`}
                    <sup>(*)</sup>
                  </span>
                )}
              </span>
            </div>

            <div className="flex gap-3 px-3 flex-wrap">
              <div className="grow">
                <StatsMetricsTable
                  stats={stats}
                  filteredStats={filteredStats}
                  metrics={[
                    {
                      title: "Jobs Submitted",
                      key: "jobsSubmittedCount",
                    },
                    {
                      title: "Jobs Run",
                      key: "jobsRunCount",
                    },
                    {
                      title: "Jobs Completed",
                      key: "jobsCompletedCount",
                    },
                    {
                      title: "Jobs Failed",
                      key: "jobsFailedCount",
                    },
                  ]}
                  caption="Considers number of jobs and retrials."
                />
              </div>

              <div className="grow">
                <StatsMetricsTable
                  stats={stats}
                  filteredStats={filteredStats}
                  metrics={[
                    {
                      title: "Expected Consumption (h)",
                      key: "expectedConsumption",
                    },
                    {
                      title: "Real Consumption (h)",
                      key: "realConsumption",
                    },
                    {
                      title: "Failed Real Consumption (h)",
                      key: "failedRealConsumption",
                    },
                  ]}
                  caption="Considers the running time of the jobs and retrials."
                />
              </div>

              <div className="grow">
                <StatsMetricsTable
                  stats={stats}
                  filteredStats={filteredStats}
                  metrics={[
                    {
                      title: "Expected CPU Consumption (h)",
                      key: "expectedCpuConsumption",
                    },
                    {
                      title: "CPU Consumption (h)",
                      key: "cpuConsumption",
                    },
                    {
                      title: "Failed CPU Consumption (h)",
                      key: "failedCpuConsumption",
                    },
                  ]}
                  caption="Considers the number of processors requested by the job (and retrials) multiplied by the corresponding running time."
                />
              </div>
            </div>

            <div className="flex justify-center items-center p-4 gap-3 flex-wrap">
              <div className="overflow-x-auto">
                <BarChart
                  data={filteredJobs}
                  title="Statistics"
                  metrics={[
                    "completedQueueTime",
                    "completedRunTime",
                    "failedQueueTime",
                    "failedRunTime",
                  ]}
                  xtitle="Hours"
                  helperId={"4"}
                />
              </div>

              <div className="overflow-x-auto">
                <BarChart
                  data={filteredJobs}
                  title="Failed Attempts per Job"
                  metrics={["failedCount"]}
                  xtitle="Attempts"
                  helperId={"1"}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ExperimentStats = () => {
  const routeParams = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const sectionRef = useRef();
  const hourRef = useRef();
  useASTitle(`Experiment ${routeParams.expid} statistics`);
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`,
    },
    {
      name: `Statistics`,
      route: `/experiment/${routeParams.expid}/stats`,
    },
  ]);
  const { data, isFetching, isError } = useGetExperimentStatsQuery(
    {
      expid: routeParams.expid,
      section: searchParams.get("section") || "Any",
      hours: searchParams.get("hours") || "0",
    },
    {
      skip: !searchParams.get("section") && !searchParams.get("hours"),
    }
  );

  useEffect(() => {
    sectionRef.current.value = searchParams.get("section");
    hourRef.current.value = searchParams.get("hours");
  }, [searchParams]);

  const handleGetStats = (e) => {
    e.preventDefault();
    sectionRef.current.value = sectionRef.current.value || "Any";
    hourRef.current.value = hourRef.current.value || "0";
    setSearchParams({
      section: sectionRef.current.value,
      hours: hourRef.current.value,
    });
  };

  return (
    <div className="w-full flex flex-col min-w-0">
      {(isError || data?.error) && (
        <span className="alert alert-danger rounded-2xl">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>{" "}
          {data?.error_message || "Unknown error"}
        </span>
      )}
      <form
        onSubmit={handleGetStats}
        className="mb-4 flex flex-wrap gap-3 items-center"
      >
        <div className="grow flex gap-3 items-center">
          <label>
            Job section:{" "}
            <Tooltip.Provider>
              <Tooltip.Root delayDuration={300}>
                <Tooltip.Trigger asChild>
                  <i className="fa-solid fa-circle-question"></i>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    className="text-xs bg-black/85 text-white px-2 py-1 rounded max-w-[16rem] text-center"
                  >
                    Set a Job Section to constraint statistics calculation to
                    that group
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </label>
          <input
            className="form-input grow"
            ref={sectionRef}
            placeholder="e.g: SIM (optional)"
          />
        </div>
        <div className="grow flex gap-3 items-center">
          <label>
            Past hours (from now):{" "}
            <Tooltip.Provider>
              <Tooltip.Root delayDuration={300}>
                <Tooltip.Trigger asChild>
                  <i className="fa-solid fa-circle-question"></i>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    className="text-xs bg-black/85 text-white px-2 py-1 rounded max-w-[16rem] text-center"
                  >
                    Set the Past Hours value that determines how many hours
                    before the current time you want to query
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </label>
          <input
            type="number"
            className="form-input grow"
            ref={hourRef}
            placeholder="e.g: 72 (optional)"
          />
        </div>

        <button
          className="btn btn-dark px-4 font-bold text-nowrap"
          onClick={handleGetStats}
        >
          Get Statistics
        </button>
      </form>

      {isFetching ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : !searchParams.get("section") && !searchParams.get("hours") ? (
        <div className="my-8 w-full h-full flex flex-col gap-8 items-center justify-center text-center">
          <i className="fa-solid fa-magnifying-glass text-9xl"></i>
          <div className="text-lg mx-2">
            Please press the <strong>"Get Statistics"</strong> button to
            continue
          </div>
        </div>
      ) : (
        <StatsReport
          data={data}
          selectedSection={searchParams.get("section")}
        />
      )}
    </div>
  );
};

export default ExperimentStats;
