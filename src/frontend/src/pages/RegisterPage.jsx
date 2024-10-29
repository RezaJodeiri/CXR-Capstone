import React, { useState } from "react";
import { SecondaryButton } from "../components/Buttons";

import {
  RegisterFlowView1,
  RegisterFlowView2,
  RegisterFlowView3,
} from "../components/RegisterFlows";

const RegisterFlow = [RegisterFlowView1, RegisterFlowView2, RegisterFlowView3];

function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
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
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[70%] h-[60%] max-w-[1100px] bg-white flex">
        <div className="h-full w-1/2 bg-gradient-to-br from-primary to-[#00B6AD] flex flex-col items-center justify-center gap-4">
          <h1 className="text-white text-4xl font-medium">Neuralanalyzer.</h1>
          <h4 className="text-white">Already has an account?</h4>
          <SecondaryButton
            text="Sign In"
            onClick={() => console.log("Sign up")}
          />
        </div>
        <div className="h-full w-1/2 flex justify-center items-center">
          <CurrentFlowView
            registerFormValue={registerFormValue}
            setRegisterFormValue={setRegisterFormValue}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            totalSteps={RegisterFlow.length}
          />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
