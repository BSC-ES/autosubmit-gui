import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import { AUTH_PROVIDER, CAS_THIRD_PARTY_LOGIN_URL, CAS_SERVICE_ID, GITHUB_CLIENT_ID } from "../consts";
import { useDispatch } from "react-redux";
import { ReactComponent as Logo } from "../common/Logo.svg";

import { authActions } from "../store/authSlice";


const Login = () => {
  const searchParams = useSearchParams({})[0];
  const navigate = useNavigate();
  const ticket = searchParams.get("ticket")
  const service = CAS_SERVICE_ID || window.location.href.split("?")[0]
  const code = searchParams.get("code")
  const dispatch = useDispatch();
  const [login, {
    data: loginData,
    isError: isLoginError,
    isUninitialized: isLoginUninitialized
  }] = autosubmitApiV4.endpoints.login.useMutation()
  const {
    isSuccess: isVerifySuccess,
    isFetching: isVerifyFetching,
    refetch
  } = autosubmitApiV4.endpoints.verifyToken.useQuery()

  useEffect(() => {
    if (!isVerifyFetching && isVerifySuccess) navigate("/")
  }, [isVerifyFetching, isVerifySuccess])


  useEffect(() => {
    if (ticket || code) {
      login({
        provider: AUTH_PROVIDER,
        ticket: ticket,
        service: service,
        code: code
      })
    }
  }, [])

  const handleLogin = () => {
    if (AUTH_PROVIDER === "github") {
      const _target = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=read:user%20read:org`;
      window.location.href = _target;
    } else {
      const _target = `${CAS_THIRD_PARTY_LOGIN_URL}?service=${service}`;
      window.location.href = _target;
    }
  }

  useEffect(() => {
    if (!isLoginUninitialized && !isLoginError && loginData) {
      localStorage.setItem("token", loginData.token)
      dispatch(authActions.login({
        token: loginData.token,
        user_id: loginData.user
      }))
      refetch()
    }
  }, [loginData, isLoginUninitialized, isLoginError])

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {
        (isVerifyFetching || code || ticket) ?
          <div className="spinner-border" role="status"></div>
          :
          <div className="flex flex-col gap-8 border px-20 py-12 rounded-2xl shadow">
            <Logo className="h-20" />
            <button
              onClick={handleLogin}
              className="btn btn-light border text-xl px-8 py-2 font-semibold text-center">
              Login with {AUTH_PROVIDER.toUpperCase()}
            </button>
          </div>
      }
    </div>
  )
}

export default Login;