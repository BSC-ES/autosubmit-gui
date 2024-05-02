import { Link, useLocation } from "react-router-dom";
import AuthBadge from "../common/AuthBadge";
import { ReactComponent as Logo } from "../common/Logo.svg";
import { useWindowSize } from "@uidotdev/usehooks";
import DarkThemeSwitcher from "../common/DarkThemeSwitcher";
import { AUTHENTICATION, CUSTOM_LOGO_URL, DARK_MODE_SWITCHER } from "../consts";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "../services/utils";

const NAVBAR_BREAKPOINT = 768;

const NAVBAR_ITEMS = [
  {
    name: "HOME",
    iconClass: "fa-solid fa-house",
    route: "/",
  },
  {
    name: "ABOUT",
    iconClass: "fa-solid fa-circle-info",
    route: "/about",
  },
];

const NavbarMenuItems = ({ onItemClick }) => {
  const location = useLocation();

  return (
    <>
      {NAVBAR_ITEMS.map((item) => (
        <Link
          key={item.route}
          className={cn(
            "flex items-center transition-colors px-2 py-1",
            location.pathname === item.route
              ? " text-secondary"
              : "text-dark dark:text-light"
          )}
          to={item.route}
          onClick={onItemClick}
        >
          <i className={"text-2xl mr-6 " + item.iconClass}></i>
          <span>{item.name}</span>
        </Link>
      ))}
    </>
  );
};

const Navbar = () => {
  const { width } = useWindowSize();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (width >= NAVBAR_BREAKPOINT) setOpen(false);
  }, [width]);

  return (
    <nav className="flex gap-12 py-4 px-6 items-center">
      {width < NAVBAR_BREAKPOINT && (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <i className="fa-solid fa-bars text-2xl"></i>
          </Dialog.Trigger>
          <AnimatePresence>
            {open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30"
                  />
                </Dialog.Overlay>
                <div className="fixed left-0 top-0 h-screen overflow-y-auto">
                  <Dialog.Content asChild>
                    <motion.div
                      initial={{ x: -1000 }}
                      animate={{ x: 0 }}
                      exit={{ x: -1000 }}
                      transition={{ bounce: 0 }}
                      className={
                        "relative px-8 py-6 w-full h-full bg-white dark:bg-neutral-700 shadow"
                      }
                    >
                      <div className="h-full flex flex-col gap-2">
                        <NavbarMenuItems onItemClick={() => setOpen(false)} />
                        <div className="mt-auto">
                          {DARK_MODE_SWITCHER && (
                            <DarkThemeSwitcher
                              showLabel={true}
                              className={"w-full"}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Dialog.Content>
                </div>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
      )}
      <Link to={"/"} className="flex gap-4 items-center">
        <Logo className="h-10" />
        {CUSTOM_LOGO_URL && (
          <>
            <div className="w-px h-10 bg-black dark:bg-white opacity-25"></div>
            <img src={CUSTOM_LOGO_URL} className="h-10" alt="Logo"/>
          </>
        )}
      </Link>
      {width >= NAVBAR_BREAKPOINT && (
        <>
          <div className="grow flex items-center gap-8 px-4">
            <NavbarMenuItems />
          </div>
          <div className="flex gap-4 h-10">
            {DARK_MODE_SWITCHER && <DarkThemeSwitcher />}
            {AUTHENTICATION && <AuthBadge />}
          </div>
        </>
      )}
      {width < NAVBAR_BREAKPOINT && (
        <div className="ms-auto flex gap-4">
          {AUTHENTICATION && <AuthBadge />}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
