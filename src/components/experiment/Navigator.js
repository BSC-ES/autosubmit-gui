import React, { useContext } from "react";
import ExperimentContext from "../context/experiment/experimentContext";

const Navigator = () => {
  const experimentContext = useContext(ExperimentContext);
  const { navToLatest } = experimentContext;

  const WaitingCode = 0;
  const UnknownCode = -2;
  const SuspendedCode = -3;
  const QueueCode = 3;
  const FailedCode = -1;
  const HoldCode = 6;
  const CompletedCode = 5;
  const SubmittedCode = 2;
  const RunningCode = 4;
  const ReadyCode = 1;
  const PreparedCode = 7;

  const queueColor = {
    background: "lightpink",
    fontWeight: "bold",
  };
  const failedColor = {
    background: "red",
    fontWeight: "bold",
    color: "white",
  };
  const completedColor = {
    background: "yellow",
    fontWeight: "bold",
  };
  const submittedColor = {
    background: "cyan",
    fontWeight: "bold",
  };
  const runningColor = {
    background: "green",
    fontWeight: "bold",
    color: "white",
  };
  const readyColor = {
    background: "lightblue",
    fontWeight: "bold",
  };
  const waitingColor = {
    background: "gray",
    fontWeight: "bold",
    color: "white",
  };
  const unknownColor = {
    background: "white",
    color: "black",
    fontWeight: "bold",
  };
  const suspendedColor = {
    background: "orange",
    fontWeight: "bold",
    color: "white",
  };
  const holdColor = {
    background: "salmon",
    fontWeight: "bold",
    color: "white",
  };
  const preparedColor = {
    background: "lightsalmon",
    fontWeight: "bold",
  };

  const onLatest = (statusCode, latest = true) => (e) => {
    e.preventDefault();
    navToLatest(statusCode, latest); // Completed
  };

  return (
    <div className='row card-body py-1'>
      <div className='col-1 px-1'>
        <form onSubmit={onLatest(WaitingCode, false)} className='form'>
          <input
            type='submit'
            value='Waiting'
            className='btn btn-block btn-sm'
            style={waitingColor}
          />
        </form>
      </div>
      <div className='col-1 px-1'>
        <form onSubmit={onLatest(ReadyCode)} className='form'>
          <input
            type='submit'
            value='Ready'
            className='btn btn-block btn-sm'
            style={readyColor}
          />
        </form>
      </div>
      <div className='col-1 px-1'>
        <form onSubmit={onLatest(PreparedCode)} className='form'>
          <input
            type='submit'
            value='Prepared'
            className='btn btn-block btn-sm'
            style={preparedColor}
          />
        </form>
      </div>
      <div className='col-1 px-1'>
        <form onSubmit={onLatest(SubmittedCode)} className='form'>
          <input
            type='submit'
            value='Submitted'
            className='btn btn-block btn-sm'
            style={submittedColor}
          />
        </form>
      </div>
      <div className='col-1 px-1'>
        <form onSubmit={onLatest(QueueCode)} className='form'>
          <input
            type='submit'
            value='Queue'
            className='btn btn-block btn-sm'
            style={queueColor}
          />
        </form>
      </div>
      <div className='col-1 px-1'>
        <form onSubmit={onLatest(RunningCode)} className='form'>
          <input
            type='submit'
            value='Running'
            className='btn btn-block btn-sm'
            style={runningColor}
          />
        </form>
      </div>
      <div className='col-1 px-1'>
        <form onSubmit={onLatest(CompletedCode)} className='form'>
          <input
            type='submit'
            value='Completed'
            className='btn btn-block btn-sm'
            style={completedColor}
          />
        </form>
      </div>
      <div className='col-1 px-1'>
        <form onSubmit={onLatest(FailedCode)} className='form'>
          <input
            type='submit'
            value='Failed'
            className='btn btn-block btn-sm'
            style={failedColor}
          />
        </form>
      </div>
      <div className='col-1 px-1'>
        <form onSubmit={onLatest(SuspendedCode)} className='form'>
          <input
            type='submit'
            value='Suspended'
            className='btn btn-block btn-sm'
            style={suspendedColor}
          />
        </form>
      </div>
      <div className='col-1 px-1'>
        <form onSubmit={onLatest(UnknownCode)} className='form'>
          <input
            type='submit'
            value='Unknown'
            className='btn btn-block btn-sm'
            style={unknownColor}
          />
        </form>
      </div>
      <div className='col-1 px-1'>
        <form onSubmit={onLatest(HoldCode)} className='form'>
          <input
            type='submit'
            value='Hold'
            className='btn btn-block btn-sm'
            style={holdColor}
          />
        </form>
      </div>
      <div className='col-1 px-1 text-left'>
        {/* <small>job with that status.</small> */}
        <small> &#8592; CLICKABLE </small>
      </div>
    </div>
  );
};

export default Navigator;
