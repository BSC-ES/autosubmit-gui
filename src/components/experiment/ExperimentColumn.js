import React, { useContext } from "react";
//import Spinner from "../layout/Spinner";
import ExperimentContext from "../context/experiment/experimentContext";
//import TreeContext from "../context/tree/treeContext";

const ExperimentColumn = ({ expidToken, refTree }) => {
  //console.log(expidToken);
  const experimentContext = useContext(ExperimentContext);
  //const treeContext = useContext(TreeContext);
  const { loading, experiment, totalJobs } = experimentContext;
  //const { setExpectedLoadingTreeTime } = treeContext;

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
    //time_last_mod,
    db_historic_version,
    version,
    //updateTime,
    branch,
    hpc,
    description,
    //isGrouped,
  } = experiment;

  const db_version = db_historic_version ? db_historic_version : "NA";
  //setExpectedLoadingTreeTime(totalJobs);

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
                {/* |
                <small className='mx-2'>
                  <strong>Modified:</strong> {time_last_mod}
                </small> */}
                |
                <small className='mx-2'>
                  <strong>DB:</strong> {db_version}
                </small>
                |
                <small className='mx-2'>
                  <strong>#Jobs:</strong> {totalJobs}
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
