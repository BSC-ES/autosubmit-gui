import React, {  useContext } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';
import {generateConfigFileHtml} from '../context/utils';

const CurrentConfiguration = () => {
  const experimentContext = useContext(ExperimentContext);
  const {     
    experiment,
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
      console.log(currentConfiguration);
      const currentValidConfiguration = currentConfiguration.areEqual === true ?
        currentConfiguration.configurationCurrentRun.contains_nones === false ?
          currentConfiguration.configurationCurrentRun : 
          currentConfiguration.configurationFileSystem 
          :
        currentConfiguration.configurationFileSystem.contains_nones === false ?
          currentConfiguration.configurationFileSystem :
          currentConfiguration.configurationCurrentRun;
      
      const sourceName = currentConfiguration.areEqual === true ?
        currentConfiguration.configurationCurrentRun.contains_nones === false ?
          "Historical Database" : 
          "File System"
          :
        currentConfiguration.configurationFileSystem.contains_nones === false ?
          "File System" :
          "Historical Database";
      // console.log(currentValidConfiguration);
      // console.log(sourceName);
      return (
        <div className="row mx-2">
          <div className="col">
            <p><small className="muted">Source : {sourceName}</small></p>
            {currentValidConfiguration.conf && (
              <div className="row mx-2">
                <div className="col">
                  <p className="lead"><strong>autosubmit_{experiment.expid}.conf</strong></p>
                  {generateConfigFileHtml(currentValidConfiguration.conf)}
                </div>                
              </div>            
            )}
            {currentValidConfiguration.exp && (
              <div className="row mx-2">
                <div className="col">
                  <p className="lead"><strong>expdef_{experiment.expid}.conf</strong></p>
                  {generateConfigFileHtml(currentValidConfiguration.exp)}
                </div>                
              </div>            
            )}
            {currentValidConfiguration.jobs && (
              <div className="row mx-2">
                <div className="col">
                  <p className="lead"><strong>jobs_{experiment.expid}.conf</strong></p>
                  {generateConfigFileHtml(currentValidConfiguration.jobs)}
                </div>                
              </div>            
            )}
            {currentValidConfiguration.platforms && (
              <div className="row mx-2">
                <div className="col">
                  <p className="lead"><strong>platforms_{experiment.expid}.conf</strong></p>
                  {generateConfigFileHtml(currentValidConfiguration.platforms)}
                </div>                
              </div>            
            )}
            {currentValidConfiguration.proj && (
              <div className="row mx-2">
                <div className="col">
                  <p className="lead"><strong>proj_{experiment.expid}.conf</strong></p>
                  {generateConfigFileHtml(currentValidConfiguration.proj)}
                </div>                
              </div>            
            )}
            {currentConfiguration.warning === true && <p>{currentConfiguration.warningMessage}</p>}
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
