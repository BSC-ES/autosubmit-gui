import React, { useState, useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import AlertContext from "../context/alert/alertContext";

const Search = ({ setAlert }) => {
  const experimentContext = useContext(ExperimentContext);
  const alertContext = useContext(AlertContext);

  const [text, setText] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (text === "") {
      alertContext.setAlert("Please enter something", "light");
    } else {
      experimentContext.searchExperiments(text);
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

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-11'>
          <form onSubmit={onSubmit} className='form'>
            <div className='input-group mb-3'>
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
        <div className='col-1'>
          <form onSubmit={onSubmitRunning} className='form'>
            <div className='input-group mb-3'>
              <input
                type='submit'
                value='Active Exps'
                className='btn btn-success'
              ></input>
            </div>
          </form>
        </div>
      </div>

      {experimentContext.experiments.length > 0 && (
        <div className='row pb-3'>
          <div className='col-md-3'>
            <button
              className='btn btn-info btn-block'
              onClick={experimentContext.getSummaries}
            >
              Show Detailed Data
            </button>
          </div>
          <div className='col-md-9'>
            <button
              className='btn btn-light btn-block'
              onClick={experimentContext.clearExperiments}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
