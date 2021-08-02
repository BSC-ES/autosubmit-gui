import React, { useContext, useEffect } from "react";
import ExperimentItem from "./ExperimentItem";
import Spinner from "../layout/Spinner";
import ExperimentContext from "../context/experiment/experimentContext";
import Pagination from "./Pagination";
import { orderByType } from "../context/vars";


const Experiments = () => {
  const experimentContext = useContext(ExperimentContext);
  const { loading, 
    experiments, 
    summaries, 
    loadingSummary, 
    getExperimentSummary, 
    currentPage, 
    setPaginatedResult, 
    experimentsInPage, 
    orderExperimentsInResult, 
    pageSetup, 
    currentOrderType,
    activeInactiveFilter,
    typeFilter,
    currentSearchString } = experimentContext;

  const isLoading = (loadingSummaries, name) => {    
    if (loadingSummaries && name){
      if (loadingSummaries.has(name)){
        // console.log(name + ' is loading.');
        return true;
      }
    }
    return false;
  }

  const onOrderBy = (orderType) => (e) => {
    e.preventDefault();
    orderExperimentsInResult(orderType);
  }

  useEffect(() => {
    if (experiments){
      setPaginatedResult();
    }    
    // eslint-disable-next-line
  }, [experiments, currentPage, pageSetup])  

  if (loading) {
    return <Spinner />;
  } else {
    // Render one Experiment Item for each item in experiments.
    // Order them by status so the ACTIVE ones are shown first.
    const totalCount = experiments ? experiments.length : 0;
    const filteredCount = experiments ? experiments.filter(x => x.hidden === false).length : 0;

    return (      
      <div className='container'>      
        <div className="d-flex flex-wrap row-hl">
            <Pagination />
            {experimentsInPage && experimentsInPage.length > 0 && (
              <div className="item-hl ml-auto mb-1">
                Order By:{" "}
                <div className="btn-group" role="group" aria-label="Order">                  
                  <button type="button" className="btn btn-primary btn-sm" onClick={onOrderBy(currentOrderType === orderByType.total ? orderByType.total_asc : orderByType.total)}>Total Jobs {currentOrderType === orderByType.total ? <span>&#8595;</span> : <span>&#8593;</span>}</button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={onOrderBy(currentOrderType === orderByType.completed ? orderByType.completed_asc : orderByType.completed)}>Completed Jobs {currentOrderType === orderByType.completed ? <span>&#8595;</span> : <span>&#8593;</span>}</button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={onOrderBy(currentOrderType === orderByType.name ? orderByType.name_asc : orderByType.name)}>Name {currentOrderType === orderByType.name ? <span>&#8595;</span> : <span>&#8593;</span>}</button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={onOrderBy(orderByType.queuing)}>Queuing Jobs</button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={onOrderBy(orderByType.running)}>Running Jobs</button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={onOrderBy(orderByType.failed)}>Failed Jobs</button>   
                  <button type="button" className="btn btn-primary btn-sm" onClick={onOrderBy(orderByType.wrapper)}>Wrapper</button>               
                </div>
              </div>
            )}
        </div>
        
        
        <div className='row row-cols-1 row-cols-md-3'>
          {experimentsInPage && experimentsInPage.length > 0 && 
            experimentsInPage.filter(x => x.hidden === false)
              .map(experiment => (
                <ExperimentItem key={experiment.id} experiment={experiment} summaries={summaries} isLoading={isLoading(loadingSummary, experiment.name)} getExperimentSummary={getExperimentSummary} />
              ))}
        </div>
        <div className="row">          
            <div className="col">                
              {/* {(experimentsInPage || experimentsInPage.length <= 0) && currentSearchString && <span className="px-1 bg-secondary text-dark rounded">No results.</span>} */}
              {currentSearchString ? 
              <span className="px-1 ml-1 bg-secondary text-dark rounded"> 
                {(experimentsInPage && filteredCount > 0) ? 
                <span>Considering <strong>{filteredCount}</strong> of  <strong>{totalCount}</strong> results for: <i>{currentSearchString}</i></span> 
                : <i>No results</i>} 
              </span> 
              : <span className="px-1 ml-1 bg-secondary text-dark rounded">
                {(experimentsInPage && filteredCount > 0) ? 
                <span>Considering <strong>{filteredCount}</strong> of  <strong>{totalCount}</strong> active experiments</span> 
                : <i>No results</i>}
                </span>
              }                
              {typeFilter && <span className="px-1 ml-1 bg-secondary text-dark rounded">Type of Experiment: <strong>{typeFilter}</strong></span>}  
              {activeInactiveFilter && <span className="px-1 ml-1 bg-secondary text-dark rounded">Status: <strong>{activeInactiveFilter}</strong></span>}               
              {currentOrderType && <span className="px-1 ml-1 bg-secondary text-dark rounded">Ordered by: <strong>{currentOrderType}</strong></span>}               
            </div>          
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
