import { PrimaryButton } from "./Buttons";
import { PrimaryTextInputWithLabel } from "./Inputs";

export function RegisterFlowView1({
  registerFormValue,
  setRegisterFormValue,
  currentStep,
  setCurrentStep,
  totalSteps,
}) {
  return (
    <div id="login-form" className="w-4/5 h-4/5 flex flex-col justify-between">
      <RegisterProgress
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <PrimaryTextInputWithLabel
        label="Email"
        type="text"
        placeholder="jane.doe@neuralanalyzer.ca"
        value={registerFormValue.email}
        onChange={(e) =>
          setRegisterFormValue({ ...registerFormValue, email: e.target.value })
        }
      />

      <PrimaryTextInputWithLabel
        label="First Name"
        type="text"
        placeholder="Jane"
        value={registerFormValue.firstName}
        onChange={(e) =>
          setRegisterFormValue({
            ...registerFormValue,
            firstName: e.target.value,
          })
        }
      />

      <PrimaryTextInputWithLabel
        label="Last Name"
        type="text"
        placeholder="Doe"
        value={registerFormValue.lastName}
        onChange={(e) =>
          setRegisterFormValue({
            ...registerFormValue,
            lastName: e.target.value,
          })
        }
      />

      <PrimaryButton
        text="Continue"
        onClick={() => setCurrentStep(currentStep + 1)}
      />
    </div>
  );
}

export function RegisterFlowView2({
  registerFormValue,
  setRegisterFormValue,
  currentStep,
  setCurrentStep,
  totalSteps,
}) {
  return (
    <div id="login-form" className="w-4/5 h-4/5 flex flex-col justify-between">
      <RegisterProgress
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <PrimaryTextInputWithLabel
        label="Occupation"
        type="text"
        placeholder="Full-time Registered Nurse"
        value={registerFormValue.occupation}
        onChange={(e) =>
          setRegisterFormValue({
            ...registerFormValue,
            occupation: e.target.value,
          })
        }
      />

      <PrimaryTextInputWithLabel
        label="Organization"
        type="text"
        placeholder="SickKids Hospital"
        value={registerFormValue.organization}
        onChange={(e) =>
          setRegisterFormValue({
            ...registerFormValue,
            organization: e.target.value,
          })
        }
      />

      <PrimaryTextInputWithLabel
        label="Location"
        type="text"
        placeholder="Toronto, Ontario, Canada"
        value={registerFormValue.location}
        onChange={(e) =>
          setRegisterFormValue({
            ...registerFormValue,
            location: e.target.value,
          })
        }
      />

      <PrimaryButton
        text="Continue"
        onClick={() => setCurrentStep(currentStep + 1)}
      />
    </div>
  );
}

export function RegisterFlowView3({
  registerFormValue,
  setRegisterFormValue,
  currentStep,
  setCurrentStep,
  totalSteps,
  onSubmit,
}) {
  return (
    <div id="login-form" className="w-4/5 h-4/5 flex flex-col justify-between">
      <RegisterProgress
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <PrimaryTextInputWithLabel
        label="Password"
        type="password"
        placeholder="Password"
        value={registerFormValue.password}
        onChange={(e) =>
          setRegisterFormValue({
            ...registerFormValue,
            password: e.target.value,
          })
        }
      />

      <PrimaryTextInputWithLabel
        label="Confirm Password"
        type="password"
        placeholder="Confirm Password"
        value={registerFormValue.confirmPassword}
        onChange={(e) =>
          setRegisterFormValue({
            ...registerFormValue,
            confirmPassword: e.target.value,
          })
        }
      />

      <PrimaryButton text="Submit" onClick={onSubmit} />
    </div>
  );
}

function RegisterProgress({ currentStep, totalSteps, setCurrentStep }) {
  return (
    <div className="w-full flex justify-center items-center">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex justify-center items-center">
          {i > 0 && (
            <div
              className={`w-10 h-[3px] ${
                i > currentStep ? "bg-gray-200" : "bg-secondary"
              }`}
            ></div>
          )}
          <div
            id="circle-with-id"
            onClick={() => setCurrentStep(i)}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xl hover:underline cursor-pointer ${
              i < currentStep
                ? "bg-secondary text-white"
                : i === currentStep
                ? "bg-white border-2 border-secondary text-secondary"
                : "bg-white border-2 border-gray-200 text-gray-200"
            }`}
          >
            {i + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
