import {
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  useImperativeHandle,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

// Tree Selection Context
const TreeSelectionContext = createContext({
  selectedNodes: new Set(),
  isSelectable: false,
  selectNode: () => {},
  isSelected: () => false,
});

// Tree Selection Provider
const TreeSelectionProvider = ({
  children,
  selectable = false,
  onSelectNodes,
}) => {
  const [selectedNodes, setSelectedNodes] = useState(new Set());

  const selectNode = (nodeData, isSelected, clearOthers = false) => {
    if (!selectable) return;

    setSelectedNodes((prevSelected) => {
      const newSelected = clearOthers ? new Set() : new Set(prevSelected);

      if (isSelected) {
        newSelected.add(nodeData);
      } else {
        newSelected.delete(nodeData);
      }

      // Trigger callback with array of selected node IDs
      if (onSelectNodes) {
        onSelectNodes(Array.from(newSelected));
      }

      return newSelected;
    });
  };

  const isSelected = (node) => {
    return selectedNodes.has(node);
  };

  const contextValue = useMemo(
    () => ({
      selectedNodes,
      isSelectable: selectable,
      selectNode,
      isSelected,
    }),
    [selectedNodes, selectable, selectNode, isSelected]
  );

  return (
    <TreeSelectionContext.Provider value={contextValue}>
      {children}
    </TreeSelectionContext.Provider>
  );
};

// Hook to use tree selection context
const useTreeSelection = () => {
  const context = useContext(TreeSelectionContext);
  if (!context) {
    throw new Error(
      "useTreeSelection must be used within a TreeSelectionProvider"
    );
  }
  return context;
};

// Utility function to count leaf nodes in a subtree
const countLeafNodes = (node) => {
  if (!node.children || node.children.length === 0) {
    return 1; // This is a leaf node
  }

  return node.children.reduce((count, child) => {
    return count + countLeafNodes(child);
  }, 0);
};

// Default title renderer - handles different data types gracefully
const _defaultNodeTitleRender = ({ data }) => {
  if (typeof data === "string") {
    return <span>{data}</span>;
  }
  if (data && typeof data === "object") {
    // Display name, title, or id if available, otherwise fallback to JSON
    const displayText =
      data.name || data.title || data.label || data.id || JSON.stringify(data);
    return <span>{displayText}</span>;
  }
  return <span>{String(data)}</span>;
};

const TitleTreeNode = ({
  data,
  titleRenderFn = _defaultNodeTitleRender,
  firstIcon,
  secondIcon,
  onClick,
  onDoubleClick,
}) => {
  const { isSelectable, selectNode, isSelected } = useTreeSelection();
  const nodeIsSelected = isSelected(data);

  const handleClick = (e) => {
    if (isSelectable && (e.ctrlKey || e.metaKey)) {
      // Multi-select with Ctrl/Cmd key
      e.stopPropagation();
      selectNode(data, !nodeIsSelected);
    } else if (isSelectable && e.shiftKey) {
      // Select with Shift key
      // TODO: Range selection could be implemented later
      e.stopPropagation();
      selectNode(data, !nodeIsSelected);
    } else if (isSelectable && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      // Single select
      e.stopPropagation();
      selectNode(data, true, true); // true for clearOthers
    }

    onClick && onClick(e);
  };

  return (
    <span
      className={`flex gap-3 py-[1px] cursor-pointer`}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
    >
      <span className="flex items-center w-3">{firstIcon}</span>
      <span className="flex items-center w-3">{secondIcon}</span>
      <span
        className={`px-1 py-[1px]  ${
          nodeIsSelected
            ? "bg-sky-700 text-white hover:bg-sky-800 rounded"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        }`}
      >
        {titleRenderFn({ data })}
      </span>
    </span>
  );
};

// Leaf node component for nodes without children
const LeafTreeNode = ({ data, titleRenderFn = _defaultNodeTitleRender }) => {
  return (
    <li className="flex flex-col">
      <TitleTreeNode
        data={data}
        titleRenderFn={titleRenderFn}
        firstIcon={<></>}
        secondIcon={<i className="fa-regular fa-circle text-primary" />}
      />
    </li>
  );
};

// Component for nodes that support lazy loading of children
const LazyExpandableTreeNode = ({
  data,
  titleRenderFn = _defaultNodeTitleRender,
  onLoadChildren,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState(data.children || []);
  const [loadError, setLoadError] = useState(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const toggleExpand = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!isExpanded) {
        // Expanding - load children if needed
        if (
          !hasAttemptedLoad &&
          onLoadChildren &&
          (!data.children || data.children.length === 0)
        ) {
          setIsLoading(true);
          setLoadError(null);
          try {
            const loadedChildren = await onLoadChildren(data);
            setChildren(loadedChildren || []);
            setHasAttemptedLoad(true);
          } catch (error) {
            setLoadError(error.message || "Failed to load children");
            console.error("Error loading children:", error);
          } finally {
            setIsLoading(false);
          }
        }
      }
      setIsExpanded(!isExpanded);
    },
    [isExpanded, onLoadChildren, data, hasAttemptedLoad]
  );

  const hasChildren = children && children.length > 0;
  const canExpand = hasChildren || (onLoadChildren && !hasAttemptedLoad);

  return (
    <li className="flex flex-col">
      <span
        className={`flex gap-3 px-6 ${
          canExpand ? "cursor-pointer hover:bg-gray-50" : ""
        }`}
        onClick={canExpand ? toggleExpand : undefined}
      >
        <span className="flex items-center">
          {canExpand ? (
            <i
              className={`fa-regular ${
                isExpanded ? "fa-folder-open" : "fa-folder"
              } text-primary`}
            />
          ) : (
            <i className="fa-regular fa-circle text-primary" />
          )}
        </span>
        {titleRenderFn({ data })}
        {isLoading && (
          <span className="ml-2">
            <i className="fa fa-spinner fa-spin text-gray-500" />
          </span>
        )}
      </span>

      {isExpanded && (
        <ul className="pl-6">
          {loadError ? (
            <li className="px-6 text-red-500 text-sm">
              <i className="fa fa-exclamation-triangle mr-2" />
              {loadError}
            </li>
          ) : (
            children.map((child) => (
              <TreeNode
                key={child.id || Math.random()}
                data={child}
                titleRenderFn={titleRenderFn}
                onLoadChildren={onLoadChildren}
              />
            ))
          )}
        </ul>
      )}
    </li>
  );
};

