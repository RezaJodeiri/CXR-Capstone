export const PrimaryButton = ({ text, onClick, disabled = false }) => {
  return (
    <button
      disabled={disabled}
      className={`${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-primary hover:bg-primaryHover"
      } text-white font-bold py-2 px-4 rounded`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export const SecondaryButton = ({ text, onClick }) => {
  return (
    <button
      className="text-white font-bold py-2 px-4 rounded border-[1px] border-white hover:border-gray-300"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export const CancelButton = ({ text, onClick, disabled = false }) => {
  return (
    <button
      disabled={disabled}
      className={`${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#ff6a6a] hover:bg-[#ff7979]"
      } text-white font-bold py-2 px-4 rounded`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
