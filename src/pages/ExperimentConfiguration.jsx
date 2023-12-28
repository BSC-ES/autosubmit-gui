import { useParams } from "react-router-dom";
import { useGetExperimentConfigurationQuery } from "../services/autosubmitApiV3";


const ExperimentConfiguration = () => {
    const routeParams = useParams()
    const {data, isLoading} = useGetExperimentConfigurationQuery(routeParams.expid)

    return (
        <div>
            {
                isLoading ?
                    <div className="spinner-border" role="status"></div>
                    :
                    JSON.stringify(data)
            }
        </div>
    )
}

export default ExperimentConfiguration