import React from 'react';
import { readyColor } from '../context/vars';

const ReadyJobs = ({readyJobs, source}) => {
  // console.log(readyJobs);
  let classCard = "card scroll-ready-tree";
  if (source && source === "graph"){
    classCard = "card scroll-ready-graph";
  } 

  if (!readyJobs){
    return null;
  }
  return (
    <div className={classCard}>
      <div className="card-body">     
          {readyJobs && readyJobs.map((item, index) => (
            <div key={index}>
              <span className="badge my-0" style={readyColor}>{item.name}</span><br></br>
            </div>            
          ))}     
      </div>
    </div>
  )
}

export default ReadyJobs;
