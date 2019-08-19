import React, { Component, Fragment } from 'react'

class Running extends Component {
    constructor(props) {
        super(props);
        this.rundata = null;
    }
    // componentDidUpdate() {
    //     //console.log(this.props.experiment.updateTime)
    //     // if(this.props.autoUpdateLog) {
    //     //     console.log(this.props.autoUpdateLog)
    //     //     this.interval = setInterval(() => this.props.getExperimentRun(this.props.experiment.expid) , this.props.experiment.updateTime);
    //     // }        
    // }

    componentDidMount(){
        this.props.getExperimentRun(this.props.experiment.expid);
        this.interval = setInterval(() => this.props.getExperimentRun(this.props.experiment.expid) , this.props.experiment.updateTime * 1000);
        // if (this.props.rundata){
        //     console.log('DidMount Running.')
        // }
    }

    componentWillUnmount() {
        this.props.cleanRunData();
        clearInterval(this.interval);
    }
    
    
    render() {

        if (this.props.rundata === null){
            return (
              <Fragment>
                <div>Loading...</div>
              </Fragment>
            );       
          }

        const { logcontent,
        error,
        error_message,
        found,
        logfile,
        lastModified,
        timeStamp} = this.props.rundata;

        const logitems = logcontent.map((item) =>
            <li key={item.index}><small>{item.content}</small></li>
        );
        
        if (error) {
            return (
                <Fragment>
                    <div>{error_message}</div>
                    <br></br>
                    <hr></hr>
                </Fragment>
                
            );
        }
        if (!found) {
            return (
                <Fragment>
                    <div>Running log not found. This experiment might not be currently running on Autosubmit.</div>
                    <br></br>
                    <hr></hr>
                </Fragment>                
            );
        }

        return (
            <div>
                <h3>Logfile: {logfile}</h3>
                <p>Last Modified: {lastModified}</p>
                <p><small>TimeStamp: {timeStamp}</small></p>
                <p><strong>Showing last 40 lines of the log file:</strong></p>
                <pre className="bash">
                    <ul style={pStyle}>{logitems}</ul>                    
                </pre>
                <br></br>
                <h3>End of log file.</h3>
                <br></br>
            </div>
        )
    }
}

const pStyle = {
    'listStyleType': 'none',
};


export default Running;