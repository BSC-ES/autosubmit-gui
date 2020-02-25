import React, { useContext, useState } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';

const JobSearcher = () => {
    
    const experimentContext = useContext(ExperimentContext);
    const { searchJobInGraph, 
            foundNodes, 
            loadingSearchJob, 
            data, 
            navigateTo } = experimentContext;

    const [jobId, setJobId] = useState('');    
    const [currentIndex, setCurrentIndex] = useState('');
    const onChangeId = e => setJobId(e.target.value);
    

    const onSubmit = e => {
        e.preventDefault();
        searchJobInGraph(jobId);
        setCurrentIndex(0);
    }

    const onNext = index => e => {
        e.preventDefault();
        if (foundNodes) {
            let nextIndex = currentIndex + index;
            //setCurrentIndex(nextIndex);
            //console.log(nextIndex);
            if (nextIndex >= 0 && nextIndex < foundNodes.length ) {
                //setCurrentIndex(nextIndex);
                //console.log(foundNodes[currentIndex].id);
                navigateTo(foundNodes[nextIndex].id);
                setCurrentIndex(nextIndex)
            } else {
               if (nextIndex < 0){
                    navigateTo(foundNodes[foundNodes.length - 1].id);
                   setCurrentIndex(foundNodes.length - 1);
               } else if (nextIndex >= foundNodes.length) {
                    navigateTo(foundNodes[0].id);
                    setCurrentIndex(0);
               }
            }            
        }
    }

    return (
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={onSubmit} className='form'>
                    <div className="input-group input-group-sm">                      
                        <input
                            className="form-control"
                            type='text'
                            name='section'
                            placeholder='Job Name (e.g. fc0_1_CLEAN)'                          
                            onChange={onChangeId}
                        />
                        {/* <input
                            className="form-control"
                            type='text'
                            name='hours'
                            placeholder='Hours'                          
                            onChange={onChangeHour}
                        />                     */}
                        {loadingSearchJob && 
                            <span>Searching...</span>
                        }
                        {!loadingSearchJob && 
                        <div className="input-group-append">
                            <input          
                            type='submit'
                            value='Search by Job Name'
                            className='btn btn-dark btn-sm'                            
                            />
                        </div>                    
                        }                    
                    </div>
                </form>
            </div>      
            <div className="col-md-3 text-center">
                {foundNodes && foundNodes.length > 1 &&
                    <div>
                        <button className="btn-sm btn-info" type="button" onClick={onNext(-1)}>Previous</button>
                        <button className="btn-sm btn-info" type="button" onClick={onNext(1)}>Next</button>
                        <small className='text-muted ml-2'>{currentIndex + 1} of {foundNodes.length}</small>
                        {/* <form onSubmit={onNext(-1)} className='form'>
                            <input          
                            type='submit'
                            value='Prev'
                            className='btn btn-info btn-sm'                            
                            />
                        </form>

                        <form onSubmit={onNext(1)} className='form'>
                            <input          
                            type='submit'
                            value='Next'
                            className='btn btn-info btn-sm'                            
                            />
                        </form> */}
                    </div>                            
                }   
            </div>         
            <div className="col-md-5 text-right text-muted">
                {data && 
                    <small>Max out: {data.max_children} | Max in: {data.max_parents} | Total #Jobs: {data.total_jobs} | Chunk unit: <strong>{data.chunk_unit}</strong></small>
                }
            </div>         
        </div>
    )
};

export default JobSearcher;
