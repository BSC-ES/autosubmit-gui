import React, { useContext, useEffect, useState } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import { generateConfigFileHtml, getExperimentAutosubmitVersion } from "../context/utils";

const alertDifferenceSpan = (
  <span
    className='badge badge-warning'
    data-toggle='tooltip'
    data-placement='bottom'
    title='Difference detected.'
  >
    !
  </span>
);


const ConfigTableGen = ({ config, prefix, differences }) => {
  const [configValues, setConfigValues] = useState({})
  const [configChilds, setConfigChilds] = useState({})

  useEffect(() => {
    let _newValues = {}
    let _newChilds = {}
    if (config) {
      Object.keys(config).forEach(key => {
        if (typeof (config[key]) === 'object') {
          _newChilds[key] = config[key]
        } else {
          _newValues[key] = config[key]
        }
      })
      setConfigChilds(_newChilds)
      setConfigValues(_newValues)
    }
  }, [config])

  return (
    <>
      {
        configValues && Object.keys(configValues).length > 0 &&
        <div className="configuration-section">
          {
            prefix && <div className="configuration-section-title">
              [{prefix}]
              {
                differences.has(prefix) &&
                <>
                  {" "}
                  {alertDifferenceSpan}
                </>
              }
            </div>
          }
          <table className='table table-sm table-fixed list-table'>
            <thead className='thead-dark'>
              <tr>
                <th scope='col'>Setting</th>
                <th scope='col'>Value</th>
              </tr>
            </thead>
            <tbody>
              {
                Object.keys(configValues).map(key => {
                  return (
                    <tr key={key}>
                      <td>
                        {key}
                      </td>
                      <td>
                        {['string', 'number'].includes(typeof (config[key])) ? config[key] : JSON.stringify(config[key])}
                        {
                          differences.has((prefix ? prefix + "." : "") + key) &&
                          <>
                            {" "}
                            {alertDifferenceSpan}
                          </>
                        }
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      }
      {
        config && Object.keys(configChilds).map(key => {
          let title = (prefix ? prefix + "." : "") + key
          return (
            <>
              <ConfigTableGen key={title} config={config[key]} prefix={title} differences={differences} />
            </>
          )
        })
      }
    </>
  )
}

const CurrentConfiguration = () => {
  const experimentContext = useContext(ExperimentContext);
  const { currentConfiguration, configDifferences, experiment } =
    experimentContext;
  const { expid } = experiment ? experiment : { expid: null };
  if (currentConfiguration) {
    if (currentConfiguration.error === true) {
      return (
        <div className='row header-information-space'>
          <div className='m-auto'>
            <span className='error-message'>
              {currentConfiguration.errorMessage}
            </span>
          </div>
        </div>
      );
    } else {
      /*  No errors detected. Proceed to validate data 
          and identify current configuration. 
      */
      // console.log(currentConfiguration);
      const messageAreEqual =
        currentConfiguration.areEqual === false
          ? "The current run configuration in the historical database is different than the current configuration in the file system."
          : null;
      const currentRunConfiguration =
        currentConfiguration.configurationCurrentRun;
      const currentFileSystemConfiguration =
        currentConfiguration.configurationFileSystem;
      const messageNoInformation = (
        <div className='row header-information-space'>
          <div className='m-auto'>
            <span className='error-message'>
              Not Available or Autosubmit API couldn't access the necessary
              files.
            </span>
          </div>
        </div>
      );

      const historicalDatabaseColumnTitle = (
        <div className='text-center header-information-space-sm configuration-source-info'>
          <span>Current Run Configuration (Historical Database)</span>
        </div>
      );

      const fileSystemColumnTitle = (
        <div className='text-center header-information-space-sm configuration-source-info'>
          <span>Current FileSystem Configuration</span>
        </div>
      );

      return (
        <div className='container'>
          {(currentConfiguration && currentConfiguration.warning === true) ||
            (messageAreEqual && (
              <div className='row header-information-space'>
                <div className='m-auto'>
                  {currentConfiguration.warning === true && (
                    <span className='error-message'>
                      {currentConfiguration.warningMessage}
                    </span>
                  )}
                  {messageAreEqual && (
                    <span className='error-message'>{messageAreEqual}</span>
                  )}
                </div>
              </div>
            ))}

          {
            getExperimentAutosubmitVersion(experiment.version)["major"] < 4 ?
              <div className='row'>
                <div className='col'>
                  <div className='header-information-space'>
                    <ul
                      className='nav nav-pills nav-fill'
                      id='hconf-pills-tab'
                      role='tablist'
                    >
                      <li className='nav-item' role='presentation'>
                        <a
                          href='#hconf-pills-autosubmit'
                          className='nav-link active configuration-nav-pill'
                          data-toggle='pill'
                          role='tab'
                          id='hconf-pills-autosubmit-tab'
                          aria-controls='hconf-pills-autosubmit'
                          aria-selected='true'
                        >
                          {`autosubmit_${expid}.conf`}{" "}
                          {configDifferences.has("conf") && alertDifferenceSpan}
                        </a>
                      </li>
                      <li className='nav-item' role='presentation'>
                        <a
                          href='#hconf-pills-expdef'
                          className='nav-link configuration-nav-pill'
                          data-toggle='pill'
                          role='tab'
                          id='hconf-pills-expdef-tab'
                          aria-controls='hconf-pills-expdef'
                          aria-selected='false'
                        >
                          {`expdef_${expid}.conf`}{" "}
                          {configDifferences.has("exp") && alertDifferenceSpan}
                        </a>
                      </li>
                      <li className='nav-item' role='presentation'>
                        <a
                          href='#hconf-pills-jobs'
                          className='nav-link configuration-nav-pill'
                          data-toggle='pill'
                          role='tab'
                          id='hconf-pills-jobs-tab'
                          aria-controls='hconf-pills-jobs'
                          aria-selected='false'
                        >
                          {`jobs_${expid}.conf`}{" "}
                          {configDifferences.has("jobs") && alertDifferenceSpan}
                        </a>
                      </li>
                      <li className='nav-item' role='presentation'>
                        <a
                          href='#hconf-pills-platforms'
                          className='nav-link configuration-nav-pill'
                          data-toggle='pill'
                          role='tab'
                          id='hconf-pills-platforms-tab'
                          aria-controls='hconf-pills-platforms'
                          aria-selected='false'
                        >
                          {`platforms_${expid}.conf`}{" "}
                          {configDifferences.has("platforms") &&
                            alertDifferenceSpan}
                        </a>
                      </li>
                      <li className='nav-item' role='presentation'>
                        <a
                          href='#hconf-pills-proj'
                          className='nav-link configuration-nav-pill'
                          data-toggle='pill'
                          role='tab'
                          id='hconf-pills-proj-tab'
                          aria-controls='hconf-pills-proj'
                          aria-selected='false'
                        >
                          {`proj_${expid}.conf`}{" "}
                          {configDifferences.has("proj") && alertDifferenceSpan}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className='tab-content' id='hconf-pills-tabContent'>
                    <div
                      className='tab-pane fade show active'
                      id='hconf-pills-autosubmit'
                      role='tabpanel'
                      aria-labelledby='hconf-pills-autosubmit-tab'
                    >
                      <div className='row'>
                        <div className='col-md-6'>
                          {historicalDatabaseColumnTitle}
                          {currentRunConfiguration.conf
                            ? generateConfigFileHtml(
                              currentRunConfiguration.conf,
                              "conf",
                              configDifferences,
                              alertDifferenceSpan
                            )
                            : messageNoInformation}
                        </div>
                        <div className='col-md-6'>
                          {fileSystemColumnTitle}
                          {currentFileSystemConfiguration.conf
                            ? generateConfigFileHtml(
                              currentFileSystemConfiguration.conf,
                              "conf",
                              configDifferences,
                              alertDifferenceSpan
                            )
                            : messageNoInformation}
                        </div>
                      </div>
                    </div>
                    <div
                      className='tab-pane fade'
                      id='hconf-pills-expdef'
                      role='tabpanel'
                      aria-labelledby='hconf-pills-expdef-tab'
                    >
                      <div className='row'>
                        <div className='col-md-6'>
                          {historicalDatabaseColumnTitle}
                          {currentRunConfiguration.exp
                            ? generateConfigFileHtml(
                              currentRunConfiguration.exp,
                              "exp",
                              configDifferences,
                              alertDifferenceSpan
                            )
                            : messageNoInformation}
                        </div>
                        <div className='col-md-6'>
                          {fileSystemColumnTitle}
                          {currentFileSystemConfiguration.exp
                            ? generateConfigFileHtml(
                              currentFileSystemConfiguration.exp,
                              "exp",
                              configDifferences,
                              alertDifferenceSpan
                            )
                            : messageNoInformation}
                        </div>
                      </div>
                    </div>
                    <div
                      className='tab-pane fade'
                      id='hconf-pills-jobs'
                      role='tabpanel'
                      aria-labelledby='hconf-pills-jobs-tab'
                    >
                      <div className='row'>
                        <div className='col-md-6'>
                          {historicalDatabaseColumnTitle}
                          {currentRunConfiguration.jobs ? (
                            generateConfigFileHtml(
                              currentRunConfiguration.jobs,
                              "jobs",
                              configDifferences,
                              alertDifferenceSpan
                            )
                          ) : (
                            <p>{messageNoInformation}</p>
                          )}
                        </div>
                        <div className='col-md-6'>
                          {fileSystemColumnTitle}
                          {currentFileSystemConfiguration.jobs
                            ? generateConfigFileHtml(
                              currentFileSystemConfiguration.jobs,
                              "jobs",
                              configDifferences,
                              alertDifferenceSpan
                            )
                            : messageNoInformation}
                        </div>
                      </div>
                    </div>
                    <div
                      className='tab-pane fade'
                      id='hconf-pills-platforms'
                      role='tabpanel'
                      aria-labelledby='hconf-pills-platforms-tab'
                    >
                      <div className='row'>
                        <div className='col-md-6'>
                          {historicalDatabaseColumnTitle}
                          {currentRunConfiguration.platforms
                            ? generateConfigFileHtml(
                              currentRunConfiguration.platforms,
                              "platforms",
                              configDifferences,
                              alertDifferenceSpan
                            )
                            : messageNoInformation}
                        </div>
                        <div className='col-md-6'>
                          {fileSystemColumnTitle}
                          {currentFileSystemConfiguration.platforms
                            ? generateConfigFileHtml(
                              currentFileSystemConfiguration.platforms,
                              "platforms",
                              configDifferences,
                              alertDifferenceSpan
                            )
                            : messageNoInformation}
                        </div>
                      </div>
                    </div>
                    <div
                      className='tab-pane fade'
                      id='hconf-pills-proj'
                      role='tabpanel'
                      aria-labelledby='hconf-pills-proj-tab'
                    >
                      <div className='row'>
                        <div className='col-md-6'>
                          {historicalDatabaseColumnTitle}
                          {currentRunConfiguration.proj
                            ? generateConfigFileHtml(
                              currentRunConfiguration.proj,
                              "proj",
                              configDifferences,
                              alertDifferenceSpan
                            )
                            : messageNoInformation}
                        </div>
                        <div className='col-md-6'>
                          {fileSystemColumnTitle}
                          {currentFileSystemConfiguration.proj
                            ? generateConfigFileHtml(
                              currentFileSystemConfiguration.proj,
                              "proj",
                              configDifferences,
                              alertDifferenceSpan
                            )
                            : messageNoInformation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              :
              <div className='row'>
                <div className='col-md-6'>
                  {historicalDatabaseColumnTitle}
                  <ConfigTableGen config={currentRunConfiguration} differences={configDifferences} />
                </div>
                <div className='col-md-6'>
                  {fileSystemColumnTitle}
                  <ConfigTableGen config={currentFileSystemConfiguration} differences={configDifferences} />
                </div>
              </div>
          }

        </div>


      );
    }
  } else {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <p>
              Press{" "}
              <span className='badge badge-primary'>
                SHOW CURRENT INFORMATION
              </span>{" "}
              to visualize the current configuration of your experiment. The
              information will be retrieved from the historical database and
              from the filesystem, each datasource is displayed in its own
              table.
            </p>
            <h4>
              What is the <strong>Current FileSystem Configuration</strong>?
            </h4>
            <p>
              It is the configuration of your experiment stored in the files
              inside the folder <strong>conf</strong>. Autosubmit GUI might have
              problems accessing this information if your conf files have{" "}
              <strong>restricted read permissions</strong>.
            </p>
            <h4>
              What is the{" "}
              <strong>Current Run Configuration (Historical Database)</strong>?
            </h4>
            <p>
              Whenever you start a new run of your experiment, the current
              configuration stored in the file system is stored in the
              historical database for reference.
            </p>
            <h4>
              What is a <strong>new run</strong> of the experiment?
            </h4>
            <p>A new run is created in any of these situations:</p>
            <ul>
              <li>
                <code>autosubmit create</code> is executed.
              </li>
              <li>
                <code>autosubmit run</code> is executed and the historical
                database is empty.
              </li>
              <li>
                <code>autosubmit run</code> is executed and it is detected that
                the number of jobs in the experiment has changed.
              </li>
              <li>
                <code>autosubmit setstatus</code> and/or a significant amount of
                jobs changes status.
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

export default CurrentConfiguration;
