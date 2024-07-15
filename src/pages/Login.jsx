import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { autosubmitApiV4 } from "../services/autosubmitApiV4";
import {
  AUTH_PROVIDER,
  CAS_THIRD_PARTY_LOGIN_URL,
  CAS_SERVICE_ID,
  GITHUB_CLIENT_ID,
} from "../consts";
import { useDispatch } from "react-redux";
import { ReactComponent as Logo } from "../common/Logo.svg";

import { authActions } from "../store/authSlice";
import { motion, useAnimate } from "framer-motion";
import useASTitle from "../hooks/useASTitle";

const AnimatedBG = () => {
  const [scope, animate] = useAnimate();
  const [scope2, animate2] = useAnimate();

  useEffect(() => {
    animate(
      [
        [
          scope.current,
          {
            pathLength: 1,
            pathOffset: 0,
          },
          {
            duration: 2,
          },
        ],
        [
          scope.current,
          {
            pathLength: 1,
            pathOffset: 1,
          },
          {
            duration: 2,
            delay: 1,
          },
        ],
      ],
      {
        repeat: Infinity,
      }
    );

    animate2(
      [
        [
          scope2.current,
          {
            pathLength: 1,
            pathOffset: 0,
          },
          {
            duration: 2,
          },
        ],
        [
          scope2.current,
          {
            pathLength: 1,
            pathOffset: 1,
          },
          {
            duration: 2,
            delay: 1,
          },
        ],
      ],
      {
        repeat: Infinity,
        delay: 1.5,
      }
    );
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 1080"
      className="fixed blur-lg -z-50 top-0 min-w-[110vw] min-h-[1080px]"
      fill="transparent"
    >
      <motion.path
        d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320"
        stroke="#4e8490"
        strokeWidth={4}
        initial={{
          pathLength: 0,
          pathOffset: 0,
        }}
        ref={scope}
      />

      <motion.path
        d="M 0 606 L 48 584.7 C 96 563 192 521 288 510 C 384 499 480 521 576 499.3 C 672 478 768 414 864 430 C 960 446 1056 542 1152 547.3 C 1248 553 1344 467 1392 424.7 L 1440 382"
        stroke="#ff511c"
        strokeWidth={4}
        initial={{
          pathLength: 0,
          pathOffset: 0,
        }}
        ref={scope2}
      />
    </svg>
  );
};

const Login = () => {
  useASTitle("Login");
  const searchParams = useSearchParams({})[0];
  const navigate = useNavigate();
  const ticket = searchParams.get("ticket");
  const service = CAS_SERVICE_ID || window.location.href.split("?")[0];
  const code = searchParams.get("code");
  const dispatch = useDispatch();
  const [
    login,
    {
      data: loginData,
      isError: isLoginError,
      isLoading: isLoginLoading,
      isUninitialized: isLoginUninitialized,
    },
  ] = autosubmitApiV4.endpoints.login.useMutation();
  const {
    isSuccess: isVerifySuccess,
    isFetching: isVerifyFetching,
    refetch,
  } = autosubmitApiV4.endpoints.verifyToken.useQuery();

  useEffect(() => {
    if (!isVerifyFetching && isVerifySuccess) navigate("/");
  }, [isVerifyFetching, isVerifySuccess]);

  useEffect(() => {
    if (ticket || code) {
      login({
        provider: AUTH_PROVIDER,
        ticket: ticket,
        service: service,
        code: code,
      });
    }
  }, []);

  const handleLogin = () => {
    if (AUTH_PROVIDER === "github") {
      const _target = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=read:user%20read:org`;
      window.location.href = _target;
    } else {
      const _target = `${CAS_THIRD_PARTY_LOGIN_URL}?service=${service}`;
      window.location.href = _target;
    }
  };

  useEffect(() => {
    if (!isLoginUninitialized && !isLoginError && loginData) {
      localStorage.setItem("token", loginData.token);
      dispatch(
        authActions.login({
          token: loginData.token,
          user_id: loginData.user,
        })
      );
      refetch();
    }
  }, [loginData, isLoginUninitialized, isLoginError]);

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center">
        {isVerifyFetching || isLoginLoading ? (
          <div className="spinner-border" role="status"></div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                bounce: 0.6,
                duration: 0.5,
                opacity: { bounce: 0 },
              },
            }}
            className="flex flex-col gap-8 border px-20 py-12 rounded-2xl max-w-[90vw] shadow bg-white dark:bg-neutral-800"
          >
            {isLoginError && (
              <span className="alert alert-danger rounded-2xl">
                <i className="fa-solid fa-triangle-exclamation me-2"></i>{" "}
                {"Error logging in. You may be unauthorized."}
              </span>
            )}
            <Logo className="h-20" />
            <button
              onClick={handleLogin}
              className="btn btn-light border text-xl px-8 py-2 font-semibold text-center truncate"
            >
              Login with {AUTH_PROVIDER.toUpperCase()}
            </button>
          </motion.div>
        )}

        <AnimatedBG />
      </div>
    </>
  );
};

export default Login;
