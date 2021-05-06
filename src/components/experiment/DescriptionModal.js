import React, { useContext, useState } from 'react';
import ExperimentContext from "../context/experiment/experimentContext";
import { DEBUG } from "../context/vars";
import { commandGeneratorUpdateDescrip } from "../context/utils";
const DescriptionModal = () => {
  const experimentContext = useContext(ExperimentContext);

  const { 
    experiment,
    currentUpdateDescripCommand,
    setCurrentUpdateDescripCommand,
  } = experimentContext;

  const [text, setText] = useState("");
  const onChange = (e) => setText(e.target.value);

  let expid = null;
  
  if (experiment) expid = experiment.expid;

  const onGetUpdateCommand = (e) => {
    e.preventDefault();
    const command = commandGeneratorUpdateDescrip(expid, text ? text : "New description");
    setCurrentUpdateDescripCommand(command);    
    copyContent(command);
  }



  const copyContent = (inputname) => {
    //e.preventDefault();
    DEBUG && console.log("Sending " + inputname);
    window.copyTextToClipboard(inputname);
  };
  
  if (expid) {
    return (
      <span>
        <span className="p-0 m-0" data-toggle='tooltip' data-placement='bottom' title="Generate a command to change the experiment description." >
          <button
            className='btn btn-sm btn-info my-0 py-0'
            type='button'
            onClick={onGetUpdateCommand}
            data-toggle='modal'                    
            data-target='#updatedescrip_modal'
          >
            Change
          </button>          
        </span>
        <div
          className='modal fade'
          id="updatedescrip_modal" 
          tabIndex='-1'
          role='dialog'
          aria-labelledby="updatedescripTitle"
          aria-hidden='true'
        >
          <div className='modal-dialog modal-dialog-status' role='document'>
            <div className='modal-content'>
              <div className='modal-body pb-1'>
                <div className="row text-dark">
                  <div className="col">
                    <small>Generate a command to change the description of your experiment.</small>
                  </div>                  
                </div>
                <div className='row text-dark'>
                  <div className="col">
                    <form onSubmit={onGetUpdateCommand} className='form'>
                      <div className="input-group input-group-sm">
                        <input 
                        type="text" 
                        name="text"
                        className="form-control py-0"
                        placeholder="Insert your new description and press Enter or click on Set. Works on the latest version of AS."
                        aria-label='Update'
                        value={text}
                        onChange={onChange}/>  
                        <div className="input-group-append">
                          <input 
                          className="btn btn-dark"
                          type="submit"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          value='Set'
                          title="Insert your new description and click."
                          />
                           
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className='row mt-2 mx-1'>
                  <div
                    className='col-12'
                    style={{
                      fontFamily: "Courier",
                      background: "black",
                      color: "white",
                    }}
                  >
                    {currentUpdateDescripCommand && (
                      <div className='p-2' style={{
                        whiteSpace: 'normal',
                      }}>
                        {JSON.parse(JSON.stringify(currentUpdateDescripCommand))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {currentUpdateDescripCommand && currentUpdateDescripCommand.length > 0 && (
                <div className='row mx-1 mb-2 float-left text-dark
                '>
                  <div className='col-12'>
                    <small>The command has been copied to the clipboard. Paste it in your terminal.</small>
                  </div>
                </div>
              )}                
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-sm btn-dark'
                  data-dismiss='modal'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </span>
    )
  } else {
    return null;
  }
  
}

export default DescriptionModal
