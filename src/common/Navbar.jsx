import { useLocation, useNavigate } from "react-router-dom";

const NAVBAR_ITEMS = [
    {
        name: "Home",
        iconClass: "fa-solid fa-house",
        route: "/"
    },
    {
        name: "About",
        iconClass: "fa-solid fa-circle-info",
        route: "/about"
    },
]

const Navbar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <nav>
            <img style={{ height: "3rem" }}
                src="/img/as_gui.png"
                alt="logo" />
            {
                NAVBAR_ITEMS.map(item => <>
                    <span
                        className={(location.pathname === item.route ? ' text-secondary' : '')}
                        onClick={() => navigate(item.route)}
                    >
                        <i className={item.iconClass}></i>
                        {item.name}
                    </span>
                </>)
            }
        </nav>
    )
}

export default Navbar;