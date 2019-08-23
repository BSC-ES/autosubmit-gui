import React, { useState, useContext, Fragment } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';
import AlertContext from '../context/alert/alertContext';

const Search = ({ setAlert }) => {
  const experimentContext = useContext(ExperimentContext);
  const alertContext = useContext(AlertContext);

  const [text, setText] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    if (text === '') {
      alertContext.setAlert('Please enter something', 'light');
    } else {
      experimentContext.searchExperiments(text);
      //setText('');
    }
  };

  const onChange = e => setText(e.target.value);

  return (
    <div className="container">
      <form onSubmit={onSubmit} className='form'>
        <div className="input-group mb-3">
          
            <input
              className="form-control"
              type='text'
              name='text'
              placeholder='Search Experiments by Expid or Description...'
              value={text}
              onChange={onChange}
            />
            <div className="input-group-append">
              <input          
                type='submit'
                value='Search'
                className='btn btn-dark'
              />
            </div>        
        </div>
      </form>
      {experimentContext.experiments.length > 0 && (
            <Fragment>
              <button className='btn btn-light btn-block' onClick={experimentContext.clearExperiments}>
                Clear
              </button>
              <br></br>
            </Fragment>                                  
          )} 
    </div>
  );
}

export default Search;
