import { useState } from "react";
import { JOB_STATUSES, STATUS_COLORS } from "../../services/utils";

const StatusLegend = () => {
    const [minimized, setMinimized] = useState(true);

    const hideLegendIconStyle = "fa-solid text-xs " + (minimized ? "fa-up-right-and-down-left-from-center" : "fa-compress");

    return (
        <div className="absolute bottom-0 left-0 z-10 rounded-tr-md bg-neutral-200 px-2 py-2 text-xs text-black opacity-50 hover:opacity-100">
            <div className="flex items-center justify-between gap-4 font-semibold">
                <span>Status legend</span>
                <button
                    type="button"
                    title={minimized ? "Expand status legend" : "Minimize status legend"}
                    onClick={() => setMinimized((value) => !value)}
                >
                    <i className={hideLegendIconStyle}></i>
                </button>
            </div>

            {!minimized && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    {JOB_STATUSES.map((status) => (
                        <div key={status} className="flex items-center gap-1.5">
                            <span
                                className="h-3 w-3 rounded-md border border-black"
                                style={{
                                    backgroundColor: STATUS_COLORS[status],
                                }}
                            />
                            <span>{status}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StatusLegend;
