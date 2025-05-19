import { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { autosubmitApiV3 } from "../services/autosubmitApiV3";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";

const LogDisplay = ({ filename, timestamp, lastModified, content }) => {
  const logRef = useRef();

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop =
        logRef.current.scrollHeight - logRef.current.clientHeight;
    }
  }, [content]);

  return (
    <>
      <div className="w-full px-1 file-info flex justify-between flex-wrap">
        <div>
          <span>LOG FILE: {filename}</span>{" "}
          {timestamp && (
            <span className="text-dark dark:text-neutral-300">
              ({timestamp})
            </span>
          )}
        </div>
        <div className="text-dark">LAST MODIFIED: {lastModified}</div>
      </div>

      <pre
        ref={logRef}
        className="bash m-0 overflow-x-scroll overflow-y-auto max-h-[75vh]"
      >
        <ul>
          {content?.map((item) => {
            return (
              <li key={item.index} className="text-sm">
                {item.content}
              </li>
            );
          })}
        </ul>
      </pre>

      <div className="text-dark dark:text-neutral-300 text-center file-info mt-4">
        Showing last 150 lines
      </div>
    </>
  );
};

const ExperimentRunLogTab = ({ expid, autoRefresh }) => {
  const {
    data: logData,
    isLoading,
    isError,
  } = autosubmitApiV3.endpoints.getExperimentRunLog.useQuery(expid, {
    pollingInterval: autoRefresh,
  });

  return (
    <div className="w-full flex flex-col border rounded-2xl p-4 min-w-0 dark:bg-neutral-700">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : (
        <>
          {(isError || logData?.error) && (
            <span className="alert alert-danger rounded-4 px-4">
              <i className="fa-solid fa-triangle-exclamation me-2"></i>{" "}
              {logData?.error_message || "Unknown error"}
            </span>
          )}
          <LogDisplay
            filename={logData.logfile}
            timestamp={logData.timeStamp}
            lastModified={logData.lastModified}
            content={logData.logcontent}
          />
        </>
      )}
    </div>
  );
};

const ExperimentRecoveryLogsTab = ({ expid, autoRefresh }) => {
  const {
    data: logData,
    isLoading,
    isError,
  } = autosubmitApiV3.endpoints.getExperimentRecoveryLog.useQuery(expid, {
    pollingInterval: autoRefresh,
  });

  const [selectedPlatform, setSelectedPlatform] = useState();

  const platforms = useMemo(() => {
    if (!logData?.platform_recovery_logs) return [];
    return logData.platform_recovery_logs.map((log) => log.platform);
  }, [logData]);

  useEffect(() => {
    if (platforms.length > 0) {
      setSelectedPlatform(platforms[0]);
    }
  }, [platforms]);

  const selectedLog = useMemo(() => {
    if (!logData?.platform_recovery_logs) return {};
    return logData.platform_recovery_logs.find(
      (log) => log.platform === selectedPlatform
    );
  }, [logData, selectedPlatform]);

  return (
    <div className="w-full flex flex-col border rounded-2xl p-4 min-w-0 dark:bg-neutral-700">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : (
        <>
          {(isError || logData?.error) && (
            <span className="alert alert-danger rounded-4 px-4">
              <i className="fa-solid fa-triangle-exclamation me-2"></i>{" "}
              {logData?.error_message || "Unknown error"}
            </span>
          )}

          {platforms.length > 0 ? (
            <>
              {/* Dropdown for selecting the platform */}
              <div className="w-full px-4 flex items-center gap-4 mt-2 mb-4">
                <span className="font-semibold text-lg">PLATFORM:</span>
                <select
                  className="form-select border grow bg-white text-black"
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLog && (
                <LogDisplay
                  filename={selectedLog.filename}
                  lastModified={selectedLog.modified_date}
                  content={selectedLog.content}
                />
              )}
            </>
          ) : (
            <div className="text-dark dark:text-neutral-300 text-center file-info my-4">
              No recovery logs available
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ExperimentRunLog = () => {
  const routeParams = useParams();
  useASTitle(`Experiment ${routeParams.expid} run log`);
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`,
    },
    {
      name: `Run Log`,
      route: `/experiment/${routeParams.expid}/runlog`,
    },
  ]);

  const { data: expData } =
    autosubmitApiV3.endpoints.getExperimentInfo.useQuery(routeParams.expid);

  const [tab, setTab] = useState("runlog");

  const TAB_LIST = [
    {
      name: "Run Log",
      value: "runlog",
    },
    {
      name: "Log Recoveries",
      value: "recovery",
    },
  ];

  return (
    <div className="w-full flex flex-col min-w-0">
      {/* Tabs */}
      <div className="w-full flex items-center mb-4 mt-2 text-lg">
        {TAB_LIST.map((tabItem) => (
          <div
            key={tabItem.value}
            id={"tab_" + tabItem.value}
            className={`grow text-center cursor-pointer py-2 border-b hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
              tab === tabItem.value
                ? "text-primary border-b-2 border-primary dark:border-primary-400 dark:text-primary-400"
                : ""
            }`}
            onClick={() => setTab(tabItem.value)}
          >
            {tabItem.name}
          </div>
        ))}
      </div>

      {tab === "runlog" && (
        <ExperimentRunLogTab
          expid={routeParams.expid}
          autoRefresh={expData && expData.running ? 10 * 1000 : false}
        />
      )}

      {tab === "recovery" && (
        <ExperimentRecoveryLogsTab
          expid={routeParams.expid}
          autoRefresh={expData && expData.running ? 10 * 1000 : false}
        />
      )}
    </div>
  );
};

export default ExperimentRunLog;
