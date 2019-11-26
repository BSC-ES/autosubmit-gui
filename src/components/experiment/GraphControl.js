import React, { useContext } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';

const GraphControl = () => {
    const experimentContext = useContext(ExperimentContext); 
    const { getExperimentGraph, 
            experiment,
            enabledGraphSearch,
            experimentRunning,
            data,
            setAutoUpdatePkl,
            startAutoUpdatePkl } = experimentContext;

    const onSubmitGraph = group => e => {
            e.preventDefault();
            getExperimentGraph(experiment.expid, group);
            //window.showGraphTab();
        };
    
    const onJobMonitor = e => {
        e.preventDefault();
        setAutoUpdatePkl(true);
        };

    const onNotJobMonitor = e => {
        e.preventDefault();
        setAutoUpdatePkl(false);    
        };
            
    return (
        <div className="card-header p-1">
            <div className="row justify-content-end">
                <div className='col-md-2'>
                    <form onSubmit={onSubmitGraph(false)} className='form'>
                      <input
                        type='submit'
                        value='Classic'
                        className='btn btn-info btn-block btn-sm'
                        disabled={!enabledGraphSearch}
                      />
                    </form>
                </div>
                <div className='col-md-2'>
                    <form onSubmit={onSubmitGraph(true)} className='form'>
                      <input
                        type='submit'
                        value='Grouped'
                        className='btn btn-info btn-block btn-sm'
                        disabled={!enabledGraphSearch}
                      />
                    </form>
                </div>
                {experimentRunning && data && !startAutoUpdatePkl &&
                    <div className='col-md-3'>
                        <form onSubmit={onJobMonitor} className='form'>
                            <input
                                type='submit'
                                value='Start Job Monitor'
                                className='btn btn-dark btn-block btn-sm'
                                disabled={!enabledGraphSearch}
                            />
                        </form>
                    </div>
                }                
                {experimentRunning && data && startAutoUpdatePkl &&
                <div className='col-md-3'>
                    <form onSubmit={onNotJobMonitor} className='form'>
                        <input
                            type='submit'
                            value='Stop Job Monitor'
                            className='btn btn-danger btn-block btn-sm'
                            disabled={!enabledGraphSearch}
                        />
                    </form>
                </div>                    
                }                                
            </div>
        </div>
    )
}

export default GraphControl
