import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import VisNetwork from "../common/VisNetwork";
import { useGetExperimentGraphViewQuery } from "../services/autosubmitApiV3";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";


const ExperimentGraph = () => {
    const routeParams = useParams()
    useASTitle(`Experiment ${routeParams.expid} graph`)
    useBreadcrumb([
        {
          name: `Experiment ${routeParams.expid}`,
          route: `/experiment/${routeParams.expid}`
        },
        {
          name: `Graph View`,
          route: `/experiment/${routeParams.expid}/graph`
        }
      ])
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