import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home";
import Navbar from "./Navbar";
import About from "../pages/About";
import ExperimentWrapper from "./ExperimentWrapper";
import ExperimentTree from "../pages/ExperimentTree";
import ExperimentDetail from "../pages/ExperimentDetail";
import ExperimentGraph from "../pages/ExperimentGraph";
import Breadcrumb from "../common/Breadcrumb";
import ExperimentRunLog from "../pages/ExperimentRunLog";
import ExperimentConfiguration from "../pages/ExperimentConfiguration";
import ExperimentQuick from "../pages/ExperimentQuick";
import ExperimentStats from "../pages/ExperimentStats";
import UserSettings from "../pages/UserSettings";
import NotFound from "../pages/NotFound";
import ExperimentPerformance from "../pages/ExperimentPerformance";
import { DARK_MODE_SWITCHER, PUBLIC_URL } from "../consts";
import ExperimentTableView from "../pages/ExperimentTableView";
import Login from "../pages/Login";
import { useDispatch } from "react-redux";
import { appActions } from "../store/appSlice";
import { useEffect } from "react";
import Footer from "./Footer";
import TopAnnouncement from "./TopAnnouncement";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <>
          <TopAnnouncement />
          <main className="container flex flex-col min-h-screen w-screen px-6">
            <Navbar />
            <Breadcrumb />
            {/* <Alert /> */}
            <Outlet />
            <Footer />
          </main>
        </>
      ),
      errorElement: <Navigate to={"/404"} replace />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/settings",
          element: <UserSettings />,
        },
        {
          path: "/experiment/:expid",
          element: (
            <ExperimentWrapper>
              <Outlet />
            </ExperimentWrapper>
          ),
          children: [
            {
              path: "/experiment/:expid",
              element: <ExperimentDetail />,
            },
            {
              path: "/experiment/:expid/quick",
              element: <ExperimentQuick />,
            },
            {
              path: "/experiment/:expid/tree",
              element: <ExperimentTree />,
            },
            {
              path: "/experiment/:expid/graph",
              element: <ExperimentGraph />,
            },
            {
              path: "/experiment/:expid/table",
              element: <ExperimentTableView />,
            },
            {
              path: "/experiment/:expid/runlog",
              element: <ExperimentRunLog />,
            },
            {
              path: "/experiment/:expid/config",
              element: <ExperimentConfiguration />,
            },
            {
              path: "/experiment/:expid/stats",
              element: <ExperimentStats />,
            },
            {
              path: "/experiment/:expid/performance",
              element: <ExperimentPerformance />,
            },
          ],
        },
      ],
    },
    {
      path: "/404",
      element: <NotFound />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ],
  {
    basename: `${PUBLIC_URL || ""}`,
  }
);

export default function Router() {
  // First enable/disable dark mode
  const dispatch = useDispatch();
  useEffect(() => {
    if (DARK_MODE_SWITCHER) {
      const localTheme = localStorage.getItem("asgui.theme");
      if (localTheme) {
        dispatch(appActions.setTheme(localTheme));
        if (localTheme === "dark") {
          document.documentElement.classList.add("dark");
        }
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        dispatch(appActions.setTheme("dark"));
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  return <RouterProvider router={router} />;
}
