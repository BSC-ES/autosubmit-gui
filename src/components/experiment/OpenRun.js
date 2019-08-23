import React, { useContext, Fragment } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';


const OpenRun = () => {
    const experimentContext = useContext(ExperimentContext); 
    const { setAutoUpdateRun, startAutoUpdateRun, experiment } = experimentContext;
    const onSubmit = e => {
        e.preventDefault();
        setAutoUpdateRun(true);
    };

    const onStopSubmit = e => {
      e.preventDefault();
      setAutoUpdateRun(false);
  };

    return (
      <Fragment>
          <div className='row'>
            <hr></hr>
          </div>
          <div className='row'>
            <div className="col-md-4 offset-md-4">
              <div>
                {experiment && !startAutoUpdateRun &&
                  <form onSubmit={onSubmit} className='form'>
                    <input
                    type='submit'
                    value='Show Running Data'
                    className='btn btn-dark btn-sm btn-block'
                    // disabled={!enabledGraphSearch}
                    />
                  </form>
                }
                {experiment && startAutoUpdateRun &&
                  <form onSubmit={onStopSubmit} className='form'>
                    <input
                    type='submit'
                    value='Stop Running Data'
                    className='btn btn-danger btn-sm btn-block'
                    // disabled={!enabledGraphSearch}
                    />
                  </form>
                }
              </div>
            </div>

        </div>
      </Fragment>
        
    )
}

export default OpenRun;
