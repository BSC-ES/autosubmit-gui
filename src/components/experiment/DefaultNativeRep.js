import React from 'react'

export default function DefaultNativeRep() {
    return (
        <div className="card-body text-left">
            <p className='lead'>Press <span className='badge badge-info'>Show Graph</span> to see the graph representation of the experiment.</p>
            <p className='lead'>If the experiment is <span className='badge badge-success'>RUNNING</span> and the Graph has been rendered, press <span className='badge badge-dark'>Start Job Monitor</span> to start a live tracker of the changes on the experiment's jobs.
                This process will automatically update the graph's nodes colors and show a log of the detected changes.
            </p>
        </div> 
)
}
