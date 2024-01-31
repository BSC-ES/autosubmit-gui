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
    <div className="vw-100 vh-100 d-flex align-items-center justify-content-center">
      {
        !isError ?
          <div className="spinner-border" role="status"></div>
          :
          <div className="text-danger w-100 h-100 d-flex flex-column gap-4 align-items-center justify-content-center">
            <i className="fa-solid fa-x" style={{ fontSize: "8rem" }}></i>
            <div className="fs-4">Unauthorized</div>
          </div>
      }
    </div>
  )
}

export default Login;