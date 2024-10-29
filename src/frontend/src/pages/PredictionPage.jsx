import React, { useState } from "react";
import { uploadImage } from "../services/api";

function PredictionPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    try {
      const result = await uploadImage(selectedFile);
      setPrediction(result);
      setError(null);
    } catch (error) {
      setError("Error uploading file. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-red-300">Chest X-ray Prediction</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Upload and Predict</button>
      {prediction && <h3>Prediction: {prediction}</h3>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default PredictionPage;
