import { useParams } from "react-router-dom";
import { useGetExperimentQuickViewQuery } from "../services/autosubmitApiV3";
import { useEffect, useState } from "react";
import { MAX_ITEMS_QUICK_VIEW } from "../consts";
import useASTitle from "../hooks/useASTitle";
import useBreadcrumb from "../hooks/useBreadcrumb";
import { cn } from "../services/utils";
import { ChangeStatusModal } from "../common/ChangeStatusModal";
import BottomPanel from "../common/BottomPanel";
import FetchJobDetailCard from "../common/FetchJobDetailCard";

const QuickJobList = ({ jobs, onSelectionChange }) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <i className="fa-regular fa-face-frown text-4xl text-primary"></i>
        <span className="text text-gray-500">No jobs found</span>
      </div>
    );
  }

  const [selectedJobIds, setSelectedJobIds] = useState(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState(null);

  const handleJobClick = (index, jobName, event) => {
    if (event.shiftKey && lastClickedIndex !== null && jobs) {
      // Shift+click: select range
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      const newSelected = new Set(selectedJobIds);
      for (let i = start; i <= end; i++) {
        newSelected.add(jobs[i].refKey);
      }
      setSelectedJobIds(newSelected);
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd+click: toggle selection
      const newSelected = new Set(selectedJobIds);
      if (newSelected.has(jobName)) {
        newSelected.delete(jobName);
      } else {
        newSelected.add(jobName);
      }
      setSelectedJobIds(newSelected);
      setLastClickedIndex(index);
    } else {
      // Regular click: select only this item
      setSelectedJobIds(new Set([jobName]));
      setLastClickedIndex(index);
    }
  };

  useEffect(() => {
    onSelectionChange(selectedJobIds);
  }, [selectedJobIds]);

  return (
    <ul
      className="text-sm flex flex-col gap-[0.3rem] py-1 font-thin"
      style={{
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        color: "#333",
      }}
    >
      {jobs.map((job, index) => {
        const isSelected = selectedJobIds.has(job.refKey);

        return (
          <li
            key={job.refKey}
            className="flex gap-3 px-6"
            onClick={(event) => handleJobClick(index, job.refKey, event)}
          >
            <span>
              <i className="fa-regular fa-circle text-primary" />
            </span>
            <div
              className={cn(
                "px-1 py-[1px] hover:bg-gray-100 rounded cursor-pointer select-none",
                isSelected && "bg-blue-100 hover:bg-blue-200",
              )}
              dangerouslySetInnerHTML={{ __html: job.title }}
            ></div>
          </li>
        );
      })}
    </ul>
  );
};

/**
 * Filter the jobs received in the Quick View
 * @param {Array} baseData - Base Data
 * @param {string} filterText - Filter text. It can include ! at the begining for negation and * as a wildcard
 * @param {string} filterStatus - Posible values: ANY|COMPLETED|FAILED|RUNNING|QUEUING
 * @returns {Array}
 */
const filterQuickView = (baseData, filterText, filterStatus) => {
  let filterNorm = String(filterText).toUpperCase();

  const isNegation = filterNorm.indexOf("!") === 0;
  if (isNegation) {
    filterNorm = filterNorm.substring(1);
  }

  const fields = filterNorm.split("*");

  const newJobs = baseData.filter((item) => {
    // Filter by status
    let flagStatus = true;
    if (filterStatus !== "ANY") {
      flagStatus = item.status === filterStatus;
    }

    // Filter by text
    let flagText = true;
    let stringTest = String(item.refKey).toUpperCase();
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].length > 0) {
        if (stringTest.indexOf(fields[i]) > -1) {
          let foundIndex = stringTest.indexOf(fields[i]) + fields[i].length;
          stringTest = stringTest.substring(foundIndex);
        } else {
          flagText = false;
          break;
        }
      }
    }

    // Use negation
    if (isNegation) {
      return !flagText && flagStatus;
    } else {
      return flagText && flagStatus;
    }
  });

  return newJobs;
};

