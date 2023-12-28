import { useLocation, useNavigate, useParams } from "react-router-dom";

const EXPERIMENT_MENU_ITEMS = [
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


const ExperimentWrapper = ({ children }) => {
    const routeParams = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <div className="d-flex gap-4 flex-fill">
            <div className="d-flex flex-column gap-4 bg-info p-4 rounded-4" 
                style={{minWidth: "16rem"}}>
                {EXPERIMENT_MENU_ITEMS.map(item => {
                    const expRoute = `/experiment/${routeParams.expid}${item.route}`
                    return (
                        <div key={item.route} style={{ cursor: "pointer" }}
                            className={"d-flex align-items-center fw-bold p-1 " + (location.pathname === expRoute ? ' text-secondary' : '')}
                            onClick={() => navigate(expRoute)}>
                            <i style={{ fontSize: "1.5rem", width: "2rem" }}
                                className={"me-4 text-center " + item.iconClass}></i>
                            <span>
                                {item.name}
                            </span>
                        </div>
                    )
                })}
            </div>
            {children}
        </div>
    )
}

export default ExperimentWrapper;