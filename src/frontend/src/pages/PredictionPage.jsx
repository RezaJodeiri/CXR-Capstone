import React, { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";

import { IoInformationCircleSharp } from "react-icons/io5";

import { PrimaryButton } from "../components/Buttons";
import { Link } from "react-router-dom";

import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";

const allowedFileTypes = ["JPG", "PNG", "GIF"];

import { predictImage } from "../services/api";

const mockPrediction = {
  Atelectasis: 0.32797316,
  Consolidation: 0.42933336,
  Infiltration: 0.5316924,
  Pneumothorax: 0.28849724,
  Edema: 0.024142697,
  Emphysema: 0.5011832,
  Fibrosis: 0.51887786,
  Effusion: 0.27805611,
  Pneumonia: 0.18569896,
  Pleural_Thickening: 0.24489835,
  Cardiomegaly: 0.3645515,
  Nodule: 0.68982,
  Mass: 0.6392845,
  Hernia: 0.00993878,
  "Lung Lesion": 0.011150705,
  Fracture: 0.51916164,
  "Lung Opacity": 0.59073937,
  "Enlarged Cardiomediastinum": 0.27218717,
};

function PredictionPage() {
  const [files, setFiles] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [currentImageName, setCurrentImageName] = useState(null);

  const handleSubmission = async () => {
    const promises = files.map((f) => predictImage(f));

    // Simultaneously Predict all images in array
    const predictionsRes = await Promise.all(promises);

    // Map backend data structure to Front-end data structure
    const predictionList = files.map((f, index) => {
      const diseaseWithPercentage = Object.keys(predictionsRes[index])
        .map((disease) => {
          return {
            disease: disease,
            percentage: predictionsRes[index][disease],
          };
        })
        .sort((a, b) => b.percentage - a.percentage);
      return { [f.name]: diseaseWithPercentage };
    });

    const predictionMap = predictionList.reduce((acc, obj) => {
      return { ...acc, ...obj };
    }, {});

    setPredictions(predictionMap);
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      {predictions.length === 0 ? (
        <div className="w-[90%] h-[90%] bg-white flex justify-center pt-14 gap-3">
          <div
            id="drop-zone-and-label"
            className={
              files.length > 0
                ? "flex flex-col w-[40%]"
                : "flex flex-col w-[90%]"
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
            <div className="w-[60%] h-full flex justify-center items-center">
              <div className="w-full h-[90%]">
                <h1 className="text-sm font-extrabold">Images</h1>
                <div className="w-[95%] h-1/2 bg-[#f2f2f2]">
                  <div
                    className="flex-1 flex gap-10 overflow-x-scroll h-2/3 p-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-[4px]
                        [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-500 bg-gray-200 box-border"
                  >
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-3 items-center justify-center min-w-max relative"
                      >
                        <div className="h-[90%] aspect-square rounded-sm relative group">
                          <div
                            className="absolute bg-black w-full h-full opacity-0 hover:opacity-100 bg-opacity-50 flex justify-center items-center cursor-pointer"
                            onClick={() =>
                              window.open(URL.createObjectURL(file), "_blank")
                            }
                          >
                            <FaExternalLinkAlt className="text-gray-200" />
                          </div>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name.split(".").pop()}
                            className="h-full object-cover"
                          />
                        </div>
                        <div className="w-full flex justify-center">
                          <div className="max-w-min flex justify-center items-center gap-1 border-[2px] border-gray-600 px-2 rounded-md">
                            <FaTimes
                              className="text-sm text-gray-600 cursor-pointer hover:text-red-500"
                              onClick={() =>
                                setFiles(files.filter((f) => f !== file))
                              }
                            />
                            <h3 className="text-sm text-gray-600 select-none">{`${
                              index + 1
                            }.${file.name.split(".").pop()}`}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-1/3 w-full flex justify-center items-center">
                    <PrimaryButton
                      text="Predict Disease"
                      onClick={handleSubmission}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-between items-center h-[90%] w-[90%] bg-white p-16">
          <div className="flex flex-col w-[15%] h-full gap-5">
            <div
              id="image-selection-scroll"
              className="h-full flex flex-col gap-5 w-full overflow-y-scroll px-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-[4px]
                        [&::-webkit-scrollbar]:ml-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-500"
            >
              {files.map((file, index) => {
                return (
                  <div
                    className={
                      currentImageName === file.name
                        ? "bg-[#202020] p-4 select-none"
                        : "hover:bg-[#bcbcbc] cursor-pointer p-4 select-none"
                    }
                    key={index}
                    onClick={() => {
                      console.log(file.name);
                      setCurrentImageName(file.name);
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name.split(".").pop()}
                      className="object-cover pointer-events-none"
                    />
                    <h3
                      className={
                        currentImageName === file.name
                          ? "text-center font-semibold text-sm text-white pt-2"
                          : "text-center font-semibold text-sm pt-2"
                      }
                    >{`${index + 1}.${file.name.split(".").pop()}`}</h3>
                  </div>
                );
              })}
            </div>
          </div>
          <div id="prediction-bars" className="h-full w-[80%]">
            {predictions[currentImageName] ? (
              <div className="h-[70%] w-full flex flex-col gap-5">
                <h1 className="text-xl font-bold">Likelihood of Disease</h1>
                <div className="h-[85%] py-4 w-full flex flex-col bg-[#f2f2f2] flex-wrap items-center gap-4">
                  {predictions[currentImageName].map((item, index) => {
                    let { disease } = item;
                    const percentage = item.percentage * 100;
                    return (
                      <div key={index} className="h-[5%] w-[40%]">
                        <div className="h-full w-full flex items-center gap-2">
                          <h1
                            className={
                              index == 0
                                ? "text-xs font-bold text-primary"
                                : "text-xs font-bold text-secondary"
                            }
                          >
                            {`${percentage.toFixed(2)}%`}
                          </h1>
                          <div className="h-1/2 w-1/2 bg-[#D9D9D9] rounded-md">
                            <div
                              className={
                                index == 0
                                  ? "h-full bg-primary rounded-md"
                                  : "h-full bg-secondary rounded-md"
                              }
                              style={{
                                width: percentage >= 3 ? `${percentage}%` : 0,
                              }}
                            ></div>
                          </div>
                          {index === 0 ? (
                            <Link
                              className="text-xs font-bold w-1/4 hover:underline flex"
                              to={`https://www.google.com/search?q=${disease}`}
                              target="_blank"
                            >
                              {disease}
                              <IoInformationCircleSharp />
                            </Link>
                          ) : (
                            <h1 className="text-xs text-[#393939] w-1/4">
                              {disease}
                            </h1>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <h1 className="text-2xl font-bold">No Prediction Available</h1>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictionPage;

// const handleSubmission = async () => {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   const predictions = {};
//   files.forEach((file) => {
//     const randomPrediction = getRandomPrediction();
//     predictions[file.name] = randomPrediction
//       ? Object.keys(randomPrediction)
//           .map((disease) => {
//             return {
//               disease,
//               percentage: randomPrediction[disease],
//             };
//           })
//           .sort((a, b) => b.percentage - a.percentage)
//       : null;
//   });
//   setPredictions(predictions);
//   setCurrentImageName(files[0].name);
// };

// const getRandomPrediction = () => {
//   if (Math.random() < 0.1) {
//     return null;
//   }
//   const prediction = {};
//   Object.keys(mockPrediction).forEach((key) => {
//     prediction[key] = Math.random();
//   });

//   return prediction;
// };
