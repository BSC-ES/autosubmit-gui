import { autosubmitApiV3 } from "../services/autosubmitApiV3";
import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo, useRef, MutableRefObject } from "react";
import JobDetailCard from "../common/JobDetailCard";
import CyWorkflow from "../common/CyWorkflow";
import Cytoscape from "cytoscape";
import { useDispatch, useSelector } from "react-redux";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import BottomPanel from "../common/BottomPanel";
import { ChangeStatusModal } from "../common/ChangeStatusModal";
import { STATUS_STYLES } from "../services/utils";

const ExperimentGraph = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const routeParams = useParams();
  useASTitle(`Experiment ${routeParams.expid} graph`);
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`,
    },
    {
      name: `Graph View`,
      route: `/experiment/${routeParams.expid}/graph`,
    },
  ]);

  /** @type {MutableRefObject<Cytoscape.Core>} */
  const cy = useRef();

  const filterRef = useRef();
  const statusSelectRef = useRef();
  const [activeMonitor, setActiveMonitor] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [graphElements, setGraphElements] = useState([]);

  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const selectedJob = useMemo(() => {
    if (selectedJobIds.length === 1) {
      return jobs.find((rawNode) => rawNode.id === selectedJobIds[0]);
    }
    return undefined;
  }, [jobs, selectedJobIds]);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const { data, isFetching, refetch, isError } =
    autosubmitApiV3.endpoints.getExperimentGraphView.useQuery({
      expid: routeParams.expid,
      layout: "standard",
      grouped: "none",
    });

  const { data: pklData } = autosubmitApiV3.endpoints.getPklInfo.useQuery(
    {
      expid: routeParams.expid,
    },
    {
      skip: !activeMonitor,
      pollingInterval: 5 * 1000,
    }
  );

  useEffect(() => {
    // Unmount component
    return () => {
      const promise = dispatch(
        autosubmitApiV3.endpoints.showdownRoute.initiate(
          {
            route: "graph",
            loggedUser: authState.user_id,
            expid: routeParams.expid,
          },
          { forceRefetch: true }
        )
      );
      promise.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (Array.isArray(data?.nodes) && Array.isArray(data?.edges)) {
      setJobs([...data.nodes]);
      const newElems = [];
      const wrapperNodes = new Set();
      data.nodes.forEach((item) => {
        let node = {
          group: "nodes",
          data: { id: item.id, status: item.status },
          position: { x: item.x, y: item.y },
        };
        if (item.wrapper) {
          if (!wrapperNodes.has(item.wrapper)) {
            newElems.push({
              group: "nodes",
              data: { id: item.wrapper },
              grabbable: false,
              pannable: true
            });
            wrapperNodes.add(item.wrapper);
          }
          node.data["parent"] = item.wrapper;
        }
        newElems.push(node);
      });
      data.edges.forEach((item) => {
        newElems.push({
          group: "edges",
          data: { source: item.from, target: item.to },
          selectable: false,
          pannable: true
        });
      });
      setGraphElements(newElems);
    }
  }, [data]);

  useEffect(() => {
    if (pklData) {
      let newJobData = {};
      pklData.pkl_content.forEach((job) => {
        newJobData[job.name] = job;
      });

      let changeLog = [];
      const newJobs = jobs.map((job) => {
        let newJob = { ...job };
        const incomingData = newJobData[job.id];

        if (newJob.status_code !== incomingData.status_code) {
          changeLog.push(
            `[${new Date().toISOString()}] ${newJob.id} change status to ${
              incomingData.status
            }`
          );
          // network.body.nodes[newJob.id].options.color.background = incomingData.status_color
          cy.current
            .nodes(`node[id = "${newJob.id}"]`)
            .data("status", incomingData.status);
        }

        // Overwrite data
        newJob.status_code = incomingData.status_code;
        newJob.status = incomingData.status;
        newJob.status_color = incomingData.status_color;
        newJob.package = incomingData.package;
        newJob.dashed = incomingData.dashed;
        newJob.out = incomingData.out;
        newJob.err = incomingData.err;
        newJob.minutes = incomingData.minutes;
        newJob.minutes_queue = incomingData.minutes_queue;
        newJob.submit = incomingData.submit;
        newJob.start = incomingData.start;
        newJob.finish = incomingData.finish;
        newJob.rm_id = incomingData.rm_id;
        newJob.SYPD = incomingData.SYPD;

        return newJob;
      });

      // Refresh Job List
      setJobs(newJobs);
    }

    // eslint-disable-next-line
  }, [pklData]);

  const handleFilter = (e) => {
    e.preventDefault();
    const searchValue = filterRef.current.value;
    if (searchValue) {
      cy.current.nodes().unselect();
      const vals = cy.current.filter(`node[id *= '${searchValue}']`);
      vals.select();
      cy.current.fit(vals);
    } else {
      handleClear();
    }
  };

  const handleClear = () => {
    filterRef.current.value = "";
    cy.current.nodes().unselect();
  };

  const handleOnSelectNodes = (_selectedNodes) => {
    if (Array.isArray(_selectedNodes)) {
      const newSelectedIds = _selectedNodes.map((item) => item.data.id);
      setSelectedJobIds(newSelectedIds);
    } else {
      setSelectedJobIds([]);
    }
  };

  const handleCloseJobDetail = () => {
    cy.current.nodes().unselect();
    setSelectedJobIds([]);
  };

  const toggleActiveMonitor = () => {
    setActiveMonitor(!activeMonitor);
  };

  const handleSelectByStatus = () => {
    const selStatus = statusSelectRef.current.value;
    cy.current.nodes().unselect();
    const vals = cy.current.filter(`node[status = '${selStatus}']`);
    vals.select();
    cy.current.fit(vals);
  };

  return (
    <div className="w-full min-w-0 flex flex-col gap-4 grow">
      {(isError || data?.error) && (
        <span className="alert alert-danger rounded-2xl">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>{" "}
          {data?.error_message || "Unknown error"}
        </span>
      )}

      <div className="flex gap-2 items-center flex-wrap">
        <form className="grow flex flex-wrap" onSubmit={handleFilter}>
          <input
            ref={filterRef}
            className="form-input rounded-e-none grow"
            placeholder="Filter job..."
          />
          <button
            type="submit"
            className="btn btn-dark font-bold px-4 rounded-s-none rounded-e-none"
          >
            Filter
          </button>
          <button
            type="button"
            className="btn btn-light border font-bold px-4 rounded-s-none"
            onClick={handleClear}
          >
            Clear
          </button>
        </form>
        <button
          className={
            "btn font-bold text-white px-4 text-nowrap " +
            (activeMonitor ? "btn-danger" : "btn-success")
          }
          onClick={toggleActiveMonitor}
        >
          {activeMonitor ? "STOP MONITORING" : "START MONITOR"}
        </button>
        <button
          className="btn btn-success font-bold text-white"
          title="Refresh data"
          onClick={() => {
            refetch();
          }}
        >
          <i className="fa-solid fa-rotate-right"></i>
        </button>
      </div>

      <div className="flex items-center">
        <div className="me-auto">
          <span className="mx-2 text-sm">
            Total #Jobs: {data?.total_jobs} | Chunk unit: {data?.chunk_unit} |
            Chunk size: {data?.chunk_size}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div>Select by status:</div>
          <select
            ref={statusSelectRef}
            className={"bg-white text-black border text-center px-2"}
          >
            {Object.keys(STATUS_STYLES)
              .sort()
              .map((key) => {
                return (
                  <option
                    key={key}
                    value={key}
                    className={STATUS_STYLES[key].badge}
                  >
                    {key}
                  </option>
                );
              })}
          </select>
          <button
            className="btn btn-success text-sm"
            onClick={handleSelectByStatus}
          >
            <i className="fa-solid fa-check"></i>
          </button>
        </div>
      </div>

      <div className="flex grow border relative">
        {isFetching && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
            <div className="spinner-border dark:invert" role="status"></div>
          </div>
        )}
        <CyWorkflow
          cy={(_cy) => {
            cy.current = _cy;
          }}
          elements={graphElements}
          onSelectNodes={handleOnSelectNodes}
        />
      </div>

      {selectedJobIds.length > 0 && (
        <BottomPanel
          title={
            selectedJobIds.length === 1
              ? selectedJobIds[0]
              : `${selectedJobIds.length} jobs selected`
          }
          onClose={handleCloseJobDetail}
        >
          <div className="flex flex-col gap-3">
            {selectedJobIds.length === 1 && (
              <JobDetailCard
                expid={routeParams.expid}
                jobData={selectedJob}
                jobs={jobs}
              />
            )}
            <div className="flex items-center justify-center gap-3">
              <div className="font-semibold">Actions:</div>
              <button className="btn btn-primary" onClick={toggleModal}>
                Change status
              </button>
            </div>
            <ChangeStatusModal
              selectedJobs={selectedJobIds}
              show={showModal}
              onHide={toggleModal}
              expid={routeParams.expid}
            />
          </div>
        </BottomPanel>
      )}
    </div>
  );
};

export default ExperimentGraph;
