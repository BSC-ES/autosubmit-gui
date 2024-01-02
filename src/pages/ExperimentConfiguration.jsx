import { useParams } from "react-router-dom";
import { useGetExperimentConfigurationQuery } from "../services/autosubmitApiV3";
import useASTitle from "../hooks/useASTitle";
import { useEffect, useState } from "react";
import useBreadcrumb from "../hooks/useBreadcrumb";

const alertDifferenceSpan = (
  <small>
    <span
      className='badge bg-warning text-white m-1'
      title='Difference detected'
    >!</span>
  </small>
);


const ConfigTableGen = ({ config, prefix, differences }) => {
  const [configValues, setConfigValues] = useState({})
  const [configChilds, setConfigChilds] = useState({})

  useEffect(() => {
    let _newValues = {}
    let _newChilds = {}
    if (config) {
      Object.keys(config).forEach(key => {
        if (typeof (config[key]) === 'object') {
          _newChilds[key] = config[key]
        } else {
          _newValues[key] = config[key]
        }
      })
      setConfigChilds(_newChilds)
      setConfigValues(_newValues)
    }
  }, [config])

  return (
    <>
      {
        configValues && Object.keys(configValues).length > 0 &&
        <div className="configuration-section card border-0">
          {
            prefix && <div className="configuration-section-title">
              [{prefix}]
              {
                differences.has(prefix) &&
                <>
                  {" "}
                  {alertDifferenceSpan}
                </>
              }
            </div>
          }
          <table className='table table-sm table-fixed list-table'>
            <thead className='table-dark'>
              <tr>
                <th scope='col'>Setting</th>
                <th scope='col'>Value</th>
              </tr>
            </thead>
            <tbody>
              {
                Object.keys(configValues).map(key => {
                  return (
                    <tr key={key}>
                      <td>
                        {key}
                      </td>
                      <td>
                        {['string', 'number'].includes(typeof (config[key])) ? config[key] : JSON.stringify(config[key])}
                        {
                          differences.has((prefix ? prefix + "." : "") + key) &&
                          <>
                            {" "}
                            {alertDifferenceSpan}
                          </>
                        }
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      }
      {
        config && Object.keys(configChilds).map(key => {
          let title = (prefix ? prefix + "." : "") + key
          return (
            <>
              <ConfigTableGen key={title} config={config[key]} prefix={title} differences={differences} />
            </>
          )
        })
      }
    </>
  )
}

const ExperimentConfiguration = () => {
  const routeParams = useParams()
  useASTitle(`Experiment ${routeParams.expid} configuration`)
  useBreadcrumb([
    {
        name: `Experiment ${routeParams.expid}`,
        route: `/experiment/${routeParams.expid}`
    },
    {
        name: `Configuration`,
        route: `/experiment/${routeParams.expid}/config`
    }
])
  const { data, isFetching } = useGetExperimentConfigurationQuery(routeParams.expid)

  return (
    <div className="w-100">
      {/* <div className="d-flex flex-row-reverse mb-3 gap-3 align-items-center">
        <button className="btn btn-success fw-bold text-white px-5" onClick={() => { refetch() }}>REFRESH</button>
      </div> */}
      {
        isFetching ?
          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border" role="status"></div>
          </div>
          :
          <>
            <div className='row'>
              <div className='col-md-6'>
                <div className='text-center header-information-space-sm configuration-source-info'>
                  <span>Current Run Configuration (Historical Database)</span>
                </div>
                <ConfigTableGen config={data.configuration_current_run} differences={new Set(data.differences)} />
              </div>
              <div className='col-md-6'>
                <div className='text-center header-information-space-sm configuration-source-info'>
                  <span>Current FileSystem Configuration</span>
                </div>
                <ConfigTableGen config={data.configuration_filesystem} differences={new Set(data.differences)} />
              </div>
            </div>
          </>
      }
    </div>
  )
}

export default ExperimentConfiguration