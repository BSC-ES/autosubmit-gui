import { useParams } from "react-router-dom"
import { useGetExperimentQuickViewQuery } from "../services/autosubmitApiV3"
import FancyTree from "../common/FancyTree"
import { useEffect, useState } from "react"
import { MAX_ITEMS_QUICK_VIEW } from '../consts'
import useASTitle from "../hooks/useASTitle"
import useBreadcrumb from "../hooks/useBreadcrumb"

/**
 * Filter the jobs received in the Quick View
 * @param {Array} baseData - Base Data
 * @param {string} filterText - Filter text. It can include ! at the begining for negation and * as a wildcard
 * @param {string} filterStatus - Posible values: ANY|COMPLETED|FAILED|RUNNING|QUEUING
 * @returns {Array}
 */
const filterQuickView = (baseData, filterText, filterStatus) => {

    let filterNorm = String(filterText).toUpperCase()

    const isNegation = filterNorm.indexOf('!') === 0;
    if (isNegation) {
        filterNorm = filterNorm.substring(1)
    }

    const fields = filterNorm.split("*")

    const newJobs = baseData.filter(item => {
        // Filter by status
        let flagStatus = true
        if (filterStatus !== "ANY") {
            flagStatus = (item.status === filterStatus)
        }

        // Filter by text
        let flagText = true
        let stringTest = String(item.refKey).toUpperCase();
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].length > 0) {
                if (stringTest.indexOf(fields[i]) > -1) {
                    let foundIndex = stringTest.indexOf(fields[i]) + fields[i].length;
                    stringTest = stringTest.substring(foundIndex);
                } else {
                    flagText = false
                    break
                }
            }
        }

        // Use negation
        if (isNegation) {
            return !flagText && flagStatus
        } else {
            return flagText && flagStatus
        }
    })

    return newJobs;
}


const ExperimentQuick = () => {
    const routeParams = useParams()
    useASTitle(`Experiment ${routeParams.expid} quick view`)
    useBreadcrumb([
        {
            name: `Experiment ${routeParams.expid}`,
            route: `/experiment/${routeParams.expid}`
        },
        {
            name: `Quick View`,
            route: `/experiment/${routeParams.expid}/quick`
        }
    ])
    const [filters, setFilters] = useState({
        status: "ANY",
        filter: ""
    })
    const [jobs, setJobs] = useState([])
    const { data, isFetching, refetch } = useGetExperimentQuickViewQuery(routeParams.expid)

    useEffect(() => {
        if (data && Array.isArray(data.tree_view)) {
            let newJobs = filterQuickView(data.tree_view, filters.filter, filters.status)
            newJobs = newJobs.slice(0, MAX_ITEMS_QUICK_VIEW)
            setJobs(newJobs)
        }
    }, [data, filters])

    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            filter: event.target.value
        })
    }

    const handleStatusChange = (event) => {
        setFilters({
            ...filters,
            status: event.target.value
        })
    }

    return (
        <div className="w-100 d-flex flex-column">
            <div className="d-flex mb-3 gap-3 align-items-center flex-wrap">
                <div style={{ minWidth: "12rem" }}>
                    <select value={filters.status} onChange={handleStatusChange}
                        className="form-select border border-primary text-primary fw-bold text-center">
                        <option value="ANY">TOTAL ({(data && data.total) || 0})</option>
                        <option value="COMPLETED">COMPLETED ({(data && data.completed) || 0})</option>
                        <option value="FAILED">FAILED ({(data && data.failed) || 0})</option>
                        <option value="RUNNING">RUNNING ({(data && data.running) || 0})</option>
                        <option value="QUEUING">QUEUING ({(data && data.queuing) || 0})</option>
                    </select>
                </div>
                <div className="flex-fill">
                    <input value={filters.filter} onChange={handleFilterChange}
                        className="form-control" placeholder="Filter job..." />
                    {/* <button className="btn btn-dark fw-bold px-4">Filter</button> */}
                </div>
                <div className="small" style={{ whiteSpace: "nowrap" }}>
                    Showing {jobs.length} of <strong>{data && data.tree_view && data.tree_view.length} total jobs</strong>
                </div>
                <button className="btn btn-success fw-bold text-white"
                    title="Refresh data"
                    onClick={() => { refetch() }}>
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
            </div>
            <div className="border rounded-4 p-3 flex-fill">
                <div className="overflow-y-auto h-100" style={{ maxHeight: "75vh" }}>
                    {
                        isFetching ?
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                <div className="spinner-border" role="status"></div>
                            </div>
                            :
                            <FancyTree treeData={jobs}></FancyTree>

                    }
                </div>
            </div>
        </div>
    )
}

export default ExperimentQuick