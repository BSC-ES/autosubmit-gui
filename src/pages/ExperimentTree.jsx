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
                isLoading
            }
                <FancyTree treeData={treeData}></FancyTree>

            {/* <div>{JSON.stringify(treeData)}</div>
            <button onClick={() => { setReload(!reload) }}>refresh</button> */}
        </div>
    )
}

export default ExperimentTree