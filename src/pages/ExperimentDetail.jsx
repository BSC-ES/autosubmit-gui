import { useNavigate, useParams } from "react-router-dom"
import useASTitle from "../hooks/useASTitle"
import useBreadcrumb from "../hooks/useBreadcrumb"
import { useEffect } from "react"


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

    useEffect(()=>{
        navigate(`/experiment/${routeParams.expid}/quick`)
    })


    return (
        <div>
            
        </div>
    )
}

export default ExperimentDetail