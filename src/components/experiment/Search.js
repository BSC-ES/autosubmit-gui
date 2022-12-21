import React, { useState, useContext, useEffect, useRef } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import AlertContext from "../context/alert/alertContext";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  localStorageExperimentTypeSearch,
  localStorageExperimentActiveCheck,
  orderByType,
  simpleActiveStatusToComplex,
  NOAPI,
} from "../context/vars";

let controller = new AbortController();

const Search = ({ specificSearch }) => {
  const alertContext = useContext(AlertContext);
  const experimentContext = useContext(ExperimentContext);
  const { searchExperimentsByOwner, experiments, loggedUser } =
    experimentContext;
  const currentExpTypeChoice = localStorage.getItem(
    localStorageExperimentTypeSearch
  );
  const currentActiveCheck = localStorage.getItem(
    localStorageExperimentActiveCheck
  );
  const [onlyActive, setOnlyActive] = useLocalStorage("onlyact", true)

  const btnRef = useRef()

  useEffect( () => {
    if(btnRef.current) {
      btnRef.current.disabled = false
      controller.abort()
      experimentContext.shutdown("summary", loggedUser, experimentContext.expid)
      controller = new AbortController();
    }
  // eslint-disable-next-line
  }, [experimentContext.experimentsInPage])

  // Window close
  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault()
      controller.abort()
      experimentContext.shutdown("summary", loggedUser, experimentContext.expid);
      controller = new AbortController();
      return;
    };

    window.addEventListener("beforeunload", unloadCallback);
      return () => window.removeEventListener("beforeunload", unloadCallback);
  });

  // componentWillUnmount: cleanup
  useEffect( () => {
    // initial load of running exp
    if (experimentContext.experimentsInPage.length === 0) {
      experimentContext.getCurrentRunning();
    }

    return (() => {
      controller.abort()
      experimentContext.shutdown("summary", loggedUser, experimentContext.expid)
      controller = new AbortController();
    })
  // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (currentExpTypeChoice) {
      setTypeExperiment(currentExpTypeChoice);
    } else {
      setTypeExperiment(orderByType.radioAll);
    }

    if (currentActiveCheck) {
      setActiveChoice(currentActiveCheck);
    } else {
      setActiveChoice(orderByType.showAllActiveInactive);
    }

    if (specificSearch && !experiments) {
      searchExperimentsByOwner(
        specificSearch,
        currentExpTypeChoice,
        currentActiveCheck
      );
    }

    if (NOAPI && (!experiments || experiments.length === 0)) {
      experimentContext.getCurrentRunning();
    }
    // eslint-disable-next-line
  }, [
    specificSearch,
    searchExperimentsByOwner,
    currentExpTypeChoice,
    // currentActiveCheck,
    experiments,
  ]);


  const [text, setText] = useState("");
  const [typeExperiment, setTypeExperiment] = useState("");
  const [activeChoice, setActiveChoice] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (text === "") {
      alertContext.setAlert("Please enter something", "light");
    } else {
      let actChoice = onlyActive === true ? 'Only Active' : 'Active & Inactive'
      experimentContext.searchExperiments(text, typeExperiment, actChoice);
    }
  };

  const onSubmitRunning = (e) => {
    e.preventDefault();
    experimentContext.getCurrentRunning();
  };

  const onChange = (e) => setText(e.target.value);

  const onChangeType = (e) => {
    let inputType = null;
    switch (e.target.value) {
      case "experiment":
        inputType = orderByType.radioExperiments;
        break;
      case "test":
        inputType = orderByType.radioTests;
        break;
      case "all":
      default:
        inputType = orderByType.radioAll;
    }
    experimentContext.orderExperimentsInResult(inputType);
    setTypeExperiment(inputType);
    localStorage.setItem(localStorageExperimentTypeSearch, inputType);
  };

  const onChangeActiveCheck = (e) => {
    const nextValue = onlyActive === true ? "active" : "all";
    setOnlyActive(!onlyActive)
    const complexInput = simpleActiveStatusToComplex(nextValue);
    experimentContext.orderExperimentsInResult(complexInput);
    setActiveChoice(complexInput);
    localStorage.setItem(localStorageExperimentActiveCheck, complexInput);
  };

  return (
    <div className='container'>
      <div className='row-hl d-flex flex-wrap mb-2'>
        <div className='item-hl mr-1 px-2 pt-1 border rounded'>
          <div className='form-check form-check-inline'>
            <input
              type='radio'
              name='experimentType'
              id='experimentTypeTest'
              className='form-check-input'
              value='test'
              checked={typeExperiment === orderByType.radioTests}
              onChange={onChangeType}
            />
            <label htmlFor='experimentTypeTest' className='form-check-label'>
              Test
            </label>
          </div>
          <div className='form-check form-check-inline'>
            <input
              type='radio'
              name='experimentType'
              id='experimentTypeExperiment'
              className='form-check-input'
              value='experiment'
              checked={typeExperiment === orderByType.radioExperiments}
              onChange={onChangeType}
            />
            <label
              htmlFor='experimentTypeExperiment'
              className='form-check-label'
            >
              Experiment
            </label>
          </div>
          <div className='form-check form-check-inline'>
            <input
              type='radio'
              name='experimentType'
              id='experimentTypeAll'
              className='form-check-input'
              value='all'
              checked={typeExperiment === orderByType.radioAll}
              onChange={onChangeType}
            />
            <label htmlFor='experimentTypeAll' className='form-check-label'>
              All
            </label>
          </div>
        </div>
        <div className='item-hl mr-1 pt-1 px-2 border rounded'>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              id='switchActive'
              value={
                activeChoice === orderByType.showAllActiveInactive
                  ? "all"
                  : "active"
              }
              onChange={onChangeActiveCheck}
              checked = {
                  onlyActive
              }
            />
            <label className='form-check-label' htmlFor='switchActive'>
              Only Active
            </label>
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
                title='Shows all the experiments that are currently running under Autosubmit.'
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
              onClick={ async(event) => {
                  const btn_instance = event.currentTarget;
                  btn_instance.disabled = true;

                  await experimentContext.getSummariesInPage(controller, loggedUser)

                  btn_instance.disabled = false;
                }
              }u
              data-toggle='tooltip'
              data-placement='bottom'
              title='Shows a summary of the current progress of each experiment in the result.'
              // disabled={loggedUser ? false : true}
              ref = {btnRef}
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
