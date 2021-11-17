import React, { useContext, useEffect } from "react";
import ExperimentContext from "../context/experiment/experimentContext";
import GraphContext from "../context/graph/graphContext";
import JobSummary from "./JobSummary";
import SelectionControl from "./SelectionControl";
import { buildWarningInactiveMessageTree } from "../context/utils";

const GraphControl = () => {
  const experimentContext = useContext(ExperimentContext);
  const graphContext = useContext(GraphContext);
  const {
    experiment,
    experimentRunning,
    loadingJobMonitor,
    getLogStatus,
    logTimeDiff,
    currentLog,
  } = experimentContext;

  const {
    getExperimentGraph,
    data,
    getExperimentPkl,
    setAutoUpdatePkl,
    startAutoUpdatePkl,
    enabledGraphSearch,
    loadingPkl,
    warningActive,
    setWarningActive,
  } = graphContext;

  useEffect(() => {
    const warningMessage = buildWarningInactiveMessageTree(experimentRunning, logTimeDiff, currentLog, data ? data.nodes : null);
    setWarningActive(warningMessage);
    // eslint-disable-next-line
  }, [logTimeDiff, warningActive, currentLog, data])

  const disableQuery = !enabledGraphSearch || loadingPkl;

  const onSubmitGraph = (grouped = "none", layout = "standard") => (e) => {
    e.preventDefault();
    getLogStatus(experiment.expid);
    const warningMessage = buildWarningInactiveMessageTree(experimentRunning, logTimeDiff, currentLog, data ? data.nodes : null);
    getExperimentGraph(experiment.expid, grouped, layout, warningMessage);
  };

  const onJobMonitor = (e) => {
    e.preventDefault();
    setAutoUpdatePkl(true);
  };

  const onNotJobMonitor = (e) => {
    e.preventDefault();
    setAutoUpdatePkl(false);
  };

  const onRequestUpdate = (e) => {
    e.preventDefault();
    getLogStatus(experiment.expid);
    getExperimentPkl(experiment.expid, experiment.pkl_timestamp);
  };

  return (
    <div className='card-header p-1'>
      <div className='d-flex flex-wrap row-hl'>

        {(loadingJobMonitor || loadingPkl) && <div className='mr-auto item-hl'>Querying...</div>}
        {warningActive && (
          <div className="mr-auto item-hl">
            <span
              className='px-2 bg-warning text-white rounded text-center ml-1'
              style={{ width: "100%" }}
              title={warningActive}
            >
              <strong>ACTIVE WARNING</strong>
            </span>
          </div>
        )}

        <div className='item-hl ml-auto'>
          <div className="btn-group" role="group" aria-label="Group By">
            <button
              className="btn btn-primary btn-sm"
              disabled={disableQuery}
              onClick={onSubmitGraph()}
              data-toggle='tooltip'
              data-placement='bottom'
              title="Shows the default Graph Representation of the experiment."
            >
              Classic
            </button>
            <button
              className="btn btn-primary btn-sm"
              disabled={disableQuery}
              onClick={onSubmitGraph("none", "laplacian")}
              data-toggle='tooltip'
              data-placement='bottom'
              title="Shows Graph Laplacian representation of the experiment.">
              <i className="fas fa-chess-board"></i>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={onSubmitGraph("date-member")}
              disabled={disableQuery}
              data-toggle='tooltip'
              data-placement='bottom'
              title="Similar to Classic, but the nodes are grouped by date-member.">
              Date-Member
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={onSubmitGraph("status")}
              disabled={disableQuery}
              data-toggle='tooltip'
              data-placement='bottom'
              title="Similar to Classic, but the nodes are grouped by status.">
              Status
            </button>
          </div>
        </div>

        {experiment && data && (
          <div className='item-hl pl-1'>
            <JobSummary source="graph" />
          </div>
        )}

        {experiment && data && (
          <div className='item-hl px-1'>
            <SelectionControl />
          </div>
        )}

        <div className="item-hl">
          <div className="btn-group" role="group" aria-label="workflow">
            {experiment && data && experimentRunning && !startAutoUpdatePkl && (
              <button
                type='button'
                className='btn btn-success btn-sm'
                disabled={disableQuery}
                onClick={onRequestUpdate}
                data-toggle='tooltip'
                data-placement='bottom'
                title="Updates the Graph's job data (including status) with the most recent information."
              >
                Refresh
              </button>
            )}
            {experimentRunning && data && !startAutoUpdatePkl && (
              <button
                type='button'
                className='btn btn-success btn-sm'
                disabled={disableQuery}
                onClick={onJobMonitor}
                data-toggle='tooltip'
                data-placement='bottom'
                title="Starts a worker that periodically updates the Graph's job data."
              >
                Start Job Monitor
              </button>
            )}
            {experimentRunning && data && startAutoUpdatePkl && (
              <button
                type='button'
                className='btn btn-danger btn-sm'
                disabled={disableQuery}
                onClick={onNotJobMonitor}
              >Stop Job Monitor</button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GraphControl;
