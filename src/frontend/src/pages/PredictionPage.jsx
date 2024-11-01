import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

import { SecondaryButton } from "../components/Buttons";

const allowedFileTypes = ["JPG", "PNG", "GIF"];
function PredictionPage() {
  const [files, setFiles] = useState([]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[90%] h-[90%] bg-white flex justify-center pt-14 gap-3">
        <div
          id="drop-zone-and-label"
          className={
            files.length > 0 ? "flex flex-col w-[40%]" : "flex flex-col w-[90%]"
          }
        >
          <h1
            className={
              files.length > 0
                ? "px-[2%] text-sm font-extrabold"
                : "px-[15%] text-sm font-extrabold"
            }
          >
            Upload X-Ray
          </h1>
          <div className="w-full flex justify-center items-center">
            <div className={files.length > 0 ? "w-[90%]" : "w-[65%]"}>
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
              >
                <div className="flex flex-col justify-center items-center gap-2 border-dashed border-2 border-primary py-10 rounded-md">
                  <img
                    src="/file-upload.png"
                    alt="file upload icon"
                    className="w-[143px]"
                  />
                  <h1 className="text-[#2C618A] font-bold text-2xl">
                    Drag & Drop X-Ray here
                  </h1>
                  <div className="relative w-40 flex items-center justify-center mt-5 mb-2">
                    <div className="absolute w-full h-[1px] bg-black"></div>
                    <h1 className="bg-white px-2 z-10">or</h1>
                  </div>
                  <div className="text-[#2C618A] font-bold py-2 px-4 rounded border-[1px] border-[#2C618A] hover:border-[#437fad]">
                    Browse Files
                  </div>
                </div>
              </FileUploader>
            </div>
          </div>
        </div>
        {files.length > 0 && (
          <div className="w-[60%] bg-red-100">
            <h1>Images</h1>
            <div className="flex gap-2 overflow-y-scroll">
              {files.map((file, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-[100px] h-[100px] object-cover rounded-md"
                  />
                  <h1>{file.name}</h1>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionPage;
