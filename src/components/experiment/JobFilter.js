/*
  Component that provides the tools to search jobs in the Tree Representation
*/
import React, { useContext, useEffect, useState, useRef } from "react";
import TreeContext from "../context/tree/treeContext";
import AlertTotal from "./AlertTotal";
import TreeNodeSelection from "./TreeNodeSelection";

const JobFilter = () => {
  const treeContext = useContext(TreeContext);
  const refInput = useRef("");
  const {
    filterTreeView,
    treedata,
    loadingFilterTree,
    clearFilterTreeView,
    expandAllTree,
    collapseAllTree,
    saveTreeLayout,
    resetTreeLayout,
    returnFilter,
  } = treeContext;

  useEffect(() => {
    // this will run only on load
    saveTreeLayout()
  // eslint-disable-next-line
  }, [])

  const [filterString, setFilterString] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    filterTreeView(filterString);
  };

  const onChangeFilter = (e) => setFilterString(e.target.value);

  const onClearFilter = (e) => {
    e.preventDefault();
    resetTreeLayout();
    clearFilterTreeView();
    setFilterString("");
    refInput.current.value=""
  };

  var clearText = "Reset";
  if (returnFilter && returnFilter >= 0) {
    clearText = "Reset Result";
  }

  const onExpandFilter = (e) => {
    e.preventDefault();
    expandAllTree();
  };

  const onCollapseFilter = (e) => {
    e.preventDefault();
    collapseAllTree();
  };

  return (
    <div className='row-hl flex-wrap d-flex'>
      <div className='item-hl'>
        <form onSubmit={onSubmit} className='form' autoComplete='off'>
          <div className='input-group input-group-sm'>
            <input
              className='form-control menu-input-append'
              type='text'
              ref={refInput}
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
                  className='btn btn-dark btn-sm menu-btn'
                  data-toggle='tooltip'
                  data-placement='bottom'
                  title="Use the Filter string to filter the contents of the Tree View, you can use '*' as a wildcard."
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {treedata && treedata.jobs.length > 0 && (
      <>
          <div className='item-hl ml-2'>
            <form onSubmit={onClearFilter} className='form'>
              <input
                type='submit'
                value={clearText}
                className='btn btn-primary btn-sm menu-btn'
                data-toggle='tooltip'
                data-placement='bottom'
                title='Returns the Tree View to its original content if a filter has been applied.'
              />
            </form>
          </div>
          <div className='item-hl ml-2'>
            <form onSubmit={onExpandFilter} className='form'>
              <input
                type='submit'
                value="Expand ＋"
                className='btn btn-warning btn-sm menu-btn'
                data-toggle='tooltip'
                data-placement='bottom'
                title='Expands recursively all the tree folders.'
              />
            </form>
          </div>
          <div className='item-hl ml-2'> 
            <form onSubmit={onCollapseFilter} className='form'>
              <input
                type='submit'
                value="Collapse －"
                className='btn btn-warning btn-sm menu-btn'
                data-toggle='tooltip'
                data-placement='bottom'
                title='Collapse all the tree folders.'
              />
            </form>
          </div>
      </>
      )}
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
