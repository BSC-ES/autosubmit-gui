import React, { useContext } from 'react';
import ExperimentContext from '../context/experiment/experimentContext';


const TreeControl = ()  => {
    const experimentContext = useContext(ExperimentContext);
    const { experiment, 
            treedata,
            getExperimentTree,
            cleanTreeData,
            enabledGraphSearch } = experimentContext;

    const onSubmitTree = e => {
        e.preventDefault();
        getExperimentTree(experiment.expid);        
    };

    const onClearTree = e => {
        e.preventDefault();
        cleanTreeData();
    }


    return (
        <div className="card-header p-1">
            <div className="row justify-content-end">
                <div className='col-md-2'>
                  {experiment && !treedata &&
                    <form onSubmit={onSubmitTree} className='form'>
                      <input
                        type='submit'
                        value='Show Tree View'
                        className='btn btn-info btn-block btn-sm'
                        disabled={!enabledGraphSearch}
                      />
                    </form>
                  }
                  {experiment && treedata && 
                    <form onSubmit={onClearTree} className='form'>
                      <input
                        type='submit'
                        value='Clear Tree View'
                        className='btn btn-secondary btn-block btn-sm'
                        disabled={!enabledGraphSearch}
                      />
                    </form>
                  }
                  
                </div>
            </div>
        </div>
    )
}

export default TreeControl
