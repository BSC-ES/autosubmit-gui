import React, { useEffect, useContext } from "react";
import TreeContext from "../context/tree/treeContext";
import LighterContext from "../context/lighter/lighterContext";
import ExperimentContext from "../context/experiment/experimentContext";
import { maxReponseTimeThreshold } from "../context/vars";

const LoadingCounter = ({ loadsource }) => {
  //const { source_load } = source;
  //console.log(loadsource);
  const treeContext = useContext(TreeContext);
  const lighterContext = useContext(LighterContext);
  const experimentContext = useContext(ExperimentContext);
  const {
    expectedLoadingTreeTime,
    expectedLoadingQuickView,
  } = experimentContext;
  const { increaseElapsedLoadingTree, elapsedLoadingTree } = treeContext;
  const {
    increaseElapsedLoadingQuickView,
    elapsedLoadingQuickView,
  } = lighterContext;

  const increaseFunction =
    loadsource === "tree"
      ? increaseElapsedLoadingTree
      : increaseElapsedLoadingQuickView;
  const elapsedTime =
    loadsource === "tree" ? elapsedLoadingTree : elapsedLoadingQuickView;
  const approximatedTime =
    loadsource === "tree" ? expectedLoadingTreeTime : expectedLoadingQuickView;
  //const { expectedLoadingTreeTime } = experimentContext;
  const fetchMessage =
    loadsource === "tree"
      ? "Fetching this tree view will take about " +
        approximatedTime +
        " seconds."
      : "Loading this not-so-quick view will take about " +
        approximatedTime +
        " seconds.";

  useEffect(() => {
    const interval = setInterval(() => {
      increaseFunction();
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='pb-4 text-center'>
      {approximatedTime > maxReponseTimeThreshold && (
        <p>
          This experiment might be too heavy to fetch in due time. If an error
          message is prompted, try the <b>Quick View</b>.
        </p>
      )}
      <p>{fetchMessage}</p>
      <div className='row'>
        <div className='col'>
          <div className='progress'>
            <div
              className='progress-bar'
              role='progressbar'
              style={{
                width:
                  approximatedTime > 0 && elapsedTime <= approximatedTime
                    ? (elapsedTime / approximatedTime) * 100 + "%"
                    : "100%",
              }}
              aria-valuenow={elapsedTime}
              aria-valuemin='0'
              aria-valuemax={approximatedTime}
            >
              {elapsedTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCounter;
