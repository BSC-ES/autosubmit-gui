import React, { useContext } from "react";
import ExperimentItem from "./ExperimentItem";
import Spinner from "../layout/Spinner";
import ExperimentContext from "../context/experiment/experimentContext";

const Experiments = () => {
  const experimentContext = useContext(ExperimentContext);
  const { loading, experiments } = experimentContext;
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className='container'>
        <div className='row row-cols-1 row-cols-md-3'>
          {experiments &&
            experiments
              .sort((a, b) => (a.status > b.status ? -1 : 1))
              .map(experiment => (
                <ExperimentItem key={experiment.id} experiment={experiment} />
              ))}
        </div>
      </div>
    );
  }
};

// const experimentStyle = {
//   display: 'grid',
//   gridTemplateColumns: 'repeat(3, 1fr)',
//   gridGap: '1rem'
// };

export default Experiments;
