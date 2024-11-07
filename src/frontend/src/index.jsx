// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css"; // Import your styles
import { BrowserRouter } from "react-router-dom";

// Create a root for rendering the React component tree
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
