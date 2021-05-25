import React, { useContext, useState } from "react";
//import ExperimentContext from "../context/experiment/experimentContext";
import GraphContext from "../context/graph/graphContext";
import GraphNodeSelection from "./GraphNodeSelection";
import AlertTotal from "./AlertTotal";

const JobSearcher = () => {
  //const experimentContext = useContext(ExperimentContext);
  const graphContext = useContext(GraphContext);
  const {
    searchJobInGraph,
    foundNodes,
    loadingSearchJob,
    data,
    navigateTo,
    displayJobInfoPanel,
    setJobInfoPanelVisibility,
  } = graphContext;

  const [jobId, setJobId] = useState("");
  const [currentIndex, setCurrentIndex] = useState("");
  const onChangeId = (e) => setJobId(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    searchJobInGraph(jobId);
    setCurrentIndex(0);
  };

  const onSetDisplayPanel = (value) => (e) => {
    e.preventDefault();
    setJobInfoPanelVisibility(value);
  }

  const onNext = (index) => (e) => {
    e.preventDefault();
    if (foundNodes) {
      let nextIndex = currentIndex + index;
      //setCurrentIndex(nextIndex);
      //console.log(nextIndex);
      if (nextIndex >= 0 && nextIndex < foundNodes.length) {
        //setCurrentIndex(nextIndex);
        //console.log(foundNodes[currentIndex].id);
        navigateTo(foundNodes[nextIndex].id);
        setCurrentIndex(nextIndex);
      } else {
        if (nextIndex < 0) {
          navigateTo(foundNodes[foundNodes.length - 1].id);
          setCurrentIndex(foundNodes.length - 1);
        } else if (nextIndex >= foundNodes.length) {
          navigateTo(foundNodes[0].id);
          setCurrentIndex(0);
        }
      }
    }
  };

  return (
    <div className='row-hl d-flex flex-wrap'>
      <div className='item-hl'>
        <form onSubmit={onSubmit} className='form'>
          <div className='input-group input-group-sm'>
            <input
              className='form-control'
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
            {loadingSearchJob && <span>Searching...</span>}
            {!loadingSearchJob && (
              <div className='input-group-append'>
                <input
                  type='submit'
                  value='Search by Job Name'
                  className='btn btn-dark btn-sm'
                />
              </div>
            )}
          </div>
        </form>
      </div>
      <div className='item-hl'>
        {foundNodes && foundNodes.length > 1 && (
          <div className='ml-2'>
            <button
              className='btn btn-sm btn-primary'
              type='button'
              onClick={onNext(-1)}
            >
              Previous
            </button>
            <button
              className='btn btn-sm btn-primary'
              type='button'
              onClick={onNext(1)}
            >
              Next
            </button>
            <small className='text-muted ml-2'>
              {currentIndex + 1} of {foundNodes.length}
            </small>
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
        )}
      </div>
      <div className='item-hl ml-2'>
        <GraphNodeSelection />
      </div>    
      <div className="item-hl ml-auto">
      {displayJobInfoPanel === "none" ? 
        <button 
          className="btn btn-sm btn-primary" 
          data-toggle='tooltip' 
          data-placement='bottom' 
          title="Show the Job Information Panel."
          onClick={onSetDisplayPanel("block")}>Show Panel</button> 
        : 
        <button 
        className="btn btn-sm btn-secondary"
        data-toggle='tooltip' 
        data-placement='bottom' 
        title="Hide the Job Information Panel."
        onClick={onSetDisplayPanel("none")}>Hide Panel</button>
      }  
      </div>
      
        {data && (
          <div className='ml-2 item-hl text-right'>
            Max out: {data.max_children} | Max in: {data.max_parents} | Total
            #Jobs: {data.total_jobs} <AlertTotal source={"graph"} /> | Chunk
            unit: <strong>{data.chunk_unit}</strong> | Chunk size{" "}
            <strong>{data.chunk_size}</strong>{" "}
          </div>
        )}      
    </div>
  );
};

export default JobSearcher;
