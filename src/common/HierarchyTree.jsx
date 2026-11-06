import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import useHierarchyTree from "../hooks/useHierarchyTree";
import { cn } from "../services/utils";

const HierarchyTree = forwardRef(function HierarchyTree(
    { expid, onNodeSelect, selectedNode, activeMonitor },
    ref,
) {
    const {
        treeDirs,
        isTreeFetching,
        refetchTree,
        expandedNodes,
        handleNodeSelect,
        handleNodeExpand,
        handleAllNodesExpand,
    } = useHierarchyTree({ expid, onNodeSelect, activeMonitor });

    useImperativeHandle(
        ref,
        () => ({ refetchTree }),
        [refetchTree],
    );

    const [nameFilter, setNameFilter] = useState("");
    const [isFilterActive, setIsFilterActive] = useState(false);
    const normalizedFilter = nameFilter.trim().toLowerCase();
    const filteredTreeDirs = useMemo(() => {
        if (!normalizedFilter) return treeDirs;

        const filterNodes = (nodes = []) => nodes
            .map((node) => {
                const children = filterNodes(node.children);
                const matches = node.title.toLowerCase().includes(normalizedFilter);

                return matches || children.length > 0
                    ? { ...node, children: matches ? node.children : children }
                    : null;
            })
            .filter(Boolean);

        return filterNodes(treeDirs);
    }, [normalizedFilter, treeDirs]);

    const renderNodes = (nodes) => nodes?.map((treeDir, index) => {
        const counter = Object.values(treeDir.diff_statuses_counters || {}).reduce(
            (acc, count) => acc + count,
            0,
        );
        const isSelected = selectedNode && selectedNode.key === treeDir.key;

        return (
            <li key={treeDir.key || index}>
                <div className="flex items-center my-0.5">
                    {treeDir.children && treeDir.children.length > 0 ? (
                        <i
                            className={cn(
                                "fa-solid fa-caret-down mr-1 cursor-pointer transition-transform duration-300 ease-in-out",
                                !normalizedFilter && expandedNodes[treeDir.key] === false && "-rotate-90",
                            )}
                            onClick={(event) => handleNodeExpand(event, treeDir.key)}
                        />
                    ) : (
                        <span className="fa-solid mr-1 opacity-0" />
                    )}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={(event) => {
                            handleNodeSelect(treeDir);
                            if (
                                treeDir.children
                                && treeDir.children.length > 0
                                && expandedNodes[treeDir.key] === false
                            ) {
                                handleNodeExpand(event, treeDir.key);
                            }
                        }}
                    >
                        <i className="fa-solid fa-folder" />
                        <span className={cn(
                            "px-1 py-[1px] hover:bg-gray-100 rounded",
                            isSelected && "bg-blue-100 hover:bg-blue-200",
                        )}>
                            {treeDir.title}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                        {counter > 0 && (
                            <span className={cn(
                                "badge text-[0.7rem] text-nowrap",
                                (treeDir.diff_statuses_counters?.COMPLETED || 0) === counter
                                    ? "badge-status-completed"
                                    : "badge-status-some-completed",
                            )}>
                                {treeDir.diff_statuses_counters?.COMPLETED || 0}/{counter} COMPLETED
                            </span>
                        )}
                        {Object.entries(treeDir.diff_statuses_counters || {}).map(([status, count]) => (
                            count > 0 && ["RUNNING", "QUEUING", "FAILED"].includes(status) && (
                                <span key={status} className={`badge badge-status-${status.toLowerCase()} text-[0.7rem] text-nowrap`}>
                                    {count} {status}
                                </span>
                            )
                        ))}
                    </div>
                </div>
                {treeDir.children && treeDir.children.length > 0 && (
                    <div className={cn(
                        "ml-6 grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                        !normalizedFilter && expandedNodes[treeDir.key] === false
                            ? "grid-rows-[0fr] opacity-0"
                            : "grid-rows-[1fr] opacity-100",
                    )}>
                        <div className="min-h-0">
                            <ul className="flex flex-col my-0.5">
                                {renderNodes(treeDir.children)}
                            </ul>
                        </div>
                    </div>
                )}
            </li>
        );
    });

    return !treeDirs && isTreeFetching ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
            <div className="spinner-border dark:invert" role="status"></div>
        </div>
    ) : (
        <>
            <div className="sticky top-0 z-10 flex items-center mb-2 gap-2 border border-gray-150 bg-white rounded-xl p-2">
                <div className="relative min-w-0 flex-1">
                    <input
                        className="form-input w-full h-8 rounded-lg"
                        placeholder="Filter directories..."
                        value={nameFilter}
                        onFocus={() => setIsFilterActive(true)}
                        onBlur={() => setIsFilterActive(false)}
                        onChange={(event) => setNameFilter(event.target.value)}
                    />
                    {nameFilter && (
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                            title="Clear directory filter"
                            aria-label="Clear directory filter"
                            onClick={() => setNameFilter("")}
                        >
                            <i className="fa-solid fa-xmark" />
                        </button>
                    )}
                </div>
                <div className={cn(
                    "flex items-center gap-2 overflow-hidden whitespace-nowrap transition-[max-width,transform,opacity] duration-200 ease-in-out",
                    !nameFilter && !isFilterActive
                        ? "max-w-[5rem] translate-x-0 opacity-100"
                        : "pointer-events-none max-w-0 -translate-x-2 opacity-0",
                )}>
                        <button
                            type="button"
                            className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-primary text-primary hover:opacity-100 active:scale-95 active:opacity-100 transition-transform"
                            onClick={(event) => handleAllNodesExpand(event, true)}
                            title="Expand all"
                        >
                            <i className="fa-solid fa-square-caret-down" />
                        </button>
                        <button
                            type="button"
                            className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-secondary text-secondary hover:opacity-100 active:scale-95 active:opacity-100 transition-transform"
                            onClick={(event) => handleAllNodesExpand(event, false)}
                            title="Collapse all"
                        >
                            <i className="fa-solid fa-square-caret-up" />
                        </button>
                </div>
            </div>
            <ul
                className="text-sm flex flex-col gap-[0.35rem] py-1 font-thin"
                style={{
                    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                    color: "#333",
                }}
            >
                {filteredTreeDirs?.length > 0 ? (
                    renderNodes(filteredTreeDirs)
                ) : (
                    <li className="py-2 text-gray-500">No directories found</li>
                )}
            </ul>
        </>
    )
});

export default HierarchyTree;
