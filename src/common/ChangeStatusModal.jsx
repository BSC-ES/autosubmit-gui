import { useState } from "react";
import { STATUS_STYLES } from "../services/utils";
import Modal from "./Modal";
import {
  commandGeneratorGraph,
  statusChangeTextGeneratorGraph,
} from "../components/context/utils";
import { useCopyToClipboard } from "@uidotdev/usehooks";

export function ChangeStatusModal({ expid, selectedJobs, show, onHide }) {
  const copyToClipboard = useCopyToClipboard()[1];
  const [targetStatus, setTargetStatus] = useState("WAITING");
  const [type, setType] = useState("cmd");
  const [copied, setCopied] = useState("Copy to clipboard");

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
  return (
    <Modal show={show} onClose={onHide}>
      <div className="bg-white text-black py-6 px-6 rounded-lg relative w-[40rem] max-w-[95vw]">
        <div className="cursor-pointer absolute top-4 right-4" onClick={onHide}>
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
        </div>
      </div>
    </Modal>
  );
}
