import { Link, useLocation, useParams } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";

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

const ExperimentMenu = () => {
    const routeParams = useParams()
    const location = useLocation()

    return (
        <div className="d-flex flex-column gap-4 bg-light border p-4 rounded-4"
            style={{ minWidth: "16rem" }}>
            {EXPERIMENT_MENU_ITEMS.map(item => {
                const expRoute = `/experiment/${routeParams.expid}${item.route}`
                return (
                    <Link key={item.route}
                        className={"d-flex align-items-center fw-bold p-1 " + (location.pathname === expRoute ? ' text-secondary' : 'text-black')}
                        to={expRoute}>
                        <i style={{ fontSize: "1.5rem", width: "2rem" }}
                            className={"me-4 text-center " + item.iconClass}></i>
                        <span>
                            {item.name}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}

const ExperimentWrapper = ({ children }) => {
    const { width } = useWindowSize()

    return (
        <>
            {
                width > 992 ?
                    <div className="d-flex gap-4 flex-fill">
                        <ExperimentMenu />
                        {children}
                    </div>
                    :
                    <div className="d-flex gap-4 flex-column">
                        <ExperimentMenu />
                        {children}
                    </div>

            }
        </>

    )
}

export default ExperimentWrapper;