import { useParams } from "react-router-dom";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import useASTitle from "../hooks/useASTitle";
import { useMemo, useState } from "react";
import useBreadcrumb from "../hooks/useBreadcrumb";

const deepMapAccess = (obj, path) => {
  return path.reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : undefined;
  }, obj);
};

const getSectionsHeadersMergeConfigs = (config1, config2) => {
  let sections = [];

  // Sepatate subsections with not object values
  let primitiveSections = new Set();
  let objectSections = new Set();
  if (config1 && typeof config1 === "object") {
    Object.keys(config1).forEach((key) => {
      if (typeof config1[key] !== "object") {
        primitiveSections.add(key);
      } else {
        objectSections.add(key);
      }
    });
  }
  if (config2 && typeof config2 === "object") {
    Object.keys(config2).forEach((key) => {
      if (typeof config2[key] !== "object") {
        primitiveSections.add(key);
      } else {
        objectSections.add(key);
      }
    });
  }
  if (primitiveSections.size > 0) {
    sections.push({
      section: [],
      keys: Array.from(primitiveSections),
    });
  }

  // Separate subsections with object values
  objectSections.forEach((key) => {
    let subsection = getSectionsHeadersMergeConfigs(
      config1 && typeof config1[key] === "object" ? config1[key] : {},
      config2 && typeof config2[key] === "object" ? config2[key] : {}
    );
    subsection = subsection.map((sub) => {
      return {
        section: [key, ...sub.section],
        keys: sub.keys,
      };
    });
    sections = sections.concat(subsection);
  });

  return sections;
};

const ExperimentConfigurationCompare = ({ configLeft, configRight }) => {
  const sections = useMemo(() => {
    return getSectionsHeadersMergeConfigs(configLeft, configRight);
  }, [configLeft, configRight]);

  return (
    <div className="flex flex-col">
      {sections.map((section) => (
        <div key={section.section.join(".")} className="mb-8">
          {section.section.length > 0 && (
            <>
              <div className="text-2xl font-bold mx-4 my-2 text-wrap break-words">
                {section.section.join(".")}
              </div>
              <hr />
            </>
          )}
          <div className="flex flex-col gap-3 my-3">
            {section.keys.map((key) => {
              let leftSubValue = deepMapAccess(
                configLeft,
                section.section.concat(key)
              );
              let rightSubValue = deepMapAccess(
                configRight,
                section.section.concat(key)
              );
              // eslint-disable-next-line eqeqeq
              let isDifferent = leftSubValue != rightSubValue;
              return (
                <div key={key} className="flex">
                  <div className="w-1/3 font-semibold pl-8 break-all">
                    {key}{" "}
                    {isDifferent && (
                      <i class="fa-solid fa-circle-exclamation text-amber-500"></i>
                    )}
                  </div>
                  <div className="w-1/3 text-wrap break-all pl-8">
                    {["string", "number"].includes(typeof leftSubValue)
                      ? leftSubValue
                      : JSON.stringify(leftSubValue)}
                  </div>
                  <div className="w-1/3 text-wrap break-all pl-8">
                    {["string", "number"].includes(typeof rightSubValue)
                      ? rightSubValue
                      : JSON.stringify(rightSubValue)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const ExperimentConfigurationSelect = ({
  selectedRun,
  setSelectedRun,
  config,
  runs,
  isError,
}) => {
  return (
    <>
      <select
        className="border rounded-xl px-2 py-3 bg-white text-black min-w-[75%] max-w-full"
        value={selectedRun}
        onChange={(e) => setSelectedRun(e.target.value)}
      >
        <option disabled value="">
          Select a configuration...
        </option>
        <option value="fs">Current Filesystem</option>
        {runs.map((run) => {
          return (
            <option key={run.run_id} value={run.run_id}>
              Run {run.run_id}
            </option>
          );
        })}
      </select>
      {isError && (
        <span className="text-red-600 text-sm px-4 py-2">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>Error while
          fetching configuration: {config?.error_message || "Unknown error"}
        </span>
      )}
    </>
  );
};

const ExperimentConfigurationControl = ({ expid, runs }) => {
  const [selectedRunLeft, setSelectedRunLeft] = useState("fs");
  // use State last value of runs list or empty
  const [selectedRunRight, setSelectedRunRight] = useState(
    runs.length > 0 ? runs[0].run_id : ""
  );

  const {
    data: configLeft,
    isFetching: isFetchingLeft,
    isError: isErrorLeft,
  } = autosubmitApiV4.endpoints.getExperimentConfigurationMixed.useQuery(
    {
      expid: expid,
      run_id: selectedRunLeft,
    },
    {
      skip: !selectedRunLeft,
    }
  );

  const {
    data: configRight,
    isFetching: isFetchingRight,
    isError: isErrorRight,
  } = autosubmitApiV4.endpoints.getExperimentConfigurationMixed.useQuery(
    {
      expid: expid,
      run_id: selectedRunRight,
    },
    {
      skip: !selectedRunRight,
    }
  );

  return (
    <>
      <div className="flex my-4 sticky top-4">
        <div className="w-1/3"></div>
        <div className="w-1/3 pl-8 flex flex-col gap-2">
          <ExperimentConfigurationSelect
            selectedRun={selectedRunLeft}
            setSelectedRun={setSelectedRunLeft}
            config={configLeft}
            runs={runs}
            isError={isErrorLeft}
          />
        </div>
        <div className="w-1/3 pl-8 flex flex-col gap-2">
          <ExperimentConfigurationSelect
            selectedRun={selectedRunRight}
            setSelectedRun={setSelectedRunRight}
            config={configRight}
            runs={runs}
            isError={isErrorRight}
          />
        </div>
      </div>

      {isFetchingLeft || isFetchingRight ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : (
        <ExperimentConfigurationCompare
          configLeft={configLeft?.config || {}}
          configRight={configRight?.config || {}}
        />
      )}
    </>
  );
};

const ExperimentConfiguration = () => {
  const routeParams = useParams();
  useASTitle(`Experiment ${routeParams.expid} configuration`);
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`,
    },
    {
      name: `Configuration`,
      route: `/experiment/${routeParams.expid}/config`,
    },
  ]);
  const { data, isFetching, isError } =
    autosubmitApiV4.endpoints.getExperimentRuns.useQuery({
      expid: routeParams.expid,
    });

  return (
    <div className="w-full flex flex-col min-w-0">
      {isError && (
        <span className="alert alert-danger rounded-2xl">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>Error while
          fetching run data: {data?.error_message || "Unknown error"}
        </span>
      )}
      {isFetching && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      {!isFetching && (
        <ExperimentConfigurationControl
          expid={routeParams.expid}
          runs={
            data?.runs ? [...data.runs].sort((a, b) => b.run_id - a.run_id) : []
          }
        />
      )}
    </div>
  );
};

export default ExperimentConfiguration;
