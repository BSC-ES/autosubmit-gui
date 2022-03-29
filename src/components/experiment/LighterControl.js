import React, { useContext, useState } from "react";
import LighterContext from "../context/lighter/lighterContext";
import ExperimentContext from "../context/experiment/experimentContext";
import AlertTotal from "./AlertTotal";
import {
  completedColor,
  runningColor,
  queueColor,
  failedColor,
} from "../context/vars";

const LighterControl = () => {
  const lighterContext = useContext(LighterContext);
  const experimentContext = useContext(ExperimentContext);
  const {
    getLighterView,
    loadingView,
    isValid,
    queueCount,
    runCount,
    totalCount,
    failedCount,
    completedCount,
    currentCount,
    filterLighterTreeView,
    loadingFilterTreeView,
    clearLighterFilterTreeView,
    filterCount,
  } = lighterContext;
  const { experiment } = experimentContext;

  //const { enabledTreeSearch } = treeContext;
  const [filterString, setFilterString] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    filterLighterTreeView(filterString);
  };
  const onChangeFilter = (e) => setFilterString(e.target.value);

  const onClearFilter = (e) => {
    e.preventDefault();
    clearLighterFilterTreeView();
  };

  const onSubmitRequest = (e) => {
    e.preventDefault();
    getLighterView(experiment.expid);
  };

  const onFilterStatus = (statusString) => (e) => {
    e.preventDefault();
    filterLighterTreeView(statusString);
  };

  const labelButton = isValid ? "Refresh" : "Show";
  const labelToolTip = isValid
    ? "Updates the job data with the latest information."
    : "Show the list of jobs.";

  let clearText = "Clear";
  if (filterCount && filterCount >= 0) {
    clearText = "Clear Result";
  }

  return (
    <div className='card-header p-1'>
      <div className='row-hl d-flex flex-wrap'>
        {isValid && (
          <div className='item-hl'>
            <button
              className='btn btn-sm btn-secondary menu-btn'
              type='button'
              style={completedColor}
              onClick={onFilterStatus("#COMPLETED")}
              disabled={loadingFilterTreeView}
              data-toggle='tooltip'
              data-placement='bottom'
              title='Filters the list and only shows COMPLETED jobs.'
            >
              {completedCount} completed
            </button>
            <button
              className='btn btn-sm btn-secondary menu-btn'
              type='button'
              style={failedColor}
              onClick={onFilterStatus("#FAILED")}
              disabled={loadingFilterTreeView}
              data-toggle='tooltip'
              data-placement='bottom'
              title='Filters the list and only shows FAILED jobs.'
            >
              {failedCount} failed
            </button>
            <button
              className='btn btn-sm btn-secondary menu-btn'
              type='button'
              style={runningColor}
              onClick={onFilterStatus("#RUNNING")}
              disabled={loadingFilterTreeView}
              data-toggle='tooltip'
              data-placement='bottom'
              title='Filters the list and only shows RUNNING jobs.'
            >
              {runCount} running
            </button>
            <button
              className='btn btn-sm btn-secondary menu-btn'
              type='button'
              style={queueColor}
              onClick={onFilterStatus("#QUEUING")}
              disabled={loadingFilterTreeView}
              data-toggle='tooltip'
              data-placement='bottom'
              title='Filters the list and only shows QUEUING jobs.'
            >
              {queueCount} queuing
            </button>
          </div>
        )}
        {isValid && <AlertTotal source={"lighter"} />}
        {isValid && (
          <div className='item-hl ml-2'>
            <form onSubmit={onSubmit} className='form' autoComplete='off'>
              {loadingFilterTreeView && <span>Searching...</span>}
              {!loadingFilterTreeView && (
                <div className='input-group input-group-sm'>
                  <input
                    className='form-control menu-input-append'
                    type='text'
                    name='section'
                    placeholder='Filter string'
                    onChange={onChangeFilter}
                  />
                  <div className='input-group-append'>
                    <input
                      type='submit'
                      value='Filter'
                      className='btn btn-dark btn-sm menu-btn'
                      data-toggle='tooltip'
                      data-placement='bottom'
                      title="Use the Filter string to filter the contents of the list, you can use '*' as a wildcard."
                    />
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
        {isValid && (
          <div className='item-hl ml-2'>
            <span>
              Showing {currentCount} of <strong>{totalCount} total jobs</strong>
              .
            </span>
          </div>
        )}
        {isValid && filterCount >= 0 && (
          <div className='item-hl mx-1'>
            <form onSubmit={onClearFilter} className='form'>
              <input
                type='submit'
                value={clearText}
                className='btn btn-sm btn-primary menu-btn'
                data-toggle='tooltip'
                data-placement='bottom'
                title='Returns the list to its original content if a filter has been applied.'
              />
            </form>
          </div>
        )}
        <div className='item-hl ml-auto'>
          {experiment && (
            <form onSubmit={onSubmitRequest} className='form'>
              <input
                type='submit'
                value={labelButton}
                className='btn btn-success btn-block btn-sm menu-btn'
                disabled={loadingView}
                data-toggle='tooltip'
                data-placement='bottom'
                title={labelToolTip}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LighterControl;
