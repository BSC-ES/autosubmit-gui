import React, { useState, useContext, useEffect } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import AlertContext from "../context/alert/alertContext";
import { localStorageExperimentTypeSearch, localStorageExperimentActiveCheck, orderByType, simpleActiveStatusToComplex } from "../context/vars";

const Search = ({ specificSearch }) => {
  const experimentContext = useContext(ExperimentContext);
  const alertContext = useContext(AlertContext);

  useEffect(() => {

    const currentExpTypeChoice = localStorage.getItem(localStorageExperimentTypeSearch);
    const currentActiveCheck = localStorage.getItem(localStorageExperimentActiveCheck);
    if (currentExpTypeChoice){      
      setTypeExperiment(currentExpTypeChoice);
    } else {
      setTypeExperiment("all");
    }

    if (currentActiveCheck) {      
      setActiveChoice(currentActiveCheck);
    } else {
      setActiveChoice("all");
    }

    if (specificSearch){
      // Search by user
      // experimentContext
      experimentContext.searchExperimentsByOwner(specificSearch, currentExpTypeChoice, currentActiveCheck);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [text, setText] = useState("");
  const [typeExperiment, setTypeExperiment] = useState("");
  const [activeChoice, setActiveChoice] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (text === "") {
      alertContext.setAlert("Please enter something", "light");
    } else {
      experimentContext.searchExperiments(text, typeExperiment, activeChoice);
      //setText('');
    }
  };

  const onSubmitRunning = (e) => {
    e.preventDefault();
    experimentContext.getCurrentRunning();
  };

  // const onRequestDetail = e => {
  //   e.preventDefault();
  //   experimentContext.getSummaries();
  // };

  const onChange = (e) => setText(e.target.value);

  const onChangeType = (e) => {
    let inputType = null;
    switch(e.target.value) {
      case "experiment":
        inputType = orderByType.radioExperiments;
        break;
      case "test":
        inputType = orderByType.radioTests;
        break;
      case "all":        
      default:
        inputType = orderByType.radioAll;
        break;
    }
    experimentContext.orderExperimentsInResult(inputType);
    setTypeExperiment(e.target.value);
  }

  const onChangeActiveCheck = (e) => {
    const inputStatus = e.target.value;
    // console.log(inputStatus);
    experimentContext.orderExperimentsInResult(simpleActiveStatusToComplex(inputStatus));
    setActiveChoice(e.target.value);
  };
  
  return (
    <div className='container'>
      <div className='row-hl d-flex flex-wrap mb-2'> 
        <div className="item-hl mr-1 px-2 pt-1 border rounded">
          <div className="form-check form-check-inline">
            <input type="radio" name="experimentType" id="experimentTypeTest" className="form-check-input" value="test" checked={typeExperiment === "test"} onChange={onChangeType} />
            <label htmlFor="experimentTypeTest" className="form-check-label">Test</label>
          </div>
          <div className="form-check form-check-inline">
            <input type="radio" name="experimentType" id="experimentTypeExperiment" className="form-check-input" value="experiment" checked={typeExperiment === "experiment"} onChange={onChangeType} />
            <label htmlFor="experimentTypeExperiment" className="form-check-label">Experiment</label>
          </div>
          <div className="form-check form-check-inline">
            <input type="radio" name="experimentType" id="experimentTypeAll" className="form-check-input" value="all" checked={typeExperiment === "all"} onChange={onChangeType} />
            <label htmlFor="experimentTypeAll" className="form-check-label">All</label>
          </div>
        </div>
        <div className="item-hl mr-1 pt-1 px-2 border rounded">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="switchActive" value={activeChoice === "active" ? "all" : "active"} onChange={onChangeActiveCheck} checked={activeChoice === "active"} />
            <label className="form-check-label" htmlFor="switchActive">Only Active</label>
          </div>
        </div>       
        <div className='item-hl flex-fill mr-1'>
          <form onSubmit={onSubmit} className='form'>              
            <div className='input-group'>
              <input
                className='form-control'
                type='text'
                name='text'
                placeholder='If it uses Autosubmit, you will find it. Search by expid, description, or owner.'
                value={text}
                onChange={onChange}
              />              
              <div className='input-group-append'>
                <input type='submit' value='Search' className='btn btn-dark' />
              </div>              
            </div>
          </form>
        </div>        
        <div className='item-hl'>
          <form onSubmit={onSubmitRunning} className='form'>
            <div className='input-group'>
              <input
                type='submit'
                value='Active Exps'
                className='btn btn-success'
                data-toggle='tooltip' 
                data-placement='bottom' 
                title="Shows all the experiments that are currently running under Autosubmit."
              ></input>
            </div>
          </form>
        </div>
      </div>

      {experimentContext.experiments.length > 0 && (
        <div className='row mb-2'>
          <div className='col-md-3'>
            <button
              className='btn btn-primary btn-block'
              onClick={experimentContext.getSummaries}
              data-toggle='tooltip' 
              data-placement='bottom' 
              title="Shows a summary of the current progress of each experiment in the result."
            >
              Show Detailed Data
            </button>
          </div>
          <div className='col-md-9'>
            <button
              className='btn btn-light btn-block'
              onClick={experimentContext.clearExperiments}
            >
              Clear {experimentContext.experiments.length}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
