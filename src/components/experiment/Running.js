import React, { Component, Fragment } from 'react'

class Running extends Component {
    
    constructor(props) {
        super(props);
        this.rundata = null;
        //this.messagesEnd = null;
        //this.messagesEndRef = React.createRef()
    }

    
    componentDidMount(){
        //console.log(this.props.experimentRunning)
        this.props.getExperimentRun(this.props.experiment.expid);
        if (this.props.experimentRunning) {
            this.interval = setInterval(() => this.props.getExperimentRun(this.props.experiment.expid) , this.props.experiment.updateTime * 1000);
        }     
        //console.log(this.messagesEndRef);
        //this.scrollTo();   
    }

    componentWillUnmount() {
        //console.log(this.props.experimentRunning)
        this.props.cleanRunData();
        if (this.props.experimentRunning) {
            clearInterval(this.interval);
        }        
    }

    componentDidUpdate() {
        window.scrollToBottom();
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
            <div className='row'>
                <div className='col-12'>
                    <div className="row px-1">
                        <div className="col-6 text-left"><small>Logfile: {logfile}</small> <small className="text-muted">({timeStamp})</small></div>
                        <div className="col-6 text-right"><small>Last Modified: {lastModified}</small></div>                        
                    </div>

                    {/* <p><strong>Showing last 50 lines of the log file:</strong></p> */}
                    <pre className="bash mb-0 scroll" id="log_scroll">
                        <ul style={pStyle} className='p-1 mb-0 ul-2'>{logitems}                        
                        </ul>         
                        {/* <div style={{ float:"left", clear: "both" }}
                            ref={this.messagesEndRef}>
                        </div>            */}
                                                     
                    </pre>
                    
                    <div className='text-muted text-center'>
                        <small>Showing last 150 lines.</small>
                    </div>
                    

                </div>
                
                {/* {this.props.startAutoUpdateRun && this.interval &&
                    <div>
                        <form onSubmit={this.onSubmit} className='form'>
                        <input
                        type='submit'
                        value='Stop Live Update'
                        className='btn btn-dark btn-block'
                        // disabled={!enabledGraphSearch}
                        />
                        </form>
                    </div>
                } */}
            </div>
            
        )
    }
}

const pStyle = {
    'listStyleType': 'none',
};


export default Running;