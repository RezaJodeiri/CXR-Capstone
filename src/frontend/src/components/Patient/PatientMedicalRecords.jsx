import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiUpload,
  FiZoomIn,
  FiZoomOut,
  FiRotateCw,
} from "react-icons/fi";
import CreateMedicalRecord from "./CreateMedicalRecord";
import {
  getMedicalRecordsForPatient,
  getPredictionAndReport,
  getSegmentationBoxes,
  createRecordForUser,
  parseRecordData,
} from "../../services/api";
import { useAuth } from "../../context/Authentication";
import XrayWithSegmentationBoxes from "./XrayWithSegmentationBoxes";

function PatientMedicalRecords({ patient }) {
  const { token, user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("cardiac silhouette");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [recordData, setRecordData] = useState({
    priority: "Low",
    treatmentPlan: "",
    note: "",
    file: null,
    xRayUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [prediction, setPrediction] = useState({
    findings: "",
    impression: "",
    predictions: [],
    segmentationBoxes: [],
  });

  const getSelectedConditions = (selectedRegion) => {
    const selectedPrediction = prediction?.predictions?.find(
      (prediction) => prediction.region === selectedRegion
    );
    return selectedPrediction?.conditions || [];
  };

  useEffect(() => {
    getMedicalRecordsForPatient(patient.id, token).then((data) =>
      setMedicalRecords(data)
    );
  }, []);

  const resetAllStates = () => {
    setIsCreating(false);
    setViewingRecord(null);
    setShowAnalysis(false);
    setSelectedRegion("cardiac silhouette");
    setRecordData({
      priority: "Low",
      treatmentPlan: "",
      note: "",
      file: null,
      xRayUrl: "",
    });
    setPrediction({
      findings: "",
      impression: "",
      predictions: [],
      segmentationBoxes: [],
    });
  };

  const handleAnalyzeClick = async (formData) => {
    setRecordData({
      ...formData,
    });
    setIsTransitioning(true);
    const [predictionData, segmentationBoxData] = await Promise.all([
      getPredictionAndReport(patient.id, formData.xRayUrl, token),
      getSegmentationBoxes(user?.id, formData.xRayUrl, token),
    ]);

    // console.log("predictionData", predictionData);
    // console.log("segmentationBoxData", segmentationBoxData);

    setPrediction({
      ...prediction,
      findings: predictionData.report.findings,
      impression: predictionData.report.impression,
      predictions: predictionData.predictions,
      segmentationBoxes: segmentationBoxData,
    });

    setShowAnalysis(true);
    setIsTransitioning(false);
  };

  const submitRecord = async () => {
    const recordWithPrediction = {
      xRayUrl: recordData.xRayUrl,
      note: recordData.note,
      priority: recordData.priority,
      treatmentPlan: recordData.treatmentPlan,
      report: {
        findings: prediction.findings,
        impression: prediction.impression,
        segmentationBoxes: prediction.segmentationBoxes,
        predictions: prediction.predictions,
      },
    };

    const newRecord = await createRecordForUser(
      patient.id,
      recordWithPrediction,
      token
    );
    setMedicalRecords((prevRecords) => [
      ...prevRecords,
      parseRecordData(newRecord),
    ]);
    setIsCreating(false);
    setIsTransitioning(false);
  };

  const getColorForConfidence = (confidence) => {
    if (confidence < 30) {
      return "green";
    } else if (confidence < 50) {
      return "orange";
    } else {
      return "red";
    }
  };
  const onSelectLabel = (label) => {
    setSelectedRegion(label);
  };

  const handleBackToRecord = () => {
    setIsTransitioning(true);
    setShowAnalysis(false);
    setIsTransitioning(false);
  };

  // If creating a new record
  if (isCreating || viewingRecord) {
    return (
      <div
        className={`transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {showAnalysis ? (
          // Analysis Stage
          <div className="p-6 space-y-6">
            {/* Header */}
            {/* Steps Indicator */}
            <div className="flex items-center max-w-2xl mx-auto">
              <div
                className="flex-1 flex items-center opacity-50 cursor-pointer"
                onClick={handleBackToRecord}
              >
                <div className="flex-none">
                  <div className="w-10 h-10 rounded-full bg-[#3C7187] text-white flex items-center justify-center font-medium text-lg">
                    1
                  </div>
                </div>
                <div className="flex-1 h-1 bg-[#3C7187]"></div>
              </div>
              <div className="flex-1 flex items-center">
                <div className="flex-1 h-1 bg-[#3C7187]"></div>
                <div className="flex-none">
                  <div className="w-10 h-10 rounded-full bg-[#3C7187] text-white flex items-center justify-center font-medium text-lg">
                    2
                  </div>
                </div>
              </div>
            </div>
            <div className="flex max-w-2xl mx-auto mt-2">
              <div
                className="flex-1 text-center opacity-50 cursor-pointer hover:opacity-75 transition-opacity"
                onClick={handleBackToRecord}
              >
                <p className="font-medium text-[#3C7187]">Record Details</p>
                <p className="text-sm text-gray-500">
                  Enter medical information
                </p>
              </div>
              <div className="flex-1 text-center">
                <p className="font-medium text-[#3C7187]">AI Analysis</p>
                <p className="text-sm text-gray-500">Review AI findings</p>
              </div>
            </div>

            {/* Rest of the analysis content */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Analysis Area */}
              <div className="lg:col-span-7 space-y-6">
                {/* Image Display Area */}
                <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-square w-3/5 mx-auto">
                  {recordData?.file || recordData.xRayUrl ? (
                    // TODO
                    <div className="relative">
                      <XrayWithSegmentationBoxes
                        src={recordData.xRayUrl}
                        boundingBoxes={prediction.segmentationBoxes || []}
                        onSelectLabel={onSelectLabel}
                        selectedLabel={selectedRegion}
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <FiUpload className="w-8 h-8 mx-auto mb-2" />
                        <p>No image uploaded</p>
                      </div>
                    </div>
                  )}

                  {/* Image Controls */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/40 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none">
                      <FiZoomIn className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/40 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none">
                      <FiZoomOut className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/40 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none">
                      <FiRotateCw className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
                <div className="w-full">
                  <div className="grid grid-cols-3 gap-2">
                    {prediction?.predictions.map((pred) => (
                      <button
                        key={pred.region}
                        className={`flex items-center gap-3 justify-start px-3 py-2 border rounded-md text-sm transition-colors ${
                          selectedRegion === pred.region
                            ? "bg-[#9a9a9a] text-white"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedRegion(pred.region)}
                      >
                        <div
                          className="flex-0 w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: getColorForConfidence(
                              pred.conditions[0].confidence
                            ),
                          }}
                        />

                        <p className="flex-1">{pred.region}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analysis Results Panel */}
              <div className="lg:col-span-5 bg-white rounded-lg border border-gray-200">
                <div className="p-6 space-y-6">
                  {/* Detection Results */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Selected Region
                      </h3>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-sm text-[#3C7187] hover:text-[#2c5465] px-3 py-1 rounded-md hover:bg-gray-50 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                      >
                        {isEditing ? "Save" : "Edit"}
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Primary Finding */}
                      <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                        <div>
                          <h4 className="font-medium text-red-900">
                            <h1>{selectedRegion.toUpperCase()}</h1>
                          </h4>
                        </div>
                      </div>
                      {/* Region Analysis */}
                      <div className="space-y-3">
                        {/* Region-specific Detection Results */}
                        <h4 className="font-medium text-gray-700">
                          Findings & Confidence
                        </h4>
                        {selectedRegion && (
                          <div className="mt-4 space-y-3">
                            <div className="space-y-2">
                              {getSelectedConditions(selectedRegion)
                                .slice(0, 5)
                                .map((finding, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100"
                                  >
                                    <span className="text-sm text-gray-700 font-medium">
                                      {finding.condition}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-[#3C7187] rounded-full"
                                          style={{
                                            width: `${finding.confidence}%`,
                                          }}
                                        />
                                      </div>
                                      <span className="text-sm text-gray-500 min-w-[3ch]">
                                        {Number(finding.confidence).toFixed(2)}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Findings */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Findings
                    </h3>
                    {isEditing ? (
                      <textarea
                        className="w-full border border-gray-200 rounded-lg p-4 min-h-[120px] text-sm text-gray-700 focus:ring-2 focus:ring-[#3C7187] focus:border-transparent"
                        value={prediction.findings}
                        onChange={(e) =>
                          setPrediction({
                            ...prediction,
                            findings: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="w-full border border-gray-200 rounded-lg p-4 min-h-[120px] text-sm text-gray-700 whitespace-pre-line">
                        {prediction.findings ||
                          "1. Right lower lobe consolidation with air bronchograms\n2. No pleural effusion\n3. Heart size within normal limits\n4. No pneumothorax"}
                      </div>
                    )}
                  </div>

                  {/* Impression */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Impression
                    </h3>
                    {isEditing ? (
                      <textarea
                        className="w-full border border-gray-200 rounded-lg p-4 min-h-[100px] text-sm text-gray-700 focus:ring-2 focus:ring-[#3C7187] focus:border-transparent"
                        value={prediction.impression}
                        onChange={(e) =>
                          setPrediction({
                            ...prediction,
                            impression: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="w-full border border-gray-200 rounded-lg p-4 min-h-[100px] text-sm text-gray-700 whitespace-pre-line">
                        {prediction.impression}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Actions - Moved to bottom */}
            <div className="mt-8 flex justify-end gap-4 px-6">
              <button
                onClick={resetAllStates}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none font-medium"
              >
                Cancel
              </button>
              {!viewingRecord && (
                <button
                  onClick={submitRecord}
                  className="px-6 py-2.5 bg-[#3C7187] text-white rounded-md hover:bg-[#3C7187]/90 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none font-medium"
                >
                  Submit Analysis
                </button>
              )}
            </div>
          </div>
        ) : (
          // Medical Record Creation Stage
          <CreateMedicalRecord
            onBack={resetAllStates}
            onAnalyze={handleAnalyzeClick}
            viewMode={!!viewingRecord}
            recordId={viewingRecord || null}
            onClickAnalyze={(currentRecord) => {
              if (!viewingRecord) {
                return;
              }
              setRecordData({
                xRayUrl: currentRecord.xRayUrl,
                note: currentRecord.note,
                priority: currentRecord.priority,
                treatmentPlan: currentRecord.treatmentPlan,
              });
              setPrediction({
                findings: currentRecord.report.findings,
                impression: currentRecord.report.impression,
                predictions: currentRecord.report.predictions,
                segmentationBoxes: currentRecord.report.segmentationBoxes,
              });
              setShowAnalysis(true);
            }}
          />
        )}
      </div>
    );
  }

  // Medical Records List
  return (
    <div className="p-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-[#3C7187] text-white px-4 py-2 rounded-md hover:bg-[#2c5465] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            <FiPlus className="text-lg" />
            <span>Create New Record</span>
          </button>
          {/* <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none">
            <FiArrowUp className="text-lg" />
            <span>Compare Records</span>
          </button> */}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Record ID
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Priority
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Report
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Created
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {medicalRecords.map((record) => (
              <tr
                key={record.id || record.friendlyId || Date.now().toString()}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <button
                    onClick={() => setViewingRecord(record.id)}
                    className="text-sm text-[#3C7187] hover:text-[#2c5465] hover:underline"
                  >
                    {record.friendlyId || record.recordId || `RID-${record.id}`}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 aspect-square rounded-full"
                      style={{
                        backgroundColor:
                          record.priority === "Emergency"
                            ? "red"
                            : record.priority === "Low"
                            ? "green"
                            : record.priority === "Medium"
                            ? "orange"
                            : "gray",
                      }}
                    ></div>
                    <span className="px-2 py-1 rounded-full text-xs">
                      {record.priority || "Low"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      record.reportStatus === "Completed"
                        ? "bg-green-100 text-green-800"
                        : record.reportStatus === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {record.reportStatus || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {record.timeCreated
                    ? new Date(record.timeCreated).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {record.timeUpdated
                    ? new Date(record.timeUpdated).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t">
          <div className="text-sm text-gray-500">
            {/* Showing 1 to 4 of 4 records */}
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm border rounded text-gray-500 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:hover:bg-white disabled:hover:shadow-none disabled:hover:translate-y-0"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 text-sm border rounded bg-[#3C7187] text-white transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:shadow-none">
              1
            </button>
            <button
              className="px-3 py-1 text-sm border rounded text-gray-500 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:hover:bg-white disabled:hover:shadow-none disabled:hover:translate-y-0"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes slideIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            to {
              transform: scaleX(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default PatientMedicalRecords;
