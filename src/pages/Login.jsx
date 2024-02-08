import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import { CAS_THIRD_PARTY_LOGIN_URL } from "../consts";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/authSlice";


const Login = () => {
  const searchParams = useSearchParams({})[0];
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const [login, { data, isError, isUninitialized }] = autosubmitApiV4.endpoints.loginCASv2.useMutation()

  useEffect(() => {
    const ticket = searchParams.get("ticket")
    const service = window.location.href.split("?")[0]
    if (ticket) {
      login({
        ticket: ticket,
        service: service
      })
    } else {
      const _target = `${CAS_THIRD_PARTY_LOGIN_URL}?service=${service}`;
      window.location.href = _target;
    }
  }, [])

  useEffect(() => {
    if (!isUninitialized && !isError && data) {
      localStorage.setItem("token", data.token)
      dispatch(authActions.login({
        token: data.token,
        user_id: data.user
      }))
      navigate("/")
    }
  }, [data])

  return (
    <div className=" w-screen h-screen flex items-center justify-center">
      {
        !isError ?
          <div className="spinner-border" role="status"></div>
          :
          <div className="text-danger w-full grow flex flex-col gap-8 items-center justify-center">
            <i className="fa-solid fa-x text-9xl"></i>
            <div className="text-2xl">Unauthorized</div>
          </div>
      }
    </div>
  )
}

export default Login;