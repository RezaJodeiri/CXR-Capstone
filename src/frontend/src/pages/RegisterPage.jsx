import React, { useState, useCallback } from "react";
import { SecondaryButton, PrimaryButton } from "../components/Buttons";
import { Link } from "react-router-dom";

import {
  RegisterFlowView1,
  RegisterFlowView2,
  RegisterFlowView3,
} from "../components/RegisterFlows";

const RegisterFlow = [RegisterFlowView1, RegisterFlowView2, RegisterFlowView3];

function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const CurrentFlowView = RegisterFlow[currentStep];
  const [registerFormValue, setRegisterFormValue] = useState({
    email: "",
    firstName: "",
    lastName: "",
    occupation: "",
    organization: "",
    location: "",
    password: "",
    confirmPassword: "",
  });
  const onSubmit = useCallback(() => {
    setRegisterSuccess(true);
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      {!registerSuccess ? (
        <div className="w-[70%] h-[60%] max-w-[1100px] bg-white flex">
          <div className="h-full w-1/2 bg-gradient-to-tl from-primary to-[#00B6AD] flex flex-col items-center justify-center gap-4">
            <h1 className="text-white text-4xl font-medium">Neuralanalyzer.</h1>
            <h4 className="text-white">Already has an account?</h4>
            <Link to="/login">
              <SecondaryButton text="Sign In" onClick={void 0} />
            </Link>
          </div>
          <div className="h-full w-1/2 flex justify-center items-center">
            <CurrentFlowView
              registerFormValue={registerFormValue}
              setRegisterFormValue={setRegisterFormValue}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              totalSteps={RegisterFlow.length}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      ) : (
        <div className="w-[70%] h-[60%] max-w-[1100px] flex flex-col justify-center items-center bg-white">
          <div className="w-[50%] h-[30%] flex flex-col justify-around items-center">
            <div className="flex flex-col justify-around items-center">
              <h1 className="font-bold text-3xl">
                Welcome, {registerFormValue.firstName}{" "}
                {registerFormValue.lastName}
              </h1>
              <h3 className="text-gray-600">to Neuralanalyzer 🫀</h3>
            </div>

            <Link to="/dashboard">
              <PrimaryButton text="Go to Dashboard" onClick={void 0} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
