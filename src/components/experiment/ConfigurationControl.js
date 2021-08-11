import React, { useContext } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';

const ConfigurationControl = () => {
  const experimentContext = useContext(ExperimentContext);
  const { 
    experiment, 
    requestCurrentConfiguration, 
    currentConfiguration,
    clearCurrentConfigurationData } = experimentContext;

  const onRequestCurrent = (expid) => (e) => {
    e.preventDefault();
    // TODO: Implement Request
    requestCurrentConfiguration(expid);
  };

  const onClearCurrent = (e) => {
    e.preventDefault();
    clearCurrentConfigurationData();
  }

  return (
    <div className="card-header p-1">
      <div className="d-flex flex-wrap row-hl">
        
          {experiment && (
            <div className="item-hl ml-auto">
              <form onSubmit={onRequestCurrent(experiment.expid)} className="form">
                <input 
                  type="submit" 
                  value={currentConfiguration ? "Refresh Data" : "Show Current Configuration" }
                  className={currentConfiguration ? "btn btn-success btn-sm btn-block" : "btn btn-primary btn-sm btn-block"}
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Show the current configuration of your experiment"
                />
              </form>
            </div> 
          )}
               
          {experiment && currentConfiguration && (
            <div className="item-hl ml-2">
              <form action="" className="form" onSubmit={onClearCurrent}>
                <input 
                type="submit" 
                value="Clear Data"
                className="btn btn-dark btn-sm btn-block"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Clears the current configuration information"
                />
              </form>
            </div>
          )}
        
      </div>
    </div>
  )
}

export default ConfigurationControl
