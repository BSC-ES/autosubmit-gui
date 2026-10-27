import { calcRunTime } from "./FetchJobDetailCard";
import { secondsToDelta } from "../components/context/utils";
import { cn, getStatusBadgeStyle } from "../services/utils";

/**
 * @typedef {Object} Job
 * @property {string} name - Unique name of the job.
 * @property {string} status - Current status of the job.
 */
/**
 * @typedef {Object} JobSelection
 * @property {Set<string>} jobIds - Names of the selected jobs.
 * @property {number} lastClickedIndex - Anchor index for range selection.
 */
/**
 * Renders the jobs displayed in the quick view and handles selection.
 *
 * @param {Object} props - Component properties.
 * @param {Job[]} props.jobs - Jobs to display.
 * @param {JobSelection} props.selection - Current selection state.
 * @param {(selection: JobSelection) => void} props.onSelectionChange -
 *   Callback invoked when the selection changes.
 * @returns {JSX.Element} The job list or an empty-list message.
 */

const JobList = ({ jobs, selection, onSelectionChange }) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <i className="fa-regular fa-face-frown text-4xl text-primary"></i>
        <span className="text text-gray-500">No jobs found</span>
      </div>
    );
  }

  /**
   * Handles a click on a job according to the modifier keys pressed.
   *
   * A regular click replaces the current selection, Ctrl/Cmd-click toggles
   * the clicked job, and Shift-click adds the range between the last clicked
   * index and the current index.
   *
   * @param {number} index - Index of the clicked job.
   * @param {string} jobName - Name of the clicked job.
   * @param {Object} event - Click event.
   */
  const handleJobClick = (index, jobName, event) => {
    let newSelected = new Set(selection.jobIds);
    let newLastClickedIndex = index;

    if (event.shiftKey && selection.lastClickedIndex !== null) {
      const start = Math.min(selection.lastClickedIndex, index);
      const end = Math.max(selection.lastClickedIndex, index);

      for (let i = start; i <= end; i++) {
        newSelected.add(jobs[i].name);
      }
    } else if (event.ctrlKey || event.metaKey) {
      if (newSelected.has(jobName)) {
        newSelected.delete(jobName);
      } else {
        newSelected.add(jobName);
      }
    } else {
      newSelected = new Set([jobName]);
    }

    onSelectionChange({
      jobIds: newSelected,
      lastClickedIndex: newLastClickedIndex,
    });
  };

  return (
    <ul
      className="text-sm flex flex-col gap-[0.3rem] py-1 font-thin"
      style={{
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        color: "#333",
      }}
    >
      {jobs.map((job, index) => {
        const isSelected = selection.jobIds.has(job.name);

        return (
          <li
            key={job.name}
            className="flex gap-3 px-6"
            onClick={(event) => handleJobClick(index, job.name, event)}
          >
            <span>
              <i className="fa-regular fa-circle text-primary" />
            </span>
            <div className="flex gap-2">
              <div
                className={cn(
                  "px-1 py-[1px] hover:bg-gray-100 rounded cursor-pointer select-none",
                  isSelected && "bg-blue-100 hover:bg-blue-200"
                )}
              >
                {job.name}
              </div>
              <span className={cn("flex items-center badge", getStatusBadgeStyle(job.status.toUpperCase()))}>{job.status}</span>
            </div>
            {job?.submit && job?.start && job?.finish && (
              <span className="text-gray-500">
                ~ ( {secondsToDelta(calcRunTime(job.submit, job.start))} ) +{" "}
                {secondsToDelta(calcRunTime(job.start, job.finish))}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default JobList;
