# CXR-Capstone

A deep learning-based chest X-ray analysis project using PyTorch and Flask for backend, and React for frontend.

## Project Overview
This project focuses on using PyTorch and deep learning to analyze chest X-rays and generate reports that predict potential diseases, along with demographic information such as race, age, and gender. By utilizing multi-task learning, the model aims to handle both medical diagnosis and demographic classification, addressing challenges in medical imaging, bias mitigation, and multi-label prediction.

## Project Structure

Below is the structure of the project and an explanation of the key folders and files.
```
CXR-Capstone/
├── src/
│   ├── backend/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── oauth.py          # Authentication endpoints
│   │   │   └── predict.py        # Prediction endpoints
│   │   ├── runtime/
│   │   │   ├── __init__.py
│   │   │   ├── config.py         # Runtime configuration
│   │   │   ├── logger.py         # Logging configuration
│   │   │   └── data/
│   │   │       ├── __init__.py
│   │   │       ├── aws_cognito.py     # AWS Cognito provider
│   │   │       └── prediction_services.py  # AI prediction service
│   │   ├── decorators/
│   │   │   └── login_required.py  # Authentication decorator
│   │   ├── app.py               # Main Flask application
│   │   ├── Dockerfile          # Backend container config
│   │   ├── requirements.txt    # Production dependencies
│   │   └── requirements-dev.txt # Development dependencies
│   └── frontend/
│       ├── public/
│       │   └── index.html      # HTML entry point
│       ├── src/
│       │   ├── components/
│       │   │   ├── Buttons.jsx
│       │   │   ├── Inputs.jsx
│       │   │   └── ProtectedRoute.jsx
│       │   ├── context/
│       │   │   └── Authentication.js
│       │   ├── pages/
│       │   │   ├── LoginPage.jsx
│       │   │   ├── RegisterPage.jsx
│       │   │   └── PredictionPage.jsx
│       │   ├── services/
│       │   │   └── api.js      # API service layer
│       │   └── App.jsx         # Main React component
│       ├── .gitignore
│       └── package.json       # Frontend dependencies
├── test/
│   ├── backend/
│   │   └── api/
│   │       └── test_oauth.py  # Authentication tests
│   ├── conftest.py           # Pytest configuration
│   └── README.md             # Test documentation
└── README.md                 # Project documentation
```

## Getting Started

This project is fully containerized using Docker and Docker Compose. There is no need to manually install any dependencies like `npm` or `pip`. The Docker configuration will take care of setting up both the frontend and backend.


### Prerequisites

Ensure that you have **Docker** installed on your system:

- **Docker**: [Download Docker](https://www.docker.com/get-started) and install it for your operating system.

### Steps to Run the Application

```bash
# 1.Direct terminal to the src folder where the docker-compose.yml file is located:
cd src 

# 2. Build and  Run the Application
docker-compose build
docker-compose up

# This will:
# - Start both the frontend and backend services.

# 3. Access the Application:
# - Frontend: Open your browser and go to http://localhost:3000 to access the web interface.
# - Backend (API): The Flask API will be available at http://localhost:8888.

# 4. Stopping the Containers
docker-compose down

# This will stop and remove the containers created by Docker Compose.

#Note: For the first time, the build may take a few minutes to install and cache dependencies. To remove cached images and free up space, you can use the following command:

docker system prune -a
```
# Project Evaluation and Issue Tracking


| Section                 | Title                              | Issue Description           | Commit ID  | Feedback By (TA/Peer) |
|-------------------------|------------------------------------|-----------------------------|------------|------------------------|
| **SRS**                 | Address TA Feedback               | Improve formatting and style; mention figures in paragraphs and fix title. [#125](https://github.com/RezaJodeiri/CXR-Capstone/issues/125) | `x`  | TA Yiding Li|
|                         | What not How (Abstract)           | Improve constraints details. [#126](https://github.com/RezaJodeiri/CXR-Capstone/issues/126)                                               | `x`  | TA Yiding Li|
|                         | Complete, Correct, and Unambiguous| Template explanation. [#124](https://github.com/RezaJodeiri/CXR-Capstone/issues/124)                                                      | `x`  | TA Yiding Li|
|                         | Traceable Requirements            | Fix referencing for section 5.2. [#123](https://github.com/RezaJodeiri/CXR-Capstone/issues/123)                                           | `x`  | TA Yiding Li
|                         | Document Content                  | Fix functional requirements. [#122](https://github.com/RezaJodeiri/CXR-Capstone/issues/122)                                               | `x`  | TA Yiding Li|
|                         | Project Goals                     | Goal statements inconsistency. [#55](https://github.com/RezaJodeiri/CXR-Capstone/issues/55)                                               | `x`  | TA Yiding Li|
|                         | Document Content                  | Fix FR and NFR to align with the current scope of the project. [#201](https://github.com/RezaJodeiri/CXR-Capstone/issues/201)             | `x`  | TA Yiding Li|
| **Hazard Analysis**     |                                   |                                                                                |            |                      |
|                         | Document Content                  | Fixed citation. [#202](https://github.com/RezaJodeiri/CXR-Capstone/issues/202) | `vwx9012`  | TA Yiding Li          |
| **MIS**                 |                                      |                             |            |                      |
|                         | Formalization                     | Fixed Formalization [#191](https://github.com/RezaJodeiri/CXR-Capstone/issues/191)                 | `x`  | TA Yiding Li|
|                         | Input Representation              | Fixed Input Representation [#192](https://github.com/RezaJodeiri/CXR-Capstone/issues/192)          | `x`  | TA Yiding Li|
|                         | Specific Definition of JSON       | Fixed Specific Definition of JSON [#193](https://github.com/RezaJodeiri/CXR-Capstone/issues/193)   | `x`  | TA Yiding Li|
|                         | HTTP Design                       | Fixed Descritpition of HTTP Design [#194](https://github.com/RezaJodeiri/CXR-Capstone/issues/194)  | `x`  | TA Yiding Li|
| **V&V Plan**            |                                      |                             |            |                      |
| TA Feedback  | Nondynamic testing used as necessary & Improve Testing                 | [#196](https://github.com/RezaJodeiri/CXR-Capstone/issues/196) | `x`  | TA Yiding Li  |
| TA Feedback  | General Information                                                    | Objective mismatching                                | [#195](https://github.com/RezaJodeiri/CXR-Capstone/issues/195) | `x`  | TA Yiding Li |
| Team Feedback | System Tests for Functional / Nonfunctional Requirements are specific | [#203](https://github.com/RezaJodeiri/CXR-Capstone/issues/203) | `x`  | Team        |
| **V&V Report**          |                                      |                             |            |                      |
