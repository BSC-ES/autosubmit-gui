import React, { useContext } from "react";
//import ExperimentContext from "../context/experiment/experimentContext";
import GraphContext from "../context/graph/graphContext";
import {
  WaitingCode,
  waitingColor,
  UnknownCode,
  unknownColor,
  SuspendedCode,
  suspendedColor,
  QueueCode,
  queueColor,
  FailedCode,
  failedColor,
  HoldCode,
  holdColor,
  CompletedCode,
  completedColor,
  SubmittedCode,
  submittedColor,
  RunningCode,
  runningColor,
  ReadyCode,
  readyColor,
  PreparedCode,
  preparedColor,
  SkippedCode,
  skippedColor,
} from "../context/vars";

const Navigator = () => {
  //const experimentContext = useContext(ExperimentContext);
  const graphContext = useContext(GraphContext);
  const { navToLatest } = graphContext;

  const onLatest = (statusCode, latest = true) => (e) => {
    e.preventDefault();
    navToLatest(statusCode, latest); // Completed
  };

  return (
    <div className="row p-1">
      <div className="col-12">
        <label className="px-2" htmlFor="navigation-group">Navigation buttons:</label>
        <div className="btn-group" role="group" id="navigation-group">
          <button className="btn btn-sm btn-secondary" type="button" onClick={onLatest(WaitingCode, false)} style={waitingColor}>Waiting</button>
          <button className="btn btn-sm btn-secondary" type="button" onClick={onLatest(ReadyCode)} style={readyColor}>Ready</button>
          <button className="btn btn-sm btn-secondary" type="button" onClick={onLatest(PreparedCode)} style={preparedColor}>Prepared</button>  
        </div>
        <div className="btn-group px-1" role="group">        
          <button className="btn btn-sm btn-secondary" type="button" onClick={onLatest(SubmittedCode)} style={submittedColor}>Submitted</button>
          <button className="btn btn-sm btn-secondary" type="button" onClick={onLatest(QueueCode)} style={queueColor}>Queuing</button>
          <button className="btn btn-sm btn-secondary" type="button" onClick={onLatest(RunningCode)} style={runningColor}>Running</button>
          <button className="btn btn-sm btn-secondary" type="button" onClick={onLatest(CompletedCode)} style={completedColor}>Completed</button>
        </div>
        <div className="btn-group" role="group"> 
          <button className="btn btn-sm btn-secondary" type="button" onClick={onLatest(FailedCode)} style={failedColor}>Failed</button>
          <button className="btn btn-sm btn-secondary" type="button" onClick={onLatest(SuspendedCode)} style={suspendedColor}>Suspended</button>
          <button className="btn btn-sm btn-secondary" type="button" onClick={onLatest(UnknownCode)} style={unknownColor}>Unknown</button>
          <button className="btn btn-sm btn-secondary" type="button" onClick={onLatest(HoldCode)} style={holdColor}>Hold</button>
          <button className="btn btn-sm btn-secondary" type="button" onClick={onLatest(SkippedCode)} style={skippedColor}>Skipped</button>
        </div>
      </div>
      
    </div>
  )

  // return (
  //   <div className='row card-body py-1'>

  //     <div className='col-1 px-1'>
  //       <form onSubmit={onLatest(WaitingCode, false)} className='form'>
  //         <input
  //           type='submit'
  //           value='Waiting'
  //           className='btn btn-block btn-sm'
  //           style={waitingColor}
  //         />
  //       </form>
  //     </div>
  //     <div className='col-1 px-1'>
  //       <form onSubmit={onLatest(ReadyCode)} className='form'>
  //         <input
  //           type='submit'
  //           value='Ready'
  //           className='btn btn-block btn-sm'
  //           style={readyColor}
  //         />
  //       </form>
  //     </div>
  //     <div className='col-1 px-1'>
  //       <form onSubmit={onLatest(PreparedCode)} className='form'>
  //         <input
  //           type='submit'
  //           value='Prepared'
  //           className='btn btn-block btn-sm'
  //           style={preparedColor}
  //         />
  //       </form>
  //     </div>
  //     <div className='col-1 px-1'>
  //       <form onSubmit={onLatest(SubmittedCode)} className='form'>
  //         <input
  //           type='submit'
  //           value='Submitted'
  //           className='btn btn-block btn-sm'
  //           style={submittedColor}
  //         />
  //       </form>
  //     </div>
  //     <div className='col-1 px-1'>
  //       <form onSubmit={onLatest(QueueCode)} className='form'>
  //         <input
  //           type='submit'
  //           value='Queue'
  //           className='btn btn-block btn-sm'
  //           style={queueColor}
  //         />
  //       </form>
  //     </div>
  //     <div className='col-1 px-1'>
  //       <form onSubmit={onLatest(RunningCode)} className='form'>
  //         <input
  //           type='submit'
  //           value='Running'
  //           className='btn btn-block btn-sm'
  //           style={runningColor}
  //         />
  //       </form>
  //     </div>
  //     <div className='col-1 px-1'>
  //       <form onSubmit={onLatest(CompletedCode)} className='form'>
  //         <input
  //           type='submit'
  //           value='Completed'
  //           className='btn btn-block btn-sm'
  //           style={completedColor}
  //         />
  //       </form>
  //     </div>
  //     <div className='col-1 px-1'>
  //       <form onSubmit={onLatest(FailedCode)} className='form'>
  //         <input
  //           type='submit'
  //           value='Failed'
  //           className='btn btn-block btn-sm'
  //           style={failedColor}
  //         />
  //       </form>
  //     </div>
  //     <div className='col-1 px-1'>
  //       <form onSubmit={onLatest(SuspendedCode)} className='form'>
  //         <input
  //           type='submit'
  //           value='Suspended'
  //           className='btn btn-block btn-sm'
  //           style={suspendedColor}
  //         />
  //       </form>
  //     </div>
  //     <div className='col-1 px-1'>
  //       <form onSubmit={onLatest(UnknownCode)} className='form'>
  //         <input
  //           type='submit'
  //           value='Unknown'
  //           className='btn btn-block btn-sm'
  //           style={unknownColor}
  //         />
  //       </form>
  //     </div>
  //     <div className='col-1 px-1'>
  //       <form onSubmit={onLatest(HoldCode)} className='form'>
  //         <input
  //           type='submit'
  //           value='Hold'
  //           className='btn btn-block btn-sm'
  //           style={holdColor}
  //         />
  //       </form>
  //     </div>
  //     <div className='col-1 px-1 text-left'>
  //       {/* <small>job with that status.</small> */}
  //       <small> &#8592; CLICKABLE </small>
  //     </div>
  //   </div>
  // );
};

export default Navigator;
