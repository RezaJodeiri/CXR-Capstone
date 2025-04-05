# Source Code of backend API

## Overview

General purpose backend API for the CXR-Capstone project. This API is responsible for handling all requests from the frontend and providing the necessary data and functionality.
It is fully containerized using Docker Compose, which automatically handles all installation requirements:

* All Python dependencies for the backend are installed automatically
* All npm packages for the frontend are installed automatically
* No manual package installation is required
* All services are automatically started and stopped using Docker Compose
* All services are automatically restarted if they crash

## Installation

Please refer to the **Getting Started** section in the [README.md](README.md) for complete installation instructions for developer.

## Directory Structure

```txt
.src/backend/
    ├── Dockerfile
    ├── README.md
    ├── api
    │   ├── decorators.py       # special decorators file part of flask
    │   ├── doctor.py           # doctor-related API endpoints (signup, login, etc.)
    │   ├── fileHandler.py      # file upload/download API endpoints
    │   ├── healthCheck.py      # health check API endpoint
    │   ├── oauth.py            # OAuth2 API endpoints
    │   ├── predict.py          # prediction API endpoints
    │   ├── prescription.py     # prescription-related API endpoints (signup, login, etc.)
    │   ├── record.py           # medical record-related API endpoints (signup, login, etc.)
    │   └── user.py             # user-related API endpoints (signup, login, etc.)
    ├── app.py                  # main application file
    ├── decorators              # custom decorators for the API
    │   ├── `__init__`.py
    │   └── login_required.py   # decorator to check if user is logged in
    ├── requirements-dev.txt    # development dependencies
    ├── requirements.txt        # production dependencies
    ├── runtime
    │   ├── `__init__`.py
    │   ├── config.py            # configuration file for the application
    │   ├── data/
    │   │   ├── aws_cognito.py   # AWS Cognito authentication class (user login, signup, etc.)
    │   │   ├── aws_dynamodb
    │   │   │   ├── base_service.py
    │   │   │   ├── medical_prescription_service.py  # medical prescription service (CRUD operations)
    │   │   │   └── medical_record_service.py        # medical record service (CRUD operations)
    │   │   ├── aws_s3.py                            # AWS S3 file upload/download class
    │   │   ├── prediction_services.py               # prediction service class (ML model prediction)
    │   │   └── report_generation_service.py         # report generation service class (PDF generation)
    │   └── logger.py
    └── test
        ├── __init__.py
        ├── conftest.py                         # pytest configuration file
        ├── mocks
        │   ├── mock_db.py                      # mock database class for unit tests
        │   ├── mock_identity_provider.py       # mock identity provider class for unit tests
        │   ├── mock_prediction_service.py      # mock prediction service class for unit tests
        │   ├── mock_report_generation.py       # mock report generation service for unit tests
        │   └── mock_s3.py                      # mock S3 class for unit tests
        ├── test_aws_conito.py                  # unit tests for AWS Cognito authentication class
        ├── test_aws_s3.py                      # unit tests for AWS S3 file upload/download class
        ├── test_db.py                          # unit tests for AWS DynamoDB database class
        └── test_report_generation_service.py   # unit tests for report generation service class
```
