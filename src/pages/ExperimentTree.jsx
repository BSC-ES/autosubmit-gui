import { useEffect, useMemo, useRef, useState, MutableRefObject } from "react";
import { autosubmitApiV3 } from "../services/autosubmitApiV3";
import { useParams } from "react-router-dom";
import FancyTree from "../common/FancyTree";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import JobDetailCard from "../common/JobDetailCard";
import { useDispatch, useSelector } from "react-redux";
import RunsModal from "../common/RunsModal";
import TreeContentHandler from "../components/context/tree/business/treeUpdate";
import BottomPanel from "../common/BottomPanel";
import { ChangeStatusModal } from "../common/ChangeStatusModal";

const ExperimentTree = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const routeParams = useParams();
  useASTitle(`Experiment ${routeParams.expid} tree`);
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`,
    },
    {
      name: `Tree View`,
      route: `/experiment/${routeParams.expid}/tree`,
    },
  ]);

  /** @type {MutableRefObject<Fancytree.Fancytree>} */
  const tree = useRef();
  const filterRef = useRef();

  const [activeMonitor, setActiveMonitor] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const selectedJob = useMemo(() => {
    if (selectedJobIds.length === 1) {
      return jobs.find((rawNode) => rawNode.label === selectedJobIds[0]);
    }
    return undefined;
  }, [jobs, selectedJobIds]);

  const [showRunsM, setShowRunsM] = useState(false);
  const [selectedRun, setSelectedRun] = useState({
    run_id: null,
    created: null,
  });

  const [showModal, setShowModal] = useState(false);
  const toggleModal = ( refresh = false ) => {
    setShowModal(!showModal);
    if (refresh === true) {
      refetch();
    }
  };

  const { data, isFetching, refetch, isError } =
    autosubmitApiV3.endpoints.getExperimentTreeView.useQuery({
      expid: routeParams.expid,
      runId: selectedRun?.run_id,
    });

  const { data: pklData } = autosubmitApiV3.endpoints.getPklTreeInfo.useQuery(
    {
      expid: routeParams.expid,
    },
    {
      skip: !activeMonitor || selectedRun?.run_id,
      pollingInterval: 5 * 1000,
    }
  );

  const assignKeysToTree = (tree) => {
    if (Array.isArray(tree)) {
      // Create a deep copy and assign keys
      return tree.map((node) => {
        const newNode = { ...node };
        newNode.key = `${node.refKey}-${Math.random().toString(36).slice(2, 11)}`;
        if (Array.isArray(newNode.children)) {
          newNode.children = assignKeysToTree(newNode.children);
        }
        return newNode;
      });
    }
  };

  const dataTree = useMemo(() => assignKeysToTree(data?.tree || []), [data]);

  useEffect(() => {
    // Unmount component
    return () => {
      const promise = dispatch(
        autosubmitApiV3.endpoints.showdownRoute.initiate(
          {
            route: "tree",
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
    const newJobs = data?.jobs || [];
    setJobs(newJobs);
  }, [data]);

  useEffect(() => {
    let treeUpdater = new TreeContentHandler(
      jobs,
      data?.reference || {},
      pklData,
      false
    );

    if (tree.current && treeUpdater.validate()) {
      const processResult = treeUpdater.processChanges(tree.current);
      if (Array.isArray(processResult?.currentJobs)) {
        setJobs(processResult.currentJobs);
      }
    }
  }, [pklData]);

  const toggleActiveMonitor = () => {
    setActiveMonitor(!activeMonitor);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    if (tree.current) {
      if (filterRef.current.value) {
        tree.current.filterNodes(filterRef.current.value);
      } else {
        tree.current.clearFilter();
      }
    }
  };

  const handleClear = () => {
    filterRef.current.value = "";
    if (tree.current) tree.current.clearFilter();
  };

  const handleSelectNodes = (_selectedNodes) => {
    if (Array.isArray(_selectedNodes)) {
      const newSelectedIds = _selectedNodes
        .filter((node) => node?.folder === undefined)
        .map((node) => node?.refKey);
      setSelectedJobIds(newSelectedIds);
    } else {
      setSelectedJobIds([]);
    }
  };

  const handleExpand = () => {
    if (tree.current) tree.current.expandAll();
  };
  const handleCollapse = () => {
    if (tree.current) tree.current.expandAll(false);
  };
  const handleDefaultExpand = () => {
    if (tree.current) {
      tree.current.expandAll(false, {
        noAnimation: true,
        noEvents: true,
      });
      tree.current.getRootNode().children.forEach((node) => {
        node.setExpanded();
      });
    }
  };

  const handleRunSelect = (item) => {
    handleClear();
    setSelectedRun(item);
    setShowRunsM(false);
  };

  const handleResetRun = () => {
    handleRunSelect({
      run_id: null,
      created: null,
    });
  };

  const toggleShowRunsM = () => {
    setShowRunsM(!showRunsM);
  };

  return (
    <>
      <RunsModal
        show={showRunsM}
        onHide={toggleShowRunsM}
        expid={routeParams.expid}
        onRunSelect={handleRunSelect}
      />
      <div className="w-full flex flex-col gap-4 grow">
        {(isError || data?.error) && (
          <span className="alert alert-danger rounded-2xl">
            <i className="fa-solid fa-triangle-exclamation me-2"></i>{" "}
            {data?.error_message || "Unknown error"}
          </span>
        )}

        <div className="flex gap-2 items-center flex-wrap">
          <div>
            <button
              className={
                "btn btn-primary font-bold " +
                (selectedRun?.run_id && " rounded-e-none")
              }
              title="Select Run"
              onClick={toggleShowRunsM}
            >
              <i className="fa-solid fa-clock-rotate-left me-2"></i> Run:{" "}
              {(selectedRun.run_id && selectedRun.created) || "Latest"}
            </button>
            {selectedRun?.run_id && (
              <button
                className="btn btn-light text-primary rounded-s-none border"
                title="Reset to latest"
                onClick={handleResetRun}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
          <form className="grow flex flex-wrap" onSubmit={handleFilter}>
            <input
              ref={filterRef}
              className="form-input rounded-e-none grow"
              placeholder="Filter job..."
            />
            <button
              type="submit"
              className="btn btn-dark border-dark font-bold px-4 rounded-s-none rounded-e-none"
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
          {!selectedRun?.run_id && (
            <button
              className={
                "btn font-bold px-4 text-nowrap " +
                (activeMonitor ? "btn-danger" : "btn-success")
              }
              onClick={toggleActiveMonitor}
            >
              {activeMonitor ? "STOP MONITORING" : "START MONITOR"}
            </button>
          )}
          <button
            className="btn btn-success font-bold"
            title="Refresh data"
            onClick={() => {
              refetch();
            }}
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center justify-between">
          <span className="mx-2 text-sm">
            Total #Jobs: {data?.total} | Chunk unit:{" "}
            {data?.reference?.chunk_unit} | Chunk size:{" "}
            {data?.reference?.chunk_size}
          </span>
          <div className="flex gap-2">
            <button
              className="btn btn-success font-bold px-4 text-sm"
              onClick={handleDefaultExpand}
            >
              Default Expand
            </button>
            <button
              className="btn btn-primary font-bold px-4 text-sm"
              onClick={handleExpand}
            >
              Expand All +
            </button>
            <button
              className="btn btn-secondary font-bold px-4 text-sm"
              onClick={handleCollapse}
            >
              Collapse All -
            </button>
          </div>
        </div>

        <div className="relative grow basis-0 overflow-auto min-h-[70vh] lg:min-h-[50vh] w-full border p-4 rounded-lg custom-scrollbar bg-white">
          {isFetching && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
              <div className="spinner-border dark:invert" role="status"></div>
            </div>
          )}
          <FancyTree
            tree={(_tree) => {
              tree.current = _tree;
            }}
            source={dataTree}
            onSelectNodes={handleSelectNodes}
          />
        </div>
      </div>

      {selectedJobIds.length > 0 && (
        <BottomPanel
          title={
            selectedJobIds.length === 1
              ? selectedJobIds[0]
              : `${selectedJobIds.length} jobs selected`
          }
        >
          <div className="flex flex-col gap-3">
            <JobDetailCard
              expid={routeParams.expid}
              jobData={selectedJob}
              jobs={jobs}
            />
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
    </>
  );
};

export default ExperimentTree;
