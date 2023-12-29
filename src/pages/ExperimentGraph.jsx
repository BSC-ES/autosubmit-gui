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
        <div className="w-100">
            {
                isLoading ?
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <div className="spinner-border" role="status"></div>
                    </div>
                    :
                    <VisNetwork nodes={data.nodes} edges={data.edges} />
            }
        </div>
    )
}

export default ExperimentGraph