import React, { useContext } from "react";
import dogload from "./dogload.gif";
import catload from "./catload.gif";
import Spinner from "./Spinner";
import LoadingCounter from "./LoadingCounter";
import ExperimentContext from "../context/experiment/experimentContext";

const Loading = ({ source }) => {
  const experimentContext = useContext(ExperimentContext);
  const {
    expectedLoadingTreeTime,
    expectedLoadingQuickView,
    //increaseElapsedLoadingTree,
    //elapsedLoadingTree,
  } = experimentContext;

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     increaseElapsedLoadingTree();
  //   }, 1000);
  //   return () => clearInterval(interval);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const expectedTime =
    source === "tree" ? expectedLoadingTreeTime : expectedLoadingQuickView;
  const gifload = source === "tree" ? dogload : catload;

  //console.log(expectedLoadingTreeTime);
  if (expectedTime >= 1) {
    return (
      <div className='row'>
        <div className='col'>
          <div className='row justify-content-center'>
            <div className='col-4'>
              <img
                src={gifload}
                alt='Loading...'
                style={{ width: "200px", margin: "auto", display: "block" }}
              />
            </div>
          </div>
          <div className='row justify-content-center'>
            <div className='col-4'>
              <LoadingCounter loadsource={source} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='row'>
        <div className='col'>
          <Spinner></Spinner>
        </div>
      </div>
    );
  }
};

export default Loading;
