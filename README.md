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

| Section                 |  Title                          | Issue Description           | Commit ID  | Feedback By (TA/Peer) |
|-------------------------|--------------------------------------|-----------------------------|------------|----------------------|
| **SRS**                 |                                      |                             |            |                      |
|                         | Address TA Feedback                  | Issue description here      | `abc1234`  | TA John Doe          |
|                         | Fix Functional Requirement 6         | Issue description here      | `def5678`  | Peer Jane Doe        |
| **Hazard Analysis**     |                                      |                             |            |                      |
|                         | Address TA Feedback                  | Issue description here      | `abc1234`  | TA John Doe          |
|                         | Fix Functional Requirement 6         | Issue description here      | `def5678`  | Peer Jane Doe        |
| **MIS**                 |                                      |                             |            |                      |
|                         | Revise System Architecture          | Issue description here      | `ghi9012`  | TA Alex Smith        |
|                         | Clarify Module Responsibilities     | Issue description here      | `jkl3456`  | Peer Mike Brown      |
| **MG**                  |                                      |                             |            |                      |
|                         | Improve Traceability                | Issue description here      | `mno7890`  | TA Sarah Lee        |
|                         | Fix Incorrect Assumptions           | Issue description here      | `pqr1234`  | Peer Emily Davis     |
| **V&V Plan**            |                                      |                             |            |                      |
|                         | Add Unit Test Cases                 | Issue description here      | `stu5678`  | TA Alex Johnson      |
|                         | Update Integration Testing Strategy | Issue description here      | `vwx9012`  | Peer Chris Evans     |
| **V&V Report**          |                                      |                             |            |                      |
|                         | Add Test Results Summary            | Issue description here      | `yz12345`  | TA Rachel Green      |
|                         | Include Performance Test Findings   | Issue description here      | `abc6789`  | Peer Laura White     |