import { useEffect, useState } from "react"
import { useGetExperimentTreeViewQuery } from "../services/autosubmitApiV3";
import { useParams } from "react-router-dom";
import FancyTree from "../common/FancyTree";


const ExperimentTree = () => {
    const routeParams = useParams()

    const [treeData, setTreeData] = useState(null)

    const { data, isLoading } = useGetExperimentTreeViewQuery(routeParams.expid)

    useEffect(() => {
        if (data && Array.isArray(data.tree)) {
            setTreeData(data.tree)
        }
    }, [data])

    return (
        <div>
            {
                isLoading ?
                    <div className="spinner-border" role="status"></div>
                    :
                    <FancyTree treeData={treeData}></FancyTree>
            }
        </div>
    )
}

export default ExperimentTree