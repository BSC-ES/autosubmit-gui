import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import VisNetwork from "../common/VisNetwork";
import { useGetExperimentGraphViewQuery } from "../services/autosubmitApiV3";


const ExperimentGraph = () => {
    const routeParams = useParams()
    const { data, isLoading } = useGetExperimentGraphViewQuery({
        expid: routeParams.expid,
        layout: "standard",
        grouped: "none"
    })

    return (
        <div>
            {
                isLoading ?
                    <div className="spinner-border" role="status"></div>
                    :
                    <VisNetwork nodes={data.nodes} edges={data.edges} />
            }
        </div>
    )
}

export default ExperimentGraph