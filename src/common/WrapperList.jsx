import { forwardRef, useImperativeHandle, useMemo, useState, useEffect } from "react";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import { cn } from "../services/utils";

const WrapperList = forwardRef(function WrapperList(
    { expid, onNodeSelect, selectedNode, activeMonitor, setAreWrappersAvailable },
    ref,
) {
    const {
        data: wrappersResponse,
        isFetching: isWrappersFetching,
        refetch: refetchWrappers,
    } = autosubmitApiV4.endpoints.getExperimentWrappers.useQuery(
        {
            expid
        },
        {
            pollingInterval: activeMonitor ? 5000 : 0
        },
    );

    useImperativeHandle(
        ref,
        () => ({ refetchWrappers }),
        [refetchWrappers],
    );

    const [nameFilter, setNameFilter] = useState("");
    const normalizedFilter = nameFilter.trim().toLowerCase();
    const wrappers = wrappersResponse?.wrappers || [];
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
                {!wrappersResponse && isWrappersFetching ? (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
                        <div className="spinner-border dark:invert" role="status" />
                    </div>
                ) : (
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
                                    const isSelected = selectedNode?.wrapper_name === wrapper.wrapper_name
                                        || selectedNode?.key === wrapper.wrapper_name;

                                    return (
                                        <li
                                            key={wrapper.wrapper_name}
                                            className="flex items-start gap-2 mx-6"
                                            onClick={() => onNodeSelect?.(wrapper)}
                                        >
                                            <i className="fa-solid fa-layer-group mt-1 text-primary" />
                                            <div className="min-w-0">
                                                <div className={cn(
                                                    "w-fit px-1 py-[1px] hover:bg-gray-100 rounded cursor-pointer select-none",
                                                    isSelected && "bg-blue-100 hover:bg-blue-200",
                                                )}>
                                                    {wrapper.wrapper_name}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <li className="py-2 text-gray-500">No wrappers found</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
});

export default WrapperList;
