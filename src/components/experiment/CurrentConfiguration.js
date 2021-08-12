import React, {  useContext } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';
import {generateConfigFileHtml} from '../context/utils';

const CurrentConfiguration = () => {
  const experimentContext = useContext(ExperimentContext);
  const {         
    currentConfiguration } = experimentContext;
  if (currentConfiguration) {
    if (currentConfiguration.error === true) {
      return (
        <div className="row">
          <div className="col">            
            <strong>{currentConfiguration.errorMessage}</strong>            
          </div>
        </div>
      )
    } else {
      /*  No errors detected. Proceed to validate data 
          and identify current configuration. 
      */
      // console.log(currentConfiguration);
      const messageAreEqual = currentConfiguration.areEqual === false ? "The current run configuration in the historical database is different than the current configuration in the file system." : null;
      const currentRunConfiguration = currentConfiguration.configurationCurrentRun;
      const currentFileSystemConfiguration = currentConfiguration.configurationFileSystem;
      const messageNoInformation = <div className="row mx-2"><div className="col">Not Available or Autosubmit API couldn't access the necessary files.</div></div>
      // const currentValidConfiguration = currentConfiguration.areEqual === true ?
      //   currentConfiguration.configurationCurrentRun.contains_nones === false ?
      //     currentConfiguration.configurationCurrentRun : 
      //     currentConfiguration.configurationFileSystem 
      //     :
      //   currentConfiguration.configurationFileSystem.contains_nones === false ?
      //     currentConfiguration.configurationFileSystem :
      //     currentConfiguration.configurationCurrentRun;
      
      // const sourceName = currentConfiguration.areEqual === true ?
      //   currentConfiguration.configurationCurrentRun.contains_nones === false ?
      //     "Historical Database" : 
      //     "File System"
      //     :
      //   currentConfiguration.configurationFileSystem.contains_nones === false ?
      //     "File System" :
      //     "Historical Database";
      // console.log(currentValidConfiguration);
      // console.log(sourceName);
      return (
        <div className="row">
        <div className="col">
          <div className="row">
            <div className="col-md-12">
              {currentConfiguration.warning === true && <p>{currentConfiguration.warningMessage}</p>}          
              {messageAreEqual && (<p className="text-center"><span className="text-muted">{messageAreEqual}</span></p>)}
            </div>            
          </div>
          <div className="row">          
            <div className="col-md-6 pr-0">
              <p className="text-center lead"><span>Current Run Configuration (Historical Database)</span></p>
              
              <ul className="nav nav-pills ml-4 mb-2" id="hconf-pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <a 
                    href="#hconf-pills-autosubmit" 
                    className="nav-link active"
                    data-toggle="pill"
                    role="tab"
                    id="hconf-pills-autosubmit-tab"
                    aria-controls="hconf-pills-autosubmit"
                    aria-selected="true"
                    >
                      <strong>autosubmit_.conf</strong>
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    href="#hconf-pills-expdef"
                    className="nav-link"
                    data-toggle="pill"
                    role="tab"
                    id="hconf-pills-expdef-tab"
                    aria-controls="hconf-pills-expdef"
                    aria-selected="false"
                  >
                    <strong>expdef_.conf</strong>
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    href="#hconf-pills-jobs"
                    className="nav-link"
                    data-toggle="pill"
                    role="tab"
                    id="hconf-pills-jobs-tab"
                    aria-controls="hconf-pills-jobs"
                    aria-selected="false"
                  >
                    <strong>jobs_.conf</strong>
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    href="#hconf-pills-platforms"
                    className="nav-link"
                    data-toggle="pill"
                    role="tab"
                    id="hconf-pills-platforms-tab"
                    aria-controls="hconf-pills-platforms"
                    aria-selected="false"
                  >
                    <strong>platforms_.conf</strong>
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    href="#hconf-pills-proj"
                    className="nav-link"
                    data-toggle="pill"
                    role="tab"
                    id="hconf-pills-proj-tab"
                    aria-controls="hconf-pills-proj"
                    aria-selected="false"
                  >
                    <strong>proj_.conf</strong>
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="hconf-pills-tabContent">
                <div 
                  className="tab-pane fade show active"
                  id="hconf-pills-autosubmit"
                  role="tabpanel"
                  aria-labelledby="hconf-pills-autosubmit-tab"
                >
                  {currentRunConfiguration.conf ? generateConfigFileHtml(currentRunConfiguration.conf) : messageNoInformation}
                </div>
                <div 
                  className="tab-pane fade"
                  id="hconf-pills-expdef"
                  role="tabpanel"
                  aria-labelledby="hconf-pills-expdef-tab"
                >
                  {currentRunConfiguration.exp ? generateConfigFileHtml(currentRunConfiguration.exp) : messageNoInformation}
                </div>
                <div 
                  className="tab-pane fade"
                  id="hconf-pills-jobs"
                  role="tabpanel"
                  aria-labelledby="hconf-pills-jobs-tab"
                >
                  {currentRunConfiguration.jobs ? generateConfigFileHtml(currentRunConfiguration.jobs) : <p>{messageNoInformation}</p>}
                </div>
                <div 
                  className="tab-pane fade"
                  id="hconf-pills-platforms"
                  role="tabpanel"
                  aria-labelledby="hconf-pills-platforms-tab"
                >
                  {currentRunConfiguration.platforms ? generateConfigFileHtml(currentRunConfiguration.platforms) : messageNoInformation}
                </div>
                <div 
                  className="tab-pane fade"
                  id="hconf-pills-proj"
                  role="tabpanel"
                  aria-labelledby="hconf-pills-proj-tab"
                >
                  {currentRunConfiguration.proj ? generateConfigFileHtml(currentRunConfiguration.proj) : messageNoInformation}
                </div>              
              </div>
            </div>
            <div className="col-md-6 pl-0">
              <p className="text-center lead"><span>Current FileSystem Configuration</span></p>
                
                <ul className="nav nav-pills ml-4 mb-2" id="fconf-pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a 
                      href="#fconf-pills-autosubmit" 
                      className="nav-link active"
                      data-toggle="pill"
                      role="tab"
                      id="fconf-pills-autosubmit-tab"
                      aria-controls="fconf-pills-autosubmit"
                      aria-selected="true"
                      >
                        <strong>autosubmit_.conf</strong>
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      href="#fconf-pills-expdef"
                      className="nav-link"
                      data-toggle="pill"
                      role="tab"
                      id="fconf-pills-expdef-tab"
                      aria-controls="fconf-pills-expdef"
                      aria-selected="false"
                    >
                      <strong>expdef_.conf</strong>
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      href="#fconf-pills-jobs"
                      className="nav-link"
                      data-toggle="pill"
                      role="tab"
                      id="fconf-pills-jobs-tab"
                      aria-controls="fconf-pills-jobs"
                      aria-selected="false"
                    >
                      <strong>jobs_.conf</strong>
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      href="#fconf-pills-platforms"
                      className="nav-link"
                      data-toggle="pill"
                      role="tab"
                      id="fconf-pills-platforms-tab"
                      aria-controls="fconf-pills-platforms"
                      aria-selected="false"
                    >
                      <strong>platforms_.conf</strong>
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      href="#fconf-pills-proj"
                      className="nav-link"
                      data-toggle="pill"
                      role="tab"
                      id="fconf-pills-proj-tab"
                      aria-controls="fconf-pills-proj"
                      aria-selected="false"
                    >
                      <strong>proj_.conf</strong>
                    </a>
                  </li>
                </ul>
                <div className="tab-content" id="fconf-pills-tabContent">
                  <div 
                    className="tab-pane fade show active"
                    id="fconf-pills-autosubmit"
                    role="tabpanel"
                    aria-labelledby="fconf-pills-autosubmit-tab"
                  >
                    {currentFileSystemConfiguration.conf ? generateConfigFileHtml(currentFileSystemConfiguration.conf) : messageNoInformation}
                  </div>
                  <div 
                    className="tab-pane fade"
                    id="fconf-pills-expdef"
                    role="tabpanel"
                    aria-labelledby="fconf-pills-expdef-tab"
                  >
                    {currentFileSystemConfiguration.exp ? generateConfigFileHtml(currentFileSystemConfiguration.exp) : messageNoInformation}
                  </div>
                  <div 
                    className="tab-pane fade"
                    id="fconf-pills-jobs"
                    role="tabpanel"
                    aria-labelledby="fconf-pills-jobs-tab"
                  >
                    {currentFileSystemConfiguration.jobs ? generateConfigFileHtml(currentFileSystemConfiguration.jobs) : messageNoInformation}
                  </div>
                  <div 
                    className="tab-pane fade"
                    id="fconf-pills-platforms"
                    role="tabpanel"
                    aria-labelledby="fconf-pills-platforms-tab"
                  >
                    {currentFileSystemConfiguration.platforms ? generateConfigFileHtml(currentFileSystemConfiguration.platforms) : messageNoInformation}
                  </div>
                  <div 
                    className="tab-pane fade"
                    id="fconf-pills-proj"
                    role="tabpanel"
                    aria-labelledby="fconf-pills-proj-tab"
                  >
                    {currentFileSystemConfiguration.proj ? generateConfigFileHtml(currentFileSystemConfiguration.proj) : messageNoInformation}
                  </div>              
                </div>
            </div>               
          </div>             
        </div>
        </div>
      )
    }    
  } else {
    return (
      <div className="row">
        <div className="col">
          <p>
          Press <span className="badge badge-primary">SHOW CURRENT INFORMATION</span> to visualize the current configuration of your experiment. The information will be retrieved from the historical database; if that source is not available, the filesystem will be used.
          </p>
        </div>
      </div>
    );
  }
    
}

export default CurrentConfiguration
