import { useParams } from "react-router-dom";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { useGetExperimentPerformanceQuery } from "../services/autosubmitApiV3";
import MetricScatterPlot from "../components/plots/MetricScatterPlot";
import { Fragment, useEffect, useState } from "react";
import {
  secondsToDelta,
  arrayAverage,
  arrayStandardDeviation,
  arrayMeanAbsoluteDeviationAroundMean,
  formatNumberMoney,
  formatTime,
} from "../components/context/utils";
import TimeScatterPlot from "../components/plots/TimeScatterPlot";
import { cn, exportToCSV } from "../services/utils";
import Modal from "../common/Modal";
import { Dialog } from "@headlessui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../common/Table";
import * as Collapsible from "@radix-ui/react-collapsible";
import EnergyFootprintComparison from "../components/performance/EnergyFootprintComparison";

const PERFORMANCE_PLOTS = [
  {
    key: "JPSYvsCHSY",
    title: "JPSY vs CHSY",
    disabled: (d) => d.maxJPSY <= 0,
    type: "Scatter2D",
    attributeX: "JPSY",
    attributeY: "CHSY",
  },
  {
    key: "JPSYvsSYPD",
    title: "JPSY vs SYPD",
    disabled: (d) => d.maxJPSY <= 0,
    type: "Scatter2D",
    attributeX: "JPSY",
    attributeY: "SYPD",
  },
  {
    key: "JPSYvsASYPD",
    title: "JPSY vs ASYPD",
    disabled: (d) => d.maxJPSY <= 0,
    type: "Scatter2D",
    attributeX: "JPSY",
    attributeY: "ASYPD",
  },
  {
    key: "SYPDvsASYPD",
    title: "SYPD vs ASYPD",
    disabled: (d) => d.maxASYPD <= 0,
    type: "Scatter2D",
    attributeX: "SYPD",
    attributeY: "ASYPD",
  },
  {
    key: "CHSYvsSYPD",
    title: "CHSY vs SYPD",
    disabled: (d) => false,
    type: "Scatter2D",
    attributeX: "CHSY",
    attributeY: "SYPD",
  },
  {
    key: "CHSYvsASYPD",
    title: "CHSY vs ASYPD",
    disabled: (d) => d.maxASYPD <= 0,
    type: "Scatter2D",
    attributeX: "CHSY",
    attributeY: "ASYPD",
  },
  {
    key: "RunVsSYPD",
    title: "Runtime vs SYPD",
    disabled: (d) => false,
    type: "TimeScatter",
    attribute: "SYPD",
  },
  {
    key: "RunVsCHSY",
    title: "Runtime vs CHSY",
    disabled: (d) => false,
    type: "TimeScatter",
    attribute: "CHSY",
  },
  {
    key: "QueueRunVsASYPD",
    title: "Queue+Runtime vs ASYPD",
    disabled: (d) => d.maxASYPD <= 0,
    type: "TimeScatter",
    attribute: "ASYPD",
  },
];

