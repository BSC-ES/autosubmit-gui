import React, { useContext, Fragment } from "react";
import Spinner from "../layout/Spinner";
import ExperimentContext from "../context/experiment/experimentContext";

const ExperimentColumn = ({ expidToken, refTree }) => {
  //console.log(expidToken);
  const experimentContext = useContext(ExperimentContext);
  const { loading, experiment } = experimentContext;

  if (experiment === null) return <Spinner />;

  const {
    // expid,
    owner,
    owner_id,
    path,
    //time_last_access,
    time_last_mod,
    version,
    updateTime,
    branch,
    hpc,
    description,
    //isGrouped,
  } = experiment;

  if (loading) return <Spinner />;

  return (
    <Fragment>
      <div className='card-footer p-1 scroll-x'>
        <div className='row'>
          <div className='col-md-12 text-center'>
            <small>{description}</small>
          </div>
        </div>
      </div>
      <div className='card-footer p-1 scroll-x'>
        <div className='row'>
          <div className='col-md-3'>
            <div>
              <small className='font-weight-bold'>Version:</small> {version}
            </div>
            <div>
              <small className='font-weight-bold'>Owner:</small> {owner_id}{" "}
              {owner}
            </div>
            <div>
              <small className='font-weight-bold'>Path:</small>{" "}
              <span>{path}</span>
            </div>
          </div>
          <div className='col-md-3'>
            <div>
              <small className='font-weight-bold'>SleepTime: </small>{" "}
              {updateTime}
            </div>
            <div>
              <small className='font-weight-bold'>Modified:</small>{" "}
              {time_last_mod}
            </div>
          </div>
          <div className='col-md-3'>
            <div>
              <small className='font-weight-bold'>Branch:</small>
            </div>
            <div className='lead'>{branch}</div>
          </div>
          <div className='col-md-3'>
            <div>
              <small className='font-weight-bold'>Hpc:</small>
            </div>
            <div className='lead'>{hpc}</div>
          </div>
        </div>
      </div>
    </Fragment>

    // <div className='col-12 pr-0'>
    //   <div className='card'>
    //     <div className='card-text m-2'>
    //       <div className='row'>
    //         <div className='col-md-12'>
    //           <div>
    //             <small className='font-weight-bold'>Version:</small>
    //           </div>
    //           <div>{version}</div>
    //           <div>
    //             <small className='font-weight-bold'>Owner:</small>
    //           </div>
    //           <div>
    //             {owner_id} {owner}
    //           </div>
    //           <div>
    //             <small className='font-weight-bold'>Path:</small>
    //           </div>
    //           <div>
    //             <span>{path}</span>
    //           </div>
    //           <div>
    //             <small className='font-weight-bold'>SleepTime: </small>
    //           </div>
    //           <div>{updateTime}</div>
    //           <div>
    //             <small className='font-weight-bold'>Modified:</small>
    //           </div>
    //           <div>{time_last_mod}</div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    // </div>
  );
};

export default ExperimentColumn;
