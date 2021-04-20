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
    lightData,
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

  const labelButton = lightData ? "Refresh" : "View";

  let clearText = "Clear";
  if (filterCount && filterCount >= 0) {
    clearText = "Clear Result";
  }

  return (
    <div className='card-header p-1'>
      <div className='row-hl d-flex flex-wrap'>
        {lightData && (
          <div className='item-hl'>
            <button className='btn btn-sm btn-secondary' onClick={onClearFilter}>
              {lightData.total} total jobs
            </button>
            {lightData.completed > 0 && (
              <button
                className='btn btn-sm btn-secondary'
                type='button'
                style={completedColor}
                onClick={onFilterStatus("#COMPLETED")}
                disabled={loadingFilterTreeView}
              >
                {lightData.completed} completed
              </button>
            )}
            {lightData.failed > 0 && (
              <button
                className='btn btn-sm btn-secondary'
                type='button'
                style={failedColor}
                onClick={onFilterStatus("#FAILED")}
                disabled={loadingFilterTreeView}
              >
                {lightData.failed} failed
              </button>
            )}
            {lightData.running > 0 && (
              <button
                className='btn btn-sm btn-secondary'
                type='button'
                style={runningColor}
                onClick={onFilterStatus("#RUNNING")}
                disabled={loadingFilterTreeView}
              >
                {lightData.running} running
              </button>
            )}
            {lightData.queuing > 0 && (
              <button
                className='btn btn-sm btn-secondary'
                type='button'
                style={queueColor}
                onClick={onFilterStatus("#QUEUING")}
                disabled={loadingFilterTreeView}
              >
                {lightData.queuing} queuing
              </button>
            )}
          </div>
        )}
        {lightData && <AlertTotal source={"lighter"} />}
        {lightData && (
          <div className='item-hl ml-2'>
            <form onSubmit={onSubmit} className='form' autoComplete='off'>
              {loadingFilterTreeView && <span>Searching...</span>}
              {!loadingFilterTreeView && (
                <div className='input-group input-group-sm'>
                  <input
                    className='form-control'
                    type='text'
                    name='section'
                    placeholder='Filter View'
                    onChange={onChangeFilter}
                  />
                  <div className='input-group-append'>
                    <input
                      type='submit'
                      value='Filter'
                      className='btn btn-dark btn-sm'
                    />
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
        {lightData && filterCount > 0 && (
          <div className='item-hl mx-1'>
            <form onSubmit={onClearFilter} className='form'>
              <input
                type='submit'
                value={clearText}
                className='btn btn-sm btn-primary'
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
                className='btn btn-success btn-block btn-sm'
                disabled={loadingView}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LighterControl;
