import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Home from '../pages/Home'
import Navbar from './Navbar'
import About from '../pages/About';

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <Navbar />
                {/* <Alert /> */}
                <Outlet />
                {/* <Footer /> */}
            </>
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
                element: <div>
                    Hola experiment
                    <Outlet></Outlet>
                </div>,
                children: [
                    {
                        path: "/experiment/:expid",
                        element: <div>Hola exp home</div>
                    },
                    {
                        path: "/experiment/:expid/tree",
                        element: <div>Hola tree</div>
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