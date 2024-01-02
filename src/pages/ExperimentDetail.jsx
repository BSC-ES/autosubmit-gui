import { useParams } from "react-router-dom"
import useASTitle from "../hooks/useASTitle"
import useBreadcrumb from "../hooks/useBreadcrumb"


const ExperimentDetail = () => {
    const routeParams = useParams()
    useASTitle(`Experiment ${routeParams.expid}`)
    useBreadcrumb([
        {
            name: `Experiment ${routeParams.expid}`,
            route: `/experiment/${routeParams.expid}`
        }
    ])


    return (
        <div>
            Hola detail
        </div>
    )
}

export default ExperimentDetail