import { Link, useLocation } from "react-router-dom";
import AuthBadge from "../common/AuthBadge";
import { ReactComponent as Logo } from "../common/Logo.svg"
import { useWindowSize } from "@uidotdev/usehooks";

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
        <nav className="flex justify-between gap-12 py-4 px-6">
            <Link to={"/"}>
                <Logo className="h-10"/>
            </Link>
            {
                width > 992 &&
                <div className="grow flex items-center gap-12 px-6">
                    {
                        NAVBAR_ITEMS.map(item =>
                            <Link key={item.route}
                                className={"flex items-center " + (location.pathname === item.route ? ' text-secondary' : 'text-dark')}
                                to={item.route}>
                                <i className={"text-2xl mr-6 " + item.iconClass}></i>
                                <span>
                                    {item.name}
                                </span>
                            </Link>
                        )
                    }
                </div>
            }

            <div>
                <AuthBadge></AuthBadge>
            </div>
        </nav>
    )
}

export default Navbar;