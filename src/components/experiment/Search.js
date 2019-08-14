import React, { useState, useContext } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';
import PropTypes from 'prop-types';

const Search = ({ setAlert }) => {
  const experimentContext = useContext(ExperimentContext);

  const [text, setText] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    if (text === '') {
      setAlert('Please enter something', 'light');
    } else {
      experimentContext.searchExperiments(text);
      setText('');
    }
  };

  const onChange = e => setText(e.target.value);

  return (
    <div>
      <form onSubmit={onSubmit} className='form'>
        <input
          type='text'
          name='text'
          placeholder='Search Experiments by Expid or Description...'
          value={text}
          onChange={onChange}
        />
        <input
          type='submit'
          value='Search'
          className='btn btn-dark btn-block'
        />
      </form>
      {experimentContext.experiments.length > 0 && (
        <button className='btn btn-light btn-block' onClick={experimentContext.clearExperiments}>
          Clear
        </button>
      )}
    </div>
  );
}


Search.propTypes = {
  setAlert: PropTypes.func.isRequired
};

export default Search;
