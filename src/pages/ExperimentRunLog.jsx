import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetExperimentInfoQuery, useGetExperimentRunLogQuery } from "../services/autosubmitApiV3";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";


const ExperimentRunLog = () => {
  const routeParams = useParams()
  useASTitle(`Experiment ${routeParams.expid} run log`)
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`
    },
    {
      name: `Run Log`,
      route: `/experiment/${routeParams.expid}/runlog`
    }
  ])
  const logRef = useRef()
  const { data: expData } = useGetExperimentInfoQuery(routeParams.expid)
  const { data: logData, isLoading } = useGetExperimentRunLogQuery(routeParams.expid, {
    pollingInterval: (expData && expData.running) ? 10 * 1000 : false
  })

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight - logRef.current.clientHeight;
    }
  })

  return (
    <div className="card rounded-4 p-4 w-100">
      {
        isLoading ?
          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border" role="status"></div>
          </div>
          :
          <>
            <div className='row px-1 file-info'>
              <div className='col-6'>
                <span>LOG FILE: {logData.logfile}</span>{" "}
                <span className='text-muted'>({logData.timeStamp})</span>
              </div>
              <div className='col-6 text-end text-muted'>
                LAST MODIFIED: {logData.lastModified}
              </div>
            </div>

            <pre ref={logRef} className="bash scroll m-0" style={{ overflowX: "scroll" }}>
              <ul style={{ listStyleType: "none" }} className='p-1 mb-0'>
                {
                  logData.logcontent.map((item) => {
                    return (
                      <li key={item.index}>
                        <small>{item.content}</small>
                      </li>
                    )
                  })
                }
              </ul>
            </pre>

            <div className='text-muted text-center file-info mt-3'>
              Showing last 150 lines
            </div>
          </>
      }
    </div>
  )
}

export default ExperimentRunLog