const ExperimentQuick = () => {
  const routeParams = useParams();
  useASTitle(`Experiment ${routeParams.expid} quick view`);
  useBreadcrumb([
    {
      name: `Experiment ${routeParams.expid}`,
      route: `/experiment/${routeParams.expid}`,
    },
    {
      name: `Quick View`,
      route: `/experiment/${routeParams.expid}/quick`,
    },
  ]);
  const [filters, setFilters] = useState({
    status: "ANY",
    filter: "",
  });
  const [jobs, setJobs] = useState([]);
  const { data, isFetching, refetch } = useGetExperimentQuickViewQuery(
    routeParams.expid,
  );

  const [showModal, setShowModal] = useState(false);
  const toggleModal = (refresh = false) => {
    setShowModal(!showModal);
    if (refresh === true) {
      refetch();
    }
  };

  const [selectedJobIds, setSelectedJobIds] = useState(new Set());
  const handleJobSelectionChange = (selectedIds) => {
    setSelectedJobIds(selectedIds);
  };

  useEffect(() => {
    if (data && Array.isArray(data.tree_view)) {
      let newJobs = filterQuickView(
        data.tree_view,
        filters.filter,
        filters.status,
      );
      newJobs = newJobs.slice(0, MAX_ITEMS_QUICK_VIEW);
      setJobs(newJobs);
    }
  }, [data, filters]);

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      filter: event.target.value,
    });
  };

  const handleStatusChange = (event) => {
    setFilters({
      ...filters,
      status: event.target.value,
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 grow">
      {data?.error && (
        <span className="alert alert-danger rounded-2xl">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>{" "}
          {data?.error_message || "Unknown error"}
        </span>
      )}
      <div className="flex gap-3 items-center flex-wrap">
        <div>
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="form-select border border-primary text-primary dark:bg-primary dark:text-white font-bold text-center"
          >
            <option value="ANY">TOTAL ({(data && data.total) || 0})</option>
            <option value="COMPLETED">
              COMPLETED ({(data && data.completed) || 0})
            </option>
            <option value="FAILED">
              FAILED ({(data && data.failed) || 0})
            </option>
            <option value="RUNNING">
              RUNNING ({(data && data.running) || 0})
            </option>
            <option value="QUEUING">
              QUEUING ({(data && data.queuing) || 0})
            </option>
          </select>
        </div>
        <div className="grow">
          <input
            value={filters.filter}
            onChange={handleFilterChange}
            className="form-input w-full"
            placeholder="Filter job..."
          />
          {/* <button className="btn btn-dark fw-bold px-4">Filter</button> */}
        </div>
        <div className="text-sm" style={{ whiteSpace: "nowrap" }}>
          Showing {jobs.length} of{" "}
          <strong>
            {data && data.tree_view && data.tree_view.length} total jobs
          </strong>
        </div>
        <button
          className="btn btn-success"
          title="Refresh data"
          onClick={() => {
            refetch();
          }}
        >
          <i className="fa-solid fa-rotate-right"></i>
        </button>
      </div>
      <div className="relative grow basis-0 overflow-auto min-h-[70vh] lg:min-h-[50vh] w-full border p-4 rounded-lg custom-scrollbar bg-white">
        {isFetching && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
            <div className="spinner-border dark:invert" role="status"></div>
          </div>
        )}

        <QuickJobList
          jobs={jobs}
          onSelectionChange={handleJobSelectionChange}
        ></QuickJobList>
      </div>

      {selectedJobIds.size > 0 && (
        <BottomPanel
          title={
            selectedJobIds.size === 1
              ? selectedJobIds.values().next().value
              : `${selectedJobIds.size} jobs selected`
          }
        >
          <div className="flex flex-col gap-3">
            {selectedJobIds.size === 1 && (
              <FetchJobDetailCard
                expid={routeParams.expid}
                jobName={selectedJobIds.values().next().value}
              />
            )}

            <div className="flex items-center justify-center gap-3">
              <div className="font-semibold">Actions:</div>
              <button className="btn btn-primary" onClick={toggleModal}>
                Change status
              </button>
            </div>
            <ChangeStatusModal
              selectedJobs={Array.from(selectedJobIds)}
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

export default ExperimentQuick;
