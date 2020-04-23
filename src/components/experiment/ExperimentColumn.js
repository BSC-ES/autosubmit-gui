import React, { useContext } from "react";
//import Spinner from "../layout/Spinner";
import ExperimentContext from "../context/experiment/experimentContext";

const ExperimentColumn = ({ expidToken, refTree }) => {
  //console.log(expidToken);
  const experimentContext = useContext(ExperimentContext);
  const { loading, experiment } = experimentContext;

  if (experiment === null)
    return (
      <div className='footer bg-dark text-white '>
        <div className='card-footer p-0 px-2 scroll-x'>
          <div className='row text-right'>
            <div className='col'>No data...</div>
          </div>
        </div>
      </div>
    );

  const {
    // expid,
    owner,
    owner_id,
    //path,
    //time_last_access,
    time_last_mod,
    version,
    //updateTime,
    branch,
    hpc,
    description,
    //isGrouped,
  } = experiment;

  if (loading)
    return (
      <div className='footer bg-dark text-white '>
        <div className='card-footer p-0 px-2 scroll-x'>
          <div className='row text-right'>
            <div className='col'>Loading...</div>
          </div>
        </div>
      </div>
    );

  return (
    <div className='footer bg-dark text-white '>
      <div className='card-footer p-0 px-2 scroll-x'>
        <div className='row text-right'>
          <div className='col'>
            <small className='mr-2'>{description}</small>|
            <small className='mx-2'>
              <strong>Branch:</strong> {branch}
            </small>
            |
            <small className='mx-2'>
              <strong>Hpc:</strong> {hpc}
            </small>
            |
            <small className='mx-2'>
              <strong>Owner:</strong> {owner_id} {owner}{" "}
            </small>
            |
            <small className='mx-2'>
              <strong>Version:</strong> {version}
            </small>
            |
            <small className='mx-2'>
              <strong>Modified:</strong> {time_last_mod}
            </small>
          </div>
          {/* <div className='col-md-6 text-left'>
            <small>{description}</small>
          </div>
          <div className='col-md-2'>
            <small className='font-weight-bold'>Version: {version}</small>
          </div>
          <div className='col-md-2'>
            <small className='font-weight-bold'>Owner: {owner_id} {owner}</small>
          </div> */}
        </div>
      </div>
      {/* <div className='card-footer p-1 scroll-x'>
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
      </div> */}
    </div>

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