const PerformancePlots = ({ considered }) => {
  const [displayPlots, setDisplayPlots] = useState({
    JPSYvsCHSY: false,
    JPSYvsSYPD: false,
    JPSYvsASYPD: false,
    SYPDvsASYPD: false,
    CHSYvsSYPD: false,
    CHSYvsASYPD: false,
    RunVsSYPD: false,
    RunVsCHSY: false,
    QueueRunVsASYPD: false,
  });

  const [auxStats, setAuxStats] = useState({
    consideredJPSY: [],
    maxJPSY: 0,
    maxASYPD: 0,
    JPSYdivisor: 1000,
    JPSYtitleX: "JPSY (thousands)",
  });

  useEffect(() => {
    if (Array.isArray(considered)) {
      const maxJPSY = Math.max(
        ...Array.from(
          considered.map((item) => {
            return parseInt(item.JPSY);
          })
        )
      );
      const maxASYPD = Math.max(
        ...Array.from(considered.map((item) => Number.parseFloat(item.ASYPD)))
      );
      const JPSYdivisor = maxJPSY > 999999999 ? 1000000 : 1000;
      const JPSYtitleX =
        maxJPSY > 999999999 ? "JPSY (millions)" : "JPSY (thousands)";
      const consideredJPSY = considered.map((item) => {
        return {
          ...item,
          JPSY: item.JPSY / JPSYdivisor,
        };
      });

      const newAux = {
        consideredJPSY: consideredJPSY,
        maxJPSY: maxJPSY,
        maxASYPD: maxASYPD,
        JPSYdivisor: JPSYdivisor,
        JPSYtitleX: JPSYtitleX,
      };
      setAuxStats(newAux);

      const newDisplay = {};
      PERFORMANCE_PLOTS.forEach((item) => {
        newDisplay[item.key] = !item.disabled(newAux);
      });
      setDisplayPlots(newDisplay);
    }
  }, [considered]);

  const handleCheckbox = (selector) => {
    setDisplayPlots({
      ...displayPlots,
      [selector]: !displayPlots[selector],
    });
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="flex gap-3 flex-wrap justify-around">
        {PERFORMANCE_PLOTS.map((item) => {
          return (
            <div key={item.key} className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                checked={displayPlots[item.key]}
                onChange={() => handleCheckbox(item.key)}
                disabled={item.disabled(auxStats)}
              />
              <label className="px-1 mx-1 form-check-label">{item.title}</label>
            </div>
          );
        })}
      </div>
      <div
        className="w-full flex gap-3 flex-wrap justify-around"
        style={{ minHeight: 480 }}
      >
        {PERFORMANCE_PLOTS.map((item) => {
          let plot = <></>;
          if (displayPlots[item.key]) {
            if (item.type === "Scatter2D") {
              if (
                ["JPSYvsCHSY", "JPSYvsSYPD", "JPSYvsASYPD"].includes(item.key)
              ) {
                plot = (
                  <MetricScatterPlot
                    data={auxStats.consideredJPSY}
                    attributeX={item.attributeX}
                    attributeY={item.attributeY}
                    titleX={auxStats.JPSYtitleX}
                    mainTitle={item.title}
                    uniqueId={item.title}
                  />
                );
              } else {
                plot = (
                  <MetricScatterPlot
                    data={considered}
                    attributeX={item.attributeX}
                    attributeY={item.attributeY}
                    mainTitle={item.title}
                    uniqueId={item.title}
                  />
                );
              }
            } else if (item.type === "TimeScatter") {
              plot = (
                <TimeScatterPlot
                  data={considered}
                  attribute={item.attribute}
                  mainTitle={item.title}
                  uniqueId={item.title}
                />
              );
            }
          }
          return <Fragment key={item.key}>{plot}</Fragment>;
        })}
      </div>
    </div>
  );
};

const PerformanceConsideredJobs = ({ considered }) => {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow className="bg-primary-200 font-bold sticky top-0">
            {[
              "Chunk",
              "Job Name",
              "Queue",
              "Run",
              "CHSY",
              "SYPD",
              "ASYPD",
              "JPSY",
              "Energy",
              "Footprint",
            ].map((title) => (
              <TableHeader className="py-1" key={title}>
                {title}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {considered &&
            [...considered]
              .sort((a, b) => {
                if (a.chunk === b.chunk) {
                  return a.name > b.name ? 1 : -1;
                } else {
                  return a.chunk > b.chunk ? 1 : -1;
                }
              })
              .map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="py-1">{item.chunk}</TableCell>
                  <TableCell className="py-1">{item.name}</TableCell>
                  <TableCell className="py-1">
                    <strong> {secondsToDelta(item.queue)}</strong>
                  </TableCell>
                  <TableCell className="py-1">
                    <strong>{secondsToDelta(item.running)}</strong>
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(item.CHSY)}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(item.SYPD)}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(item.ASYPD)}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(item.JPSY, true)}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(item.energy, true)}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(item.footprint, true)}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </>
  );
};

