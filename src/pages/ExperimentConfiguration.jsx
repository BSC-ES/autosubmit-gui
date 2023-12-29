import { useParams } from "react-router-dom";
import { useGetExperimentConfigurationQuery } from "../services/autosubmitApiV3";


const ExperimentConfiguration = () => {
    const routeParams = useParams()
    const { data, isLoading } = useGetExperimentConfigurationQuery(routeParams.expid)

    return (
        <div>
            {
                isLoading ?
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <div className="spinner-border" role="status"></div>
                    </div>
                    :
                    JSON.stringify(data)
            }
        </div>
    )
}

export default ExperimentConfiguration