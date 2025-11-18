import { useState, useCallback, useEffect } from "react";
import { STATUS_STYLES } from "../services/utils";
import Modal from "./Modal";
import {
  commandGeneratorGraph,
  statusChangeTextGeneratorGraph,
} from "../components/context/utils";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { RunnerOptionsFormSection } from "./RunnerOptionsFormSection";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";

const ConfirmModal = ({ show, onConfirm, onCancel, message }) => {
  return (
    <Modal show={show} onClose={onCancel}>
      <div className="bg-white text-black py-6 px-6 rounded-lg w-96">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-success text-white px-4 py-2 rounded hover:bg-success/90"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export function ChangeStatusModal({ expid, selectedJobs, show, onHide }) {
  const copyToClipboard = useCopyToClipboard()[1];
  const [targetStatus, setTargetStatus] = useState("WAITING");
  const [type, setType] = useState("cmd");
  const [copied, setCopied] = useState("Copy to clipboard");
  const [runnerProfileOptions, setRunnerProfileOptions] = useState({
    profile_name: "",
    profile_params: {},
  });

  const [
    submitCommand,
    {
      isLoading: submitCommandLoading,
      isSuccess: isSubmitCommandSuccess,
      isError: isSubmitCommandError,
    },
  ] = autosubmitApiV4.endpoints.runJobSetStatusCommand.useMutation();

  // Hide modal on successful mutation
  useEffect(() => {
    if (isSubmitCommandSuccess) {
      onHide(true);
    }
  }, [isSubmitCommandSuccess]);

  const handleCopy = () => {
    let content = "";
    if (type === "cmd") {
      content = commandGeneratorGraph(expid, selectedJobs, targetStatus);
    } else if (type === "txt") {
      content = statusChangeTextGeneratorGraph(selectedJobs, targetStatus);
    }
    copyToClipboard(content);
    setCopied("Copied!");
    setTimeout(() => {
      setCopied("Copy to clipboard");
    }, 2000);
  };

  const handleRunnerSelectionChange = useCallback((selection) => {
    setRunnerProfileOptions(selection);
  }, []);

  const handleSubmitCommand = () => {
    const body = {
      expid,
      profile_name: runnerProfileOptions.profile_name,
      profile_params: runnerProfileOptions.profile_params,
      command_params: {
        final_status: targetStatus,
        job_names_list: [...selectedJobs],
      },
    };
    submitCommand(body);
  };

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Modal show={show} onClose={() => onHide()}>
      <div className="bg-white text-black py-6 px-6 rounded-lg relative w-[40rem] max-w-[95vw]">
        <div
          className="cursor-pointer absolute top-4 right-4"
          onClick={() => onHide()}
        >
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div>Change Status to: </div>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value)}
            >
              {["WAITING", "COMPLETED", "SUSPENDED", "FAILED"].map((key) => {
                return (
                  <option
                    value={key}
                    key={key}
                    className={STATUS_STYLES[key].badge}
                  >
                    {key}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex gap-2">
            <div>Method: </div>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="cmd">Command Line</option>
              <option value="txt">Text File</option>
            </select>
          </div>
          <div className="bg-black text-white px-2 font-mono relative pt-8 py-4">
            <button
              className="absolute top-2 text-sm right-2 opacity-50 text-black bg-white px-2 rounded"
              onClick={handleCopy}
            >
              <i className="fa-regular fa-copy"></i> {copied}
            </button>
            {type === "cmd" &&
              commandGeneratorGraph(expid, selectedJobs, targetStatus)}
            {type === "txt" &&
              statusChangeTextGeneratorGraph(selectedJobs, targetStatus)
                .split("\n")
                .map((item, index) => <p key={index}>{item}</p>)}
          </div>

          <div className="py-2 flex flex-col items-center">
            <RunnerOptionsFormSection
              onSelectionChange={handleRunnerSelectionChange}
            />

            {isSubmitCommandError && (
              <div className="text-red-600 mt-2">
                Error running the set job status command. Please try again.
              </div>
            )}

            <button
              className="mt-2 bg-success text-white px-4 py-2 rounded hover:bg-success/90 disabled:bg-success/70"
              disabled={
                !runnerProfileOptions.profile_name || submitCommandLoading
              }
              onClick={() => setShowConfirm(true)}
            >
              {submitCommandLoading ? (
                <span>
                  <i className="fa fa-spinner fa-spin me-2" /> RUNNING...
                </span>
              ) : (
                "RUN COMMAND"
              )}
            </button>

            <ConfirmModal
              show={showConfirm}
              onCancel={() => {
                setShowConfirm(false);
              }}
              onConfirm={() => {
                handleSubmitCommand();
                setShowConfirm(false);
              }}
              message={`Are you sure you want to run the status change command on ${selectedJobs.length} jobs?`}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
