import { useMemo, useState, useEffect } from "react";
import { cn } from "../services/utils";

/**
 * Normalized wrapper used by the list.
 * @typedef {Object} Wrapper
 * @property {string} key
 * @property {string} wrapper_name
 * @property {Object<string, number>} diff_statuses_counters
 */

/**
 * Renders a filterable list of wrappers and their status counters.
 *
 * @param {Object} props Component properties.
 * @param {Object} props.wrapperTree Wrapper names mapped to their status counters.
 * @param {(wrapper: Wrapper) => void} [props.onWrapperSelect] Callback invoked when a wrapper is selected.
 * @param {Wrapper} [props.selectedWrapper] Currently selected wrapper.
 * @param {(available: boolean) => void} props.setAreWrappersAvailable Updates whether wrappers are available.
 * @returns {JSX.Element} The wrapper list component.
 */
const WrapperList = ({ wrapperTree, onWrapperSelect, selectedWrapper, setAreWrappersAvailable }) => {
    const [nameFilter, setNameFilter] = useState("");
    const normalizedFilter = nameFilter.trim().toLowerCase();

    // Map the wrapper tree into the normalized wrapper objects used by the list.
    const wrappers = useMemo(
        () => Object.entries(wrapperTree || {}).map(([wrapperName, statuses]) => ({
            key: wrapperName,
            wrapper_name: wrapperName,
            diff_statuses_counters: statuses,
        })),
        [wrapperTree],
    );

    // Filter the wrappers by its normalized name.
    const filteredWrappers = useMemo(
        () => wrappers.filter((wrapper) => wrapper.wrapper_name
            ?.toLowerCase()
            .includes(normalizedFilter)),
        [normalizedFilter, wrappers],
    );

    useEffect(() => {
        setAreWrappersAvailable(!!wrappers.length);
    }, [wrappers, setAreWrappersAvailable]);

    return (
        <>
            <div className="flex items-center mb-4 gap-2">
                <div className="relative min-w-0 flex-1">
                    <input
                        className="form-input w-full h-8 rounded-lg"
                        placeholder="Filter wrappers..."
                        value={nameFilter}
                        onChange={(event) => setNameFilter(event.target.value)}
                    />
                    {nameFilter && (
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                            title="Clear wrapper filter"
                            onClick={() => setNameFilter("")}
                        >
                            <i className="fa-solid fa-xmark" />
                        </button>
                    )}
                </div>
            </div>
            <div className="relative flex-1 min-h-0">
                <div className="h-full overflow-auto custom-scrollbar">
                    <ul
                        className="w-fit min-w-full pr-6 text-sm flex flex-col gap-[0.35rem] py-1 font-thin"
                        style={{
                            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                            color: "#333",
                        }}
                    >
                        {filteredWrappers.length > 0 ? (
                            filteredWrappers.map((wrapper) => {
                                const counter = Object.values(wrapper.diff_statuses_counters || {}).reduce(
                                    (acc, count) => acc + count,
                                    0,
                                );
                                const isSelected = selectedWrapper?.wrapper_name === wrapper.wrapper_name
                                    || selectedWrapper?.key === wrapper.wrapper_name;

                                return (
                                    <li
                                        key={wrapper.wrapper_name}
                                        className="flex items-start gap-2 mx-2"
                                        onClick={() => onWrapperSelect?.(wrapper)}
                                    >
                                        <i className="fa-solid fa-layer-group mt-1 text-primary" />
                                        <div className="bg-primary-400 text-white px-1.5 rounded-full text-[0.65rem]">
                                            {counter}
                                        </div>
                                        <div className="min-w-0">
                                            <div className={cn(
                                                "w-fit px-1 py-[1px] hover:bg-gray-100 rounded cursor-pointer select-none",
                                                isSelected && "bg-blue-100 hover:bg-blue-200",
                                            )}>
                                                {wrapper.wrapper_name}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 ml-2">
                                            {counter > 0 && (
                                                <span className={cn(
                                                    "badge text-[0.7rem] text-nowrap",
                                                    (wrapper.diff_statuses_counters?.COMPLETED || 0) === counter
                                                        ? "badge-status-completed"
                                                        : "badge-status-some-completed",
                                                )}>
                                                    {wrapper.diff_statuses_counters?.COMPLETED || 0} / {counter} COMPLETED
                                                </span>
                                            )}
                                            {Object.entries(wrapper.diff_statuses_counters || {}).map(([status, count]) => (
                                                count > 0 && ["RUNNING", "QUEUING", "FAILED"].includes(status) && (
                                                    <span key={status} className={`badge badge-status-${status.toLowerCase()} text-[0.7rem] text-nowrap`}>
                                                        {count} {status}
                                                    </span>
                                                )
                                            ))}
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-2 text-gray-500">No wrappers found</li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default WrapperList;
