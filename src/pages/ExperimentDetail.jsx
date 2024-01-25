import { useNavigate, useParams } from "react-router-dom"
import useASTitle from "../hooks/useASTitle"
import useBreadcrumb from "../hooks/useBreadcrumb"
import { useEffect } from "react"
import { useGetExperimentInfoQuery } from "../services/autosubmitApiV3"


const ExperimentDetail = () => {
    const routeParams = useParams()
    useASTitle(`Experiment ${routeParams.expid}`)
    useBreadcrumb([
        {
            name: `Experiment ${routeParams.expid}`,
            route: `/experiment/${routeParams.expid}`
        }
    ])
    const navigate = useNavigate()
    const { data } = useGetExperimentInfoQuery(routeParams.expid)


    useEffect(() => {
        navigate(`/experiment/${routeParams.expid}/quick`)
    })


    return (
        <div>
            <div className="border rounded-4 py-3 px-4 mb-3 bg-light d-flex flex-wrap gap-3 justify-content-between">
                <div title="Description"
                    style={{ textOverflow: "ellipsis", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                    <i className="fa-solid fa-quote-left me-3" /> {data?.description || "-"}
                </div>
                <div title="User">
                    <i className="fa-solid fa-user me-3" /> {data?.owner || "-"}
                </div>
                <div title="HPC">
                    <i className="fa-solid fa-computer me-3" /> {data?.hpc || "-"}
                </div>
                <div title="Autosubmit version">
                    <i className="fa-solid fa-code-branch me-3" /> {((data?.version) && ("Autosubmit v" + data.version)) || "-"}
                </div>
            </div>

        </div>
    )
}

export default ExperimentDetail