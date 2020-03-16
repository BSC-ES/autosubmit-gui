import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ExperimentItem = ({
  experiment: { name, description, user, hpc, status, completed, total }
}) => {
  return (
    <div className='card'>
      <div className='card-header text-center py-1'>
        <div className='row'>
          <div className='col-md-3 text-left'>
            <h3 className='font-weight-bold'>{name}</h3>
          </div>
          <div className='col-md-6 text-right'>
            {" "}
            {completed} / {total}{" "}
            <div className='progress'>
              <div
                class={
                  completed === total
                    ? "progress-bar bg-warning"
                    : status === "RUNNING"
                    ? "progress-bar progress-bar-striped progress-bar-animated bg-success"
                    : "progress-bar bg-info"
                }
                role='progressbar'
                style={{
                  width: total > 0 ? (completed / total) * 100 + "%" : "0%"
                }}
                aria-valuenow={completed}
                aria-valuemin='0'
                aria-valuemax={total}
              ></div>
            </div>
            {/* <span className='badge badge-default'>
              {" "}
              
            </span> */}
          </div>
          <div className='col-md-3 text-right'>
            {status && status === "RUNNING" && (
              <span className='badge badge-success text-right'>{status}</span>
            )}
            {status && status !== "RUNNING" && (
              <span className='badge badge-secondary text-right'>{status}</span>
            )}
          </div>
        </div>
      </div>
      <div className='card-body py-1 pt-2'>
        {/* <h4 className="card-title"></h4> */}
        <h6 className='card-subtitle text-muted'>Owner: {user}</h6>
        <p className='card-text'>{description}</p>
        <Link
          to={`/autosubmitapp/experiment/${name}`}
          className='btn btn-outline-primary btn-block'
        >
          More
        </Link>
        <p className='card-text text-center'>
          <small className='text-muted'>HPC: {hpc}</small>
        </p>
      </div>
    </div>
  );
};

ExperimentItem.propTypes = {
  experiment: PropTypes.object.isRequired
};

export default ExperimentItem;
