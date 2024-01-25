import { useParams } from "react-router-dom"
import useASTitle from "../hooks/useASTitle"
import useBreadcrumb from "../hooks/useBreadcrumb"
import { autosubmitApiV3 } from "../services/autosubmitApiV3"
import { groupByAndAggregate, secondsToDelta } from "../components/context/utils"
import { exportToCSV } from "../services/utils"


const ExperimentTableView = () => {
  const routeParams = useParams()
  useASTitle(`Experiment ${routeParams.expid}`)
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`
    },
    {
      name: `Table View`,
      route: `/experiment/${routeParams.expid}/table`
    }
  ])

  const { data, isFetching } = autosubmitApiV3.endpoints.getExperimentTreeView.useQuery({
    expid: routeParams.expid
  })

  // Data Wrappers
  const sourceData = (data?.jobs || []).filter(
    item => (item.status === "COMPLETED" || item.status === "RUNNING")
  ).map(item => ({
    Name: item.id,
    Queue: item.minutes_queue,
    Run: item.minutes,
    Status: item.status,
    Section: item.section,
  }))
  const groupedNodes = groupByAndAggregate(sourceData, "Section");

  const exportAggregatedToCSV = () => {
    const exportableData = groupedNodes.map(item => {
      return [
        item.Section,
        item.Count,
        secondsToDelta(item.SumQueue),
        secondsToDelta(item.AverageQueue),
        secondsToDelta(item.SumRun),
        secondsToDelta(item.AverageRun)
      ]
    })
    exportToCSV(
      ["Section", "Count", "Queue Sum", "Average Queue", "Run Sum", "Average Run"],
      exportableData,
      `${(new Date()).toISOString()}_AggregatedJobSections_${routeParams.expid}.csv`
    )
  }

  const exportJobListToCSV = () => {
    const exportableData = sourceData.map(item => {
      return [
        item.Name,
        secondsToDelta(item.Queue),
        secondsToDelta(item.Run),
        item.Status
      ]
    })
    exportToCSV(
      ["Job Name", "Queue", "Run", "Status"],
      exportableData,
      `${(new Date()).toISOString()}_JobList_${routeParams.expid}.csv`
    )
  }

  return (
    <div className="w-100 d-flex flex-column gap-3">
      {
        isFetching ?
          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border" role="status"></div>
          </div>
          :
          <>
            <div>
              <div className="d-flex align-items-center justify-content-between">
                <h3>Aggregated by Job Section</h3>
                <button onClick={exportAggregatedToCSV}
                  className="btn btn-light btn-sm border">
                  Export to CSV
                </button>
              </div>

              <div className="scroll-x">
                <table className='table mt-2 table-sm table-bordered list-table'>
                  <thead className='table-dark'>
                    <tr>
                      <th scope='col'>Section</th>
                      <th scope='col' className='text-right'>
                        Count
                      </th>
                      <th scope='col' className='text-right'>
                        Queue Sum
                      </th>
                      <th scope='col' className='text-right'>
                        Average Queue
                      </th>
                      <th scope='col' className='text-right'>
                        Run Sum
                      </th>
                      <th scope='col' className='text-right'>
                        Average Run
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedNodes.map((item) => (
                      <tr key={item.Section}>
                        <td>
                          <strong>{item.Section}</strong>
                        </td>
                        <td className='text-right'>{item.Count}</td>
                        <td className='text-right'>
                          {secondsToDelta(item.SumQueue)}
                        </td>
                        <td className='text-right'>
                          {secondsToDelta(item.AverageQueue)}
                        </td>
                        <td className='text-right'>
                          {secondsToDelta(item.SumRun)}
                        </td>
                        <td className='text-right'>
                          {secondsToDelta(item.AverageRun)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="d-flex align-items-center justify-content-between">
                <h3>Job List</h3>
                <button onClick={exportJobListToCSV}
                  className="btn btn-light btn-sm border">
                  Export to CSV
                </button>
              </div>

              <div className="scroll-x">
                <table className='table mt-2 table-sm table-bordered list-table scroll-x'>
                  <thead className='table-dark'>
                    <tr>
                      <th scope='col'>Job Name</th>
                      <th scope='col' className='text-right'>
                        Queue
                      </th>
                      <th scope='col' className='text-right'>
                        Run
                      </th>
                      <th scope='col'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sourceData.map((item) => (
                      <tr key={item.Name}>
                        <td>{item.Name}</td>
                        <td className='text-right'>
                          {secondsToDelta(item.Queue)}
                        </td>
                        <td className='text-right'>
                          {secondsToDelta(item.Run)}
                        </td>
                        <td>{item.Status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </>
      }
    </div>
  )
}

export default ExperimentTableView