// Regular expandable node for nodes with pre-loaded children
const ExpandableTreeNode = ({
  data,
  titleRenderFn = _defaultNodeTitleRender,
  onLoadChildren,
}) => {
  const [isExpanded, setIsExpanded] = useState(data?.expanded);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const hasChildren = useMemo(
    () => data.children && data.children.length > 0,
    [data]
  );

  if (!hasChildren) {
    return <LeafTreeNode data={data} titleRenderFn={titleRenderFn} />;
  }

  // Calculate leaf count for this subtree
  const leafCount = useMemo(() => countLeafNodes(data), [data]);

  return (
    <li className="flex flex-col">
      <TitleTreeNode
        data={data}
        titleRenderFn={titleRenderFn}
        onDoubleClick={toggleExpand}
        firstIcon={
          <i
            className={`fa-solid hover:text-sky-300 ${
              isExpanded ? "fa-caret-down" : "fa-caret-right"
            }`}
            onClick={toggleExpand}
          />
        }
        secondIcon={
          <i
            className={`relative fa-solid ${
              isExpanded ? "fa-folder-open" : "fa-folder"
            } text-black`}
          >
            <span
              className="absolute -top-1 -right-1 text-[6px] bg-gray-200 text-gray-800 rounded-full px-[4px] py-[2px]"
              style={{ userSelect: "none" }}
            >
              {leafCount < 100 ? leafCount : "99+"}
            </span>
          </i>
        }
      />

      <AnimatePresence>
        {isExpanded && (
          <motion.ul
            className="pl-6 overflow-y-hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {data.children.map((child) => (
              <TreeNode
                key={child.refKey || Math.random()}
                data={child}
                titleRenderFn={titleRenderFn}
                onLoadChildren={onLoadChildren}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

// Generic tree node that determines which type of node to render
const TreeNode = ({ data, titleRenderFn, onLoadChildren }) => {
  // Check if this node supports lazy loading
  const supportsLazyLoading = useMemo(() => {
    return (
      data.hasChildren ||
      data.loadChildren ||
      (onLoadChildren &&
        (data.children === undefined || data.children === null))
    );
  }, [data, onLoadChildren]);

  // Check if this node has children or can have children
  const hasChildren = useMemo(
    () => data.children && data.children.length > 0,
    [data]
  );
  const canHaveChildren = hasChildren || supportsLazyLoading;

  if (!canHaveChildren) {
    return <LeafTreeNode data={data} titleRenderFn={titleRenderFn} />;
  }

  if (supportsLazyLoading) {
    return (
      <LazyExpandableTreeNode
        data={data}
        titleRenderFn={titleRenderFn}
        onLoadChildren={onLoadChildren}
      />
    );
  }

  return (
    <ExpandableTreeNode
      data={data}
      titleRenderFn={titleRenderFn}
      onLoadChildren={onLoadChildren}
    />
  );
};

// Internal Tree component that renders the actual tree
const TreeContent = ({
  nodes,
  titleRenderFn = _defaultNodeTitleRender,
  onLoadChildren,
}) => {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="px-6 py-4 text-gray-500 text-sm">No items to display</div>
    );
  }

  return (
    <ul className="tree-container">
      {nodes.map((node) => (
        <TreeNode
          key={node.refKey || Math.random()}
          data={node}
          titleRenderFn={titleRenderFn}
          onLoadChildren={onLoadChildren}
        />
      ))}
    </ul>
  );
};

// Main Tree component
const Tree = ({
  ref,
  nodes,
  selectable = false,
  onSelectNodes,
  titleRenderFn = _defaultNodeTitleRender,
  onLoadChildren,
}) => {
  const expandAll = () => {
    // Logic to expand/collapse all nodes
  };
  const collapseAll = () => {
    // Logic to expand/collapse all nodes
  };
  // Expose a method to expand/collapse all nodes could be added here
  useImperativeHandle(ref, () => ({
    expandAll,
    collapseAll,
  }));

  return (
    <TreeSelectionProvider
      selectable={selectable}
      onSelectNodes={onSelectNodes}
    >
      <TreeContent
        nodes={nodes}
        titleRenderFn={titleRenderFn}
        onLoadChildren={onLoadChildren}
      />
    </TreeSelectionProvider>
  );
};

export default Tree;
