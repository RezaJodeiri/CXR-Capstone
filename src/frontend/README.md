# Source Code of frontend React App

## Overview

General purpose frontend React app for the CXR-Capstone project. This app is responsible for providing a user interface for the backend API and displaying the necessary data and functionality.
It is fully containerized using Docker Compose, which automatically handles all installation requirements:

## Installation

Please refer to the **Getting Started** section in the [README.md](README.md) for complete installation instructions for developer.

## Directory Structure

```txt
.src/frontend/
    ├── Dockerfile               # Dockerfile for production environment
    ├── README.md
    ├── babel.config.js          # Babel configuration file
    ├── jest.config.js           # Configuration file for Jest testing framework
    ├── local.Dockerfile         # Dockerfile for local development, running app in development mode
    ├── nginx.conf               # Nginx configuration file (strictly for production environment)
    ├── package-lock.json        # npm lock file
    ├── package.json             # npm dependencies  
    ├── postcss.config.js        # PostCSS configuration file
    ├── public/                  # public folder for static files
    ├── src
    │   ├── App.jsx                 # main application file
    │   ├── components/             # reusable components
    │   ├── context
    │   │   └── Authentication.js   # authentication context (contains authentication-related states)
    │   ├── index.jsx               # entry point for the application
    │   ├── pages
    │   │   ├── LoginPage.jsx               # Login page
    │   │   ├── PatientDetailsPage.jsx      # Patient details page
    │   │   ├── PatientsPage.jsx            # Patients page 
    │   │   ├── PredictionPage.jsx          # Prediction page
    │   │   ├── RegisterPage.jsx            # Register page
    │   │   └── SettingPage.jsx             # Setting page
    │   ├── router.json                     # router configuration file
    │   ├── services
    │   │   └── api.js                      # API service for making requests to the backend
    │   └── style.css                       # global CSS file
    └── tailwind.config.js                  # Tailwind CSS configuration file
```
