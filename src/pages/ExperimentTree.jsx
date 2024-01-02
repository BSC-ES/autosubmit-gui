import { useEffect, useState } from "react"
import { useGetExperimentTreeViewQuery } from "../services/autosubmitApiV3";
import { useParams } from "react-router-dom";
import FancyTree from "../common/FancyTree";
import useASTitle from "../hooks/useASTitle";


const ExperimentTree = () => {
    const routeParams = useParams()
    useASTitle(`Experiment ${routeParams.expid} tree`)

    const [treeData, setTreeData] = useState(null)

    const { data, isLoading } = useGetExperimentTreeViewQuery(routeParams.expid)

    useEffect(() => {
        if (data && Array.isArray(data.tree)) {
            setTreeData(data.tree)
        }
    }, [data])

    return (
        <div className="w-100">
            {
                isLoading ?
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <div className="spinner-border" role="status"></div>
                    </div>
                    :
                    <FancyTree treeData={treeData}></FancyTree>
            }
        </div>
    )
}

export default ExperimentTree