import { Link, useLocation } from "react-router-dom";
import AuthBadge from "../common/AuthBadge";
import { ReactComponent as Logo } from "../common/Logo.svg"
import { useWindowSize } from "@uidotdev/usehooks";
import DarkThemeSwitcher from "../common/DarkThemeSwitcher";
import { DARK_MODE_SWITCHER } from "../consts";

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
        <Logo className="h-10" />
      </Link>
      {
        width >= 768 &&
        <div className="grow flex items-center gap-12 px-6">
          {
            NAVBAR_ITEMS.map(item =>
              <Link key={item.route}
                className={"flex items-center " + (location.pathname === item.route ? ' text-secondary' : 'text-dark dark:text-light')}
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

      <div className="flex gap-4">
        <AuthBadge />
        {
          DARK_MODE_SWITCHER &&
          <DarkThemeSwitcher />
        }
      </div>
    </nav>
  )
}

export default Navbar;