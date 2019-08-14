import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ExperimentItem = ({ experiment: { name, description, user, hpc } }) => {
  return (
    <div className='card text-center'>
      {/* <img
        src={avatar_url}
        alt=''
        className='round-img'
        style={{ width: '60px' }}
      /> */}
      <h3>{name}</h3>
      <p>{description}</p>
      <p><strong>{user}</strong></p>
      <small>{hpc}</small>
      <div>
        <Link to={`/experiment/${name}`} className='btn btn-dark btn-sm my-1'>
          More
        </Link>
      </div>
    </div>
  );
};

ExperimentItem.propTypes = {
  experiment: PropTypes.object.isRequired
};

export default ExperimentItem;
