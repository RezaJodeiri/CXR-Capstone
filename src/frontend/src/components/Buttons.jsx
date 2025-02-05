export const PrimaryButton = ({ text, onClick }) => {
  return (
    <button
      className="bg-primary hover:bg-primaryHover text-white font-bold py-2 px-4 rounded"
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
