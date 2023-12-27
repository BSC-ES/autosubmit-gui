import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Home from '../pages/Home'
import Navbar from './Navbar'
import About from '../pages/About';
import ExperimentWrapper from './ExperimentWrapper';
import ExperimentTree from '../pages/ExperimentTree';
import ExperimentDetail from '../pages/ExperimentDetail';

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <main className='container-fluid min-vh-100 d-flex flex-column'>
                <Navbar />
                {/* <Alert /> */}
                <Outlet />

                {/* <Footer /> */}
            </main>
        ),
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
                        path: "/experiment/:expid/tree",
                        element: <ExperimentTree />
                    }
                ]
            }
        ]
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