import React, { useContext } from 'react';
import ExperimentContext from "../context/experiment/experimentContext";
import { openIcon } from "../context/utils";

const JobLog = ({ source, tab }) => {
  const experimentContext = useContext(ExperimentContext);
  const { experiment, joblog, getJobLog } = experimentContext;
  const pathid = source !== undefined ? source.substring(source.lastIndexOf(".")+1) : "undefined";
  //console.log(pathid);
  const onGetJobLog = (e) => {
    e.preventDefault();
    getJobLog(source)
  }

  if (experiment) {
    return (
      <div className="input-group-append">
          <button
            className='btn btn-sm btn-info'
            type='button'
            onClick={onGetJobLog}
            data-toggle='modal'
            data-target={'#joblog'+pathid+'-'+tab}
          >
            <span data-toggle='tooltip' data-placement='bottom' title="Shows the last 150 lines of the corresponding log file.">{openIcon}</span>
            
          </button>
        <div
          className='modal fade text-dark'
          id={'joblog'+pathid+'-'+tab}
          tabIndex='-1'
          role='dialog'
          aria-labelledby='joblogTitle'  
          aria-hidden='true'
        >
          <div className='modal-dialog modal-dialog-log' role='document'>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id='joblogTitle'>
                    Log {source}
                </h5>
              </div>
              <div className="modal-body">                
                {joblog && joblog.found === true && joblog.logcontent && joblog.logcontent.length > 0 && (
                  <pre className="bash mb-0 scroll">
                    <ul style={pStyle} className="p-1 mb-0 ul-2">
                      {joblog.logcontent.map((item) => (
                        <li key={item.index}>
                         <span>{item.content}</span>
                        </li>
                      ))}
                    </ul>
                  </pre>
                )}
                {joblog && joblog.found === true && joblog.logcontent && joblog.logcontent.length === 0 && (
                  <p>
                    The log is empty.
                  </p>
                )}
                {joblog && joblog.found === false && (
                  <p>The log was not found.</p>
                )}
              <div className='text-muted text-center'>
                <span>Showing last 150 lines.</span>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return null;
  }  
}

const pStyle = {
  listStyleType: "none",
};

export default JobLog
