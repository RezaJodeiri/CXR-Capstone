import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const allowedFileTypes = ["JPG", "PNG", "GIF"];

function PredictionPage() {
  const [files, setFiles] = useState([]);
  const handleChanges = (files) => {
    setFiles(files);
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[90%] h-[90%] bg-red-100">
        <div>{files.map((file) => file.name).join(", ")}</div>
        <h1 className="text-red-300">Chest X-ray Prediction</h1>
        <FileUploader
          name="file"
          multiple={true}
          files={files}
          types={allowedFileTypes}
          handleChange={(fileList) => {
            // Filter out files that are already in the list
            const filteredFiles = Array.from(fileList).filter(
              (file) => !files.some((f) => f.name === file.name)
            );
            setFiles([...files, ...filteredFiles]);
          }}
        />
      </div>
    </div>
  );
}

export default PredictionPage;
