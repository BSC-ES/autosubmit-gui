import React, { Fragment, useEffect, useContext } from "react";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import ExperimentContext from '../context/experiment/experimentContext';

const Experiment = ({ expidToken }) => {
  const experimentContext = useContext(ExperimentContext); 
  const { getExperiment, getExperimentGraph, loading, experiment, enabledGraphSearch } = experimentContext;

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
    owner,
    owner_id,
    path,
    time_last_access,
    time_last_mod,
    description,
    version,
  } = experiment;

  if (loading)  return <Spinner />;

  return (
    <Fragment>
      <Link to='/' className='btn btn-light'>
        Back To Search
      </Link>    
      <div className='card text-center'>
        <div>
            <h1>{expid}</h1>
            <p>Description: {description}</p>
            <small>Version: {version}</small>
        </div>
        <div className='badge badge-primary'>
          Owner: {owner_id} {owner}
        </div>
        <div className='badge badge-success'>
          Last Access: {time_last_access}
        </div>
        <div className='badge badge-light'>
          Last Modified: {time_last_mod}
        </div>
        <div className='badge badge-dark'>
          Path: {path}
        </div>
      </div>      
      
      <div className='card grid-1'>
        <form onSubmit={onSubmit} className='form'>
          <input
            type='submit'
            value='Show Graph'
            className='btn btn-success btn-block'
            disabled={!enabledGraphSearch}
          />
        </form>
      </div>
      
    </Fragment>
  );
}


export default Experiment;
