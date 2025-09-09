import { Link, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { useLocalStorage, useWindowSize } from "@uidotdev/usehooks";
import { cn } from "../services/utils";
import ExperimentInfoHeader from "../common/ExperimentInfoHeader";

const EXPERIMENT_MENU_ITEMS = [
  {
    name: "QUICK VIEW",
    iconClass: "fa-solid fa-list",
    route: "/quick"
  },
  {
    name: "TREE VIEW",
    iconClass: "fa-solid fa-folder-tree",
    route: "/tree"
  },
  {
    name: "GRAPH VIEW",
    iconClass: "fa-solid fa-network-wired",
    route: "/graph"
  },
  {
    name: "TABLE VIEW",
    iconClass: "fa-solid fa-table",
    route: "/table"
  },
  {
    name: "RUN LOG",
    iconClass: "fa-solid fa-terminal",
    route: "/runlog"
  },
  {
    name: "CONFIGURATION",
    iconClass: "fa-solid fa-gear",
    route: "/config"
  },
  {
    name: "STATISTICS",
    iconClass: "fa-solid fa-chart-simple",
    route: "/stats"
  },
  {
    name: "PERFORMANCE",
    iconClass: "fa-solid fa-stopwatch",
    route: "/performance"
  },
  {
    name: "USER METRICS",
    iconClass: "fa-solid fa-magnifying-glass-chart",
    route: "/user-metrics"
  }
]

const ExperimentMenuItems = ({ showLabels = true }) => {
  const routeParams = useParams()
  const location = useLocation()

  return (
    <>
      {EXPERIMENT_MENU_ITEMS.map(item => {
        const expRoute = `/experiment/${routeParams.expid}${item.route}`
        return (
          <Link key={item.route}
            className={cn("flex items-center font-bold p-2 rounded transition-colors hover:bg-black/5",
              { 'text-secondary': (location.pathname === expRoute) },
              "dark:hover:bg-black/20"
            )}
            to={expRoute}>
            <i className={cn("text-center text-2xl w-8", item.iconClass)}></i>
            {
              showLabels &&
              <span className="mx-6">
                {item.name}
              </span>
            }
          </Link>
        )
      })}
    </>
  )
}

const ExperimentWrapper = ({ children }) => {
  const routeParams = useParams()
  const { width } = useWindowSize()
  const [
    showExperimentMenuLabelsDesktop,
    saveShowExperimentMenuLabelsDesktop
  ] = useLocalStorage("asgui.layout.experiment.menu.showLabels", true)
  const [showLabels, setShowLabels] = useState(showExperimentMenuLabelsDesktop)
  const [showTopMenu, setShowTopMenu] = useState(false)

  const handleToggleLabels = () => {
    setShowLabels(!showLabels);
    saveShowExperimentMenuLabelsDesktop(!showLabels);
  }
  const handleToggleTopMenu = () => { setShowTopMenu(!showTopMenu) }

  return (
    <>
      {
        width >= 1024 ?
          <div className="flex gap-6 grow">
            <div className={cn("flex flex-col gap-2 border-e p-5",
              "dark:bg-neutral-700 dark:border-neutral-700")}
              style={{ maxHeight: "80vh" }}>
              <ExperimentMenuItems showLabels={showLabels} />
              <div className={cn("mt-auto flex items-center cursor-pointer p-2 rounded transition-colors hover:bg-black/5",
                (!showLabels && "justify-center"),
                "dark:hover:bg-black/20"
              )}
                onClick={handleToggleLabels}>
                <i className={cn("text-center text-2xl w-8 fa-solid",
                  (showLabels ? "fa-angles-left" : "fa-angles-right"))}></i>
              </div>
            </div>
              
            <div className="flex flex-col gap-4 grow min-w-0">
              <ExperimentInfoHeader expid={routeParams.expid} />
              {children}
            </div>
          </div>
          :
          <div className="flex gap-4 flex-col">
            <div className="flex flex-col">
              <div className={cn("bg-light border text-center font-bold py-2 cursor-pointer",
                "dark:bg-neutral-700 dark:border-neutral-600"
              )}
                onClick={handleToggleTopMenu}>
                MENU <i className="ms-2 fa-solid fa-bars"></i>
              </div>
              {
                showTopMenu &&
                <div className={cn("flex flex-col gap-1 border border-t-0 py-4 px-6 rounded-b-2xl",
                  "dark:bg-neutral-700 dark:border-neutral-700"
                )}
                  onClick={handleToggleTopMenu}>
                  <ExperimentMenuItems />
                </div>
              }
            </div>
            
            <ExperimentInfoHeader expid={routeParams.expid} />
            {children}
          </div>

      }
    </>

  )
}

export default ExperimentWrapper;