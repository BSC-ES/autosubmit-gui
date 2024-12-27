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
  const { data: logData, isLoading, isError } = useGetExperimentRunLogQuery(routeParams.expid, {
    pollingInterval: (expData && expData.running) ? 10 * 1000 : false
  })

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight - logRef.current.clientHeight;
    }
  })

  return (
    <div className="w-full flex flex-col border rounded-2xl p-4 min-w-0 dark:bg-neutral-700">
      {
        isLoading ?
          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border" role="status"></div>
          </div>
          :
          <>
            {
              (isError || logData?.error) &&
              <span className="alert alert-danger rounded-4 px-4">
                <i className="fa-solid fa-triangle-exclamation me-2"></i> {logData?.error_message || "Unknown error"}
              </span>
            }
            <div className='w-full px-1 file-info flex justify-between'>
              <div>
                <span>LOG FILE: {logData.logfile}</span>{" "}
                <span className='text-dark dark:text-neutral-300'>({logData.timeStamp})</span>
              </div>
              <div className='text-dark'>
                LAST MODIFIED: {logData.lastModified}
              </div>
            </div>

            <pre ref={logRef} className="bash m-0 overflow-x-scroll overflow-y-auto max-h-[75vh]">
              <ul>
                {
                  logData.logcontent.map((item) => {
                    return (
                      <li key={item.index} className="text-sm">
                        {item.content}
                      </li>
                    )
                  })
                }
              </ul>
            </pre>


            <div className='text-dark dark:text-neutral-300 text-center file-info mt-4'>
              Showing last 150 lines
            </div>
          </>
      }
    </div>
  )
}

export default ExperimentRunLog