import useHierarchyTree from "../hooks/useHierarchyTree";
import { cn } from "../services/utils";

const HierarchyTree = ({ expid, onNodeSelect, selectedNode, activeMonitor }) => {
    const {
        treeDirs,
        isTreeFetching,
        refetchTree,
        expandedNodes,
        handleNodeSelect,
        handleNodeExpand,
        handleAllNodesExpand,
    } = useHierarchyTree({ expid, onNodeSelect, activeMonitor });

    const renderNodes = (nodes) => nodes?.map((treeDir, index) => {
        const counter = Object.values(treeDir.diff_statuses_counters || {}).reduce(
            (acc, count) => acc + count,
            0,
        );
        const isSelected = selectedNode && selectedNode.key === treeDir.key;

        return (
            <li key={treeDir.key || index}>
                <div className="flex items-center">
                    {treeDir.children && treeDir.children.length > 0 ? (
                        <i
                            className={cn(
                                "fa-solid fa-caret-down mr-1 cursor-pointer transition-transform duration-300 ease-in-out",
                                expandedNodes[treeDir.key] === false && "-rotate-90",
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
                            if (treeDir.children && treeDir.children.length > 0) {
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
                        expandedNodes[treeDir.key] === false
                            ? "grid-rows-[0fr] opacity-0"
                            : "grid-rows-[1fr] opacity-100",
                    )}>
                        <div className="min-h-0">
                            <ul className="flex flex-col gap-[0.35rem]">
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
            <div className="relative">
                <div className="absolute top-0 right-0 z-10 flex flex-wrap gap-2 items-start text-xs text-white opacity-50 hover:opacity-75 transition-opacity">
                    <button
                        className="w-6 h-6 inline-flex items-center justify-center rounded-md bg-primary shadow-lg opacity-50 hover:opacity-100 active:scale-95 active:opacity-100 transition-transform"
                        onClick={(event) => handleAllNodesExpand(event, true)}
                        title="Expand all"
                    >
                        <i class="fa-solid fa-square-caret-down" />
                    </button>
                    <button
                        className="w-6 h-6 inline-flex items-center justify-center rounded-md bg-secondary shadow-md opacity-50 hover:opacity-100 active:scale-95 active:opacity-100 transition-transform"
                        onClick={(event) => handleAllNodesExpand(event, false)}
                        title="Collapse all"
                    >
                        <i class="fa-solid fa-square-caret-up" />
                    </button>
                </div>
                <ul
                    className="text-sm flex flex-col gap-[0.35rem] py-1 font-thin"
                    style={{
                        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                        color: "#333",
                    }}
                >
                    {renderNodes(treeDirs)}
                </ul>
            </div>
        </>
    )
};

export default HierarchyTree;
