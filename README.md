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
| **SRS**                 | Address TA Feedback               | Improve formatting and style; mention figures in paragraphs and fix title. [#125](https://github.com/RezaJodeiri/CXR-Capstone/issues/125) | `44e80d1`  | TA Yiding Li|
|                         | What not How (Abstract)           | Improve constraints details. [#126](https://github.com/RezaJodeiri/CXR-Capstone/issues/126)                                               | `44e80d1`  | TA Yiding Li|
|                         | Complete, Correct, and Unambiguous| Template explanation. [#124](https://github.com/RezaJodeiri/CXR-Capstone/issues/124)                                                      | `44e80d1`  | TA Yiding Li|
|                         | Traceable Requirements            | Fix referencing for section 5.2. [#123](https://github.com/RezaJodeiri/CXR-Capstone/issues/123)                                           | `44e80d1`  | TA Yiding Li|
|                         | Document Content                  | Fix functional requirements. [#122](https://github.com/RezaJodeiri/CXR-Capstone/issues/122)                                               | `44e80d1`  | TA Yiding Li|
|                         | Project Goals                     | Goal statements inconsistency. [#55](https://github.com/RezaJodeiri/CXR-Capstone/issues/55)                                               | `44e80d1`  | TA Yiding Li|
|                         | Document Content                  | Fix FR and NFR to align with the current scope of the project. [#201](https://github.com/RezaJodeiri/CXR-Capstone/issues/201)             | `32ef20a`  | Team Feedback|
|                         | Operational and Environmental Requirement 1                  | Compatibility of DICOM image is not a priority of this project and adding support for legacy systems would require additional development, validation, and maintenance efforts. [#60](https://github.com/RezaJodeiri/CXR-Capstone/issues/60)             | `32ef20a`  | Peer Review |

|                         | What not How (Abstract)                | Privacy measures are already implicitly covered in SR1 and SR2. [#57](https://github.com/RezaJodeiri/CXR-Capstone/issues/57)             | `32ef20a`  | Peer Review |
|                         | Document organization               | detailed theoretical models like ELBO optimization would shift the focus from specifying what the system must do to how certain algorithms work internally, which is beyond the typical scope of an SRS [#46](https://github.com/RezaJodeiri/CXR-Capstone/issues/46)             | `32ef20a`  | Peer Review |


| **Hazard Analysis**     |                                   |                                                                                                                                           |            |             |
|                         | Document Content                  | Fixed citation. [#202](https://github.com/RezaJodeiri/CXR-Capstone/issues/202)                                                            | `b5c1abe`  | TA Yiding Li|

|                         | Out of Scope Hazards                | We classified AI libraries, image encoding, and hardware hazards as out of scope because they are external dependencies. Risks from these areas will be mitigated through standard library validation and hardware certification, without detailed project-level tracking [#70](https://github.com/RezaJodeiri/CXR-Capstone/issues/70)                                                            | `c751e24`  | Peer Review Feedback|

|                         | Hazard Analysis: FMEA AI false positive               | The result of AI model will be reviewed by a certified radiologist,  so they are not detailed in the FMEA [#69](https://github.com/RezaJodeiri/CXR-Capstone/issues/69)                                                            | `c751e24`  | Peer Review Feedback|

|                         | Hazard Analysis: Critical Assumptions             | Add an assumption that patients gave informed constent to use their X-rays for analysis [#68](https://github.com/RezaJodeiri/CXR-Capstone/issues/68)                                                            | `c751e24`  | Peer Review Feedback|

|                         |  Hazard Analysis: Security and Safety Requirements SR6             | Add more details on what security is used and how they are implemented in the system [#67](https://github.com/RezaJodeiri/CXR-Capstone/issues/67)                                                            | `c751e24`  | Peer Review Feedback|

|                         |  Hazard Analysis: Security Requirements HS1             | Already stated that all AI-generated diagnosis need to be confirmed despite of the accuracy [#66](https://github.com/RezaJodeiri/CXR-Capstone/issues/66)                                                            | `c751e24`  | Peer Review Feedback|

|                         |  Hazard Analysis: Data encryption requirement           | Encryption is already mandated by broader privacy compliance requirements stated in SR4 (HIPPA, GDPR) [#65](https://github.com/RezaJodeiri/CXR-Capstone/issues/65)                                                            | `c751e24`  | Peer Review Feedback|



| **MIS & MG**                 |                                      |                             |            |                      |
|                         | Formalization                     | Fixed Formalization [#191](https://github.com/RezaJodeiri/CXR-Capstone/issues/191)                                                        | `42b5c48`  | TA Yiding Li|
|                         | Input Representation              | Fixed Input Representation [#192](https://github.com/RezaJodeiri/CXR-Capstone/issues/192)                                                 | `b1e88f5`  | TA Yiding Li|
|                         | Specific Definition of JSON       | Fixed Specific Definition of JSON [#193](https://github.com/RezaJodeiri/CXR-Capstone/issues/193)                                          | `9bed20b`  | TA Yiding Li|
|                         | HTTP Design                       | Fixed Descritpition of HTTP Design [#194](https://github.com/RezaJodeiri/CXR-Capstone/issues/194)                                         | `78338d3`  | TA Yiding Li|

|                         | 5.0 Module Hierarchy - User Authentication model did not abides by single responsibility                      | We decided not to split the User Authentication module because its current complexity is manageable, and combining authentication and authorization improves cohesion. [#142](https://github.com/RezaJodeiri/CXR-Capstone/issues/142)                                         | `d45c34c`  | Peer Review Feedback |

|                         | 6.2 Non-Functional Requirements LR1                     | M14 has already addressed the sepcification on how data privacy would be achieved and securely stored [#143](https://github.com/RezaJodeiri/CXR-Capstone/issues/143)                                         | `d45c34c`  | Peer Review Feedback |

|                         | .1 Functional Requirements (FR5)                    | Add more details on how affected areas will be visualized [#145](https://github.com/RezaJodeiri/CXR-Capstone/issues/145)                                         | `d45c34c`  | Peer Review Feedback |

| **V&V Plan**            |                                      |                             |            |                      |
|                         | Nondynamic testing used as necessary & Improve Testing                 | Improve Testing [#196](https://github.com/RezaJodeiri/CXR-Capstone/issues/196)                                       | `eb96f46`  | TA Yiding Li  |
|                         | General Information                                                    | Objective mismatching                                 [#195](https://github.com/RezaJodeiri/CXR-Capstone/issues/195) | `eb96f46`  | TA Yiding Li  |
|                         | Unaligned FRs and NFRs | Align FRs and NFRs testings with current project scope  [#203](https://github.com/RezaJodeiri/CXR-Capstone/issues/203)                          | `eb96f46`  | Team Feedback |
|                         | Unaligned Extras | Align extras with current project scope [#204](https://github.com/RezaJodeiri/CXR-Capstone/issues/204)                          | `0e53ce2`  | Team Feedback |
|                         |  Unit Test Description | Updated unit test description and adding traces [#81](https://github.com/RezaJodeiri/CXR-Capstone/issues/81)                          | `ffc0479`  | Peer Review  Feedback |
|                         |  Section 2.1.1 - User Interface (UI) | Our UI is designed to be lightweight, responsive, and platform-independent, adhering to general web and mobile compatibility best practices. [#82](https://github.com/RezaJodeiri/CXR-Capstone/issues/82)                          | `ffc0479`  | Peer Review Feedback |

|                         |  Section 4.1.6 - Structured Report Generation Tests |  We decided not to address this suggestion because structured report generation testing is focused on validating correct outputs under normal conditions. Failure handling will be tested separately during full system reliability testing to better align with project priorities and scope. [#83](https://github.com/RezaJodeiri/CXR-Capstone/issues/83)                          | `ffc0479`  | Peer Review Feedback |

|                         |  Section 4 (System Tests) |  Removing user log in the test step as it is already stated in the initial state. [#84](https://github.com/RezaJodeiri/CXR-Capstone/issues/84)                          | `ffc0479`  | Peer Review Feedback |

|                         |  Section 4.3 - Security Tests |  We chose not to add session timeout and concurrent login tests because they are outside the core security scope for this release. These aspects will be considered in future system hardening phase [#85](https://github.com/RezaJodeiri/CXR-Capstone/issues/85)                          | `ffc0479`  | Peer Review Feedback |

|                         |  Section 5.2.6 - Periodic Health Checks |  Add specific criteria for measuring Periodic Health Checks [#86](https://github.com/RezaJodeiri/CXR-Capstone/issues/86)                          | `ffc0479`  | Peer Review Feedback |

| **V&V Report**          |                                      |                             |            |                      |

|                         | NFR-LR1 Privacy Compliance ｜ Manual compliance review is sufficient for the current project size and risk level. Automation can be added later if system complexity or regulatory needs increase. [#180](https://github.com/RezaJodeiri/CXR-Capstone/issues/180)                          | `7fb0a2f`  | Peer Review Feedback |

|                         | NFR-HS1 User Action Logging ｜ Add additional log validation test for potential failure cases [#181](https://github.com/RezaJodeiri/CXR-Capstone/issues/181)                          | `7fb0a2f`  | Peer Review Feedback |

|                         | NFR-HS2 AI Disclaimer ｜ We are prioritizing disclaimer visibility for this phase and due to resource constraints, will defer user comprehension testing and A/B testing to future updates. [#182](https://github.com/RezaJodeiri/CXR-Capstone/issues/182)                          | `7fb0a2f`  | Peer Review Feedback |

|                         | NFR-LR1 Privacy Compliance ｜  clarify how evolving regulations will be tracked and integrated into the system[#183](https://github.com/RezaJodeiri/CXR-Capstone/issues/183)                          | `7fb0a2f`  | Peer Review Feedback |

|                         | NFR-HS1 User Action Logging ｜  Define log retention policy and how will they be stored[#184](https://github.com/RezaJodeiri/CXR-Capstone/issues/184)                          | `7fb0a2f`  | Peer Review Feedback |

|                         | NFR-HS2 AI Disclaimer ｜ visibility of the disclaimer meets current goals.[#185](https://github.com/RezaJodeiri/CXR-Capstone/issues/185)                          | `7fb0a2f`  | Peer Review Feedback |