const PerformanceSummary = ({ data }) => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (data && Array.isArray(data.considered)) {
      let newMetrics = {
        JPSY: data.considered
          .filter((x) => x.JPSY > 0)
          .map((item) => item.JPSY),
        SYPD: data.considered.map((item) => item.SYPD),
        ASYPD: data.considered.map((item) => item.ASYPD),
        CHSY: data.considered.map((item) => item.CHSY),
      };
      setMetrics(newMetrics);
    }
  }, [data]);

  return (
    <>
      <Table>
        <TableHead>
          <TableRow className="bg-primary-200 font-bold">
            {["Metric", "Value", "Min", "Max", "SD", "MAD"].map((title) => (
              <TableHeader className="py-1" key={title}>
                {title}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {metrics &&
            Object.keys(metrics).map((key) => {
              return (
                <TableRow key={key}>
                  <TableCell className="py-1 font-bold">{key}</TableCell>
                  <TableCell className={cn("py-1 font-bold")}>
                    <span className="rounded px-1 bg-light">
                      {formatNumberMoney(data[key])}
                    </span>
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(Math.min(...metrics[key]))}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(Math.max(...metrics[key]))}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(arrayStandardDeviation(metrics[key]))}
                  </TableCell>
                  <TableCell className="py-1">
                    {formatNumberMoney(
                      arrayMeanAbsoluteDeviationAroundMean(metrics[key])
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
};

const PerformanceSustainability = ({ data }) => {
  
  const computeStats = (values) => {
    const nums = values.filter((v) => typeof v === "number" && !isNaN(v));
    if (nums.length === 0)
      return { avg: "-", min: "-", max: "-", sd: "-", mad: "-" };

    return {
      avg: arrayAverage(nums),
      min: Math.min(...nums),
      max: Math.max(...nums),
      sd: arrayStandardDeviation(nums),
      mad: arrayMeanAbsoluteDeviationAroundMean(nums),
    };
  };

  const energyValues = data?.considered?.map((job) => job.energy) || [];
  const footprintValues = data?.considered?.map((job) => job.footprint) || [];

  const energyStats = computeStats(energyValues);
  const footprintStats = computeStats(footprintValues);

  const metrics = [
    {
      label: "Consumed Energy (J)",
      stats: energyStats,
      total: data?.Total_energy || "-",
    },
    {
      label: "Generated footprint (gCO₂)",
      stats: footprintStats,
      total: data?.Total_footprint || "-",
    },
  ];

  return (
    <>
      <Table>
        <TableHead>
          <TableRow className="bg-primary-200 font-bold">
            <TableHeader className="py-1">Metric</TableHeader>
            <TableHeader className="py-1">Mean</TableHeader>
            <TableHeader className="py-1">Min</TableHeader>
            <TableHeader className="py-1">Max</TableHeader>
            <TableHeader className="py-1">SD</TableHeader>
            <TableHeader className="py-1">MAD</TableHeader>
            <TableHeader className="py-1">Total</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {metrics.map((metric, index) => (
            <TableRow key={index}>
              <TableCell className="py-1 font-bold">{metric.label}</TableCell>
              <TableCell className="py-1">
                <span className="rounded px-1 bg-light">
                  {metric.stats.avg === "-"
                    ? "-"
                    : formatNumberMoney(metric.stats.avg, true)}
                </span>
              </TableCell>
              <TableCell className="py-1">
                <span className="rounded px-1 bg-light">
                  {metric.stats.min === "-"
                    ? "-"
                    : formatNumberMoney(metric.stats.min, true)}
                </span>
              </TableCell>
              <TableCell className="py-1">
                <span className="rounded px-1 bg-light">
                  {metric.stats.max === "-"
                    ? "-"
                    : formatNumberMoney(metric.stats.max, true)}
                </span>
              </TableCell>
              <TableCell className="py-1">
                <span className="rounded px-1 bg-light">
                  {metric.stats.sd === "-"
                    ? "-"
                    : formatNumberMoney(metric.stats.sd, true)}
                </span>
              </TableCell>
              <TableCell className="py-1">
                <span className="rounded px-1 bg-light">
                  {metric.stats.mad === "-"
                    ? "-"
                    : formatNumberMoney(metric.stats.mad, true)}
                </span>
              </TableCell>
              <TableCell className="py-1 font-bold">
                <span className="rounded px-1 bg-light">
                  {typeof metric.total === "undefined" || metric.total === null
                    ? "-"
                    : formatNumberMoney(metric.total, true)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col mt-4">
        <span>
          <strong>Footprint</strong>: Measures the total amount of greenhouse gases, especially carbon dioxide, emitted directly and indirectly by a platform.
        </span>
      </div>
      <div className="rounded-2xl border mt-5 p-5 dark:bg-neutral-50 dark:text-black">
        <h2 className="text-2xl font-bold mb-12 text-center">Comparative of Energy and Carbon Footprint</h2>
        <EnergyFootprintComparison
          energy={data.Total_energy || 0}
          footprint={data.Total_footprint || 0}
        />
      </div>
    </>
  );
};

const ExperimentPerformance = () => {
  const routeParams = useParams();
  const [showWarnings, setShowWarnings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useASTitle(`Experiment ${routeParams.expid} performance`);
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`,
    },
    {
      name: `Performance`,
      route: `/experiment/${routeParams.expid}/performance`,
    },
  ]);
  const { data, isFetching, refetch, isError } =
    useGetExperimentPerformanceQuery(routeParams.expid);

  const toggleShowWarning = () => setShowWarnings(!showWarnings);
  const toggleShowHelp = () => setShowHelp(!showHelp);

  const exportConsideredToCSV = (considered, expid) => {
    const exportableData = [...considered]
      .sort((a, b) => {
        if (a.chunk === b.chunk) {
          return a.name > b.name ? 1 : -1;
        } else {
          return a.chunk > b.chunk ? 1 : -1;
        }
      })
      .map((item) => {
        return [
          item.chunk,
          item.name,
          secondsToDelta(item.queue),
          secondsToDelta(item.running),
          formatNumberMoney(item.CHSY),
          formatNumberMoney(item.SYPD),
          formatNumberMoney(item.ASYPD),
          formatNumberMoney(item.JPSY, true),
          formatNumberMoney(item.energy, true),
          formatNumberMoney(item.footprint, true),
        ];
      });
    exportToCSV(
      [
        "Chunk",
        "Job Name",
        "Queue",
        "Run",
        "CHSY",
        "SYPD",
        "ASYPD",
        "JPSY",
        "Energy",
        "Footprint",
      ],
      exportableData,
      `${new Date().toISOString()}_ConsideredPerformance_${expid}.csv`,
      "\t"
    );
  };

  return (
    <>
      <Modal show={showWarnings} onClose={toggleShowWarning}>
        <Dialog.Title
          className={
            "bg-warning text-white py-4 px-4 text-2xl font-semibold rounded-t-lg flex gap-4 justify-between items-center"
          }
        >
          <span>
            <i className="fa-solid fa-triangle-exclamation mx-2"></i> Warnings
          </span>
          <div className="cursor-pointer" onClick={toggleShowWarning}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </Dialog.Title>
        <div className="bg-white text-black py-6 px-6 rounded-b-lg">
          <ol className="list-decimal ms-4">
            {data &&
              Array.isArray(data.warnings_job_data) &&
              data.warnings_job_data.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
          </ol>
        </div>
      </Modal>

      <Modal show={showHelp} onClose={toggleShowHelp}>
        <Dialog.Title
          className="bg-dark text-white py-4 px-4 text-2xl font-semibold rounded-t-lg flex justify-between items-center"
        >
          <span>
            <i className="fa-solid fa-circle-light mx-2"></i> Key information
          </span>
          <div className="cursor-pointer" onClick={toggleShowHelp}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </Dialog.Title>
        <div className="bg-white text-black py-6 px-6 rounded-b-lg space-y-6">
          <div>
            <div className="mb-4">
              <h4 className="text-xl font-semibold mb-2">Considered Jobs</h4>
                <p>
                  Scrollable list where each item represents the last successful{" "} 
                  <strong>SIM</strong> job for each <strong>CHUNK</strong>. 
                  It's important to know that <strong>retries</strong> are <strong>not considered</strong> in this list.
                  Displays key information such as <strong>Job Name</strong>,{" "} 
                  <strong>QUEUE</strong> and {" "}
                  <strong>RUNNING</strong> time in{" "}<em>HH:mm:ss</em> format,{" "} 
                  <strong>CHSY</strong>, <strong>JPSY</strong>, and raw {" "}
                  <strong>Energy (J)</strong> consumption for that job.{" "} <em>
                    Note: Energy values are only collected for jobs running on 
                    MareNostrum4 and using the latest version of Autosubmit. 
                    Subsequent development will expand this feature for other 
                    platforms. Please note that all performance metrics displayed 
                    in the Performance Metrics section are calculated based on the 
                    data from these considered <strong>SIM</strong> jobs.
                  </em>
                </p>
            </div>
            <h4 className="text-xl font-semibold mb-2">General Metrics</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Parallelization</strong>:
                <span>
                {" "}Total number of cores allocated for the run, per <strong>SIM</strong>.
                </span>
              </li>
              <li>
              <strong>Simulated time</strong>:
                <span>
                {" "}Represents the computed duration of the simulation run 
                from the <strong>Start Date</strong> to the last completed <strong>CHUNK</strong> of the last<strong>SIM</strong> job; expressed in standard time units. 
                Units used: 1 year = 8760 hours, 1 month = 730 hours, 1 week = 168 hours and
                1 day = 24 hours.
                </span>
              </li>
              <li>
              <strong>Total core-hours</strong>:
                <span>
                {" "}Represents the sum of the number of core-hours consumed by the the last successful
                {" "} <strong>SIM</strong> job of each <strong>CHUNK</strong>.
                </span>
              </li>
              <li>
                <span>
                <strong>JPSY</strong>: 
                Energy cost of a simulation, measured in
                Joules per simulated year. The JPSY <strong>value</strong> at the
                experiment level is the mean of the values calculated at the job
                level. Energy values are only collected for jobs running on{" "}
                <strong>Marenostrum4</strong>. In rare occassions the query that
                retrieves the energy information fails and the value stays at 0.
                Jobs with <strong>0</strong> energy value are not considered for the
                calculation.
                </span>
              </li>
              <li>
                <span>
                <strong>SYPD</strong>: 
                Simulated Years Per Day for the model in a 24h period.
                The <strong>value</strong> at the experiment level is the mean of 
                the values calculated at the job level.
                </span>
              </li>
              <li>
                <span>
                <strong>ASYPD</strong>: 
                Actual Simulated Years Per Day, this number
                should be lower than SYPD due to interruptions, queue wait time,{" "}
                <strong>POST</strong> jobs, data transfer, or issues with the model
                workflow. The ASYPD <strong>value</strong> calculated at the job
                level uses a generalization of the formula applied at the experiment
                level. As a consequence, the ASYPD value at the experiment level can
                be different that the mean of the values calculated at the job
                level.
                </span>
              </li>
              <li>
                <span>
                <strong>CHSY</strong>: 
                Core Hours Per Simulated Year. This metric is
                the product of the model runtime for 1 Simulated Year and the number
                of processors (Parallelization) allocated. The CHSY{" "}
                <strong>value</strong> at the experiment level is the mean of the
                values calculated at the job level.
                </span>
              </li>
              <li>
                <span>
                <strong>RSYPD</strong>: 
                "Real" Simulated Years Per Day. This
                variation of SYPD has been defined only at the experiment level. It
                depends on the existences of <strong>TRANSFER</strong> or{" "}
                <strong>CLEAN</strong> jobs. Then, it uses the finish time of the
                last TRANSFER or CLEAN job and the start time of the first SIM job
                in the experiment to calculate an approximation of the total
                duration of the simulation.
                </span>
              </li>
              <p>
                Visit{" "}
                <a
                  href="https://autosubmit-api.readthedocs.io/en/latest/guides/performance/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Performance Metrics Documentation
                </a>{" "}
                for more details.
              </p>
            </ul>
            <h4 className="text-xl font-semibold mt-4 mb-2">Sustainability</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Consumed Energy (J)</strong>:
                <span>
                {" "}Represents the sum of consumed energy by the
                platform for each last successful <strong>SIM</strong> job of each <strong>CHUNK</strong>.
                </span>
              </li>
              <li>
                <span>
                <strong>Generated footprint (gCO₂)</strong>: Represents the sum of generated footprint by the  
                platform for each last successful <strong>SIM</strong> job of each <strong>CHUNK</strong>. The footprint of a
                job is calculated as the product of the consumed energy (MWh) by the job;
                the greenhouse gas conversion factor (CF) —which converts megawatt-hours 
                into grams of CO₂— according to the supplier bill or the country energy mix; 
                and power usage effectiveness (PUE) which accounts for other costs sustained 
                from the data centre of the platform, such as cooling.{" "}
                </span> 
                <em>
                Note: To be able to calculate the footprint, the energy in Joules is first 
                converted to Megawatt-hours by dividing by 3.6*10⁹. Moreover, ensure 
                that the 'CF' and 'PUE' values are configured in the platform settings to obtain 
                the footprint. Finally, the units of the CF showed at the article are in kgCO₂/MWh. 
                However, we suggest to use gCO₂/MWh because it facilitates the comprehension 
                of the footprint values.
                </em>
              </li>
              <p>
                Visit sections 2, 2.1 and 3.8 {" "}
                <a
                  href="https://gmd.copernicus.org/articles/17/3081/2024/gmd-17-3081-2024.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Footprint and Energy Cost Article
                </a>{" "}
                for more details.
              </p>
            </ul>
          </div>
        </div>
      </Modal>

      <div className="w-full grow flex flex-col gap-4 min-w-0">
        {(isError || data?.error) && (
          <span className="alert alert-danger rounded-2xl">
            <i className="fa-solid fa-triangle-exclamation me-2"></i>{" "}
            {data?.error_message || "Unknown error"}
          </span>
        )}
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="text-3xl font-semibold">PERFORMANCE METRICS</h2>
          <div className="flex gap-2 flex-wrap">
            {data &&
              Array.isArray(data.warnings_job_data) &&
              data.warnings_job_data.length > 0 && (
                <button
                  className="btn btn-warning font-bold text-white px-4"
                  onClick={() => {
                    toggleShowWarning();
                  }}
                >
                  WARNINGS ({data.warnings_job_data.length})
                </button>
              )}
            <button
              className="btn btn-success font-bold text-white"
              title="Refresh data"
              onClick={() => {
                refetch();
              }}
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>

        {isFetching ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="spinner-border" role="status"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 w-full">
              <div className="rounded-2xl border grow min-w-0 dark:bg-neutral-50 dark:text-black">
                <div className="bg-dark rounded-t-xl flex gap-3 justify-between items-center text-white px-6 py-2 mb-2">
                  <label className="font-bold">SUMMARY</label>
                  <div>
                    <button
                      className="btn btn-dark rounded-full"
                      onClick={toggleShowHelp}
                    >
                      <i className="fa-solid fa-circle-question"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="overflow-auto">
                    <div className="mb-4 flex gap-4">
                      <span>
                        <strong>Parallelization</strong>:{" "}
                        <span className="rounded px-1 bg-light">
                          {data?.Parallelization || "-"}
                        </span>
                      </span>
                      <span>
                        <strong>RSYPD</strong>:{" "}
                        <span className="rounded px-1 bg-light">
                          {data?.RSYPD?.toFixed(2) || "-"}
                        </span>
                      </span>
                      <span>
                        <strong>Simulated time</strong>:{" "}
                        <span className="rounded px-1 bg-light">
                          {data?.SY? formatTime(data.SY) : "-"} 
                        </span>
                      </span>
                      <span>
                        <strong>Total core-hours</strong>:{" "}
                        <span className="rounded px-1 bg-light">
                          {data?.Total_core_hours || "-"} 
                        </span>
                      </span>
                    </div>
                    <PerformanceSummary data={data} />
                    <div className="flex flex-col mt-4">
                      <span>
                        <strong>Value</strong>: Value of the metric calculated
                        at the experiment level.
                      </span>
                      <span>
                        <strong>SD</strong>: Standard Deviation.
                      </span>
                      <span>
                        <strong>MAD</strong>: Mean Absolute Deviation Around the
                        Mean.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border grow min-w-0 dark:bg-neutral-50 dark:text-black">
                <div className="bg-dark rounded-t-xl flex gap-3 justify-between items-center text-white px-6 py-2 mb-2">
                  <label className="font-bold">CONSIDERED JOBS</label>
                  <div>
                    <button
                      className="btn btn-dark rounded-full"
                      onClick={toggleShowHelp}
                    >
                      <i className="fa-solid fa-circle-question"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-4 flex gap-4">
                    <span>
                      <strong># considered</strong>:{" "}
                      <span className="rounded px-1 bg-light">
                        {data?.considered?.length || "0"}
                      </span>
                    </span>
                    {Array.isArray(data?.not_considered) && (
                      <span>
                        <strong># not considered</strong>:{" "}
                        <span className="rounded px-1 bg-light">
                          {data?.not_considered?.length || "0"}
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="overflow-auto custom-scrollbar max-h-[40vh]">
                    <PerformanceConsideredJobs considered={data.considered} />
                  </div>
                  <div className="text-end mt-2">
                    <button
                      onClick={() =>
                        exportConsideredToCSV(
                          data.considered,
                          routeParams.expid
                        )
                      }
                      className="btn btn-light text-sm border"
                    >
                      Export to CSV
                    </button>
                  </div>
                  {data?.not_considered?.length > 0 && (
                    <Collapsible.Root className="py-4">
                      <Collapsible.Trigger className="bg-primary-600 text-white w-full font-semibold py-2 hover:opacity-95">
                        Display not considered jobs{" "}
                        <i className="ms-1 fa-solid fa-eye"></i>
                      </Collapsible.Trigger>
                      <Collapsible.Content>
                        <div className="overflow-auto custom-scrollbar max-h-[40vh]">
                          <PerformanceConsideredJobs
                            considered={data.not_considered}
                          />
                        </div>
                      </Collapsible.Content>
                    </Collapsible.Root>
                  )}
                </div>
              </div>
            </div>
                
            <div className="rounded-2xl border grow min-w-0 dark:bg-neutral-50 dark:text-black">
                <div className="bg-dark rounded-t-xl flex gap-3 justify-between items-center text-white px-6 py-2 mb-2">
                  <label className="font-bold">SUSTAINABILITY</label>
                  <div>
                    <button
                      className="btn btn-dark rounded-full"
                      onClick={toggleShowHelp}
                    >
                      <i className="fa-solid fa-circle-question"></i>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="overflow-auto">
                  <div className="mb-4 flex gap-4">
                      <span>
                        <strong>Platform</strong>:{" "}
                        <span className="rounded px-1 bg-light">
                          {data?.platform_info?.name || "-"}
                        </span>
                      </span>
                      <span>
                        <strong>CF</strong>:{" "}
                        <span className="rounded px-1 bg-light">
                          {data?.platform_info?.CF|| "-"}
                        </span>
                      </span>
                      <span>
                        <strong>PUE</strong>:{" "}
                        <span className="rounded px-1 bg-light">
                          {data?.platform_info?.PUE || "-"}
                        </span>
                      </span>
                    </div>
                    <PerformanceSustainability data={data} />
                  </div>
                </div>
              </div>
          
            <div className="rounded-2xl border grow dark:bg-neutral-50 dark:text-black">
              <div className="bg-dark rounded-t-xl flex gap-3 justify-between items-center text-white px-4 py-3 mb-4">
                <label className="font-bold">COMPARATIVE PLOTS</label>
              </div>

              <div className="p-3">
                <PerformancePlots considered={data.considered} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ExperimentPerformance;
