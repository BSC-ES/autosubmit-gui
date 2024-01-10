import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import VisNetwork from "../common/VisNetwork";
import { useGetExperimentGraphViewQuery } from "../services/autosubmitApiV3";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import JobDetailCard from "../common/JobDetailCard";


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

  const filterRef = useRef()

  const [selectedJob, setSelectedJob] = useState(null)
  const [network, setNetwork] = useState(null)
  const [graphData, setGraphData] = useState({
    nodes: [],
    edges: []
  })

  const { data, isFetching, refetch } = useGetExperimentGraphViewQuery({
    expid: routeParams.expid,
    layout: "standard",
    grouped: "none"
  })

  useEffect(() => {
    if (data && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
      const newNodes = data.nodes.map(node => {
        return {
          id: node.id,
          label: node.label,
          shape: node.shape,
          color: { background: node.status_color, border: "black" },
          status: node.status,
          x: node.x,
          y: node.y,
          shapeProperties: { borderDashes: node.dashed },
        }
      })
      setGraphData({
        nodes: newNodes,
        edges: data.edges
      })
    }
  }, [data])

  const handleNetworkCallback = (newNetwork) => { setNetwork(newNetwork) }

  const handleOnSelectNode = (nodeId) => {
    console.log(nodeId)
    const newSelected = data.nodes.find(rawNode => rawNode.id === nodeId)
    setSelectedJob(newSelected)
  }

  const handleFilter = (e) => {
    e.preventDefault();
    const searchValue = filterRef.current.value
    if (network) {
      if (searchValue) {
        const selectedNodes = graphData.nodes.filter( item => item.id.includes(searchValue)).map(item => item.id)
        network.selectNodes(selectedNodes)
        network.fit({
          nodes: selectedNodes
        })
      } else {
        handleClear()
      }
    }
  }

  const handleClear = () => {
    filterRef.current.value = ""
    if (network) {
      network.unselectAll()
      network.fit()
    }
  }

  const handleCloseJobDetail = () => { setSelectedJob(null) }


  return (
    <div className="w-100 d-flex flex-column">

      <div className="d-flex mb-3 gap-2 align-items-center flex-wrap">
        <div className="flex-fill">
          <form className="input-group" onSubmit={handleFilter}>
            <input ref={filterRef}
              className="form-control" placeholder="Filter job..." />
            <button type="submit" className="btn btn-dark fw-bold px-4">Filter</button>
            <button type="button" className="btn btn-info fw-bold px-4" onClick={handleClear}>Clear</button>
          </form>
        </div>
        {/* <button className="btn btn-success fw-bold text-white px-4 text-nowrap">
          START MONITORING
        </button> */}
        <button className="btn btn-success fw-bold text-white"
          title="Refresh data"
          onClick={() => { refetch() }}>
          <i className="fa-solid fa-rotate-right"></i>
        </button>
      </div>

      {
        isFetching ?
          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border" role="status"></div>
          </div>
          :
          <div className="d-flex w-100 gap-3 justify-content-center flex-wrap">

            <div className="col d-flex flex-column gap-3 flex-wrap" style={{ minWidth: "min(30rem,90vw)" }}>
              <div className="d-flex gap-2 align-items-center justify-content-between">
                <span className="mx-2 small">
                  Total #Jobs: {data.total_jobs} | Chunk unit: {data.chunk_unit} | Chunk size: {data.chunk_size}
                </span>
              </div>


              <div className="border">
                <VisNetwork
                  nodes={graphData.nodes}
                  edges={graphData.edges}
                  onSelectNode={handleOnSelectNode}
                  networkCallback={handleNetworkCallback}
                />

              </div>
            </div>

            <JobDetailCard
              jobData={selectedJob}
              jobs={data.nodes}
              onClose={handleCloseJobDetail} />

          </div>

      }
    </div>
  )
}

export default ExperimentGraph