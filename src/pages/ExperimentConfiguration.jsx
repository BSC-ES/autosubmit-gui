import { useParams } from "react-router-dom";
import { useGetExperimentConfigurationQuery } from "../services/autosubmitApiV3";
import useASTitle from "../hooks/useASTitle";
import { useEffect, useState } from "react";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table";

const alertDifferenceSpan = (
  <span className="text-amber-500 mx-1" title="Difference detected">
    <i class="fa-solid fa-circle-exclamation"></i>
  </span>
);

const ConfigTableGen = ({ config, prefix, differences }) => {
  const [configValues, setConfigValues] = useState({});
  const [configChilds, setConfigChilds] = useState({});

  useEffect(() => {
    let _newValues = {};
    let _newChilds = {};
    if (config) {
      Object.keys(config).forEach((key) => {
        if (typeof config[key] === "object") {
          _newChilds[key] = config[key];
        } else {
          _newValues[key] = config[key];
        }
      });
      setConfigChilds(_newChilds);
      setConfigValues(_newValues);
    }
  }, [config]);

  return (
    <>
      {configValues && Object.keys(configValues).length > 0 && (
        <div className="configuration-section w-full max-w-full min-w-0 border-0">
          {prefix && (
            <div className="configuration-section-title break-words">
              [{prefix}]{differences.has(prefix) && <> {alertDifferenceSpan}</>}
            </div>
          )}
          <Table className="table break-words table-fixed">
            <TableHead className="bg-dark text-white font-bold">
              <TableRow>
                <TableHeader className="py-1">Setting</TableHeader>
                <TableHeader className="py-1">Value</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(configValues).map((key) => {
                return (
                  <TableRow key={key}>
                    <TableCell className="py-1">{key}</TableCell>
                    <TableCell className="py-1">
                      {["string", "number"].includes(typeof config[key])
                        ? config[key]
                        : JSON.stringify(config[key])}
                      {differences.has((prefix ? prefix + "." : "") + key) && (
                        <> {alertDifferenceSpan}</>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      {config &&
        Object.keys(configChilds).map((key) => {
          let title = (prefix ? prefix + "." : "") + key;
          return (
            <ConfigTableGen
              key={title}
              config={config[key]}
              prefix={title}
              differences={differences}
            />
          );
        })}
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
  const { data, isFetching, isError } = useGetExperimentConfigurationQuery(
    routeParams.expid
  );

  // const flatData = (configData, title) => {
  //   const tables = [];

  //   Object.keys(configData).map({

  //   })
  // }

  // const flatRunConfig = useMemo(()=>{
  //   data.configuration_current_run
  // }, [data])

  // const flatFilesConfig = useMemo(()=>{
  //   const configData = data.configuration_filesystem;
    



    
  // }, [data])

  return (
    <div className="w-full flex flex-col min-w-0">
      {/* <div className="d-flex flex-row-reverse mb-3 gap-3 align-items-center">
        <button className="btn btn-success fw-bold text-white px-5" onClick={() => { refetch() }}>REFRESH</button>
      </div> */}
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
          {data?.differences && data?.differences?.length > 0 && (
            <div className="alert alert-warning">
              <i className="fa-solid fa-triangle-exclamation me-2"></i> The
              current run configuration in the historical database is different
              than the current configuration in the file system
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <div className="text-center header-information-space-sm configuration-source-info">
                <span>Current Run Configuration (Historical Database)</span>
              </div>
              <ConfigTableGen
                config={data.configuration_current_run}
                differences={new Set(data.differences)}
              />
            </div>
            <div>
              <div className="text-center header-information-space-sm configuration-source-info">
                <span>Current FileSystem Configuration</span>
              </div>
              <ConfigTableGen
                config={data.configuration_filesystem}
                differences={new Set(data.differences)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExperimentConfiguration;
