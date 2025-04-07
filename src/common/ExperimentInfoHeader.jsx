import { useState } from "react";
import { autosubmitApiV3 } from "../services/autosubmitApiV3";
import { cn } from "../services/utils";
import { ActiveIndicator } from "./ExperimentCard";
import { DotLoader } from "./Loaders";

const ExperimentInfoHeader = ({ expid }) => {
  const [open, setOpen] = useState(false);

  const {
    data: expInfoData,
    isFetching: isExpInfoFetching,
    isError: isExpInfoError,
  } = autosubmitApiV3.endpoints.getExperimentInfo.useQuery(expid);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <div className="flex flex-col gap-4 mb-2" onDoubleClick={handleToggle}>
        <div className="flex px-4 gap-6 items-center">
          <ActiveIndicator isActive={expInfoData?.running} />
          <div className="text-xl font-semibold grow line-clamp-2">
            {isExpInfoFetching ? (
              <DotLoader dotClassName={"bg-black dark:bg-white"} />
            ) : (
              <>
                {isExpInfoError ? (
                  <span className="text-danger">
                    <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                    {"Error getting experiment info"}
                  </span>
                ) : (
                  <>{expInfoData?.description || "-"}</>
                )}
              </>
            )}
          </div>
          <button
            onClick={handleToggle}
            className="btn rounded-full hover:bg-black/5 aspect-square"
          >
            <i
              className={cn(
                "ms-auto fa-solid",
                open ? "fa-angle-down" : "fa-angle-up"
              )}
            ></i>
          </button>
        </div>

        {open && (
          <div className="flex flex-col items-start ps-16 pe-6 gap-2 overflow-auto">
            <div className="flex items-center gap-16">
              <div>
                <span className="font-semibold">User: </span>
                {expInfoData?.owner || "-"}
              </div>
              <div>
                <span className="font-semibold">HPC: </span>
                {expInfoData?.hpc || "-"}
              </div>
              <div>
                <span className="font-semibold">Autosubmit version: </span>
                {expInfoData?.version || "-"}
              </div>
            </div>
            <div className="flex items-center gap-16">
              <div>
                <span className="font-semibold">Model: </span>
                {expInfoData?.model || "-"}
              </div>
              <div>
                <span className="font-semibold">Branch: </span>
                {expInfoData?.branch || "-"}
              </div>
              <div>
                <span className="font-semibold">Commit: </span>
                {expInfoData?.workflow_commit || "-"}
              </div>
            </div>
          </div>
        )}

        <hr />
      </div>
    </>
  );
};

export default ExperimentInfoHeader;
