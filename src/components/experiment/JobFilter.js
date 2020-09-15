import React, { useContext, useState } from "react";
//import ExperimentContext from "../context/experiment/experimentContext";
import TreeContext from "../context/tree/treeContext";
import AlertTotal from "./AlertTotal";
//import GraphNodeSelection from "./GraphNodeSelection";

const JobFilter = () => {
  //const experimentContext = useContext(ExperimentContext);
  const treeContext = useContext(TreeContext);
  const {
    filterTreeView,
    treedata,
    loadingFilterTree,
    clearFilterTreeView,
    returnFilter,
  } = treeContext;
  // const { totalJobs } = experimentContext;

  const [filterString, setFilterString] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    filterTreeView(filterString);
  };

  const onChangeFilter = (e) => setFilterString(e.target.value);
  const onClearFilter = (e) => {
    e.preventDefault();
    clearFilterTreeView();
  };

  var clearText = "Clear";
  if (returnFilter && returnFilter >= 0) {
    clearText = "Clear Result";
  }

  // if (treedata) {
  //   if (totalJobs !== treedata.total) {
  //     alert(
  //       "The number of jobs in the experiment is different than the number of jobs in your current run. This might be due to a change in the config files of your experiment while Autosubmit was already running."
  //     );
  //   }
  // }

  return (
    <div className='row'>
      <div className='col-md-4 pr-1'>
        <form onSubmit={onSubmit} className='form' autoComplete='off'>
          <div className='input-group input-group-sm'>
            <input
              className='form-control'
              type='text'
              name='section'
              placeholder='Filter text'
              onChange={onChangeFilter}
            />
            {loadingFilterTree && <span>Searching...</span>}
            {!loadingFilterTree && (
              <div className='input-group-append'>
                <input
                  type='submit'
                  value='Filter'
                  className='btn btn-dark btn-sm'
                />
              </div>
            )}
          </div>
        </form>
      </div>
      <div className='col-md-4 text-left pl-1'>
        <form onSubmit={onClearFilter} className='form'>
          <input
            type='submit'
            value={clearText}
            className='btn btn-info btn-sm'
          />
        </form>
      </div>
      <div className='col-md-4 text-right text-muted pr-4'>
        {treedata && treedata.jobs && (
          <small>
            Total #Jobs: {treedata.total} <AlertTotal source={"tree"} /> | Chunk
            unit: <strong>{treedata.reference.chunk_unit}</strong> | Chunk size:{" "}
            <strong>{treedata.reference.chunk_size}</strong>{" "}
          </small>
        )}
      </div>
    </div>
  );
};

export default JobFilter;
