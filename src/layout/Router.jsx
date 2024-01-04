import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import Home from '../pages/Home'
import Navbar from './Navbar'
import About from '../pages/About';
import ExperimentWrapper from './ExperimentWrapper';
import ExperimentTree from '../pages/ExperimentTree';
import ExperimentDetail from '../pages/ExperimentDetail';
import ExperimentGraph from '../pages/ExperimentGraph';
import Breadcrumb from '../common/Breadcrumb';
import ExperimentRunLog from '../pages/ExperimentRunLog';
import ExperimentConfiguration from '../pages/ExperimentConfiguration';
import ExperimentQuick from '../pages/ExperimentQuick';
import ExperimentStats from '../pages/ExperimentStats';
import NotFound from '../pages/NotFound';
import ExperimentPerformance from '../pages/ExperimentPerformance';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <main className='container-fluid min-vh-100 d-flex flex-column gx-5'>
        <Navbar />
        <Breadcrumb />
        {/* <Alert /> */}
        <Outlet />

        <div style={{ height: "3rem" }}></div>
        {/* <Footer /> */}
      </main>
    ),
    errorElement: <Navigate to={"/404"} replace />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/experiment/:expid",
        element:
          <ExperimentWrapper>
            <Outlet />
          </ExperimentWrapper>,
        children: [
          {
            path: "/experiment/:expid",
            element: <ExperimentDetail />
          },
          {
            path: "/experiment/:expid/quick",
            element: <ExperimentQuick />
          },
          {
            path: "/experiment/:expid/tree",
            element: <ExperimentTree />
          },
          {
            path: "/experiment/:expid/graph",
            element: <ExperimentGraph />
          },
          {
            path: "/experiment/:expid/runlog",
            element: <ExperimentRunLog />
          },
          {
            path: "/experiment/:expid/config",
            element: <ExperimentConfiguration />
          },
          {
            path: "/experiment/:expid/stats",
            element: <ExperimentStats />
          },
          {
            path: "/experiment/:expid/performance",
            element: <ExperimentPerformance />
          },
        ]
      }
    ]
  },
  {
    path: "/404",
    element: <NotFound />
  },
]);


export default function Router() {

  return (
    <RouterProvider router={router} />
  );
}

/* <div className='container' style={{ height: "100%" }}>
                        <Alert />
                        <Switch>
                          {AUTHENTICATION === true ? (
                            <ProtectedRoute
                              exact
                              path={`/${rootAppName}/`}
                              component={Home}
                            />
                          ) : (
                            <Route
                              exact
                              path={`/${rootAppName}/`}
                              component={Home}
                            />
                          )}

                          <Route
                            exact
                            path={`/${rootAppName}/login/`}
                            component={Login}
                          />
                          <Route
                            exact
                            path={`/${rootAppName}/profile/`}
                            component={Profile}
                          />
                          <Route
                            exact
                            path={`/${rootAppName}/about`}
                            component={About}
                          />
                          <Route
                            exact
                            path={`/${rootAppName}/news`}
                            component={News}
                          />
                          {AUTHENTICATION === true ? (
                            <ProtectedRoute
                              exact
                              path={`/${rootAppName}/experiment/:expid`}
                              component={ExperimentCentral}
                            />
                          ) : (
                            <Route
                              exact
                              path={`/${rootAppName}/experiment/:expid`}
                              component={ExperimentCentral}
                            />
                          )}
                          {AUTHENTICATION === true ? (
                            <ProtectedRoute
                              exact
                              path={`/${rootAppName}/experiment/:expid/:action`}
                              component={ExperimentCentral}
                            />
                          ) : (
                            <Route
                              exact
                              path={`/${rootAppName}/experiment/:expid/:action`}
                              component={ExperimentCentral}
                            />
                          )}

                          <Route component={NotFound} />
                        </Switch>
                        <Footer />
                      </div> */