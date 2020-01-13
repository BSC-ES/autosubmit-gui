import React, { useContext } from 'react';
import ExperimentItem from './ExperimentItem';
import Spinner from '../layout/Spinner';
import ExperimentContext from '../context/experiment/experimentContext';

const Experiments = () => {
  const experimentContext = useContext(ExperimentContext);
  const { loading, experiments } = experimentContext;
    if(loading) {
      return <Spinner />
    } else {
      return (
        <div className="container">
          <div className="card-columns">
            {experiments && experiments.map(experiment => (
              <ExperimentItem key={experiment.id} experiment={experiment} />
            ))}
          </div>
        </div>        
      );
    }
}

// const experimentStyle = {
//   display: 'grid',
//   gridTemplateColumns: 'repeat(3, 1fr)',
//   gridGap: '1rem'
// };

export default Experiments;
