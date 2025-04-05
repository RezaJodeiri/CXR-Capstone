# CXR-Capstone

A deep learning-based chest X-ray analysis project using PyTorch and Flask for backend, and React for frontend.

## Project Overview

This project focuses on using PyTorch and deep learning to analyze chest X-rays and generate reports that predict potential diseases, along with demographic information such as race, age, and gender. By utilizing multi-task learning, the model aims to handle both medical diagnosis and demographic classification, addressing challenges in medical imaging, bias mitigation, and multi-label prediction.

## Accessing the Production Application

Head over to `https://www.neuralanalyzer.ca/` and login using your credentials. For testing purposes, you can use the following credentials:

* **Username:** `nathan_doctor@neuralanalyzer.com`
* **Password:** `Test123!`

## Project Structure

Below is the structure of the project and an explanation of the key folders and files. A more detailed explanation of each folder and file can be found in the respective `README.md` files within each folder.

```txt
CXR-Capstone/
├── src/
│   ├── ai_services/          # Additional AI functionalities
│   │   ├── neuralanalyzer/
│   │   |    ├── Dockerfile                        # Container config for AI services
│   │   |    ├── README.md
│   │   |    ├── models
│   │   |    │   ├── Detr
│   │   |    │   │   ├── Detr.ckpt                 # Pre-trained object detection checkpoint
│   │   |    │   │   ├── detr.py                   # Object detection model
│   │   |    │   │   └── detr_api.py               # Object detection API
│   │   |    │   ├── __init__.py
│   │   |    │   └── classification
│   │   |    │       ├── classification_api.py     # Classification API
│   │   |    │       ├── model.ckpt                # Pre-trained classification checkpoint
│   │   |    │       └── transfomer.py             # Transformer model
│   │   |    ├── neural_app.py                     # Main entry point for the AI service
│   │   |    └── requirements.txt                  # Dependencies for AI services
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
│   ├── frontend/
│   │   ├── public/
│   │   │   └── index.html      # HTML entry point
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Buttons.jsx
│   │   │   │   ├── Inputs.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── context/
│   │   │   │   └── Authentication.js
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   └── PredictionPage.jsx
│   │   │   ├── services/
│   │   │   │   └── api.js      # API service layer
│   │   │   └── App.jsx         # Main React component
│   │   ├── .gitignore
│   │   └── package.json       # Frontend dependencies
│   ├── infrastructure/        # Infrastructure setup files
│   ├── notebooks/             # Jupyter notebooks for model development
│   ├── docker-compose.yml     # Docker configuration for all services
│   └── .env                   # Environment variables
├── test/
│   ├── backend/
│   │   └── api/
│   │       └── test_oauth.py  # Authentication tests
│   ├── conftest.py           # Pytest configuration
│   └── README.md             # Test documentation
├── INSTALL.md                # Installation instructions
└── README.md                 # Project documentation
```

## Getting Started (For Developers)

This project is fully containerized using Docker and Docker Compose. There is no need to manually install any dependencies like `npm` or `pip`. The Docker configuration will take care of setting up both the frontend and backend.

### Prerequisites

Ensure that you have **Docker** installed on your system:

