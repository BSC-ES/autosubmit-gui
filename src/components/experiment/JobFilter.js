import React, { useContext, useState } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';

const JobFilter = () => {
    
    const experimentContext = useContext(ExperimentContext);
    const { filterTreeView, 
            treedata,
            loadingFilterTree,
            clearFilterTreeView,
            returnFilter} = experimentContext;        
    
    const [filterString, setFilterString] = useState('');  
    const onSubmit = e => {
        e.preventDefault();        
        filterTreeView(filterString);        
    }

    const onChangeFilter = e => setFilterString(e.target.value);
    const onClearFilter = e => {
        e.preventDefault();
        clearFilterTreeView();
    }

    var clearText = "Clear"
    if (returnFilter && returnFilter >= 0){
        clearText = "Clear Result"
    }

    return (
        <div className="row">
            <div className="col-md-4 pr-1">
                <form onSubmit={onSubmit} className='form' autoComplete="off">
                    <div className="input-group input-group-sm">                      
                        <input
                            className="form-control"
                            type='text'
                            name='section'
                            placeholder='Filter text'
                            onChange={onChangeFilter}                          
                        />
                        {loadingFilterTree && 
                            <span>Searching...</span>
                        }
                        {!loadingFilterTree && 
                            <div className="input-group-append">
                            <input          
                            type='submit'
                            value='Filter'
                            className='btn btn-dark btn-sm'                            
                            />
                        </div>                                  
                        }                    
                    </div>
                </form>
            </div> 
            <div className="col-md-4 text-left pl-1">                
                <form onSubmit={onClearFilter} className='form'>
                    <input
                    type='submit'
                    value={clearText}
                    className="btn btn-info btn-sm"
                    />
                </form>
            </div>                         
            <div className="col-md-4 text-right text-muted pr-4">
                {treedata && treedata.jobs && 
                    <small>Total #Jobs: {treedata.total}</small>
                }
            </div>         
        </div>
    )
};

export default JobFilter;
