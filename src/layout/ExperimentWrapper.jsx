import { Link, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { useLocalStorage, useWindowSize } from "@uidotdev/usehooks";
import { cn } from "../services/utils";

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
              (location.pathname === expRoute ? ' text-secondary' : 'text-black'))}
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
            <div className="flex flex-col gap-2 bg-light border p-5 rounded-2xl"
              style={{ maxHeight: "80vh" }}>
              <ExperimentMenuItems showLabels={showLabels} />
              <div className={cn("mt-auto flex items-center cursor-pointer p-2 rounded transition-colors hover:bg-black/5",
                 (!showLabels && "justify-center"))}
                onClick={handleToggleLabels}>
                <i className={cn("text-center text-2xl w-8 fa-solid",
                (showLabels ? "fa-angles-left" : "fa-angles-right"))}></i>
              </div>
            </div>
            {children}
          </div>
          :
          <div className="flex gap-4 flex-col">
            <div className="flex flex-col">
              <div className="bg-light border text-center font-bold py-2 cursor-pointer"
                onClick={handleToggleTopMenu}>
                MENU <i className="ms-2 fa-solid fa-bars"></i>
              </div>
              {
                showTopMenu &&
                <div className="flex flex-col gap-1 bg-light border border-t-0 py-4 px-6 rounded-b-2xl"
                  onClick={handleToggleTopMenu}>
                  <ExperimentMenuItems />
                </div>
              }
            </div>

            {children}
          </div>

      }
    </>

  )
}

export default ExperimentWrapper;