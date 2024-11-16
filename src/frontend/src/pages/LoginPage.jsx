import React, { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../components/Buttons";
import { PrimaryTextInputWithLabel } from "../components/Inputs";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { signIn } from "../services/api";

function LoginPage() {
  const navigate = useNavigate();
  const [loginFormValue, setLoginFormValue] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[70%] h-[60%] max-w-[1100px] bg-white flex">
        <div className="h-full w-1/2 flex justify-center items-center">
          <div
            id="login-form"
            className="w-4/5 h-4/5 flex flex-col justify-around"
          >
            <h1 className="text-4xl font-light">Sign In</h1>
            <PrimaryTextInputWithLabel
              label="USERNAME"
              type="text"
              placeholder="jane.doe@neuralanalyzer.ca"
              value={loginFormValue.email}
              onChange={(e) =>
                setLoginFormValue({ ...loginFormValue, email: e.target.value })
              }
            />
            <PrimaryTextInputWithLabel
              label="PASSWORD"
              type="password"
              placeholder="Password"
              value={loginFormValue.password}
              onChange={(e) =>
                setLoginFormValue({
                  ...loginFormValue,
                  password: e.target.value,
                })
              }
            />

            <PrimaryButton
              text="Sign In"
              onClick={async () => {
                const res = await signIn(
                  loginFormValue.email,
                  loginFormValue.password
                );
                console.log(res);
                navigate("/dashboard", { replace: true });
              }}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-primary w-5 h-5 cursor-pointer"
                checked={loginFormValue.rememberMe}
                onChange={(e) =>
                  setLoginFormValue({
                    ...loginFormValue,
                    rememberMe: e.target.checked,
                  })
                }
              />
              <h3
                className="text-primary font-bold cursor-pointer"
                htmlFor="remember-me"
                onClick={() =>
                  setLoginFormValue({
                    ...loginFormValue,
                    rememberMe: !loginFormValue.rememberMe,
                  })
                }
              >
                Remember me
              </h3>
            </div>
          </div>
        </div>
        <div className="h-full w-1/2 bg-gradient-to-br from-primary to-[#00B6AD] flex flex-col items-center justify-center gap-4">
          <h1 className="text-white text-4xl font-medium">Neuralanalyzer</h1>
          <h4 className="text-white">Don't have an account?</h4>
          <Link to="/register">
            <SecondaryButton text="Sign Up" onClick={() => void 0} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
