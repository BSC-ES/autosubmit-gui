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
        route: ""
    },
]


const ExperimentWrapper = ({ children }) => {
    const routeParams = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <div className="d-flex gap-4">
            <div className="d-flex flex-column gap-3 bg-info p-4 rounded">
                {EXPERIMENT_MENU_ITEMS.map(item => {
                    const expRoute = `/experiment/${routeParams.expid}${item.route}`
                    return (
                        <div key={item.route} style={{ cursor: "pointer" }}
                            className={"d-flex align-items-center fw-bold " + (location.pathname === expRoute ? ' text-secondary' : '')}
                            onClick={() => navigate(expRoute)}>
                            <i style={{ fontSize: "1.5rem" }}
                                className={"me-2 " + item.iconClass}></i>
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