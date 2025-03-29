import _ from "lodash";
import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/Authentication";
import { FaRegUser } from "react-icons/fa";
import { PrimaryButton, CancelButton } from "../components/Buttons";
import { MdEdit } from "react-icons/md";

function SettingsPage() {
  const { user } = useAuth();

  const getInitialState = () => {
    return {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      gender: user?.gender || "",
      age: user?.age || "",
      notes: user?.notes || "",
      location: user?.location || "",
      postal_code: user?.postal_code || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
    };
  };

  const [userState, setUserState] = useState(getInitialState());
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8">
          <div className="bg-white rounded-lg p-6 h-[85vh] flex flex-col">
            <div className="w-full h-[70%] flex flex-col gap-12">
              <div className="flex items-center gap-10 border-b-[1px] pb-5">
                <div className="h-[5rem] w-[5rem] rounded-full flex justify-center items-center relative group cursor-pointer">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className=" object-cover"
                    />
                  ) : (
                    <div className="w-[90%] bg-gray-600 aspect-square flex justify-center items-center rounded-full">
                      <FaRegUser className="w-[90%]  object-cover text-gray-200" />
                    </div>
                  )}
                  <div className="bg-secondary group-hover:bg-secondaryHover text-white text-sm absolute right-0 bottom-0 rounded-full p-2">
                    <MdEdit />
                  </div>
                </div>
                <UserProfileFieldInput
                  label="First Name"
                  field="first_name"
                  userState={userState}
                  setUserState={setUserState}
                  minimumCharacterCount={30}
                />
                <UserProfileFieldInput
                  label="Last Name"
                  field="last_name"
                  userState={userState}
                  setUserState={setUserState}
                  minimumCharacterCount={30}
                />
              </div>
              <div className="flex items-center justify-start gap-10 w-full">
                <UserProfileFieldInput
                  label="Gender"
                  field="gender"
                  userState={userState}
                  setUserState={setUserState}
                  minimumCharacterCount={20}
                />
                <UserProfileFieldInput
                  label="Age"
                  field="age"
                  userState={userState}
                  setUserState={setUserState}
                />
                <UserProfileFieldInput
                  label="Notes"
                  field="notes"
                  userState={userState}
                  setUserState={setUserState}
                  minimumCharacterCount={50}
                />
              </div>
              <div className="flex items-center justify-start gap-10 w-full">
                <UserProfileFieldInput
                  label="Addresses"
                  field="location"
                  userState={userState}
                  setUserState={setUserState}
                  minimumCharacterCount={30}
                />
                <UserProfileFieldInput
                  label="Postal Code"
                  field="postal_code"
                  userState={userState}
                  setUserState={setUserState}
                  minimumCharacterCount={30}
                />
              </div>
              <div className="flex items-center justify-start gap-10 w-full">
                <UserProfileFieldInput
                  label="Email"
                  field="email"
                  userState={userState}
                  setUserState={setUserState}
                  minimumCharacterCount={30}
                />
                <UserProfileFieldInput
                  label="Phone Number"
                  field="phone_number"
                  userState={userState}
                  setUserState={setUserState}
                  minimumCharacterCount={30}
                />
              </div>
            </div>
            <div className="w-full h-[20%] flex justify-end gap-10">
              <div>
                <CancelButton
                  text="Discard"
                  disabled={_.isEqual(userState, getInitialState())}
                  onClick={() => {
                    setUserState(getInitialState());
                  }}
                />
              </div>
              <div>
                <PrimaryButton
                  text="Save"
                  disabled={_.isEqual(userState, getInitialState())}
                  onClick={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const UserProfileFieldInput = ({
  label,
  field,
  userState,
  setUserState,
  minimumCharacterCount = 10,
}) => {
  const ABSOLUTE_MAX = 50;
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-semibold">{label}</h1>
      <input
        className="text-sm ring-[1px] text-[#1F2024] focus:ring-2 ring-[#006FFD] p-2 rounded-md flex items-center justify-center"
        value={userState[field]}
        autoComplete="off"
        onChange={(e) =>
          setUserState({
            ...userState,
            [field]: e.target.value,
          })
        }
        size={Math.min(
          Math.max(userState[field].length + 5, minimumCharacterCount),
          ABSOLUTE_MAX
        )}
      />
    </div>
  );
};

export default SettingsPage;
