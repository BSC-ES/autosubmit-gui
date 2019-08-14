import React, { Fragment, useEffect, useContext } from "react";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import ExperimentContext from '../context/experiment/experimentContext';

const Experiment = ({ expidToken }) => {
  const experimentContext = useContext(ExperimentContext); 
  const { getExperiment, getExperimentGraph, loading, experiment } = experimentContext;

  useEffect(() => {
    getExperiment(expidToken);
    // eslint-disable-next-line
  }, []);
  
  const onSubmit = e => {
    e.preventDefault();
    getExperimentGraph(experiment.expid);
  };

  // const cleanParentLocal = () => {
  //   console.log('Exp clean ')
  //   cleanParent();
  // };

  const {
    expid,
    contents,
    error_message,
    owner,
    owner_id,
    path,
    time_last_access,
    time_last_mod,
    description,
    version,
    model,
    branch,
    hpc,
  } = experiment;

  if (loading)  return <Spinner />;

  return (
    <Fragment>
      <Link to='/' className='btn btn-light'>
        Back To Search
      </Link>

      <div className='card text-center'>
        <div className='badge badge-primary'>
          Owner: {owner_id} {owner}
        </div>
        <div className='badge badge-success'>
          Last Access: {time_last_access}
        </div>
        <div className='badge badge-light'>
          Last Modified: {time_last_mod}
        </div>
      </div>
      <div className='card grid-2'>
        <div className='all-center'>
          <h1>{expid}</h1>
          <p>Description: {description}</p>
          <small>Version: {version}</small>
        </div>
        <div>
          <ul>
            <li>
              {error_message !== "None" && (
                <Fragment>
                  <strong>Error Message: {error_message} </strong>
                </Fragment>
              )}
            </li>
            <li>
              {path && (
                <Fragment>
                  <strong>Path: </strong> {path}
                </Fragment>
              )}
            </li>

            <li>
              {time_last_access && (
                <Fragment>
                  <strong>Last Access: </strong> {time_last_access}
                </Fragment>
              )}
            </li>

            <li>
              {time_last_mod && (
                <Fragment>
                  <strong>Last Modified: </strong> {time_last_mod}
                </Fragment>
              )}
            </li>
            <li>
              {contents && <strong>Contents</strong>}
              <ul>
                {contents &&
                  contents.map(content => (
                    <li key={content}>
                      - {path}/{content}
                    </li>
                  ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div className='card grid-1'>
        <form onSubmit={onSubmit} className='form'>
          <input
            type='submit'
            value='Show Graph'
            className='btn btn-success btn-block'
          />
        </form>
                    
        {/* {data.error === true &&
        <p className='text-danger'>{data.error_message}</p>}
        {showGraph && (
          <GraphRepresentation
            nodes_prop={data.nodes}
            edges_prop={data.edges}
          />
        )} */}
      </div>
      <div>
        <div className="card grid-3">
          <div>
          <strong>Model:</strong> {model}
          </div>
          <div>
          <strong>Branch:</strong> {branch}
          </div>
          <div>
          <strong>Hpc:</strong> {hpc}
          </div>          
        </div>
      </div>
    </Fragment>
  );
}


export default Experiment;
