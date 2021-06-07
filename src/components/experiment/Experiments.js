import React, { useContext, useEffect } from "react";
import ExperimentItem from "./ExperimentItem";
import Spinner from "../layout/Spinner";
import ExperimentContext from "../context/experiment/experimentContext";
import Pagination from "./Pagination";


const Experiments = () => {
  const experimentContext = useContext(ExperimentContext);
  const { loading, experiments, summaries, loadingSummary, getExperimentSummary, currentPage, setPaginatedResult, experimentsInPage } = experimentContext;

  const isLoading = (loadingSummaries, name) => {    
    if (loadingSummaries && name){
      if (loadingSummaries.has(name)){
        // console.log(name + ' is loading.');
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (experiments){
      setPaginatedResult();
    }    
    // eslint-disable-next-line
  }, [experiments, currentPage])

  


  if (loading) {
    return <Spinner />;
  } else {
    // Render one Experiment Item for each item in experiments.
    // Order them by status so the ACTIVE ones are shown first.
    return (
      <div className='container'>      
        <div className="row">
          <div className="col">
            <Pagination />
          </div>          
        </div>  
        <div className='row row-cols-1 row-cols-md-3'>
          {experimentsInPage &&
            experimentsInPage
              .sort((a, b) => (a.status > b.status ? -1 : 1))
              .map(experiment => (
                <ExperimentItem key={experiment.id} experiment={experiment} summaries={summaries} isLoading={isLoading(loadingSummary, experiment.name)} getExperimentSummary={getExperimentSummary} />
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
