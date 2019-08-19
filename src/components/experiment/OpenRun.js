import React, { useContext } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';


const OpenRun = () => {
    const experimentContext = useContext(ExperimentContext); 
    const { setAutoUpdateRun } = experimentContext;
    const onSubmit = e => {
        e.preventDefault();
        setAutoUpdateRun();
    };

    return (
        <div className='card grid-1'>
        <form onSubmit={onSubmit} className='form'>
          <input
            type='submit'
            value='Show Running Data'
            className='btn btn-primary btn-block'
            // disabled={!enabledGraphSearch}
          />
        </form>
      </div>
    )
}

export default OpenRun;
