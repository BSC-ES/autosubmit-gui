import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export const triggerDownload = (href, download) => {
  let link = document.createElement("a");
  link.href = href;
  link.download = download;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


/**
 * Very simple export to CSV utility
 * @param {Array} columns 
 * @param {Array<Array>} data 
 * @param {string} filename 
 */
export const exportToCSV = (columns, data, filename, sep = ",") => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += columns.join(sep) + "\n";
  csvContent += data.map(row => row.join(sep)).join("\n");

  const encodedUri = encodeURI(csvContent);

  // Trigger download action
  triggerDownload(encodedUri, filename)
}


export const saveSVGObj = (svgData, filename) => {
  const svgString = (new XMLSerializer()).serializeToString(svgData);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  triggerDownload(svgUrl, filename)
}


export const STATUS_STYLES = {
  "UNKNOWN": {
    badge: "badge-status-unknown"
  },
  "WAITING": {
    badge: "badge-status-waiting"
  },
  "READY": {
    badge: "badge-status-ready"
  },
  "PREPARED": {
    badge: "badge-status-prepared"
  },
  "SUBMITTED": {
    badge: "badge-status-submitted"
  },
  "HELD": {
    badge: "badge-status-held"
  },
  "QUEUING": {
    badge: "badge-status-queuing"
  },
  "RUNNING": {
    badge: "badge-status-running"
  },
  "COMPLETED": {
    badge: "badge-status-completed"
  },
  "FAILED": {
    badge: "badge-status-failed"
  },
  "SUSPENDED": {
    badge: "badge-status-suspended"
  },
  "SKIPPED": {
    badge: "badge-status-skipped"
  },
  "DELAYED": {
    badge: "badge-status-delayed"
  },
}

export const getStatusBadgeStyle = (status) => {
  return STATUS_STYLES[status]?.badge || "badge-status-unknown";
};

export const parseLogPath = (logfile) => {
  const logPathSplit = logfile && logfile.length > 0 ? logfile.split("/") : [""];
  const logFileName = logPathSplit.pop();
  return logFileName;
};
