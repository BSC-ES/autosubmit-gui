import { useLocation, useNavigate } from "react-router-dom";
import AuthBadge from "./AuthBadge";

const NAVBAR_ITEMS = [
    {
        name: "HOME",
        iconClass: "fa-solid fa-house",
        route: "/"
    },
    {
        name: "ABOUT",
        iconClass: "fa-solid fa-circle-info",
        route: "/about"
    },
]

const Navbar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <nav className="px-4 py-3 d-flex gap-5">
            <div className="">
                <img style={{ height: "2.5rem", cursor: "pointer" }}
                    onClick={() => navigate("/")}
                    src="/img/as_gui.png"
                    alt="logo" />
            </div>
            <div className="flex-fill d-flex align-items-center gap-5">
                {
                    NAVBAR_ITEMS.map(item =>
                        <div key={item.route} style={{ cursor: "pointer" }}
                            className={"d-flex align-items-center " + (location.pathname === item.route ? ' text-secondary' : '')}
                            onClick={() => navigate(item.route)}>
                            <i style={{ fontSize: "1.5rem" }}
                                className={"me-4 " + item.iconClass}></i>
                            <span>
                                {item.name}
                            </span>
                        </div>
                    )
                }
            </div>
            <div>
                <AuthBadge></AuthBadge>
            </div>
        </nav>
    )
}

export default Navbar;