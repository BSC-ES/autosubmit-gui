
import { forwardRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { authActions } from '../store/authSlice';
import { autosubmitApiV4 } from '../services/autosubmitApiV4';
import { useNavigate } from 'react-router-dom';
import { AUTHENTICATION } from '../consts';
import { Menu } from '@headlessui/react';

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
      handleLogout()
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
          <Menu.Button>
            <button className="btn btn-light rounded-full font-bold drop-shadow py-2 px-4">
              {authState.user_id} <i className="fa-solid fa-angle-down ms-1"></i>
            </button>
          </Menu.Button>
          <Menu.Items as="div" className={"absolute right-0 bg-white border z-40"}>
            <div className="flex flex-col">
              <Menu.Item>
                {
                  ({ active }) => (
                    <div
                      className={"text-dark text-center px-10 py-2 w-full " + (active ? "bg-danger text-white" : "")}
                      onClick={handleLogout}>
                      Logout
                    </div>
                  )
                }
              </Menu.Item>
            </div>
          </Menu.Items>
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