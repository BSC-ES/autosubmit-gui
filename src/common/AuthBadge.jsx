
import { Fragment, forwardRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { authActions } from '../store/authSlice';
import { autosubmitApiV4 } from '../services/autosubmitApiV4';
import { useNavigate } from 'react-router-dom';
import { AUTHENTICATION } from '../consts';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '../services/utils';

const CustomToggle = forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </div>
));

const AuthBadge = () => {
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token")
  const [verifyToken, { data, isError }] = autosubmitApiV4.endpoints.verifyToken.useMutation()

  useEffect(() => {
    dispatch(authActions.reset())
    if (token) {
      verifyToken()
    }
    // eslint-disable-next-line
  }, [])


  useEffect(() => {
    console.log(data)
    if (isError) {
      if (AUTHENTICATION) handleLogout()
    }
    else if (data) {
      dispatch(authActions.login({
        token: token,
        user_id: data.user
      }))
    }
  }, [data, isError])

  const handleLogin = () => {
    navigate("/login")
  }

  const handleLogout = () => {
    dispatch(authActions.logout())
    localStorage.setItem("token", null)
    if (AUTHENTICATION) navigate("/login")
  }

  return (
    <>
      {authState.user_id ?
        // <Dropdown>
        //   <Dropdown.Toggle as={CustomToggle}>
        //     {authState.user_id} <i className="fa-solid fa-angle-down"></i>
        //   </Dropdown.Toggle>
        //   <Dropdown.Menu align={"end"}>
        //     <Dropdown.Item eventKey="1">
        //       <div onClick={handleLogout}>Logout</div>
        //     </Dropdown.Item>
        //   </Dropdown.Menu>
        // </Dropdown>
        <Menu as="div" className="relative p-0">
          <Menu.Button className={"btn btn-light dark:btn-dark rounded-full font-bold drop-shadow py-2 px-4"}>
            {authState.user_id} <i className="fa-solid fa-angle-down ms-1"></i>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items as="div" className={"absolute mt-1 right-0 bg-white border rounded z-40 py-1"}>
              <div className="flex flex-col">
                <Menu.Item>
                  {
                    ({ active }) => (
                      <div
                        className={cn(["text-dark text-nowrap cursor-pointer text-center px-10 py-1 w-full transition-colors ", { "bg-danger text-white": active }])}
                        onClick={handleLogout}>
                        Logout <i className="ms-1 fa-solid fa-arrow-right-from-bracket"></i>
                      </div>
                    )
                  }
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        :
        <button className='btn btn-light rounded-full font-bold drop-shadow py-2 px-4 border'>

          <div onClick={handleLogin}>
            Login
          </div>
        </button>

      }
    </>
  )
}

export default AuthBadge