- **Docker**: [Download Docker](https://www.docker.com/get-started) and install it for your operating system.

Ensure that the repository is cloned to your local machine. You can do this by running the following command in your terminal:

```bash
git clone <repository-url>.git
```

### Steps to Run the Application

#### 1. Download the DETR checkpoint file from Google Drive

- Download the DETR checkpoint file from [Google Drive](https://drive.google.com/file/d/1QLIL-O6WTS219aUd1UeTkJ6WkMBvrC4M/view).
- Place the downloaded file in the `src/ai_services/neuralanalyzer/models/Detr` directory.
- Name the file `Detr.ckpt`.

#### 2. Build and Run the Application

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

## Project documents and Issue Tracking

| Section                 | Title                              | Issue Description           | Commit ID  | Feedback By (TA/Peer) |
|-------------------------|------------------------------------|-----------------------------|------------|------------------------|
| **SRS**                 | Address TA Feedback               | Improve formatting and style; mention figures in paragraphs and fix title. [#125](https://github.com/RezaJodeiri/CXR-Capstone/issues/125) | `44e80d1`  | TA Yiding Li|
|                         | What not How (Abstract)           | Improve constraints details. [#126](https://github.com/RezaJodeiri/CXR-Capstone/issues/126)                                               | `44e80d1`  | TA Yiding Li|
|                         | Complete, Correct, and Unambiguous| Template explanation. [#124](https://github.com/RezaJodeiri/CXR-Capstone/issues/124)                                                      | `44e80d1`  | TA Yiding Li|
|                         | Traceable Requirements            | Fix referencing for section 5.2. [#123](https://github.com/RezaJodeiri/CXR-Capstone/issues/123)                                           | `44e80d1`  | TA Yiding Li|
|                         | Document Content                  | Fix functional requirements. [#122](https://github.com/RezaJodeiri/CXR-Capstone/issues/122)                                               | `44e80d1`  | TA Yiding Li|
|                         | Project Goals                     | Goal statements inconsistency. [#55](https://github.com/RezaJodeiri/CXR-Capstone/issues/55)                                               | `44e80d1`  | TA Yiding Li|
|                         | Document Content                  | Fix FR and NFR to align with the current scope of the project. [#201](https://github.com/RezaJodeiri/CXR-Capstone/issues/201)             | `32ef20a`  | Team Feedback|
| **Hazard Analysis**     |                                   |                                                                                                                                           |            |             |
|                         | Document Content                  | Fixed citation. [#202](https://github.com/RezaJodeiri/CXR-Capstone/issues/202)                                                            | `b5c1abe`  | TA Yiding Li|
| **MIS**                 |                                      |                             |            |                      |
|                         | Formalization                     | Fixed Formalization [#191](https://github.com/RezaJodeiri/CXR-Capstone/issues/191)                                                        | `42b5c48`  | TA Yiding Li|
|                         | Input Representation              | Fixed Input Representation [#192](https://github.com/RezaJodeiri/CXR-Capstone/issues/192)                                                 | `b1e88f5`  | TA Yiding Li|
|                         | Specific Definition of JSON       | Fixed Specific Definition of JSON [#193](https://github.com/RezaJodeiri/CXR-Capstone/issues/193)                                          | `9bed20b`  | TA Yiding Li|
|                         | HTTP Design                       | Fixed Descritpition of HTTP Design [#194](https://github.com/RezaJodeiri/CXR-Capstone/issues/194)                                         | `78338d3`  | TA Yiding Li|
| **V&V Plan**            |                                      |                             |            |                      |
|                         | Nondynamic testing used as necessary & Improve Testing                 | Improve Testing [#196](https://github.com/RezaJodeiri/CXR-Capstone/issues/196)                                       | `eb96f46`  | TA Yiding Li  |
|                         | General Information                                                    | Objective mismatching                                 [#195](https://github.com/RezaJodeiri/CXR-Capstone/issues/195) | `eb96f46`  | TA Yiding Li  |
|                         | Unaligned FRs and NFRs | Align FRs and NFRs testings with current project scope  [#203](https://github.com/RezaJodeiri/CXR-Capstone/issues/203)                          | `eb96f46`  | Team Feedback |
|                         | Unaligned Extras | Align extras with current project scope [#204](https://github.com/RezaJodeiri/CXR-Capstone/issues/204)                          | `0e53ce2`  | Team Feedback |
| **V&V Report**          |                                      |                             |            |                      |
|                         | Test Specifications              | Added detailed hardware specifications, network conditions, and testing environment details for NFR-PR1, NFR-PR2, NFR-PR3, and NFR-OE1 [#213](https://github.com/RezaJodeiri/CXR-Capstone/issues/213)  | `a7d82bf`  | TA Feedback |
|                         | Document Formatting              | Corrected capitalization in section title "Changes due to Performance Testing" and removed empty parentheses in "TraceabilityMatrix:UnitTeststoModules()" [#213](https://github.com/RezaJodeiri/CXR-Capstone/issues/213)  | `a7d82bf`  | TA Feedback |
|                         | Typo Correction                  | Fixed "Questin" to "Question" in survey figure caption [#213](https://github.com/RezaJodeiri/CXR-Capstone/issues/213)  | `a7d82bf`  | TA Feedback |

