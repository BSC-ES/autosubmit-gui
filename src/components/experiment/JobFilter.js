import React, { useContext, useState } from "react";
//import ExperimentContext from "../context/experiment/experimentContext";
import TreeContext from "../context/tree/treeContext";
import AlertTotal from "./AlertTotal";
import TreeNodeSelection from "./TreeNodeSelection";
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
    <div className='row-hl flex-wrap d-flex'>
      <div className='item-hl'>
        <form onSubmit={onSubmit} className='form' autoComplete='off'>
          <div className='input-group input-group-sm'>
            <input
              className='form-control'
              type='text'
              name='section'
              placeholder='Filter string'
              onChange={onChangeFilter}
            />
            {loadingFilterTree && <span>Searching...</span>}
            {!loadingFilterTree && (
              <div className='input-group-append'>
                <input
                  type='submit'
                  value='Filter'
                  className='btn btn-dark btn-sm'
                  data-toggle='tooltip' 
                  data-placement='bottom' 
                  title="Use the Filter string to filter the contents of the Tree View, you can use '*' as a wildcard."
                />
              </div>
            )}
          </div>
        </form>
      </div>
      <div className='item-hl ml-2'>
        <form onSubmit={onClearFilter} className='form'>
          <input
            type='submit'
            value={clearText}
            className='btn btn-primary btn-sm'
            data-toggle='tooltip' 
            data-placement='bottom' 
            title="Returns the Tree View to its original content if a filter has been applied."
          />
        </form>
      </div>
      <div className='item-hl ml-2'>
        <TreeNodeSelection />
      </div>      
        {treedata && treedata.jobs && (
          <div className='item-hl text-right ml-auto'>
            Total #Jobs: {treedata.total} <AlertTotal source={"tree"} /> | Chunk
            unit: <strong>{treedata.reference.chunk_unit}</strong> | Chunk size:{" "}
            <strong>{treedata.reference.chunk_size}</strong>{" "}
          </div>
        )}      
    </div>
  );
};

export default JobFilter;
