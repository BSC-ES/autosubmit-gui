import { Link, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { useLocalStorage, useWindowSize } from "@uidotdev/usehooks";

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
            className={"d-flex align-items-center fw-bold p-1 " + (location.pathname === expRoute ? ' text-secondary' : 'text-black')}
            to={expRoute}>
            <i style={{ fontSize: "1.5rem", width: "2rem" }}
              className={"text-center " + item.iconClass}></i>
            {
              showLabels &&
              <span className="mx-4">
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
  ] = useLocalStorage("options.showExperimentMenuLabelsDesktop", true)
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
        width > 992 ?
          <div className="d-flex gap-4 flex-fill">
            <div className="d-flex flex-column gap-4 bg-light border p-4 rounded-4"
            style={{maxHeight: "80vh"}}>
              <ExperimentMenuItems showLabels={showLabels} />
              <div className={"mt-auto d-flex align-items-center " + (!showLabels && "justify-content-center")}
                onClick={handleToggleLabels}
                style={{ cursor: "pointer" }}>
                
                <i className={"text-center fa-solid " + (showLabels ? "fa-angles-left" : "fa-angles-right")}
                  style={{ fontSize: "1.5rem", width: "2rem" }}></i>
              </div>
            </div>
            {children}
          </div>
          :
          <div className="d-flex gap-4 flex-column">
            <div className="d-flex flex-column">
              <div className="bg-light border text-center fw-bold py-2"
                onClick={handleToggleTopMenu}
                style={{ cursor: "pointer" }}>
                MENU <i className="ms-2 fa-solid fa-bars"></i>
              </div>
              {
                showTopMenu &&
                <div className="d-flex flex-column gap-4 bg-light border border-top-0 p-4 rounded-bottom-4"
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