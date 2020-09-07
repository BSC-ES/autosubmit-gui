import React, { useContext } from "react";
//import Spinner from "../layout/Spinner";
import ExperimentContext from "../context/experiment/experimentContext";

const ExperimentColumn = ({ expidToken, refTree }) => {
  //console.log(expidToken);
  const experimentContext = useContext(ExperimentContext);
  const { loading, experiment } = experimentContext;

  if (experiment === null)
    return (
      <div className='row'>
        <div className='col-12'>
          <div className='footer bg-dark text-white p-0'>
            {/* <div className='card-footer p-0 scroll-x'>
            <div className='row text-right p-0'>
              <div className='col'>No data...</div>
            </div>
          </div> */}
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
    <div className='row'>
      <div className='col'>
        <div className='footer bg-dark text-white '>
          <div className='card-footer py-0 scroll-x'>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentColumn;
