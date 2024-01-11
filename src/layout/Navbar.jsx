import { Link, useLocation } from "react-router-dom";
import AuthBadge from "../common/AuthBadge";
import { ReactComponent as Logo } from "../common/Logo.svg"
import useWindowSize from "../hooks/useWindowSize";

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
    const { width } = useWindowSize()

    return (
        <nav className="px-4 py-3 d-flex gap-5 justify-content-between">
            <Link to={"/"}>
                <Logo style={{ height: "2.5rem" }} />
            </Link>
            {
                width > 992 &&
                <div className="flex-fill d-flex align-items-center gap-5 mx-4">
                    {
                        NAVBAR_ITEMS.map(item =>
                            <Link key={item.route}
                                className={"d-flex align-items-center " + (location.pathname === item.route ? ' text-secondary' : 'text-dark')}
                                to={item.route}>
                                <i style={{ fontSize: "1.5rem" }}
                                    className={"me-4 " + item.iconClass}></i>
                                <span>
                                    {item.name}
                                </span>
                            </Link>
                        )
                    }
                </div>
            }

            <div>
                {/* <AuthBadge></AuthBadge> */}
            </div>
        </nav>
    )
}

export default Navbar;