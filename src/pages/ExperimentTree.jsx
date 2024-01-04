import { useEffect, useState } from "react"
import { useGetExperimentTreeViewQuery } from "../services/autosubmitApiV3";
import { useParams } from "react-router-dom";
import FancyTree from "../common/FancyTree";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";


const ExperimentTree = () => {
    const routeParams = useParams()
    useASTitle(`Experiment ${routeParams.expid} tree`)
    useBreadcrumb([
        {
            name: `Experiment ${routeParams.expid}`,
            route: `/experiment/${routeParams.expid}`
        },
        {
            name: `Tree View`,
            route: `/experiment/${routeParams.expid}/tree`
        }
    ])

    const [treeData, setTreeData] = useState(null)

    const { data, isFetching, refetch } = useGetExperimentTreeViewQuery(routeParams.expid)

    useEffect(() => {
        if (data && Array.isArray(data.tree)) {
            setTreeData(data.tree)
        }
    }, [data])

    return (
        <div className="w-100 d-flex flex-column">
            <div className="d-flex mb-3 gap-3 align-items-center">

                <div className="flex-fill input-group">
                    <input 
                        className="form-control" placeholder="Filter job..." />
                    {/* <button className="btn btn-dark fw-bold px-4">Filter</button> */}
                </div>
                <button className="btn btn-success fw-bold text-white px-5" onClick={() => { refetch() }}>REFRESH</button>
            </div>
            {
                isFetching ?
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <div className="spinner-border" role="status"></div>
                    </div>
                    :
                    <div className="border rounded-4 p-3 flex-fill">
                    <FancyTree treeData={treeData}></FancyTree>
                    
                    </div>
            }
        </div>
    )
}

export default ExperimentTree